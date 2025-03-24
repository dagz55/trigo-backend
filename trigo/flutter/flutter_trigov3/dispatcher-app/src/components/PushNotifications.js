import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import React, { useEffect, useState } from 'react';

// Firebase configuration - Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "yourapp.firebaseapp.com",
  projectId: "yourapp",
  storageBucket: "yourapp.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (disable in development unless configured)
let messaging = null;
try {
  const firebaseApp = initializeApp(firebaseConfig);
  messaging = getMessaging(firebaseApp);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const PushNotifications = () => {
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    if (!messaging) {
      setError('Firebase messaging not initialized. Push notifications disabled.');
      return;
    }

    // Try to get token
    getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token obtained:', currentToken);
          setTokenInfo('Push notifications enabled.');
          // Optionally, send token to your server for subscription.
        } else {
          console.log('No registration token available.');
          setError('No registration token available. Permission needed.');
        }
      })
      .catch((err) => {
        console.error('Error retrieving token:', err);
        setError('Failed to get push notification token.');
      });

    // Listen for incoming messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      setNotification(payload.notification);
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  // For testing, simulate a notification
  const simulateNotification = () => {
    setNotification({
      title: 'New Ride Request',
      body: 'A new ride has been requested in your area.'
    });
  };

  return (
    <div className="push-notifications">
      <h3>Push Notifications</h3>
      {error && <div className="error-message">{error}</div>}
      {tokenInfo && <div className="success-message">{tokenInfo}</div>}
      {notification && (
        <div className="notification">
          <h4>{notification.title}</h4>
          <p>{notification.body}</p>
        </div>
      )}
      <button onClick={simulateNotification}>Simulate Notification</button>
    </div>
  );
};

export default PushNotifications; 