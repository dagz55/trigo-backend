import React from 'react';
import { withSecurityAndMonitoring } from '../components/hoc/withSecurityAndMonitoring';
import ProfilePage from '../components/ui/app/profile/page';
import { UserRoles } from '../utils/security';

// Wrap the v0.dev ProfilePage with our security and monitoring features
const SecureProfile = (props) => {
  return <ProfilePage {...props} />;
};

// Export the wrapped component with security and monitoring
export default withSecurityAndMonitoring(SecureProfile, UserRoles.PASSENGER, {
  trackPageView: true,
  measurePerformance: true,
  checkSystemHealth: true,
}); 