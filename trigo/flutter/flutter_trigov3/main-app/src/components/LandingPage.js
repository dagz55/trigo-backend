import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  return (
    <div className="landing-page">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Where to?"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="ride-options">
        <div className="card-with-icon">
          <div className="card-icon primary">
            <span>👥</span>
          </div>
          <div className="card-content">
            <h3>Regular/Group</h3>
            <p>Share your ride</p>
          </div>
        </div>

        <div className="card-with-icon">
          <div className="card-icon secondary">
            <span>⭐</span>
          </div>
          <div className="card-content">
            <h3>Special Ride</h3>
            <p>Private booking</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-with-icon">
          <div className="card-icon primary">
            <span>🏆</span>
          </div>
          <div className="card-content">
            <h3>Leaderboard</h3>
            <p>Top rated drivers</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-with-icon">
          <div className="card-icon primary">
            <span>⚡</span>
          </div>
          <div className="card-content">
            <h3>Quick Dispatch</h3>
            <p>Instant booking</p>
          </div>
        </div>
      </div>

      <h2>Top Rated Drivers</h2>
      <div className="driver-card">
        <div className="driver-avatar"></div>
        <div className="driver-info">
          <h3 className="driver-name">Kuya Driver 1</h3>
          <div className="driver-details">
            <div>
              <span>📍</span> Brgy. 1
            </div>
            <div>
              <span>🚕</span> 900+ trips
            </div>
          </div>
        </div>
        <div className="driver-rating">
          <span>⭐</span> 4.8
        </div>
      </div>

      <div className="nav-bar">
        <div className="nav-item active">
          <div className="nav-icon">🏠</div>
          <div>Home</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">📊</div>
          <div>Activity</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">🔔</div>
          <div>Notifications</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">📜</div>
          <div>History</div>
        </div>
        <div className="nav-item">
          <div className="nav-icon">📋</div>
          <div>Dispatcher</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
