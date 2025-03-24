// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfVMkAVAu9BFo5VXRo6qm7nFins-YQPlo",
  authDomain: "core-shard-452900-q8.firebaseapp.com",
  projectId: "core-shard-452900-q8",
  storageBucket: "core-shard-452900-q8.firebasestorage.app",
  messagingSenderId: "54486150994",
  appId: "1:54486150994:web:907baf1aa6982961ec548b",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Analytics and export it
export const initializeAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app)
  }
  return null
}

export default app

