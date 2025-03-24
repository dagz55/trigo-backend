import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './components/LandingPage';
import RideBooking from './components/RideBooking';
import './styles/App.css';
import './styles/Landing.css';
import './styles/RideBooking.css';

// Header component that conditionally renders based on route
const Header = () => {
  const location = useLocation();
  // Don't show header on the landing page
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <header className="App-header">
      <h1>Trigo Passenger</h1>
    </header>
  );
};

// AppContent component that contains the routes and uses the useLocation hook
const AppContent = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <main className="App-main-full">
            <LandingPage />
          </main>
        } />
        <Route path="/booking" element={
          <main className="App-main">
            <RideBooking />
          </main>
        } />
      </Routes>
      <ToastContainer position="bottom-center" />
    </>
  );
};

// Main App component that provides the Router context
function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App; 