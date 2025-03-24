/**
 * Script to upload Philippine provinces and cities data to Firestore
 * Run this script with: node utils/upload-location-data.js
 */

const { db } = require('./firebase-admin');
const locationData = require('./ph-location-data');

/**
 * Uploads all provinces to Firestore
 * @returns {Promise<Object>} A mapping of province names to their document references
 */
async function uploadProvinces() {
  console.log('Starting to upload provinces...');
  const provinceRefs = {};
  
  for (const province of locationData.provinces) {
    try {
      const docRef = db.collection('provinces').doc(province.id);
      await docRef.set({
        name: province.name,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      provinceRefs[province.id] = docRef;
      console.log(`✅ Uploaded province: ${province.name}`);
    } catch (error) {
      console.error(`❌ Error uploading province ${province.name}:`, error);
    }
  }
  
  console.log(`Completed uploading ${Object.keys(provinceRefs).length} provinces`);
  return provinceRefs;
}

/**
 * Uploads all cities to Firestore with references to their province
 * @param {Object} provinceRefs - Mapping of province IDs to document references
 */
async function uploadCities(provinceRefs) {
  console.log('\nStarting to upload cities...');
  let successCount = 0;
  let errorCount = 0;
  
  for (const city of locationData.cities) {
    try {
      const provinceRef = provinceRefs[city.provinceId];
      if (!provinceRef) {
        throw new Error(`Province reference not found for ${city.provinceId}`);
      }
      
      await db.collection('cities').doc(city.id).set({
        name: city.name,
        provinceRef: provinceRef,
        provinceId: city.provinceId,
        population: city.population || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      successCount++;
      console.log(`✅ Uploaded city: ${city.name} (${city.provinceId})`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error uploading city ${city.name}:`, error);
    }
  }
  
  console.log(`\nCompleted uploading cities. Success: ${successCount}, Errors: ${errorCount}`);
}

/**
 * Main function to run the data upload
 */
async function main() {
  try {
    console.log('🚀 Starting location data upload to Firestore...');
    
    // First upload provinces and get references
    const provinceRefs = await uploadProvinces();
    
    // Then upload cities with province references
    await uploadCities(provinceRefs);
    
    console.log('\n✨ Data upload completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in data upload process:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 