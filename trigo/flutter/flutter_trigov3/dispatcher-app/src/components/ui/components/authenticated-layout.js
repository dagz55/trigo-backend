import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-provider';

export function AuthenticatedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Trigo Dispatcher</h1>
        </div>
        <nav className="space-y-2">
          <a href="/" className="block px-4 py-2 rounded hover:bg-gray-200">Dashboard</a>
          <a href="/rides" className="block px-4 py-2 rounded hover:bg-gray-200">Ride Management</a>
          <a href="/drivers" className="block px-4 py-2 rounded hover:bg-gray-200">Driver Management</a>
          <a href="/analytics" className="block px-4 py-2 rounded hover:bg-gray-200">Analytics</a>
          <a href="/settings" className="block px-4 py-2 rounded hover:bg-gray-200">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
} 