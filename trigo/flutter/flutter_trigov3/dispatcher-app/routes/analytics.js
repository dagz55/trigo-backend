const express = require('express');
const router = express.Router();

// Get overall analytics
router.get('/', (req, res) => {
  res.json({
    success: true,
    analytics: {
      totalRides: 1250,
      totalDrivers: 85,
      totalUsers: 560,
      averageRating: 4.7,
      totalRevenue: 28500,
      activeRides: 42
    }
  });
});

// Get daily ride metrics
router.get('/daily', (req, res) => {
  res.json({
    success: true,
    metrics: [
      { date: '2024-03-10', rides: 120, revenue: 2400 },
      { date: '2024-03-11', rides: 135, revenue: 2750 },
      { date: '2024-03-12', rides: 142, revenue: 2950 },
      { date: '2024-03-13', rides: 138, revenue: 2850 },
      { date: '2024-03-14', rides: 155, revenue: 3200 },
      { date: '2024-03-15', rides: 178, revenue: 3650 },
      { date: '2024-03-16', rides: 190, revenue: 3900 }
    ]
  });
});

// Get ride completion rate
router.get('/completion-rate', (req, res) => {
  res.json({
    success: true,
    completedRides: 1150,
    canceledRides: 100,
    completionRate: 92
  });
});

module.exports = router; 