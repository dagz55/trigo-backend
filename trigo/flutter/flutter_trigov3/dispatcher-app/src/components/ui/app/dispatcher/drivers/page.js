import React, { useEffect, useState } from 'react';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API call
    setTimeout(() => {
      const mockDrivers = [
        {
          id: 'driver-001',
          name: 'Juan Cruz',
          phone: '+63 918-765-4321',
          email: 'juan.cruz@example.com',
          rating: 4.9,
          status: 'active',
          vehicle: {
            model: 'Toyota Vios',
            year: 2020,
            plate: 'ABC 123',
            color: 'Silver'
          },
          earnings: {
            today: 1250.75,
            week: 8750.50,
            month: 35000.00
          },
          completedRides: 342,
          joinedDate: '2023-05-15',
          location: 'Makati City'
        },
        {
          id: 'driver-002',
          name: 'Ana Lim',
          phone: '+63 920-876-5432',
          email: 'ana.lim@example.com',
          rating: 4.7,
          status: 'active',
          vehicle: {
            model: 'Honda City',
            year: 2021,
            plate: 'DEF 456',
            color: 'White'
          },
          earnings: {
            today: 980.25,
            week: 6540.75,
            month: 28750.50
          },
          completedRides: 287,
          joinedDate: '2023-07-22',
          location: 'Quezon City'
        },
        {
          id: 'driver-003',
          name: 'Miguel Tan',
          phone: '+63 922-987-6543',
          email: 'miguel.tan@example.com',
          rating: 4.8,
          status: 'active',
          vehicle: {
            model: 'Mitsubishi Mirage',
            year: 2019,
            plate: 'GHI 789',
            color: 'Red'
          },
          earnings: {
            today: 1100.50,
            week: 7250.25,
            month: 31500.75
          },
          completedRides: 315,
          joinedDate: '2023-06-10',
          location: 'Pasig City'
        },
        {
          id: 'driver-004',
          name: 'Gabriel Santos',
          phone: '+63 925-098-7654',
          email: 'gabriel.santos@example.com',
          rating: 4.6,
          status: 'inactive',
          vehicle: {
            model: 'Kia Soluto',
            year: 2022,
            plate: 'JKL 012',
            color: 'Blue'
          },
          earnings: {
            today: 0,
            week: 4320.50,
            month: 25750.25
          },
          completedRides: 275,
          joinedDate: '2023-08-05',
          location: 'Makati City'
        },
        {
          id: 'driver-005',
          name: 'Isabella Reyes',
          phone: '+63 927-109-8765',
          email: 'isabella.reyes@example.com',
          rating: 4.9,
          status: 'on_ride',
          vehicle: {
            model: 'Suzuki Dzire',
            year: 2021,
            plate: 'MNO 345',
            color: 'Black'
          },
          earnings: {
            today: 1350.25,
            week: 8100.75,
            month: 33250.50
          },
          completedRides: 328,
          joinedDate: '2023-04-18',
          location: 'Taguig City'
        },
        {
          id: 'driver-006',
          name: 'Diego Mendoza',
          phone: '+63 929-210-9876',
          email: 'diego.mendoza@example.com',
          rating: 4.5,
          status: 'pending_approval',
          vehicle: {
            model: 'Toyota Wigo',
            year: 2020,
            plate: 'PQR 678',
            color: 'Gray'
          },
          earnings: {
            today: 0,
            week: 0,
            month: 0
          },
          completedRides: 0,
          joinedDate: '2025-03-15',
          location: 'Manila City'
        }
      ];
      
      setDrivers(mockDrivers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    // Apply status filter
    if (filter !== 'all' && driver.status !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        driver.id.toLowerCase().includes(searchLower) ||
        driver.name.toLowerCase().includes(searchLower) ||
        driver.phone.toLowerCase().includes(searchLower) ||
        driver.email.toLowerCase().includes(searchLower) ||
        driver.vehicle.plate.toLowerCase().includes(searchLower) ||
        driver.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
      case 'on_ride':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">On Ride</span>;
      case 'pending_approval':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Approval</span>;
      case 'suspended':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Suspended</span>;
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
        <h1 className="text-2xl font-bold">Driver Management</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md shadow">
          Add New Driver
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
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md ${filter === 'active' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('on_ride')}
              className={`px-3 py-1 rounded-md ${filter === 'on_ride' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              On Ride
            </button>
            <button 
              onClick={() => setFilter('inactive')}
              className={`px-3 py-1 rounded-md ${filter === 'inactive' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Inactive
            </button>
            <button 
              onClick={() => setFilter('pending_approval')}
              className={`px-3 py-1 rounded-md ${filter === 'pending_approval' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            >
              Pending
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 material-icons">search</span>
          </div>
        </div>
      </div>
      
      {/* Drivers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rides
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No drivers found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="material-icons text-gray-500">person</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {driver.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.phone}</div>
                      <div className="text-sm text-gray-500">{driver.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.vehicle.model} ({driver.vehicle.year})</div>
                      <div className="text-sm text-gray-500">{driver.vehicle.plate} • {driver.vehicle.color}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(driver.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-yellow-400 material-icons text-sm mr-1">star</span>
                        <span>{driver.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.completedRides}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark mr-3">
                        View
                      </button>
                      {driver.status === 'pending_approval' && (
                        <button className="text-green-600 hover:text-green-900">
                          Approve
                        </button>
                      )}
                      {driver.status === 'inactive' && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Activate
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

export default DriversPage;
