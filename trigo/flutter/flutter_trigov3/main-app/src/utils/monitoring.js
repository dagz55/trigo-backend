import { getAnalytics, logEvent } from 'firebase/analytics';
import { getDatabase, ref, set } from 'firebase/database';
import { getPerformance, trace } from 'firebase/performance';

// Initialize monitoring
const analytics = getAnalytics();
const performance = getPerformance();

// Error tracking
export const ErrorTracker = {
  logError: async (error, context = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context,
      },
    };

    try {
      const db = getDatabase();
      const errorRef = ref(db, `errors/${Date.now()}`);
      await set(errorRef, errorData);

      // Log to analytics
      logEvent(analytics, 'error', {
        error_message: error.message,
        error_code: error.code || 'unknown',
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }
};

// Performance monitoring
export const PerformanceMonitor = {
  startTrace: (traceName) => {
    return trace(performance, traceName);
  },

  measureNetworkRequest: async (url, method = 'GET') => {
    const networkTrace = PerformanceMonitor.startTrace('network_request');
    networkTrace.putAttribute('url', url);
    networkTrace.putAttribute('method', method);

    try {
      networkTrace.start();
      const response = await fetch(url, { method });
      networkTrace.stop();
      return response;
    } catch (error) {
      networkTrace.stop();
      throw error;
    }
  },

  measurePageLoad: () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      
      logEvent(analytics, 'page_load_time', {
        time_ms: pageLoadTime,
        page: window.location.pathname,
      });
    }
  },

  measureOperation: (operationName, callback) => {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    console.log(`Operation ${operationName} took ${endTime - startTime}ms`);
  }
};

// Analytics tracking
export const AnalyticsTracker = {
  trackPageView: (pageName) => {
    console.log(`Page view tracked: ${pageName}`);
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_path: window.location.pathname,
    });
  },

  trackUserAction: (action, params = {}) => {
    logEvent(analytics, action, {
      timestamp: new Date().toISOString(),
      ...params,
    });
  },

  trackRideEvents: (eventType, rideData) => {
    logEvent(analytics, `ride_${eventType}`, {
      ride_id: rideData.rideId,
      pickup_location: `${rideData.pickup.lat},${rideData.pickup.lng}`,
      destination: `${rideData.destination.lat},${rideData.destination.lng}`,
      timestamp: new Date().toISOString(),
      ...rideData,
    });
  }
};

// System health monitoring
export const SystemHealth = {
  checkConnectivity: async () => {
    try {
      const db = getDatabase();
      const healthRef = ref(db, '.info/connected');
      return new Promise((resolve) => {
        const unsubscribe = healthRef.on('value', (snapshot) => {
          unsubscribe();
          resolve(!!snapshot.val());
        });
      });
    } catch (error) {
      console.error('Connectivity check failed:', error);
      return false;
    }
  },

  logSystemMetrics: async () => {
    const metrics = {
      timestamp: new Date().toISOString(),
      memory: window.performance.memory ? {
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
      } : null,
      navigation: window.performance.getEntriesByType('navigation')[0],
      resources: window.performance.getEntriesByType('resource'),
    };

    try {
      const db = getDatabase();
      const metricsRef = ref(db, `metrics/${Date.now()}`);
      await set(metricsRef, metrics);
    } catch (error) {
      console.error('Failed to log system metrics:', error);
    }
  }
};

// Usage monitoring
export const UsageMonitor = {
  trackFeatureUsage: (featureName, userData = {}) => {
    console.log(`Feature usage tracked: ${featureName}`, userData);
    logEvent(analytics, 'feature_usage', {
      feature_name: featureName,
      timestamp: new Date().toISOString(),
      ...userData,
    });
  },

  logUserSession: async (userId, sessionData) => {
    try {
      const db = getDatabase();
      const sessionRef = ref(db, `sessions/${userId}/${Date.now()}`);
      await set(sessionRef, {
        ...sessionData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log user session:', error);
    }
  }
}; 