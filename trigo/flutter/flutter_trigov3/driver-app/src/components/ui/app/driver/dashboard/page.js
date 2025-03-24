import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUserWithData } from '../../../../../utils/security';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function DashboardPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    weeklyEarnings: 0,
    totalRides: 0,
    rating: 0,
    upcomingRides: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUserWithData();
        setUserData(user);
        
        // In a real app, this would come from your backend
        setStats({
          todayEarnings: 750.50,
          weeklyEarnings: 4875.75,
          totalRides: user?.totalRides || 0,
          rating: user?.rating || 0,
          upcomingRides: [
            {
              id: 'ride-123',
              pickupTime: new Date(Date.now() + 15 * 60000).toLocaleTimeString(),
              pickup: 'BFRV TODA Terminal, BF Resort Village, Las Piñas City',
              destination: 'SM Southmall, Alabang-Zapote Rd, Las Piñas City',
              estimatedFare: 120.00,
              associationInfo: 'BFRV TODA'
            },
            {
              id: 'ride-124',
              pickupTime: new Date(Date.now() + 45 * 60000).toLocaleTimeString(),
              pickup: 'Pilar Village Main Gate, Las Piñas City',
              destination: 'BF Resort Village Commercial Area, Las Piñas City',
              estimatedFare: 100.00,
              associationInfo: 'BFRV TODA'
            }
          ]
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    // In a real app, this would update your status in the backend
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
          <button
            onClick={toggleOnlineStatus}
            className={`ml-4 px-4 py-2 rounded-md text-white ${
              isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="material-icons text-gray-600 text-3xl">person</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userData?.fullName || userData?.displayName}</h2>
            <p className="text-gray-600">
              Rating: {stats.rating.toFixed(1)} ★ | {stats.totalRides} Rides Completed
            </p>
            <p className="text-sm text-primary font-medium">BFRV TODA Member</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Earnings</h3>
          <p className="text-2xl font-bold">₱{stats.todayEarnings.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Weekly Earnings</h3>
          <p className="text-2xl font-bold">₱{stats.weeklyEarnings.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="text-2xl font-bold">98%</p>
        </div>
      </div>

      {/* Upcoming Rides */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Upcoming Rides</h2>
        
        {stats.upcomingRides.length === 0 ? (
          <p className="text-gray-500">No upcoming rides scheduled.</p>
        ) : (
          <div className="space-y-4">
            {stats.upcomingRides.map((ride) => (
              <div key={ride.id} className="border-l-4 border-primary p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Pickup: {ride.pickupTime}</p>
                    <p className="text-sm text-gray-600">From: {ride.pickup}</p>
                    <p className="text-sm text-gray-600">To: {ride.destination}</p>
                    <p className="text-xs text-primary mt-1">{ride.associationInfo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₱{ride.estimatedFare.toFixed(2)}</p>
                    <Link
                      to={`/active-ride?rideId=${ride.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">payments</span>
          <span className="text-sm font-medium">Earnings</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">history</span>
          <span className="text-sm font-medium">Ride History</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">support_agent</span>
          <span className="text-sm font-medium">Support</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <span className="material-icons text-primary mb-2">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}

export default withSecurityAndMonitoring(DashboardPage, {
  requireAuth: true,
  requireDriverApproval: true,
  monitorActivity: true,
  pageId: 'driver_dashboard'
});
