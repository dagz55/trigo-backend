import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

// Firebase configuration for Trigo app
const firebaseConfig = {
  apiKey: "AIzaSyDvnlGUb2qR0M0_0QbOJADlZvHNgBmJ-Rc",
  authDomain: "core-shard-452900-q8.firebaseapp.com",
  projectId: "core-shard-452900-q8",
  storageBucket: "core-shard-452900-q8.appspot.com",
  messagingSenderId: "347388254987",
  appId: "1:347388254987:web:a5ef65f82f4fd987d35fb9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators if in development environment
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { app, auth, db };
