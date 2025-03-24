import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ActivityPage from './components/ui/app/activity/page';
import ForgotPasswordPage from './components/ui/app/auth/forgot-password/page';
import LoginPage from './components/ui/app/auth/login/page';
import RegisterPage from './components/ui/app/auth/register/page';
import HistoryPage from './components/ui/app/history/page';
import HomePage from './components/ui/app/home/page';
import NotificationsPage from './components/ui/app/notifications/page';
import ProfilePage from './components/ui/app/profile/page';
import { AuthProvider } from './components/ui/components/auth-provider';
import { AuthenticatedLayout } from './components/ui/components/authenticated-layout';
import { ThemeProvider } from './components/ui/components/theme-provider';
import { Toaster } from './components/ui/components/ui/toaster';
import './components/ui/styles/globals.css';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/"
              element={
                <AuthenticatedLayout>
                  <HomePage />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthenticatedLayout>
                  <ProfilePage />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/activity"
              element={
                <AuthenticatedLayout>
                  <ActivityPage />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/history"
              element={
                <AuthenticatedLayout>
                  <HistoryPage />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/notifications"
              element={
                <AuthenticatedLayout>
                  <NotificationsPage />
                </AuthenticatedLayout>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
