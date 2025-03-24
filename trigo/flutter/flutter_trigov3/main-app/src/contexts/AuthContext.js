import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  async function signup(email, password, userData) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        ...userData,
        createdAt: new Date().toISOString(),
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password, role) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      if (userData.role !== role) {
        throw new Error(`Access denied. You are not authorized as a ${role}`);
      }

      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async function loginWithGoogle(role) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create user profile if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: role,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Verify role
        const userData = userDoc.data();
        if (userData.role !== role) {
          throw new Error(`Access denied. You are not authorized as a ${role}`);
        }
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function setupRecaptcha(phoneNumber) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });

    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );
      setVerificationId(verificationId);
      return verificationId;
    } catch (error) {
      throw error;
    }
  }

  async function loginWithPhone(phoneNumber, role) {
    try {
      const verificationId = await setupRecaptcha(phoneNumber);
      // Store the verification ID and role in session storage
      sessionStorage.setItem('verificationId', verificationId);
      sessionStorage.setItem('pendingRole', role);
      return verificationId;
    } catch (error) {
      throw error;
    }
  }

  async function confirmPhoneCode(code) {
    try {
      const verificationId = sessionStorage.getItem('verificationId');
      const role = sessionStorage.getItem('pendingRole');
      
      if (!verificationId) {
        throw new Error('No verification ID found');
      }

      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithPhoneNumber(auth, credential);
      
      // Create or update user profile with role
      await setDoc(doc(db, 'users', result.user.uid), {
        phoneNumber: result.user.phoneNumber,
        role: role,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Clean up session storage
      sessionStorage.removeItem('verificationId');
      sessionStorage.removeItem('pendingRole');

      return result.user;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserProfile(userData) {
    if (!currentUser) throw new Error('No user logged in');
    return setDoc(doc(db, 'users', currentUser.uid), userData, { merge: true });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    loginWithPhone,
    confirmPhoneCode,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 