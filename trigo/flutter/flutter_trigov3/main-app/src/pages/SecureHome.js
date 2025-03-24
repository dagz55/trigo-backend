import React from 'react';
import { withSecurityAndMonitoring } from '../components/hoc/withSecurityAndMonitoring';
import HomePage from '../components/ui/app/home/page';
import { UserRoles } from '../utils/security';

// Wrap the v0.dev HomePage with our security and monitoring features
const SecureHome = (props) => {
  return <HomePage {...props} />;
};

// Export the wrapped component with security and monitoring
export default withSecurityAndMonitoring(SecureHome, UserRoles.PASSENGER, {
  trackPageView: true,
  measurePerformance: true,
  checkSystemHealth: true,
}); 