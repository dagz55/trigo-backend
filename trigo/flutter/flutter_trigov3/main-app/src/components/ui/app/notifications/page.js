import React, { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'ride_update',
      title: 'Your driver is arriving',
      message: 'John will arrive in 3 minutes',
      date: '2023-03-15T14:25:00Z',
      read: false
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Weekend discount!',
      message: 'Get 20% off your rides this weekend',
      date: '2023-03-14T10:00:00Z',
      read: true
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment successful',
      message: 'Your payment of $24.50 was successful',
      date: '2023-03-13T15:30:00Z',
      read: true
    }
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ride_update':
        return '🚗';
      case 'promotion':
        return '🎁';
      case 'payment':
        return '💰';
      default:
        return '📝';
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:text-primary/90 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start p-4 border-b border-gray-200 last:border-0 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="text-2xl mr-4">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-primary hover:text-primary/90 font-medium mt-2"
                    >
                      Mark as read
                    </button>
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