import React, { useEffect, useState } from 'react';
import { logSecurityEvent } from '../../../../../utils/security';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function RideMonitoringPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // In a real app, this would be an API call
        // Simulating API call
        setTimeout(() => {
          const mockRides = [
            {
              id: 'ride-123',
              passenger: {
                name: 'John Smith',
                phone: '+63 917-123-4567',
                rating: 4.8
              },
              driver: {
                id: 'driver-001',
                name: 'Pedro Santos',
                phone: '+63 918-765-4321',
                rating: 4.9,
                vehicleType: 'Tricycle',
                plateNumber: 'TRI-1234',
                association: 'BFRV TODA'
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
              status: 'in_progress',
              startTime: new Date(Date.now() - 10 * 60000).toISOString()
            },
            {
              id: 'ride-124',
              passenger: {
                name: 'Maria Garcia',
                phone: '+63 919-222-3333',
                rating: 4.5
              },
              driver: {
                id: 'driver-002',
                name: 'Juan dela Cruz',
                phone: '+63 917-333-5555',
                rating: 4.7,
                vehicleType: 'Tricycle',
                plateNumber: 'TRI-5678',
                association: 'BFRV TODA'
              },
              pickup: {
                address: 'Pilar Village Main Gate, Las Piñas City',
                lat: 14.4623,
                lng: 120.9810
              },
              destination: {
                address: 'BF Resort Village Commercial Area, Las Piñas City',
                lat: 14.4518,
                lng: 120.9774
              },
              fare: 100.00,
              distance: 1.8,
              estimatedDuration: 12, // minutes
              status: 'accepted',
              startTime: null
            },
            {
              id: 'ride-125',
              passenger: {
                name: 'Robert Tan',
                phone: '+63 915-111-2222',
                rating: 4.6
              },
              driver: {
                id: 'driver-003',
                name: 'Miguel Reyes',
                phone: '+63 917-444-6666',
                rating: 4.8,
                vehicleType: 'Tricycle',
                plateNumber: 'TRI-9012',
                association: 'BFRV TODA'
              },
              pickup: {
                address: 'Casimiro Village Gate, Las Piñas City',
                lat: 14.4470,
                lng: 120.9720
              },
              destination: {
                address: 'Las Piñas City Hall, Las Piñas City',
                lat: 14.4500,
                lng: 120.9820
              },
              fare: 110.00,
              distance: 2.0,
              estimatedDuration: 14, // minutes
              status: 'completed',
              startTime: new Date(Date.now() - 60 * 60000).toISOString(),
              endTime: new Date(Date.now() - 45 * 60000).toISOString()
            }
          ];
          
          setRides(mockRides);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching rides:', error);
        setLoading(false);
      }
    };
    
    fetchRides();
  }, []);

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    logSecurityEvent('ride_details_viewed', {
      rideId: ride.id,
      dispatcherAction: 'view_details'
    });
  };

  const handleStatusChange = (rideId, newStatus) => {
    setRides(rides.map(ride => 
      ride.id === rideId 
        ? { ...ride, status: newStatus } 
        : ride
    ));
    
    if (selectedRide && selectedRide.id === rideId) {
      setSelectedRide({ ...selectedRide, status: newStatus });
    }
    
    logSecurityEvent('ride_status_updated', {
      rideId,
      newStatus,
      dispatcherAction: 'update_status'
    });
  };

  const filteredRides = filter === 'all' 
    ? rides 
    : rides.filter(ride => ride.status === filter);

  const getStatusBadge = (status) => {
    let color = '';
    
    switch (status) {
      case 'pending':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'accepted':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'in_progress':
        color = 'bg-green-100 text-green-800';
        break;
      case 'completed':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">Ride Monitoring</h1>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`px-3 py-1 rounded ${filter === 'accepted' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Accepted
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-3 py-1 rounded ${filter === 'in_progress' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
      </div>
      
      <div className="flex h-[calc(100vh-220px)]">
        {/* Rides List */}
        <div className="w-1/3 bg-white rounded-lg shadow mr-4 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700">BFRV TODA Rides</h2>
            <p className="text-sm text-gray-500">{filteredRides.length} rides found</p>
          </div>
          
          <div className="divide-y">
            {filteredRides.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No rides found
              </div>
            ) : (
              filteredRides.map(ride => (
                <div 
                  key={ride.id}
                  onClick={() => handleRideClick(ride)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedRide?.id === ride.id ? 'bg-gray-50 border-l-4 border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{ride.passenger.name}</p>
                      <p className="text-sm text-gray-600">{ride.driver.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{ride.pickup.address.split(',')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{ride.fare.toFixed(2)}</p>
                      <div className="mt-1">{getStatusBadge(ride.status)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Ride Details */}
        <div className="w-2/3 bg-white rounded-lg shadow overflow-y-auto">
          {selectedRide ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">{`Ride ${selectedRide.id}`}</h2>
                <div>{getStatusBadge(selectedRide.status)}</div>
              </div>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                <p className="text-gray-500">Map View - Google Maps Integration</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  {/* Passenger Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Passenger</h3>
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <span className="material-icons text-gray-500">person</span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedRide.passenger.name}</p>
                        <p className="text-sm text-gray-600">{selectedRide.passenger.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Journey Details */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Journey</h3>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <span className="material-icons text-green-500">location_on</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pickup</p>
                          <p className="font-medium">{selectedRide.pickup.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <span className="material-icons text-red-500">flag</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-medium">{selectedRide.destination.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div>
                  {/* Driver Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Driver</h3>
                    <div className="flex items-center mb-3">
                      <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <span className="material-icons text-gray-500">directions_car</span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedRide.driver.name}</p>
                        <p className="text-sm text-gray-600">{selectedRide.driver.phone}</p>
                      </div>
                    </div>
                    <div className="text-sm bg-gray-50 p-3 rounded">
                      <p><span className="text-gray-500">Association:</span> {selectedRide.driver.association}</p>
                      <p><span className="text-gray-500">Vehicle:</span> {selectedRide.driver.vehicleType}</p>
                      <p><span className="text-gray-500">Plate:</span> {selectedRide.driver.plateNumber}</p>
                    </div>
                  </div>
                  
                  {/* Ride Details */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Ride Details</h3>
                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Distance</p>
                          <p className="font-medium">{selectedRide.distance} km</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Est. Duration</p>
                          <p className="font-medium">{selectedRide.estimatedDuration} min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fare</p>
                          <p className="font-medium">₱{selectedRide.fare.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium capitalize">{selectedRide.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleStatusChange(selectedRide.id, 'in_progress')}
                        disabled={selectedRide.status === 'in_progress' || selectedRide.status === 'completed'}
                        className="flex-1 py-2 bg-green-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Start Ride
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedRide.id, 'completed')}
                        disabled={selectedRide.status === 'completed' || selectedRide.status !== 'in_progress'}
                        className="flex-1 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Complete
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedRide.id, 'cancelled')}
                        disabled={selectedRide.status === 'completed' || selectedRide.status === 'cancelled'}
                        className="flex-1 py-2 bg-red-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="material-icons text-5xl mb-4">directions_car</span>
              <p>Select a ride to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withSecurityAndMonitoring(RideMonitoringPage, {
  requireAuth: true,
  monitorActivity: true,
  pageId: 'ride_monitoring'
}); 