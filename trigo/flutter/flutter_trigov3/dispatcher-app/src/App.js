import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import withSecurityAndMonitoring from './components/hoc/withSecurityAndMonitoring';
import { AuthenticatedLayout } from './components/ui/components/authenticated-layout';
import { ThemeProvider } from './components/ui/components/theme-provider';
import { Toaster } from './components/ui/components/ui/toaster';
import { UserRoles } from './utils/security';

// Import pages
import LoginPage from './components/ui/app/auth/login/page';
import AnalyticsPage from './components/ui/app/dispatcher/analytics/page';
import DashboardPage from './components/ui/app/dispatcher/dashboard/page';
import DriversPage from './components/ui/app/dispatcher/drivers/page';
import RidesPage from './components/ui/app/dispatcher/rides/page';
import SettingsPage from './components/ui/app/dispatcher/settings/page';

// Secure the pages with role-based access control
const SecureDashboard = withSecurityAndMonitoring(DashboardPage, UserRoles.DISPATCHER);
const SecureRides = withSecurityAndMonitoring(RidesPage, UserRoles.DISPATCHER);
const SecureDrivers = withSecurityAndMonitoring(DriversPage, UserRoles.DISPATCHER);
const SecureAnalytics = withSecurityAndMonitoring(AnalyticsPage, UserRoles.DISPATCHER);
const SecureSettings = withSecurityAndMonitoring(SettingsPage, UserRoles.DISPATCHER);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="trigo-dispatcher-theme">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<SecureDashboard />} />
            <Route path="/rides" element={<SecureRides />} />
            <Route path="/drivers" element={<SecureDrivers />} />
            <Route path="/analytics" element={<SecureAnalytics />} />
            <Route path="/settings" element={<SecureSettings />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
