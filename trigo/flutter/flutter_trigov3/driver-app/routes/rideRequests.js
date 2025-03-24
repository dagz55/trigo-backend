const express = require('express');
const router = express.Router();

// Get all ride requests
router.get('/', (req, res) => {
  res.json({
    success: true,
    rideRequests: [
      {
        id: 'ride-001',
        passenger: {
          id: 'user-123',
          name: 'John Doe',
          rating: 4.8
        },
        pickup: {
          address: '123 Main St, New York, NY',
          location: { lat: 40.7128, lng: -74.0060 }
        },
        dropoff: {
          address: '456 Broadway, New York, NY',
          location: { lat: 40.7193, lng: -73.9998 }
        },
        estimatedFare: 15.50,
        estimatedDistance: 2.3,
        estimatedDuration: 12,
        status: 'pending',
        createdAt: new Date()
      },
      {
        id: 'ride-002',
        passenger: {
          id: 'user-456',
          name: 'Jane Smith',
          rating: 4.9
        },
        pickup: {
          address: '789 Park Ave, New York, NY',
          location: { lat: 40.7735, lng: -73.9649 }
        },
        dropoff: {
          address: '101 5th Ave, New York, NY',
          location: { lat: 40.7399, lng: -73.9910 }
        },
        estimatedFare: 22.75,
        estimatedDistance: 3.8,
        estimatedDuration: 18,
        status: 'pending',
        createdAt: new Date()
      }
    ]
  });
});

// Accept a ride request
router.post('/:rideId/accept', (req, res) => {
  const { rideId } = req.params;
  
  res.json({
    success: true,
    message: `Ride ${rideId} accepted successfully`,
    ride: {
      id: rideId,
      status: 'accepted',
      acceptedAt: new Date()
    }
  });
});

// Complete a ride
router.post('/:rideId/complete', (req, res) => {
  const { rideId } = req.params;
  
  res.json({
    success: true,
    message: `Ride ${rideId} completed successfully`,
    ride: {
      id: rideId,
      status: 'completed',
      completedAt: new Date(),
      fare: 18.75
    }
  });
});

module.exports = router; 