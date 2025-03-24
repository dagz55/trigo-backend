import React from 'react';

export default function HistoryPage() {
  const rides = [
    {
      id: 'ride-123',
      date: '2023-03-15T14:30:00Z',
      pickup: '123 Main St, Downtown',
      destination: 'Airport Terminal 1',
      driver: 'John D.',
      amount: '$24.50',
      status: 'completed'
    },
    {
      id: 'ride-456',
      date: '2023-03-10T09:15:00Z',
      pickup: '456 Park Ave, Midtown',
      destination: 'Central Station',
      driver: 'Sarah M.',
      amount: '$18.75',
      status: 'completed'
    },
    {
      id: 'ride-789',
      date: '2023-03-05T18:45:00Z',
      pickup: '789 Residential Blvd, Suburbs',
      destination: 'Shopping Mall',
      driver: 'Michael R.',
      amount: '$5.00',
      status: 'cancelled'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ride History</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {rides.length === 0 ? (
          <p className="text-gray-500">No ride history available</p>
        ) : (
          <div className="space-y-6">
            {rides.map((ride) => (
              <div key={ride.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{formatDate(ride.date)}</h3>
                  {getStatusBadge(ride.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="text-sm">{ride.pickup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="text-sm">{ride.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="text-sm">{ride.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-sm font-semibold">{ride.amount}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="text-sm text-primary hover:underline">View Details</button>
                  {ride.status === 'completed' && (
                    <button className="text-sm text-primary hover:underline">Get Receipt</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 