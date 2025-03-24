import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EarningsTracking = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/driver/earnings')
      .then((response) => setEarnings(response.data))
      .catch((err) => {
        console.error('Earnings fetch error:', err);
        setError('Failed to load earnings data.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading earnings data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="earnings-tracking">
      <h3>Earnings Tracking</h3>
      <div className="earnings-cards">
        <div className="earnings-card daily">
          <h4>Today</h4>
          <div className="amount">${earnings.daily}</div>
        </div>
        <div className="earnings-card weekly">
          <h4>This Week</h4>
          <div className="amount">${earnings.weekly}</div>
        </div>
        <div className="earnings-card monthly">
          <h4>This Month</h4>
          <div className="amount">${earnings.monthly}</div>
        </div>
      </div>
    </div>
  );
};

export default EarningsTracking; 