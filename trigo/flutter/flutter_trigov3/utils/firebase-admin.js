const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You will need to create this file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://core-shard-452900-q8.firebaseio.com" // Updated with the correct Firebase project URL
});

const db = admin.firestore();

module.exports = { admin, db }; 