import * as admin from 'firebase-admin';
import { GeoFirestore } from 'geofirestore';

// Initialize Firebase Admin if it hasn't been initialized yet
let db: admin.firestore.Firestore;
let geofirestore: GeoFirestore;

export function initializeFirebase(serviceAccount?: any) {
  if (!admin.apps.length) {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // If no service account is provided, use the default app (useful in Firebase Functions)
      admin.initializeApp();
    }
  }
  
  db = admin.firestore();
  geofirestore = new GeoFirestore(db);
}

// Helper function to calculate distance between two points in km using the Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Interface for TODA result
export interface TODASearchResult {
  todaId: string;
  name: string;
  area: string;
  areaId: string;
  fullPath: string;
  distance: number;
  location: {
    lat: number;
    lng: number;
  };
}

// Function to find the nearest TODA based on passenger location
export async function findNearestTODA(
  passengerLat: number, 
  passengerLng: number, 
  options: {
    radiusInKm?: number,
    limit?: number,
    includeDetails?: boolean
  } = {}
): Promise<TODASearchResult[]> {
  const { 
    radiusInKm = 3, 
    limit = 5,
    includeDetails = false 
  } = options;
  
  try {
    if (!geofirestore) {
      throw new Error("Firebase not initialized. Call initializeFirebase() first.");
    }
    
    // Create a geo query to find TODAs within the specified radius
    const geoTodasCollection = geofirestore.collection('geo-todas');
    
    const query = geoTodasCollection
      .near({ 
        center: new admin.firestore.GeoPoint(passengerLat, passengerLng), 
        radius: radiusInKm 
      })
      .limit(limit);
    
    // Execute the query
    const todaSnapshot = await query.get();
    
    if (todaSnapshot.empty) {
      return [];
    }
    
    // Process and sort the results by actual distance
    const todaResults = todaSnapshot.docs.map(doc => {
      const todaData = doc.data();
      const todaLat = todaData.coordinates.latitude;
      const todaLng = todaData.coordinates.longitude;
      
      // Calculate exact distance
      const distance = calculateDistance(passengerLat, passengerLng, todaLat, todaLng);
      
      const result: TODASearchResult = {
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
      
      return result;
    }).sort((a, b) => a.distance - b.distance);
    
    // If includeDetails is true, fetch additional data for each TODA
    if (includeDetails) {
      const detailedResults = await Promise.all(todaResults.map(async (toda) => {
        try {
          // Fetch actual TODA document to get most up-to-date information
          const todaDoc = await db.doc(toda.fullPath).get();
          if (todaDoc.exists) {
            const todaData = todaDoc.data() || {};
            // Get the number of active tricycles
            const tricyclesQuery = await db.collection(`${toda.fullPath}/tricycles`)
              .where('status', '==', 'active')
              .get();
            
            return {
              ...toda,
              availableDrivers: tricyclesQuery.size,
              totalDrivers: todaData.totalDrivers || 0,
              status: todaData.status || 'active'
            };
          }
          return toda;
        } catch (error) {
          console.error(`Error fetching details for TODA ${toda.name}:`, error);
          return toda;
        }
      }));
      
      return detailedResults;
    }
    
    return todaResults;
  } catch (error) {
    console.error("Error finding nearest TODA:", error);
    return [];
  }
}

// Example usage:
// import * as serviceAccount from './serviceAccountKey.json';
// import { initializeFirebase, findNearestTODA } from './todaNearestSearch';
//
// // Initialize Firebase with service account
// initializeFirebase(serviceAccount);
//
// // Function to find and display nearest TODAs
// async function findTODAForPassenger(lat: number, lng: number) {
//   const nearbyTODAs = await findNearestTODA(lat, lng, { 
//     radiusInKm: 2,
//     limit: 3,
//     includeDetails: true
//   });
//   
//   console.log(`Found ${nearbyTODAs.length} TODAs near your location:`);
//   nearbyTODAs.forEach((toda, i) => {
//     console.log(`${i+1}. ${toda.name} (${toda.area}) - ${toda.distance.toFixed(2)}km away`);
//   });
//   
//   return nearbyTODAs;
// }
//
// // Call the function with passenger location
// findTODAForPassenger(14.450, 120.980); 