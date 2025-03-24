import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';
import { auth } from '../firebase';

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
    return snapshot.val() || UserRoles.PASSENGER;
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

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' https://apis.google.com https://*.stripe.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://*.firebase.com https://*.stripe.com; " +
    "frame-src 'self' https://*.stripe.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
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
  return auth.currentUser !== null;
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserRole = () => {
  return auth.currentUser?.role || 'passenger';
};

export const checkPermission = (requiredRole) => {
  const currentRole = getUserRole();
  return currentRole === requiredRole;
}; 