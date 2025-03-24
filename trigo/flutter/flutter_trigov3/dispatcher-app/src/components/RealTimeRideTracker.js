import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

const RealTimeRideTracker = () => {
  const [rideUpdate, setRideUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('rideUpdate', (data) => setRideUpdate(data));
    socket.on('connect_error', () => setError('Failed to connect to ride tracking service.'));

    return () => socket.disconnect();
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="real-time-tracker">
      <h3>Real-Time Ride Tracking</h3>
      {rideUpdate ? (
        <div className="ride-update">
          <p>Ride ID: {rideUpdate.rideId}</p>
          <p>Status: {rideUpdate.status}</p>
          <p>
            Location: {rideUpdate.location.lat}, {rideUpdate.location.lng}
          </p>
          <p>Timestamp: {new Date(rideUpdate.timestamp).toLocaleTimeString()}</p>
        </div>
      ) : (
        <p>Waiting for ride updates...</p>
      )}
    </div>
  );
};

export default RealTimeRideTracker; 