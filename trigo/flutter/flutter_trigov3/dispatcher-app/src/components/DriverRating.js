import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DriverRating = ({ driverId = 'driver-001' }) => {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  const submitRating = async () => {
    try {
      const res = await axios.post('/api/ratings/rate-driver', { driverId, rating: Number(rating) });
      setMessage(res.data.message);
      fetchRating();
      setRating('');
    } catch (error) {
      setMessage('Error submitting rating.');
    }
  };

  const fetchRating = async () => {
    try {
      const res = await axios.get(`/api/ratings/driver-rating/${driverId}`);
      setAverageRating(res.data.averageRating);
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  useEffect(() => {
    fetchRating();
  }, [driverId]);

  return (
    <div className="driver-rating">
      <h3>Driver Rating System</h3>
      <div className="rating-form">
        <input
          type="number"
          placeholder="Rate Driver (1-5)"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button onClick={submitRating}>Submit Rating</button>
      </div>
      {message && <div className="message">{message}</div>}
      {averageRating !== null && <p className="average-rating">Average Rating: {averageRating.toFixed(2)}</p>}
    </div>
  );
};

export default DriverRating; 