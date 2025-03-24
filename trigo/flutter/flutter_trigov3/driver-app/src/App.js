import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import withSecurityAndMonitoring from './components/hoc/withSecurityAndMonitoring';
import { AuthenticatedLayout } from './components/ui/components/authenticated-layout';
import { ThemeProvider } from './components/ui/components/theme-provider';
import { Toaster } from './components/ui/components/ui/toaster';

// Import pages
import LoginPage from './components/ui/app/auth/login/page';
import RegisterPage from './components/ui/app/auth/register/page';
import ActiveRidePage from './components/ui/app/driver/active-ride/page';
import DashboardPage from './components/ui/app/driver/dashboard/page';
import EarningsPage from './components/ui/app/driver/earnings/page';
import ProfilePage from './components/ui/app/driver/profile/page';

// Secure the pages with role-based access control
const SecureDashboard = withSecurityAndMonitoring(DashboardPage, {
  requireAuth: true,
  requireDriverApproval: true,
  pageId: 'driver-dashboard'
});

const SecureProfile = withSecurityAndMonitoring(ProfilePage, {
  requireAuth: true,
  requireDriverApproval: true,
  pageId: 'driver-profile'
});

const SecureEarnings = withSecurityAndMonitoring(EarningsPage, {
  requireAuth: true,
  requireDriverApproval: true,
  pageId: 'driver-earnings'
});

const SecureActiveRide = withSecurityAndMonitoring(ActiveRidePage, {
  requireAuth: true,
  requireDriverApproval: true,
  pageId: 'driver-active-ride'
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="trigo-driver-theme">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<SecureDashboard />} />
            <Route path="/profile" element={<SecureProfile />} />
            <Route path="/earnings" element={<SecureEarnings />} />
            <Route path="/active-ride" element={<SecureActiveRide />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
