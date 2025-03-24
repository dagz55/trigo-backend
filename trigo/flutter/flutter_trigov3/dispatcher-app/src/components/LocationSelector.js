import React, { useEffect, useState } from 'react';
import LocationService from '../utils/locationService';

/**
 * A component for selecting provinces and cities/municipalities
 */
const LocationSelector = ({ onLocationSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState({
    provinces: false,
    cities: false
  });
  const [error, setError] = useState(null);

  // Fetch provinces on component mount
  useEffect(() => {
    async function fetchProvinces() {
      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        const provinceData = await LocationService.getProvinces();
        setProvinces(provinceData);
        setError(null);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Failed to load provinces. Please try again later.');
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    }

    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }

    async function fetchCities() {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const cityData = await LocationService.getCitiesByProvince(selectedProvince);
        setCities(cityData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching cities for ${selectedProvince}:`, err);
        setError(`Failed to load cities for ${selectedProvince}. Please try again later.`);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    }

    fetchCities();
  }, [selectedProvince]);

  // Handle province change
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedCity('');
    
    // Pass null to onLocationSelect to indicate incomplete selection
    if (onLocationSelect) {
      onLocationSelect({ province, city: null });
    }
  };

  // Handle city change
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    
    // Pass complete location to parent
    if (onLocationSelect) {
      onLocationSelect({ province: selectedProvince, city });
    }
  };

  return (
    <div className="location-selector">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="province-select">Province</label>
        <select
          id="province-select"
          value={selectedProvince}
          onChange={handleProvinceChange}
          disabled={loading.provinces}
        >
          <option value="">Select Province</option>
          {provinces.map(province => (
            <option key={province.id} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
        {loading.provinces && <div className="loading-indicator">Loading provinces...</div>}
      </div>

      <div className="form-group">
        <label htmlFor="city-select">City / Municipality</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedProvince || loading.cities}
        >
          <option value="">Select City / Municipality</option>
          {cities.map(city => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {loading.cities && <div className="loading-indicator">Loading cities...</div>}
      </div>
    </div>
  );
};

export default LocationSelector; 