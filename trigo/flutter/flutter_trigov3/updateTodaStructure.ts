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

// Helper function to create a document with a specific ID
async function createDoc(path: string, docId: string, data: any) {
  const docRef = db.doc(`${path}/${docId}`);
  await docRef.set(data, { merge: true });
  return docRef;
}

async function reorganizeTODAData() {
  try {
    // Clear existing data first 
    // Uncomment if you want to delete the old structure
    // const cityRef = db.collection('cities').doc('Las Piñas');
    // const todasSnapshot = await cityRef.collection('todas').get();
    // const batch = db.batch();
    // todasSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    // await batch.commit();
    // console.log("Old TODA data cleared");

    // 1. Create Metro Manila document
    const metroManilaRef = await createDoc('regions', 'metro-manila', {
      name: "Metro Manila",
      type: "National Capital Region",
      country: "Philippines"
    });
    console.log("Created Metro Manila region");

    // 2. Create Las Piñas City under Metro Manila
    const lasPinasRef = await createDoc('regions/metro-manila/cities', 'las-pinas', {
      name: "Las Piñas City",
      province: "Metro Manila",
      country: "Philippines"
    });
    console.log("Created Las Piñas City");

    // 3. Data structure with areas and TODAs
    const areaTodasMap: Record<string, string[]> = {
      "admiral-village-talon-tres": ["ACAPODA"],
      "angela-village-talon-kuatro": ["APHDA"],
      "pilar-village": ["ATODA"],
      "bf-executive-almanza-uno": ["PETHTODA"],
      "bf-sta-cecilia-talon-dos": ["BFRSSCV"],
      "bf-vista-grande-talon-dos": ["BFRV-VG"],
      "talon-equitable": ["TEPTODA"],
      "golden-gate-talon-tres": ["GGTODA"],
      "bf-almanza-almanza-dos": ["BFATODA"],
      "moonwalk-village-talon-singko": ["MAMTTODA"],
      "manila-doctors-almanza-uno": ["MDVPTODA"],
      "metrocor-subdivision-almanza-uno": ["MSTODA"],
      "philamlife-village-pamplona-dos": ["PVTODA"],
      "remarville-subdivision-pamplona-dos": ["RSTODA"],
      "sav-17-talon-kuatro": ["SAVTODA"],
      "saint-michael-village-talon-dos": ["SMCTODA"],
      "ts-cruz-subdivision-almanza-dos": ["TSCTODA"],
      "talon-singko": ["TSTODA"],
      "urbanville-village-talon-tres": ["NUVTODA"],
      "dbp-village-almanza-uno": ["ZOLIVIMATODA"]
    };

    // Map of area IDs to readable names
    const areaDisplayNames: Record<string, string> = {
      "admiral-village-talon-tres": "Admiral Village, Talon Tres",
      "angela-village-talon-kuatro": "Angela Village, Talon Kuatro",
      "pilar-village": "Pilar Village",
      "bf-executive-almanza-uno": "BF Executive, Almanza Uno",
      "bf-sta-cecilia-talon-dos": "BF Sta Cecilia, Talon Dos",
      "bf-vista-grande-talon-dos": "BF Vista Grande, Talon Dos",
      "talon-equitable": "Talon Equitable",
      "golden-gate-talon-tres": "Golden Gate, Talon Tres",
      "bf-almanza-almanza-dos": "BF Almanza, Almanza Dos",
      "moonwalk-village-talon-singko": "Moonwalk Village, Talon Singko",
      "manila-doctors-almanza-uno": "Manila Doctors, Almanza Uno",
      "metrocor-subdivision-almanza-uno": "Metrocor Subdivision, Almanza Uno",
      "philamlife-village-pamplona-dos": "Philamlife Village, Pamplona Dos",
      "remarville-subdivision-pamplona-dos": "Remarville Subdivision, Pamplona Dos",
      "sav-17-talon-kuatro": "SAV 17, Talon Kuatro",
      "saint-michael-village-talon-dos": "Saint Michael Village, Talon Dos",
      "ts-cruz-subdivision-almanza-dos": "TS Cruz Subdivision, Almanza Dos",
      "talon-singko": "Talon Singko",
      "urbanville-village-talon-tres": "Urbanville Village, Talon Tres",
      "dbp-village-almanza-uno": "DBP Village, Almanza Uno"
    };

    // 4. Create each area, TODA, and sample tricycles
    for (const [areaId, todas] of Object.entries(areaTodasMap)) {
      // Create the area document
      const areaRef = await createDoc(`regions/metro-manila/cities/las-pinas/areas`, areaId, {
        name: areaDisplayNames[areaId],
        city: "Las Piñas City"
      });
      console.log(`Created area: ${areaDisplayNames[areaId]}`);

      // Create each TODA in this area
      for (const toda of todas) {
        const todaId = toda.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const todaRef = await createDoc(`regions/metro-manila/cities/las-pinas/areas/${areaId}/todas`, todaId, {
          name: toda,
          area: areaDisplayNames[areaId],
          totalDrivers: 15, // Example number
          status: "active"
        });
        console.log(`Created TODA: ${toda}`);

        // Add sample tricycle drivers (5 per TODA for this example)
        for (let i = 1; i <= 5; i++) {
          const driverId = `${i.toString().padStart(3, '0')}`;
          await createDoc(`regions/metro-manila/cities/las-pinas/areas/${areaId}/todas/${todaId}/tricycles`, driverId, {
            driverName: `Sample Driver ${i}`,
            licenseNumber: `DL-${Math.floor(10000 + Math.random() * 90000)}`,
            contactNumber: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
            plateNumber: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
            status: "active",
            registrationDate: admin.firestore.Timestamp.now()
          });
        }
        console.log(`Added 5 sample tricycles for ${toda}`);
      }
    }

    console.log("TODA hierarchy successfully reorganized!");
  } catch (error) {
    console.error("Error reorganizing TODA data:", error);
  }
}

// Execute the function
reorganizeTODAData(); 