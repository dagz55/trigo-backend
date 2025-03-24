import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/analytics')
      .then((response) => setAnalyticsData(response.data))
      .catch((err) => {
        console.error('Analytics fetch error:', err);
        setError('Failed to load analytics data.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const chartData = {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Ride Count',
        data: analyticsData.rideCounts,
        backgroundColor: 'rgba(25,118,210,0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Ride Statistics',
      },
    },
  };

  return (
    <div className="analytics-dashboard">
      <h3>Analytics Dashboard</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 