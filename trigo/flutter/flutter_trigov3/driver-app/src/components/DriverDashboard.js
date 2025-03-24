import React, { useEffect, useState } from 'react';
import EarningsTracking from './EarningsTracking';
import NavigationMap from './NavigationMap';
import RideRequests from './RideRequests';

function DriverDashboard() {
  const [driverProfile, setDriverProfile] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  useEffect(() => {
    // TODO: Fetch driver profile and current ride data
    setDriverProfile({
      name: 'Driver Name',
      vehicleNumber: 'ABC123',
      rating: 4.8
    });
  }, []);

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
    // TODO: Update driver availability status
  };

  const renderTabContent = () => {
    switch(selectedTab) {
      case 'dashboard':
        return (
          <>
            <section className="profile-section">
              <h2>Your Profile</h2>
              <p>Name: {driverProfile.name}</p>
              <p>Vehicle Number: {driverProfile.vehicleNumber}</p>
              <p>Rating: {driverProfile.rating}</p>
            </section>

            {currentRide ? (
              <section className="current-ride">
                <h2>Current Ride</h2>
                <p>Passenger: {currentRide.passengerName}</p>
                <p>Pickup: {currentRide.pickup}</p>
                <p>Dropoff: {currentRide.dropoff}</p>
                <NavigationMap 
                  pickup={currentRide.pickupCoords} 
                  dropoff={currentRide.dropoffCoords} 
                />
              </section>
            ) : (
              <section className="available-rides">
                <h2>Available Rides</h2>
                <RideRequests />
              </section>
            )}
          </>
        );
      case 'requests':
        return <RideRequests />;
      case 'map':
        return <NavigationMap />;
      case 'earnings':
        return <EarningsTracking />;
      default:
        return null;
    }
  };

  if (!driverProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="driver-dashboard">
      <header>
        <h1>Driver Dashboard</h1>
        <div className="availability-toggle">
          <label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={handleAvailabilityToggle}
            />
            Available for Rides
          </label>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={selectedTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setSelectedTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={selectedTab === 'requests' ? 'active' : ''} 
            onClick={() => setSelectedTab('requests')}
          >
            Ride Requests
          </button>
          <button 
            className={selectedTab === 'map' ? 'active' : ''} 
            onClick={() => setSelectedTab('map')}
          >
            Navigation
          </button>
          <button 
            className={selectedTab === 'earnings' ? 'active' : ''} 
            onClick={() => setSelectedTab('earnings')}
          >
            Earnings
          </button>
        </nav>
      </header>

      <main>
        {renderTabContent()}
      </main>
    </div>
  );
}

export default DriverDashboard;
