import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, getAuth, onAuthStateChanged, signInWithEmailAndPassword
} from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
    return snapshot.val() || UserRoles.DISPATCHER;
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
  }
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
  return auth.currentUser?.role || 'dispatcher';
};

export const checkPermission = (requiredRole) => {
  const currentRole = getUserRole();
  return currentRole === requiredRole;
};

// Get current user with additional data from Firestore
export const getCurrentUserWithData = async () => {
  const user = auth.currentUser;
  
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        ...userDoc.data()
      };
    } else {
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    };
  }
};

// Check if user has dispatcher permission
export const hasDispatcherPermission = async () => {
  const user = auth.currentUser;
  
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'dispatcher' && userData.approved === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking dispatcher permission:', error);
    return false;
  }
};

// Check if user has driver permission
export const hasDriverPermission = async () => {
  const user = auth.currentUser;
  
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'driver' && userData.approved === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking driver permission:', error);
    return false;
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    logSecurityEvent('login_success', { email });
    return { user: userCredential.user, error: null };
  } catch (error) {
    logSecurityEvent('login_failure', { email, errorCode: error.code });
    return { user: null, error };
  }
};

// Register new user
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    logSecurityEvent('registration_success', { email });
    return { user, error: null };
  } catch (error) {
    logSecurityEvent('registration_failure', { email, errorCode: error.code });
    return { user: null, error };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await logSecurityEvent('logout', {});
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

// Log security-related events
export const logSecurityEvent = async (eventType, eventData = {}) => {
  try {
    const user = auth.currentUser;
    const userId = user ? user.uid : 'unauthenticated';
    
    await addDoc(collection(db, 'securityLogs'), {
      userId,
      email: user ? user.email : null,
      eventType,
      eventData,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: '', // Will be filled by server-side function
    });
    
    return true;
  } catch (error) {
    console.error('Error logging security event:', error);
    return false;
  }
};
