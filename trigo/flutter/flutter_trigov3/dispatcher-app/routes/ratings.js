const express = require('express');
const router = express.Router();

// Get all ratings
router.get('/', (req, res) => {
  res.json({
    success: true,
    ratings: [
      { id: 1, userId: 'u123', driverId: 'd456', rating: 4.5, comment: 'Great service', date: new Date() },
      { id: 2, userId: 'u789', driverId: 'd456', rating: 5.0, comment: 'Excellent driver', date: new Date() },
      { id: 3, userId: 'u456', driverId: 'd789', rating: 3.5, comment: 'Good but late', date: new Date() }
    ]
  });
});

// Submit a new rating
router.post('/', (req, res) => {
  const { userId, driverId, rating, comment } = req.body;
  
  if (!userId || !driverId || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // In a real app, save to database
  res.status(201).json({
    success: true,
    ratingId: `RATING-${Date.now()}`,
    userId,
    driverId,
    rating,
    comment,
    date: new Date()
  });
});

module.exports = router; 