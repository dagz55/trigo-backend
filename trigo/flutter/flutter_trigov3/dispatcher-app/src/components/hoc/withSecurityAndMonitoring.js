import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { hasDispatcherPermission, isAuthenticated, logSecurityEvent } from '../../utils/security';

// Higher-order component to add security and monitoring
export default function withSecurityAndMonitoring(Component, options = {}) {
  const {
    requireAuth = true,
    requireDispatcherApproval = true,
    monitorActivity = true,
    pageId = ''
  } = options;

  function SecureComponent(props) {
    const [auth, setAuth] = useState({
      loading: true,
      isAuthenticated: false,
      hasPermission: false
    });

    useEffect(() => {
      let isMounted = true;

      const checkAuth = async () => {
        // Check if user is authenticated
        const authStatus = await isAuthenticated();
        
        // Check if dispatcher has necessary permissions
        let permissionStatus = false;
        if (authStatus && requireDispatcherApproval) {
          permissionStatus = await hasDispatcherPermission();
        }
        
        if (isMounted) {
          setAuth({
            loading: false,
            isAuthenticated: authStatus,
            hasPermission: permissionStatus
          });
          
          // Log security event for page access
          if (monitorActivity && authStatus) {
            logSecurityEvent('page_access', {
              pageId: pageId || Component.displayName || Component.name || 'UnknownComponent',
              requiresAuth: requireAuth,
              requiresDispatcherApproval: requireDispatcherApproval,
              hasPermission: permissionStatus
            });
          }
        }
      };

      checkAuth();

      return () => {
        isMounted = false;
      };
    }, []);

    // Activity monitoring
    useEffect(() => {
      if (!monitorActivity || !auth.isAuthenticated) return;

      // Track user activity time
      const startTime = new Date();
      
      // Log activity end when component unmounts
      return () => {
        const endTime = new Date();
        const durationMs = endTime - startTime;
        
        logSecurityEvent('page_exit', {
          pageId: pageId || Component.displayName || Component.name || 'UnknownComponent',
          durationMs,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });
      };
    }, [auth.isAuthenticated]);

    if (auth.loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (requireAuth && !auth.isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (requireDispatcherApproval && !auth.hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-yellow-400">warning</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Account pending approval</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Your dispatcher account is pending approval from our team. You will be notified once your account is approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => logSecurityEvent('pending_approval_view', { action: 'viewed_message' })}
            className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </button>
        </div>
      );
    }

    return <Component {...props} />;
  }

  // Set display name for debugging
  const componentName = Component.displayName || Component.name || 'Component';
  SecureComponent.displayName = `withSecurityAndMonitoring(${componentName})`;

  return SecureComponent;
} 