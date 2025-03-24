import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  // For demo purposes, simulate a loaded user profile.
  // In practice, retrieve this from your authentication flow.
  const [userProfile, setUserProfile] = useState({ 
    role: 'passenger',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    trips: 12,
    rating: 4.7
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTrips, setRecentTrips] = useState([
    {
      id: 1,
      date: '2024-03-14',
      pickup: 'Home',
      dropoff: 'Office',
      amount: '$12.50',
      driver: 'Robert Suarez'
    },
    {
      id: 2,
      date: '2024-03-12',
      pickup: 'Office',
      dropoff: 'Home',
      amount: '$13.25',
      driver: 'Dagz Suarez'
    }
  ]);

  useEffect(() => {
    if (userProfile.role === 'driver') {
      window.location.href = 'http://localhost:3001'; // Redirect to Driver App
    } else if (userProfile.role === 'dispatcher') {
      window.location.href = 'http://localhost:3002'; // Redirect to Dispatcher App
    }
    // For passenger, remain on main-app (the landing page/dashboard).
  }, [userProfile]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  if (userProfile.role !== 'passenger') {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="dashboard">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Where to?"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <section className="user-info">
        <h2>Welcome, {userProfile.name}!</h2>
        <div className="profile-details">
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Phone:</strong> {userProfile.phone}</p>
          <p><strong>Total Trips:</strong> {userProfile.trips}</p>
          <p><strong>Rating:</strong> <span className="rating">⭐ {userProfile.rating}</span></p>
        </div>
      </section>

      <section className="recent-trips">
        <h2>Recent Trips</h2>
        {recentTrips.map(trip => (
          <div key={trip.id} className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>{trip.pickup} to {trip.dropoff}</h3>
              <span>{trip.amount}</span>
            </div>
            <p>Date: {new Date(trip.date).toLocaleDateString()}</p>
            <p>Driver: {trip.driver}</p>
          </div>
        ))}
      </section>

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
      </div>
    </div>
  );
};

export default Dashboard;
