import React, { useState } from 'react';
import LocationSelector from './LocationSelector';

const LocationDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };
  
  return (
    <div className="location-demo">
      <h3>Location Selection Demo</h3>
      <p>Select a province and city/municipality to see how Firestore data is used.</p>
      
      <LocationSelector onLocationSelect={handleLocationSelect} />
      
      {selectedLocation && selectedLocation.province && (
        <div className="selected-location">
          <h4>Selected Location</h4>
          <p><strong>Province:</strong> {selectedLocation.province}</p>
          {selectedLocation.city && (
            <p><strong>City/Municipality:</strong> {selectedLocation.city}</p>
          )}
        </div>
      )}
      
      <div className="info-box">
        <h4>How it works</h4>
        <p>This component demonstrates how to use the Philippine location data from Firestore:</p>
        <ol>
          <li>Provinces are fetched from the 'provinces' collection when the component loads</li>
          <li>When a province is selected, cities for that province are fetched from the 'cities' collection</li>
          <li>The component is reusable and can be integrated into any form that requires location selection</li>
        </ol>
      </div>
    </div>
  );
};

export default LocationDemo; 