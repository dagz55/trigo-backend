import React, { useEffect, useState } from 'react';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    activeDrivers: 0,
    pendingRides: 0,
    completedRides: 0,
    totalRevenue: 0,
    recentRides: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API call
    setTimeout(() => {
      setStats({
        activeDrivers: 42,
        pendingRides: 7,
        completedRides: 156,
        totalRevenue: 23450.75,
        recentRides: [
          {
            id: 'ride-789',
            passenger: 'Maria Santos',
            driver: 'Juan Cruz',
            pickup: 'Makati City',
            destination: 'Taguig City',
            status: 'completed',
            fare: 320.50,
            timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString()
          },
          {
            id: 'ride-790',
            passenger: 'Carlos Reyes',
            driver: 'Ana Lim',
            pickup: 'Quezon City',
            destination: 'Manila City',
            status: 'in_progress',
            fare: 275.00,
            timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString()
          },
          {
            id: 'ride-791',
            passenger: 'Sofia Garcia',
            driver: 'Miguel Tan',
            pickup: 'Pasig City',
            destination: 'Mandaluyong City',
            status: 'pending',
            fare: 180.25,
            timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString()
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dispatcher Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Drivers</h3>
          <p className="text-2xl font-bold">{stats.activeDrivers}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Rides</h3>
          <p className="text-2xl font-bold">{stats.pendingRides}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed Today</h3>
          <p className="text-2xl font-bold">{stats.completedRides}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">₱{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Recent Rides */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentRides.map((ride) => (
                <tr key={ride.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ride.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ride.passenger}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ride.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ride.pickup} → {ride.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${ride.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        ride.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₱{ride.fare.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ride.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">directions_car</span>
          <span className="text-sm font-medium">Manage Drivers</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">map</span>
          <span className="text-sm font-medium">View Map</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">analytics</span>
          <span className="text-sm font-medium">Analytics</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
