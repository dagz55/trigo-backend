import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUserWithData, signOut } from '../../../utils/security';
import { Toaster } from './ui/toaster';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUserWithData();
      setUserData(user);
    };
    
    fetchUserData();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const navItems = [
    { label: 'Dashboard', path: '/', icon: 'dashboard' },
    { label: 'Active Ride', path: '/active-ride', icon: 'local_taxi' },
    { label: 'Earnings', path: '/earnings', icon: 'payments' },
    { label: 'Profile', path: '/profile', icon: 'person' },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className={`h-screen fixed top-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b">
          {isOpen ? (
            <h1 className="text-xl font-bold text-primary">Trigo Driver</h1>
          ) : (
            <span className="material-icons text-primary">local_taxi</span>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="material-icons text-gray-500 hover:text-primary"
          >
            {isOpen ? 'menu_open' : 'menu'}
          </button>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="material-icons text-gray-600">person</span>
            </div>
            {isOpen && userData && (
              <div className="flex flex-col">
                <span className="font-medium text-sm">{userData.fullName || userData.displayName}</span>
                <span className="text-xs text-gray-500">
                  {userData.status === 'approved' ? 'Active Driver' : 'Pending Approval'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons mr-3">{item.icon}</span>
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center p-2 w-full rounded-md text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="material-icons mr-3">logout</span>
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export function AuthenticatedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-1 shadow">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none lg:hidden"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="text-xl font-bold text-primary">Driver App</div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default AuthenticatedLayout; 