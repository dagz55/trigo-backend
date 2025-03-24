import React, { useEffect, useState } from 'react';
import LocationService from '../utils/locationService';

/**
 * Admin component for managing location data
 * Allows viewing of provinces and cities currently in Firestore
 */
const LocationAdmin = () => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const data = await LocationService.getProvinces();
        setProvinces(data);
        setError(null);
      } catch (err) {
        setError('Error fetching provinces: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const data = await LocationService.getCitiesByProvince(selectedProvince);
        setCities(data);
        setError(null);
      } catch (err) {
        setError('Error fetching cities: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [selectedProvince]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  return (
    <div className="location-admin">
      <h2>Location Data Management</h2>
      
      <div className="admin-section">
        <h3>Current Data in Firestore</h3>
        
        {error && <p className="error-message">{error}</p>}
        {status && <p className="success-message">{status}</p>}
        
        <div className="data-explorer">
          <div className="form-group">
            <label htmlFor="provinceSelect">Select Province:</label>
            <select 
              id="provinceSelect" 
              value={selectedProvince} 
              onChange={handleProvinceChange}
              disabled={loading || provinces.length === 0}
            >
              <option value="">-- Select Province --</option>
              {provinces.map(province => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
            {loading && <div className="loading-indicator">Loading...</div>}
          </div>
          
          {selectedProvince && (
            <div className="cities-display">
              <h4>Cities/Municipalities in {selectedProvince}</h4>
              {cities.length === 0 ? (
                <p>No cities found for this province.</p>
              ) : (
                <ul className="cities-list">
                  {cities.map(city => (
                    <li key={city.id} className="city-item">
                      <strong>{city.name}</strong>
                      {city.population && (
                        <span className="city-population"> - Population: {city.population.toLocaleString()}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="admin-info">
        <h3>Managing Location Data</h3>
        <p>
          This component allows you to view province and city data stored in Firestore. 
          To add or update location data, use the script provided in the project:
        </p>
        <pre className="code-block">
          node utils/upload-location-data.js
        </pre>
        <p>
          The script will upload all provinces and cities defined in the data file to your Firestore database,
          creating the necessary collections and documents with proper references.
        </p>
      </div>
    </div>
  );
};

export default LocationAdmin; 