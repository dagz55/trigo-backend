import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-provider';

export function AuthenticatedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
} 