const express = require('express');
const router = express.Router();

// Get popular places
router.get('/', (req, res) => {
  res.json({
    success: true,
    places: [
      { 
        id: 1, 
        name: 'Central Park', 
        location: { lat: 40.7812, lng: -73.9665 },
        popularity: 9.5,
        visitCount: 1250
      },
      { 
        id: 2, 
        name: 'Times Square', 
        location: { lat: 40.7580, lng: -73.9855 },
        popularity: 9.8,
        visitCount: 1850
      },
      { 
        id: 3, 
        name: 'Empire State Building', 
        location: { lat: 40.7484, lng: -73.9857 },
        popularity: 9.3,
        visitCount: 980
      }
    ]
  });
});

// Get place details
router.get('/:placeId', (req, res) => {
  const { placeId } = req.params;
  
  // Simulate fetching specific place details
  res.json({
    success: true,
    place: {
      id: parseInt(placeId),
      name: `Place ${placeId}`,
      location: { lat: 40.7580, lng: -73.9855 },
      popularity: 9.5,
      visitCount: 1250,
      description: 'A popular destination with lots of attractions',
      openingHours: '9:00 AM - 10:00 PM',
      photos: ['photo1.jpg', 'photo2.jpg']
    }
  });
});

module.exports = router; 