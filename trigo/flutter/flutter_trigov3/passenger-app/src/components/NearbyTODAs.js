import React, { useEffect, useState } from 'react';
import { findNearestTODAs } from '../utils/todaService';

/**
 * Component to display nearby TODAs based on current passenger location
 * @param {Object} props - Component props
 * @param {Object} props.location - Current location {lat, lng}
 * @param {Function} props.onSelectTODA - Callback when a TODA is selected
 * @param {boolean} props.loading - Whether the parent component is in a loading state
 */
const NearbyTODAs = ({ location, onSelectTODA, loading: externalLoading }) => {
  const [nearbyTODAs, setNearbyTODAs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearbyTODAs = async () => {
      if (!location || !location.lat || !location.lng) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Find TODAs within 5km radius with full details
        const todaResults = await findNearestTODAs(
          location.lat,
          location.lng,
          5, // 5km radius
          { 
            limit: 5,
            includeDetails: true 
          }
        );
        
        setNearbyTODAs(todaResults);
      } catch (err) {
        console.error('Error fetching nearby TODAs:', err);
        setError('Failed to fetch nearby TODA associations');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyTODAs();
  }, [location]);

  if (loading || externalLoading) {
    return (
      <div className="nearby-todas loading">
        <h3>Finding nearby TODA associations...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nearby-todas error">
        <h3>TODA Associations</h3>
        <p className="error-message">{error}</p>
        <p>Please try again or select a different location</p>
      </div>
    );
  }

  if (nearbyTODAs.length === 0) {
    return (
      <div className="nearby-todas empty">
        <h3>TODA Associations</h3>
        <p>No TODA associations found near this location</p>
        <p>Please select a different pickup location</p>
      </div>
    );
  }

  return (
    <div className="nearby-todas">
      <h3>Available TODA Associations</h3>
      <p className="subtitle">Select a TODA to request a ride</p>
      
      <div className="toda-list">
        {nearbyTODAs.map((toda) => (
          <div key={toda.todaId} className="toda-item">
            <div className="toda-info">
              <h4>{toda.name}</h4>
              <p className="toda-area">{toda.area}</p>
              <p className="toda-distance">{toda.distance.toFixed(2)} km away</p>
              {toda.driverCount !== undefined && (
                <p className="toda-drivers">
                  {toda.driverCount > 0 
                    ? `${toda.driverCount} available ${toda.driverCount === 1 ? 'driver' : 'drivers'}`
                    : 'No available drivers at the moment'}
                </p>
              )}
            </div>
            <button 
              className="select-toda-btn"
              onClick={() => onSelectTODA(toda)}
              disabled={toda.driverCount === 0}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyTODAs; 