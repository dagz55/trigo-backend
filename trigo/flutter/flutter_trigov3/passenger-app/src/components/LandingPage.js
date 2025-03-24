import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Welcome to Trigo</h1>
          <p className="hero-subtitle">
            Your trusted ride-hailing service for tricycle operators and drivers
            association (TODA)
          </p>
          <div className="button-group">
            <Link to="/login" className="button primary-button">
              Sign In
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/booking" className="button secondary-button">
              Book a Ride
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Trigo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon location-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-description">
                Book a ride with just a few taps. No account required for passengers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon drivers-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="feature-title">Verified Drivers</h3>
              <p className="feature-description">
                All our drivers are verified members of local TODA associations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon security-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-title">Safe & Secure</h3>
              <p className="feature-description">
                Track your ride in real-time and share your trip details with loved ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="section-title">Ready to get started?</h2>
          <p className="cta-description">
            Join thousands of riders and passengers using Trigo every day.
          </p>
          <div className="button-group">
            <Link to="/register" className="button primary-button">
              Sign Up Now
            </Link>
            <Link to="/booking" className="button secondary-button">
              Book Without Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-branding">
              <h2 className="footer-title">Trigo</h2>
              <p className="footer-subtitle">Your trusted ride-hailing service</p>
            </div>
            <div className="footer-links">
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/privacy" className="footer-link">Privacy</Link>
              <Link to="/terms" className="footer-link">Terms</Link>
            </div>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Trigo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 