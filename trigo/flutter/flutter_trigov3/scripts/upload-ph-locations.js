const { db } = require('../utils/firebase-admin');
const { provinces, citiesByProvince } = require('../utils/ph-location-data');

/**
 * Uploads the Philippine provinces and cities data to Firestore
 */
async function uploadPhLocationData() {
  try {
    // Create a batch to perform multiple writes as a single operation
    const batch = db.batch();

    // Create collection references
    const provincesRef = db.collection('provinces');
    const citiesRef = db.collection('cities');
    
    console.log('Starting to upload provinces...');
    
    // Add provinces to batch
    provinces.forEach(province => {
      const provinceDoc = provincesRef.doc(province.toLowerCase().replace(/\s+/g, '-'));
      batch.set(provinceDoc, { 
        name: province,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Added province: ${province}`);
      
      // Add cities for this province (if available)
      const cities = citiesByProvince[province] || [];
      cities.forEach(city => {
        const cityDoc = citiesRef.doc(`${province.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`);
        batch.set(cityDoc, {
          name: city,
          province: province,
          provinceRef: provinceDoc,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`Added city: ${city} to province: ${province}`);
      });
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Successfully uploaded all provinces and cities to Firestore!');
  } catch (error) {
    console.error('Error uploading location data to Firestore:', error);
  }
}

// Execute the upload function
uploadPhLocationData()
  .then(() => {
    console.log('Upload process complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error in upload process:', error);
    process.exit(1);
  }); 