import * as serviceAccount from './serviceAccountKey.json';
import { findNearestTODA, initializeFirebase } from './todaNearestSearch';

// Initialize Firebase with service account
initializeFirebase(serviceAccount as any);

// Function to find and display nearest TODAs for a given location
async function testTODASearch(location: { lat: number; lng: number; description: string }) {
  console.log(`\nSearching for TODAs near ${location.description} (${location.lat}, ${location.lng})...`);
  
  // Basic search
  const basicResults = await findNearestTODA(location.lat, location.lng, { 
    radiusInKm: 2, 
    limit: 3 
  });
  
  console.log(`Found ${basicResults.length} TODAs near ${location.description}:`);
  basicResults.forEach((toda, i) => {
    console.log(`${i+1}. ${toda.name} (${toda.area}) - ${toda.distance.toFixed(2)}km away`);
  });
  
  // Detailed search with availability information
  console.log("\nDetailed search with driver availability:");
  const detailedResults = await findNearestTODA(location.lat, location.lng, { 
    radiusInKm: 2,
    limit: 3,
    includeDetails: true
  });
  
  detailedResults.forEach((toda: any, i) => {
    console.log(`${i+1}. ${toda.name} (${toda.area}) - ${toda.distance.toFixed(2)}km away`);
    if (toda.availableDrivers !== undefined) {
      console.log(`   Available drivers: ${toda.availableDrivers}/${toda.totalDrivers}`);
    }
  });
  
  return { basicResults, detailedResults };
}

// Test function with multiple locations
async function runTests() {
  // Test locations around Las Piñas
  const testLocations = [
    { lat: 14.450, lng: 120.980, description: "Central Las Piñas" },
    { lat: 14.445, lng: 120.975, description: "Western Las Piñas" },
    { lat: 14.455, lng: 120.985, description: "Eastern Las Piñas" }
  ];
  
  // Simulate a passenger booking flow
  console.log("=== SIMULATING PASSENGER BOOKING FLOW ===");
  
  // 1. Passenger opens app at a location
  const passengerLocation = { lat: 14.450, lng: 120.980, description: "Passenger's Location" };
  console.log(`\nPassenger opens app at location: ${passengerLocation.description} (${passengerLocation.lat}, ${passengerLocation.lng})`);
  
  // 2. App shows nearby TODAs
  const { detailedResults } = await testTODASearch(passengerLocation);
  
  // 3. Passenger selects a TODA (first one for this example)
  if (detailedResults.length > 0) {
    const selectedTODA = detailedResults[0];
    console.log(`\nPassenger selects TODA: ${selectedTODA.name}`);
    console.log(`TODA details: ${selectedTODA.distance.toFixed(2)}km away in ${selectedTODA.area}`);
    
    // 4. App would then connect to available drivers from this TODA
    console.log(`Looking for available drivers from ${selectedTODA.name}...`);
    if ((selectedTODA as any).availableDrivers > 0) {
      console.log(`Found ${(selectedTODA as any).availableDrivers} available drivers!`);
      console.log("App would now match with the nearest available driver from this TODA.");
    } else {
      console.log("No drivers available from this TODA. App would suggest trying another TODA.");
    }
  } else {
    console.log("No TODAs found near passenger. App would suggest broadening the search radius.");
  }
  
  // Run tests for all other locations
  console.log("\n\n=== TESTING DIFFERENT LOCATIONS ===");
  for (const location of testLocations) {
    await testTODASearch(location);
  }
  
  console.log("\nAll tests completed successfully!");
}

// Run the tests
runTests(); 