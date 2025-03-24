import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logSecurityEvent } from '../../../../../utils/security';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function ActiveRidePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rideId = searchParams.get('rideId');
  
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideStatus, setRideStatus] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  
  // Fetch ride information
  useEffect(() => {
    const fetchRideData = async () => {
      if (!rideId) {
        setError('No ride ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, this would be an API call
        // Simulating API call
        setTimeout(() => {
          const mockRide = {
            id: rideId,
            passenger: {
              name: 'John Smith',
              phone: '+63 917-123-4567',
              rating: 4.8
            },
            pickup: {
              address: 'BFRV TODA Terminal, BF Resort Village, Las Piñas City',
              lat: 14.4503,
              lng: 120.9765
            },
            destination: {
              address: 'SM Southmall, Alabang-Zapote Rd, Las Piñas City',
              lat: 14.4350,
              lng: 120.9831
            },
            fare: 120.00,
            distance: 2.3,
            estimatedDuration: 15, // minutes
            status: rideId === 'ride-123' ? 'enroute_to_pickup' : 'pending',
            driverInfo: {
              association: 'BFRV TODA',
              vehicleType: 'Tricycle',
              plateNumber: 'TRI-1234'
            }
          };
          
          setRide(mockRide);
          setRideStatus(mockRide.status);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching ride data:', err);
        setError('Failed to load ride information');
        setLoading(false);
      }
    };
    
    fetchRideData();
  }, [rideId]);
  
  // Timer for ride
  useEffect(() => {
    if (!ride || rideStatus !== 'in_progress') return;
    
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [ride, rideStatus]);
  
  // Format timer to MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle ride status updates
  const updateRideStatus = async (newStatus) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // Simulating API call
      setTimeout(() => {
        setRideStatus(newStatus);
        setLoading(false);
        
        if (newStatus === 'in_progress') {
          setTimer(0);
        }
        
        if (newStatus === 'completed') {
          // Navigate to summary page after a delay
          setTimeout(() => {
            navigate('/earnings');
          }, 3000);
        }
        
        // Log security event
        logSecurityEvent('ride_status_change', {
          rideId,
          oldStatus: rideStatus,
          newStatus,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    } catch (err) {
      console.error('Error updating ride status:', err);
      setError('Failed to update ride status');
      setLoading(false);
    }
  };
  
  // Get action button based on current status
  const getActionButton = () => {
    switch (rideStatus) {
      case 'pending':
        return (
          <button
            onClick={() => updateRideStatus('accepted')}
            className="w-full py-3 bg-primary text-white rounded-md shadow-md"
          >
            Accept Ride
          </button>
        );
      case 'accepted':
      case 'enroute_to_pickup':
        return (
          <button
            onClick={() => updateRideStatus('arrived_at_pickup')}
            className="w-full py-3 bg-primary text-white rounded-md shadow-md"
          >
            Arrived at Pickup
          </button>
        );
      case 'arrived_at_pickup':
        return (
          <button
            onClick={() => updateRideStatus('in_progress')}
            className="w-full py-3 bg-primary text-white rounded-md shadow-md"
          >
            Start Ride
          </button>
        );
      case 'in_progress':
        return (
          <button
            onClick={() => updateRideStatus('completed')}
            className="w-full py-3 bg-primary text-white rounded-md shadow-md"
          >
            Complete Ride
          </button>
        );
      case 'completed':
        return (
          <div className="w-full py-3 bg-green-500 text-white rounded-md shadow-md text-center">
            Ride Completed
          </div>
        );
      default:
        return null;
    }
  };
  
  // Show status banner
  const getStatusBanner = () => {
    let message = '';
    let color = 'bg-gray-100';
    
    switch (rideStatus) {
      case 'pending':
        message = 'New Ride Request';
        color = 'bg-yellow-50 border-yellow-500 text-yellow-700';
        break;
      case 'accepted':
        message = 'Ride Accepted - Head to Pickup';
        color = 'bg-blue-50 border-blue-500 text-blue-700';
        break;
      case 'enroute_to_pickup':
        message = 'En Route to Pickup';
        color = 'bg-blue-50 border-blue-500 text-blue-700';
        break;
      case 'arrived_at_pickup':
        message = 'Arrived at Pickup - Waiting for Passenger';
        color = 'bg-purple-50 border-purple-500 text-purple-700';
        break;
      case 'in_progress':
        message = 'Ride in Progress';
        color = 'bg-green-50 border-green-500 text-green-700';
        break;
      case 'completed':
        message = 'Ride Completed';
        color = 'bg-green-50 border-green-500 text-green-700';
        break;
      default:
        message = 'Unknown Status';
    }
    
    return (
      <div className={`p-3 border-l-4 rounded-md mb-4 ${color}`}>
        <p className="font-medium">{message}</p>
        {rideStatus === 'in_progress' && (
          <p className="text-sm mt-1">Ride Time: {formatTime(timer)}</p>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="material-icons text-red-500">error</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Active Ride</h1>
      
      {getStatusBanner()}
      
      {/* Map Placeholder */}
      <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map View - Google Maps Integration</p>
      </div>
      
      {/* Passenger Info */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Passenger Information</h2>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
            <span className="material-icons text-gray-500">person</span>
          </div>
          <div>
            <p className="font-medium">{ride.passenger.name}</p>
            <p className="text-sm text-gray-600">Rating: {ride.passenger.rating} ★</p>
          </div>
          <div className="ml-auto">
            <button className="p-2 rounded-full bg-green-100 text-green-700">
              <span className="material-icons">phone</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Ride Details */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Ride Details</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <span className="material-icons text-green-500">location_on</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">{ride.pickup.address}</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <span className="material-icons text-red-500">flag</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{ride.destination.address}</p>
            </div>
          </div>
          
          <div className="pt-2 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-medium">{ride.distance} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. Time</p>
              <p className="font-medium">{ride.estimatedDuration} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fare</p>
              <p className="font-medium">₱{ride.fare.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vehicle Info */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Vehicle Information</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Association:</p>
            <p className="font-medium">{ride.driverInfo.association}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Vehicle Type:</p>
            <p className="font-medium">{ride.driverInfo.vehicleType}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Plate Number:</p>
            <p className="font-medium">{ride.driverInfo.plateNumber}</p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md shadow-md"
        >
          Cancel
        </button>
        
        <div className="flex-1">
          {getActionButton()}
        </div>
      </div>
    </div>
  );
}

export default withSecurityAndMonitoring(ActiveRidePage, {
  requireAuth: true,
  requireDriverApproval: true,
  monitorActivity: true,
  pageId: 'active_ride'
});
