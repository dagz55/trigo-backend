import React, { useEffect, useState } from 'react';
import { getCurrentUserWithData } from '../../../../../utils/security';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function EarningsPage() {
  const [earningsData, setEarningsData] = useState({
    loading: true,
    daily: {
      amount: 0,
      rides: 0,
      hours: 0
    },
    weekly: {
      amount: 0,
      rides: 0,
      hours: 0
    },
    monthly: {
      amount: 0,
      rides: 0,
      hours: 0
    },
    history: []
  });

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    // In a real app, fetch from Firebase
    try {
      const user = await getCurrentUserWithData();
      
      // Mock data for demonstration
      setTimeout(() => {
        setEarningsData({
          loading: false,
          daily: {
            amount: 1250.00,
            rides: 12,
            hours: 8.5
          },
          weekly: {
            amount: 7800.00,
            rides: 65,
            hours: 42
          },
          monthly: {
            amount: 32500.00,
            rides: 275,
            hours: 160
          },
          history: [
            {
              id: '1',
              date: '2023-05-15',
              amount: 1200.00,
              rides: 10,
              details: [
                { time: '7:30 AM', pickup: 'SM Southmall, Las Piñas', dropoff: 'Robinsons Las Piñas', fare: 120.00 },
                { time: '8:15 AM', pickup: 'BF Resort Village, Las Piñas', dropoff: 'Las Piñas City Hall', fare: 150.00 },
                { time: '9:00 AM', pickup: 'Las Piñas Doctors Hospital', dropoff: 'Las Piñas Central School', fare: 100.00 },
                { time: '10:30 AM', pickup: 'Casimiro Village, Las Piñas', dropoff: 'SM Southmall, Las Piñas', fare: 130.00 },
                { time: '12:00 PM', pickup: 'University of Perpetual Help, Las Piñas', dropoff: 'Robinsons Las Piñas', fare: 120.00 },
                { time: '1:45 PM', pickup: 'Las Piñas City Hall', dropoff: 'BF Resort Village, Las Piñas', fare: 150.00 },
                { time: '3:15 PM', pickup: 'Pilar Village, Las Piñas', dropoff: 'Las Piñas Central School', fare: 110.00 },
                { time: '4:30 PM', pickup: 'Las Piñas Central School', dropoff: 'SM Southmall, Las Piñas', fare: 100.00 },
                { time: '6:00 PM', pickup: 'Robinsons Las Piñas', dropoff: 'University of Perpetual Help, Las Piñas', fare: 120.00 },
                { time: '7:30 PM', pickup: 'SM Southmall, Las Piñas', dropoff: 'Casimiro Village, Las Piñas', fare: 100.00 }
              ]
            },
            {
              id: '2',
              date: '2023-05-14',
              amount: 1050.00,
              rides: 9,
              details: [
                { time: '8:00 AM', pickup: 'BF Resort Village, Las Piñas', dropoff: 'SM Southmall, Las Piñas', fare: 130.00 },
                { time: '9:30 AM', pickup: 'Las Piñas City Hall', dropoff: 'Pilar Village, Las Piñas', fare: 110.00 },
                { time: '11:00 AM', pickup: 'SM Southmall, Las Piñas', dropoff: 'Las Piñas Doctors Hospital', fare: 100.00 }
              ]
            },
            {
              id: '3',
              date: '2023-05-13',
              amount: 1150.00,
              rides: 10,
              details: []
            }
          ]
        });
      }, 1000);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      setEarningsData(prev => ({ ...prev, loading: false }));
    }
  };

  if (earningsData.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Earnings</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Today" amount={earningsData.daily.amount} rides={earningsData.daily.rides} hours={earningsData.daily.hours} />
        <SummaryCard title="This Week" amount={earningsData.weekly.amount} rides={earningsData.weekly.rides} hours={earningsData.weekly.hours} />
        <SummaryCard title="This Month" amount={earningsData.monthly.amount} rides={earningsData.monthly.rides} hours={earningsData.monthly.hours} />
      </div>
      
      {/* Earnings History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Earnings History</h2>
        <div className="space-y-4">
          {earningsData.history.map(day => (
            <EarningsDayItem key={day.id} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, rides, hours }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold">₱{amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>{rides} rides</span>
        <span>{hours} hours</span>
      </div>
    </div>
  );
}

function EarningsDayItem({ day }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <span className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="ml-2 text-sm text-gray-500">{day.rides} rides</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-4">₱{day.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          <svg 
            className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      {expanded && day.details.length > 0 && (
        <div className="p-4 bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Dropoff</th>
                <th className="px-4 py-2 text-right">Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {day.details.map((ride, index) => (
                <tr key={index} className="text-sm">
                  <td className="px-4 py-2">{ride.time}</td>
                  <td className="px-4 py-2">{ride.pickup}</td>
                  <td className="px-4 py-2">{ride.dropoff}</td>
                  <td className="px-4 py-2 text-right">₱{ride.fare.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-medium">
                <td colSpan="3" className="px-4 py-2 text-right">Total</td>
                <td className="px-4 py-2 text-right">₱{day.details.reduce((sum, ride) => sum + ride.fare, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      
      {expanded && day.details.length === 0 && (
        <div className="p-4 bg-white text-center text-gray-500">
          Detailed breakdown not available for this day.
        </div>
      )}
    </div>
  );
}

export default withSecurityAndMonitoring(EarningsPage, {
  requireAuth: true,
  requireDriverApproval: true,
  pageId: 'driver-earnings'
}); 