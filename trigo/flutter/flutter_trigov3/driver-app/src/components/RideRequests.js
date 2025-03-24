import axios from 'axios';
import React, { useEffect, useState } from 'react';

const RideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState({
    loading: true,
    requestId: null,
    action: null
  });

  const fetchRideRequests = async () => {
    try {
      setLoadingState({ ...loadingState, loading: true });
      const res = await axios.get('/api/ride-requests');
      setRideRequests(res.data);
      setLoadingState({ ...loadingState, loading: false });
    } catch (err) {
      setError('Failed to load ride requests.');
      setLoadingState({ ...loadingState, loading: false });
    }
  };

  const handleAction = async (rideId, action) => {
    try {
      setLoadingState({ loading: true, requestId: rideId, action });
      await axios.post('/api/ride-requests/respond', { rideId, action });
      fetchRideRequests();
    } catch (err) {
      setError('Failed to process ride request.');
      setLoadingState({ loading: false, requestId: null, action: null });
    }
  };

  useEffect(() => {
    fetchRideRequests();
  }, []);

  if (loadingState.loading && rideRequests.length === 0) {
    return <div className="loading">Loading ride requests...</div>;
  }

  return (
    <div className="ride-requests">
      <h3>Ride Requests</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="requests-list">
        {rideRequests.length === 0 ? (
          <p>No ride requests available</p>
        ) : (
          rideRequests.map((ride) => (
            <div key={ride.rideId} className="ride-request-card">
              <div className="ride-info">
                <h4>Ride #{ride.rideId}</h4>
                <p>From: {ride.pickupLocation}</p>
                <p>To: {ride.dropoffLocation}</p>
                <p>Passenger: {ride.passengerName}</p>
              </div>
              <div className="action-buttons">
                <button 
                  className="accept-btn"
                  disabled={loadingState.requestId === ride.rideId}
                  onClick={() => handleAction(ride.rideId, 'accept')}
                >
                  {loadingState.requestId === ride.rideId && loadingState.action === 'accept' 
                    ? 'Accepting...' 
                    : 'Accept'}
                </button>
                <button 
                  className="reject-btn"
                  disabled={loadingState.requestId === ride.rideId}
                  onClick={() => handleAction(ride.rideId, 'reject')}
                >
                  {loadingState.requestId === ride.rideId && loadingState.action === 'reject' 
                    ? 'Rejecting...' 
                    : 'Reject'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideRequests; 