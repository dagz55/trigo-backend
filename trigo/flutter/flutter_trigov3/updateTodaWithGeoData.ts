// Using Firebase Admin SDK and Geofirestore for geospatial queries
import * as admin from 'firebase-admin';
import { GeoFirestore } from 'geofirestore';
import * as serviceAccount from './serviceAccountKey.json';

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://core-shard-452900-q8.firebaseio.com"
});

// Get Firestore instance
const db = admin.firestore();
// Create a GeoFirestore reference
const geofirestore = new GeoFirestore(db);

// Las Piñas approximate coordinates
const LP_CENTER_LAT = 14.4495;
const LP_CENTER_LNG = 120.9827;

// Mapping of areas to approximate geo-coordinates (these are approximate values for demonstration)
const areaGeoData: Record<string, { lat: number; lng: number }> = {
  "admiral-village-talon-tres": { lat: 14.448, lng: 120.977 },
  "angela-village-talon-kuatro": { lat: 14.442, lng: 120.979 },
  "pilar-village": { lat: 14.458, lng: 120.975 },
  "bf-executive-almanza-uno": { lat: 14.452, lng: 120.985 },
  "bf-sta-cecilia-talon-dos": { lat: 14.445, lng: 120.983 },
  "bf-vista-grande-talon-dos": { lat: 14.446, lng: 120.984 },
  "talon-equitable": { lat: 14.441, lng: 120.978 },
  "golden-gate-talon-tres": { lat: 14.447, lng: 120.976 },
  "bf-almanza-almanza-dos": { lat: 14.450, lng: 120.986 },
  "moonwalk-village-talon-singko": { lat: 14.438, lng: 120.980 },
  "manila-doctors-almanza-uno": { lat: 14.453, lng: 120.986 },
  "metrocor-subdivision-almanza-uno": { lat: 14.454, lng: 120.987 },
  "philamlife-village-pamplona-dos": { lat: 14.460, lng: 120.982 },
  "remarville-subdivision-pamplona-dos": { lat: 14.462, lng: 120.981 },
  "sav-17-talon-kuatro": { lat: 14.443, lng: 120.979 },
  "saint-michael-village-talon-dos": { lat: 14.444, lng: 120.982 },
  "ts-cruz-subdivision-almanza-dos": { lat: 14.451, lng: 120.987 },
  "talon-singko": { lat: 14.439, lng: 120.981 },
  "urbanville-village-talon-tres": { lat: 14.447, lng: 120.977 },
  "dbp-village-almanza-uno": { lat: 14.455, lng: 120.986 }
};

// Helper function to calculate distance between two points in km using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Update TODA areas with geolocation data
async function updateTODAWithGeoData() {
  try {
    // Create a geo-collection reference for areas
    const geoAreasCollection = geofirestore.collection('geo-areas');

    // Update each area with geolocation data
    for (const [areaId, geoData] of Object.entries(areaGeoData)) {
      const path = `regions/metro-manila/cities/las-pinas/areas/${areaId}`;
      
      // Get the original area data
      const areaDoc = await db.doc(path).get();
      if (!areaDoc.exists) {
        console.log(`Area ${areaId} not found, skipping...`);
        continue;
      }
      
      const areaData = areaDoc.data() || {};
      
      // Add the geolocation data to the area
      await geoAreasCollection.doc(areaId).set({
        ...areaData,
        coordinates: new admin.firestore.GeoPoint(geoData.lat, geoData.lng),
        // Add geo-hash field needed by GeoFirestore
        coordinates_geohash: { 
          geohash: '', // Will be automatically calculated by GeoFirestore
          geopoint: new admin.firestore.GeoPoint(geoData.lat, geoData.lng)
        }
      });
      
      console.log(`Updated geo-data for area: ${areaData.name}`);
      
      // Now get all TODAs in this area
      const todasSnapshot = await db.collection(`${path}/todas`).get();
      
      // Create a geo-collection reference for TODAs in this area
      const geoTodasCollection = geofirestore.collection('geo-todas');
      
      // Update each TODA with the area's geolocation
      for (const todaDoc of todasSnapshot.docs) {
        const todaData = todaDoc.data();
        const todaId = todaDoc.id;
        
        // Add a slight randomization to the TODA location (within about 100-200m from the area center)
        const randomLat = geoData.lat + (Math.random() - 0.5) * 0.002;
        const randomLng = geoData.lng + (Math.random() - 0.5) * 0.002;
        
        await geoTodasCollection.doc(`${areaId}_${todaId}`).set({
          ...todaData,
          areaId: areaId,
          todaId: todaId,
          fullPath: `${path}/todas/${todaId}`,
          coordinates: new admin.firestore.GeoPoint(randomLat, randomLng),
          // Add geo-hash field needed by GeoFirestore
          coordinates_geohash: { 
            geohash: '', // Will be automatically calculated by GeoFirestore
            geopoint: new admin.firestore.GeoPoint(randomLat, randomLng) 
          }
        });
        
        console.log(`Updated geo-data for TODA: ${todaData.name}`);
      }
    }
    
    console.log("All TODA areas have been updated with geolocation data!");
  } catch (error) {
    console.error("Error updating TODA geo-data:", error);
  }
}

// Function to find the nearest TODA based on passenger location
async function findNearestTODA(passengerLat: number, passengerLng: number, radiusInKm: number = 3) {
  try {
    // Create a geo query to find TODAs within the specified radius
    const geoTodasCollection = geofirestore.collection('geo-todas');
    
    const query = geoTodasCollection
      .near({ 
        center: new admin.firestore.GeoPoint(passengerLat, passengerLng), 
        radius: radiusInKm 
      })
      .limit(5); // Get the 5 nearest TODAs
    
    // Execute the query
    const todaSnapshot = await query.get();
    
    if (todaSnapshot.empty) {
      console.log(`No TODAs found within ${radiusInKm}km of location (${passengerLat}, ${passengerLng})`);
      return [];
    }
    
    // Process and sort the results by actual distance
    const todaResults = todaSnapshot.docs.map(doc => {
      const todaData = doc.data();
      const todaLat = todaData.coordinates.latitude;
      const todaLng = todaData.coordinates.longitude;
      
      // Calculate exact distance
      const distance = calculateDistance(passengerLat, passengerLng, todaLat, todaLng);
      
      return {
        todaId: todaData.todaId,
        name: todaData.name,
        area: todaData.area,
        areaId: todaData.areaId,
        fullPath: todaData.fullPath,
        distance: distance,
        location: {
          lat: todaLat,
          lng: todaLng
        }
      };
    }).sort((a, b) => a.distance - b.distance);
    
    console.log(`Found ${todaResults.length} TODAs near location (${passengerLat}, ${passengerLng}):`);
    todaResults.forEach((toda, i) => {
      console.log(`${i+1}. ${toda.name} (${toda.area}) - ${toda.distance.toFixed(2)}km away`);
    });
    
    return todaResults;
  } catch (error) {
    console.error("Error finding nearest TODA:", error);
    return [];
  }
}

// Test function that demonstrates finding a TODA near different locations
async function testNearestTODALookup() {
  // Test locations around Las Piñas
  const testLocations = [
    { lat: 14.450, lng: 120.980, description: "Central Las Piñas" },
    { lat: 14.445, lng: 120.975, description: "Western Las Piñas" },
    { lat: 14.455, lng: 120.985, description: "Eastern Las Piñas" },
    { lat: 14.460, lng: 120.982, description: "Northern Las Piñas" },
    { lat: 14.440, lng: 120.981, description: "Southern Las Piñas" }
  ];
  
  for (const location of testLocations) {
    console.log(`\nTesting location: ${location.description} (${location.lat}, ${location.lng})`);
    await findNearestTODA(location.lat, location.lng);
  }
}

// Run the main functions
async function main() {
  await updateTODAWithGeoData();
  console.log("\n--- Testing Nearest TODA Lookup ---");
  await testNearestTODALookup();
  console.log("\nAll operations completed successfully!");
}

main(); 