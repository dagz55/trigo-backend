import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 14.5995, lng: 120.9842 }; // Manila center

const NavigationMap = ({ pickup, dropoff }) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);

  // If pickup and dropoff are provided, use them instead of defaults
  const pickupLocation = pickup || { lat: 14.5995, lng: 120.9842 }; // Default to Manila
  const dropoffLocation = dropoff || { lat: 14.6091, lng: 121.0223 }; // Default to Quezon City

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
      } else {
        setError('Directions request failed due to ' + response.status);
      }
    }
  };

  return (
    <div className="navigation-map">
      <h3>Navigation Map</h3>
      {error && <div className="error-message">{error}</div>}
      
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          {/* Only display markers if directions are not available */}
          {!directions && (
            <>
              <Marker position={pickupLocation} />
              <Marker 
                position={dropoffLocation} 
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            </>
          )}

          {/* Request directions */}
          <DirectionsService
            options={{
              destination: dropoffLocation,
              origin: pickupLocation,
              travelMode: 'DRIVING'
            }}
            callback={directionsCallback}
          />

          {/* Render directions if available */}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default NavigationMap; 