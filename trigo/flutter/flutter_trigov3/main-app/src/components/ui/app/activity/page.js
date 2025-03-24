import React from 'react';

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: 'ride_completed',
      date: '2023-03-15T14:30:00Z',
      details: 'Ride from Downtown to Airport',
      amount: '$24.50'
    },
    {
      id: 2,
      type: 'payment_added',
      date: '2023-03-10T09:15:00Z',
      details: 'Added new payment method',
      amount: null
    },
    {
      id: 3,
      type: 'ride_cancelled',
      date: '2023-03-05T18:45:00Z',
      details: 'Ride from Home to Mall',
      amount: '$5.00'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'ride_completed':
        return '🚗';
      case 'payment_added':
        return '💳';
      case 'ride_cancelled':
        return '❌';
      default:
        return '📝';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Activity</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 border-b border-gray-200 last:border-0">
                <div className="text-2xl mr-4">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{activity.details}</h3>
                    {activity.amount && <span className="font-semibold">{activity.amount}</span>}
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 