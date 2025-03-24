// Using Firebase Admin SDK for server-side operations
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://core-shard-452900-q8.firebaseio.com"
});

// Get Firestore instance
const db = admin.firestore();

async function addTODAData() {
  try {
    // First, check if the city document exists, if not create it
    const cityRef = db.collection('cities').doc('Las Piñas');
    
    // Create data for the TODA organizations
    const todaData = [
      { name: "ACAPODA", area: "Admiral Village, Talon Tres" },
      { name: "APHDA", area: "Angela Village, Talon Kuatro" },
      { name: "ATODA", area: "Pilar Village" },
      { name: "PETHTODA", area: "BF Executive, Almanza Uno" },
      { name: "BFRSSCV", area: "BF Sta Cecilia, Talon Dos" },
      { name: "BFRV-VG", area: "BF Vista Grande, Talon Dos" },
      { name: "TEPTODA", area: "Talon Equitable" },
      { name: "GGTODA", area: "Golden Gate, Talon Tres" },
      { name: "BFATODA", area: "BF Almanza, Almanza Dos" },
      { name: "MAMTTODA", area: "Moonwalk Village, Talon Singko" },
      { name: "MDVPTODA", area: "Manila Doctors, Almanza Uno" },
      { name: "MSTODA", area: "Metrocor Subdivision, Almanza Uno" },
      { name: "PVTODA", area: "Philamlife Village, Pamplona Dos" },
      { name: "RSTODA", area: "Remarville Subdivision, Pamplona Dos" },
      { name: "SAVTODA", area: "SAV 17, Talon Kuatro" },
      { name: "SMCTODA", area: "Saint Michael Village, Talon Dos" },
      { name: "TSCTODA", area: "TS Cruz Subdivision, Almanza Dos" },
      { name: "TSTODA", area: "Talon Singko" },
      { name: "NUVTODA", area: "Urbanville Village, Talon Tres" },
      { name: "ZOLIVIMATODA", area: "DBP Village, Almanza Uno" },
    ];

    // Ensure the city document exists
    await cityRef.set({
      name: "Las Piñas",
      province: "Metro Manila",
      country: "Philippines"
    }, { merge: true });
    
    console.log("City document created or updated");

    // Add each TODA to the subcollection
    for (const toda of todaData) {
      await cityRef.collection('todas').add(toda);
      console.log(`Added TODA: ${toda.name}`);
    }
    
    console.log("TODA data added successfully!");
  } catch (error) {
    console.error("Error adding TODA data:", error);
  }
}

// Execute the function
addTODAData(); 