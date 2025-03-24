import firebase from 'firebase/app';
import 'firebase/firestore';

/**
 * Service to interact with location data in Firestore
 */
class LocationService {
  /**
   * Fetches all provinces from Firestore
   * @returns {Promise<Array>} Array of province objects
   */
  static async getProvinces() {
    try {
      const provincesSnapshot = await firebase.firestore()
        .collection('provinces')
        .orderBy('name', 'asc')
        .get();
      
      return provincesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  }

  /**
   * Fetches cities/municipalities for a specific province
   * @param {string} provinceName - The name of the province
   * @returns {Promise<Array>} Array of city objects
   */
  static async getCitiesByProvince(provinceName) {
    try {
      const formattedProvinceName = provinceName.toLowerCase().replace(/\s+/g, '-');
      const provinceRef = firebase.firestore().collection('provinces').doc(formattedProvinceName);
      
      const citiesSnapshot = await firebase.firestore()
        .collection('cities')
        .where('provinceRef', '==', provinceRef)
        .orderBy('name', 'asc')
        .get();
        
      return citiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error fetching cities for province ${provinceName}:`, error);
      return [];
    }
  }

  /**
   * Gets a city by province and city name
   * @param {string} provinceName - The name of the province
   * @param {string} cityName - The name of the city
   * @returns {Promise<Object|null>} City object or null if not found
   */
  static async getCity(provinceName, cityName) {
    try {
      const formattedProvinceName = provinceName.toLowerCase().replace(/\s+/g, '-');
      const formattedCityName = cityName.toLowerCase().replace(/\s+/g, '-');
      const cityId = `${formattedProvinceName}-${formattedCityName}`;
      
      const cityDoc = await firebase.firestore()
        .collection('cities')
        .doc(cityId)
        .get();
        
      if (cityDoc.exists) {
        return {
          id: cityDoc.id,
          ...cityDoc.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching city ${cityName} in province ${provinceName}:`, error);
      return null;
    }
  }
}

export default LocationService; 