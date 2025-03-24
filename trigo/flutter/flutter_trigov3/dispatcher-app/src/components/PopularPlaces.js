import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/popular-places/popular-places')
      .then((response) => setPlaces(response.data))
      .catch((err) => {
        console.error('Popular places error:', err);
        setError('Failed to load popular places.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading popular places...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="popular-places">
      <h3>Popular Places Insights</h3>
      <ul className="places-list">
        {places.map((place, index) => (
          <li key={index} className="place-item">
            {place.name} - {place.visits} visits
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularPlaces; 