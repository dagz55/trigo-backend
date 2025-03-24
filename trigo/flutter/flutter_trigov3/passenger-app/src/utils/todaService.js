import { collection, doc, GeoPoint, getDoc, getDocs, query, where } from 'firebase/firestore';
import { GeoFirestore } from 'geofirestore';
import { db } from './firebaseConfig';

// Create a GeoFirestore reference
const geofirestore = new GeoFirestore(db);

/**
 * Calculate distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1  
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Find the nearest TODAs to a passenger's location
 * @param {number} lat - Passenger's latitude
 * @param {number} lng - Passenger's longitude
 * @param {Object} options - Search options
 * @param {number} options.radiusInKm - Search radius in kilometers
 * @param {number} options.limit - Maximum number of results to return
 * @param {boolean} options.includeDetails - Whether to include additional TODA details
 * @returns {Promise<Array>} Array of nearby TODAs sorted by distance
 */
export const findNearestTODAs = async (lat, lng, options = {}) => {
  const { 
    radiusInKm = 3, 
    limit = 5,
    includeDetails = false 
  } = options;
  
  try {
    // Create a geo query to find TODAs within the specified radius
    const geoTodasCollection = geofirestore.collection('geo-todas');
    
    const geoQuery = geoTodasCollection
      .near({ 
        center: new GeoPoint(lat, lng), 
        radius: radiusInKm 
      })
      .limit(limit);
    
    // Execute the query
    const todaSnapshot = await geoQuery.get();
    
    if (todaSnapshot.empty) {
      console.log(`No TODAs found within ${radiusInKm}km of location (${lat}, ${lng})`);
      return [];
    }
    
    // Process and sort the results by actual distance
    const todaResults = todaSnapshot.docs.map(doc => {
      const todaData = doc.data();
      const todaLat = todaData.coordinates.latitude;
      const todaLng = todaData.coordinates.longitude;
      
      // Calculate exact distance
      const distance = calculateDistance(lat, lng, todaLat, todaLng);
      
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
    
    // If includeDetails is true, fetch additional data for each TODA
    if (includeDetails) {
      const detailedResults = await Promise.all(todaResults.map(async (toda) => {
        try {
          // Fetch actual TODA document to get most up-to-date information
          const todaDoc = await getDoc(doc(db, toda.fullPath));
          if (todaDoc.exists()) {
            const todaData = todaDoc.data();
            
            // Get the number of active tricycles
            const tricyclesQuery = query(
              collection(db, `${toda.fullPath}/tricycles`),
              where('status', '==', 'active')
            );
            const tricyclesSnapshot = await getDocs(tricyclesQuery);
            
            return {
              ...toda,
              availableDrivers: tricyclesSnapshot.size,
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
    console.error("Error finding nearest TODAs:", error);
    return [];
  }
}; 