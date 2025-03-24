import React, { useEffect, useState } from 'react';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function RidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API call
    setTimeout(() => {
      const mockRides = [
        {
          id: 'ride-789',
          passenger: {
            name: 'Maria Santos',
            phone: '+63 917-123-4567',
            rating: 4.8
          },
          driver: {
            name: 'Juan Cruz',
            phone: '+63 918-765-4321',
            rating: 4.9
          },
          pickup: 'Makati City',
          destination: 'Taguig City',
          status: 'completed',
          fare: 320.50,
          timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString(),
          distance: 8.5,
          duration: 22
        },
        {
          id: 'ride-790',
          passenger: {
            name: 'Carlos Reyes',
            phone: '+63 919-234-5678',
            rating: 4.5
          },
          driver: {
            name: 'Ana Lim',
            phone: '+63 920-876-5432',
            rating: 4.7
          },
          pickup: 'Quezon City',
          destination: 'Manila City',
          status: 'in_progress',
          fare: 275.00,
          timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
          distance: 12.3,
          duration: 35
        },
        {
          id: 'ride-791',
          passenger: {
            name: 'Sofia Garcia',
            phone: '+63 921-345-6789',
            rating: 4.6
          },
          driver: {
            name: 'Miguel Tan',
            phone: '+63 922-987-6543',
            rating: 4.8
          },
          pickup: 'Pasig City',
          destination: 'Mandaluyong City',
          status: 'pending',
          fare: 180.25,
          timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
          distance: 5.7,
          duration: 18
        },
        {
          id: 'ride-792',
          passenger: {
            name: 'Luis Mendoza',
            phone: '+63 923-456-7890',
            rating: 4.3
          },
          driver: null, // No driver assigned yet
          pickup: 'San Juan City',
          destination: 'Pasay City',
          status: 'pending',
          fare: 210.75,
          timestamp: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
          distance: 9.2,
          duration: 28
        },
        {
          id: 'ride-793',
          passenger: {
            name: 'Isabella Reyes',
            phone: '+63 924-567-8901',
            rating: 4.9
          },
          driver: {
            name: 'Gabriel Santos',
            phone: '+63 925-098-7654',
            rating: 4.6
          },
          pickup: 'Makati City',
          destination: 'Parañaque City',
          status: 'in_progress',
          fare: 350.00,
          timestamp: new Date(Date.now() - 10 * 60000).toLocaleTimeString(),
          distance: 14.8,
          duration: 40
        }
      ];
      
      setRides(mockRides);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRides = rides.filter(ride => {
    // Apply status filter
    if (filter !== 'all' && ride.status !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        ride.id.toLowerCase().includes(searchLower) ||
        ride.passenger.name.toLowerCase().includes(searchLower) ||
        (ride.driver && ride.driver.name.toLowerCase().includes(searchLower)) ||
        ride.pickup.toLowerCase().includes(searchLower) ||
        ride.destination.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ride Management</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md shadow">
          Create Manual Ride
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('in_progress')}
              className={`px-3 py-1 rounded-md ${filter === 'in_progress' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Completed
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search rides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 material-icons">search</span>
          </div>
        </div>
      </div>
      
      {/* Rides Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ride ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passenger
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fare
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRides.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No rides found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredRides.map((ride) => (
                  <tr key={ride.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ride.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {ride.passenger.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Rating: {ride.passenger.rating} ★
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ride.driver ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {ride.driver.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Rating: {ride.driver.rating} ★
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-yellow-600">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{ride.pickup}</div>
                      <div className="text-gray-400">to</div>
                      <div>{ride.destination}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ride.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₱{ride.fare.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ride.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark mr-3">
                        View
                      </button>
                      {ride.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RidesPage;
