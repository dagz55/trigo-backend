import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    AnalyticsTracker,
    ErrorTracker,
    PerformanceMonitor,
    SystemHealth,
    UsageMonitor
} from '../../utils/monitoring';
import { checkPermission, checkUserRole, validateSession } from '../../utils/security';

export function withSecurityAndMonitoring(WrappedComponent, requiredRole = null) {
  return function WithSecurityAndMonitoring(props) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const setupSecurityAndMonitoring = async () => {
        try {
          // Security checks
          const isSessionValid = await validateSession();
          if (!isSessionValid) {
            navigate('/login');
            return;
          }

          if (requiredRole && currentUser) {
            const userRole = await checkUserRole(currentUser.uid);
            if (userRole !== requiredRole) {
              navigate('/unauthorized');
              return;
            }
          }

          // Monitoring setup
          if (requiredRole && !checkPermission(requiredRole)) {
            navigate('/unauthorized');
            return;
          }

          if (requiredRole && currentUser) {
            const userRole = await checkUserRole(currentUser.uid);
            if (userRole !== requiredRole) {
              navigate('/unauthorized');
              return;
            }
          }

          // Monitoring setup
          if (requiredRole && currentUser) {
            UsageMonitor.trackFeatureUsage(WrappedComponent.name, {
              userId: currentUser.uid,
            });
          }

          if (requiredRole && currentUser) {
            AnalyticsTracker.trackPageView(WrappedComponent.name);
          }

          if (requiredRole && currentUser) {
            PerformanceMonitor.measurePageLoad();
          }

          if (requiredRole && currentUser) {
            const isConnected = await SystemHealth.checkConnectivity();
            if (!isConnected) {
              console.warn('System connectivity issues detected');
            }
            SystemHealth.logSystemMetrics();
          }
        } catch (error) {
          ErrorTracker.logError(error, {
            component: WrappedComponent.name,
            userId: currentUser?.uid,
          });
        }
      };

      setupSecurityAndMonitoring();
    }, [currentUser, navigate]);

    // Error boundary implementation
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true };
      }

      componentDidCatch(error, errorInfo) {
        ErrorTracker.logError(error, {
          ...errorInfo,
          component: WrappedComponent.name,
          userId: currentUser?.uid,
        });
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong.
              </h2>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          );
        }

        return this.props.children;
      }
    }

    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
} 