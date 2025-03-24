// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

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

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

