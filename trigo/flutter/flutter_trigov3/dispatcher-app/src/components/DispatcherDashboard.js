import React, { useEffect, useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import DriverRating from './DriverRating';
import LocationAdmin from './LocationAdmin';
import LocationDemo from './LocationDemo';
import PopularPlaces from './PopularPlaces';
import PushNotifications from './PushNotifications';
import RealTimeTracker from './RealTimeTracker';

function DispatcherDashboard() {
  const [activeRides, setActiveRides] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState('rides');

  useEffect(() => {
    // TODO: Fetch active rides, available drivers, and pending requests
    setActiveRides([
      {
        id: 1,
        passengerName: 'John Doe',
        driverName: 'Driver 1',
        status: 'in_progress',
        pickup: 'Location A',
        dropoff: 'Location B'
      }
    ]);

    setAvailableDrivers([
      {
        id: 1,
        name: 'Driver 1',
        vehicleNumber: 'ABC123',
        rating: 4.8
      }
    ]);

    setPendingRequests([
      {
        id: 1,
        passengerName: 'Jane Doe',
        pickup: 'Location C',
        dropoff: 'Location D',
        timestamp: '2024-02-20T10:00:00Z'
      }
    ]);
  }, []);

  const handleAssignDriver = (requestId, driverId) => {
    // TODO: Implement driver assignment logic
    console.log(`Assigning driver ${driverId} to request ${requestId}`);
  };

  const renderTabContent = () => {
    switch(selectedTab) {
      case 'rides':
        return (
          <>
            <section className="active-rides">
              <h2>Active Rides</h2>
              <div className="rides-list">
                {activeRides.map(ride => (
                  <div key={ride.id} className="ride-card">
                    <h3>Ride #{ride.id}</h3>
                    <p>Passenger: {ride.passengerName}</p>
                    <p>Driver: {ride.driverName}</p>
                    <p>Status: {ride.status}</p>
                    <p>Pickup: {ride.pickup}</p>
                    <p>Dropoff: {ride.dropoff}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="pending-requests">
              <h2>Pending Requests</h2>
              <div className="requests-list">
                {pendingRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <h3>Request #{request.id}</h3>
                    <p>Passenger: {request.passengerName}</p>
                    <p>Pickup: {request.pickup}</p>
                    <p>Dropoff: {request.dropoff}</p>
                    <p>Time: {new Date(request.timestamp).toLocaleString()}</p>
                    <div className="driver-assignment">
                      <select onChange={(e) => handleAssignDriver(request.id, e.target.value)}>
                        <option value="">Select Driver</option>
                        {availableDrivers.map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} ({driver.vehicleNumber})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="available-drivers">
              <h2>Available Drivers</h2>
              <div className="drivers-list">
                {availableDrivers.map(driver => (
                  <div key={driver.id} className="driver-card">
                    <h3>{driver.name}</h3>
                    <p>Vehicle: {driver.vehicleNumber}</p>
                    <p>Rating: {driver.rating}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      case 'requests':
        return <h2>Ride Requests</h2>;
      case 'drivers':
        return <h2>Available Drivers</h2>;
      case 'tracker':
        return <RealTimeTracker />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ratings':
        return <DriverRating />;
      case 'places':
        return <PopularPlaces />;
      case 'notifications':
        return <PushNotifications />;
      case 'locations':
        return <LocationDemo />;
      case 'location-admin':
        return <LocationAdmin />;
      default:
        return <h2>Select a tab</h2>;
    }
  };

  return (
    <div className="dispatcher-dashboard">
      <header>
        <h1>Dispatcher Dashboard</h1>
        <div className="dashboard-nav">
          <button 
            className={selectedTab === 'rides' ? 'active' : ''} 
            onClick={() => setSelectedTab('rides')}
          >
            Active Rides
          </button>
          <button 
            className={selectedTab === 'requests' ? 'active' : ''} 
            onClick={() => setSelectedTab('requests')}
          >
            Ride Requests
          </button>
          <button 
            className={selectedTab === 'drivers' ? 'active' : ''} 
            onClick={() => setSelectedTab('drivers')}
          >
            Drivers
          </button>
          <button 
            className={selectedTab === 'tracker' ? 'active' : ''} 
            onClick={() => setSelectedTab('tracker')}
          >
            Real-time Tracker
          </button>
          <button 
            className={selectedTab === 'analytics' ? 'active' : ''} 
            onClick={() => setSelectedTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={selectedTab === 'ratings' ? 'active' : ''} 
            onClick={() => setSelectedTab('ratings')}
          >
            Driver Ratings
          </button>
          <button 
            className={selectedTab === 'places' ? 'active' : ''} 
            onClick={() => setSelectedTab('places')}
          >
            Popular Places
          </button>
          <button 
            className={selectedTab === 'notifications' ? 'active' : ''} 
            onClick={() => setSelectedTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={selectedTab === 'locations' ? 'active' : ''} 
            onClick={() => setSelectedTab('locations')}
          >
            Location Demo
          </button>
          <button 
            className={selectedTab === 'location-admin' ? 'active' : ''} 
            onClick={() => setSelectedTab('location-admin')}
          >
            Location Admin
          </button>
        </div>
      </header>

      <main>
        {renderTabContent()}
      </main>
    </div>
  );
}

export default DispatcherDashboard;
