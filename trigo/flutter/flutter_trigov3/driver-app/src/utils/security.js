import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Role-based access control (RBAC)
export const UserRoles = {
  PASSENGER: 'passenger',
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  ADMIN: 'admin',
};

export const checkUserRole = async (uid) => {
  try {
    const db = getDatabase();
    const userRoleRef = ref(db, `users/${uid}/role`);
    const snapshot = await get(userRoleRef);
    return snapshot.val() || UserRoles.DRIVER;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

// Input validation utilities
export const validateInput = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  },
  password: (password) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  },
  location: (location) => {
    return (
      typeof location === 'object' &&
      typeof location.lat === 'number' &&
      typeof location.lng === 'number' &&
      location.lat >= -90 &&
      location.lat <= 90 &&
      location.lng >= -180 &&
      location.lng <= 180
    );
  },
};

// Rate limiting implementation
const rateLimits = new Map();

export const checkRateLimit = (key, limit, timeWindow) => {
  const now = Date.now();
  const userLimit = rateLimits.get(key) || { count: 0, timestamp: now };

  // Reset if time window has passed
  if (now - userLimit.timestamp > timeWindow) {
    userLimit.count = 0;
    userLimit.timestamp = now;
  }

  // Check if limit is exceeded
  if (userLimit.count >= limit) {
    return false;
  }

  // Increment count
  userLimit.count += 1;
  rateLimits.set(key, userLimit);
  return true;
};

// Session management
export const validateSession = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    return false;
  }

  try {
    await user.getIdToken(true); // Force token refresh
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserRole = () => {
  return auth.currentUser?.role || 'driver';
};

export const checkPermission = (requiredRole) => {
  const currentRole = getUserRole();
  return currentRole === requiredRole;
};

// Get current user with Firestore data
export const getCurrentUserWithData = async () => {
  const user = auth.currentUser;
  
  if (!user) return null;
  
  try {
    const docRef = doc(db, 'drivers', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        ...user,
        ...docSnap.data()
      };
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return user;
  }
};

// Check if user has driver permissions (approved status)
export const hasDriverPermission = async () => {
  const user = auth.currentUser;
  
  if (!user) return false;
  
  try {
    const docRef = doc(db, 'drivers', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.status === 'approved';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking driver permissions:', error);
    return false;
  }
};

// Log security events
export const logSecurityEvent = async (eventType, details) => {
  const user = auth.currentUser;
  
  try {
    const event = {
      type: eventType,
      userId: user ? user.uid : 'anonymous',
      userEmail: user ? user.email : 'anonymous',
      timestamp: new Date().toISOString(),
      details: details || {},
      userAgent: navigator.userAgent,
      application: 'driver-app'
    };
    
    // In a real application, you'd send this to your security monitoring system
    console.log('Security event logged:', event);
    
    // For demo purposes, we're just logging to console
    // In a real app, you might use a service like Firebase Analytics, Sentry, etc.
    
    return true;
  } catch (error) {
    console.error('Error logging security event:', error);
    return false;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await logSecurityEvent('logout', { method: 'explicit' });
    return auth.signOut();
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
}; 