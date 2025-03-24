# Philippine Locations Data Upload

This directory contains scripts to upload Philippine provinces, cities, and municipalities data to Firebase Firestore.

## Prerequisites

1. Node.js (version 14 or higher)
2. npm or yarn
3. Firebase project with Firestore database enabled
4. Firebase service account credentials

## Setup Instructions

1. **Install dependencies**

```bash
npm install firebase-admin
```

2. **Set up Firebase credentials**

- Go to your Firebase project console: https://console.firebase.google.com/
- Navigate to "Project settings" > "Service accounts"
- Click "Generate new private key" button
- Save the downloaded JSON file as `serviceAccountKey.json` in the root directory of this project

3. **Customize location data (optional)**

If you need to modify the provinces and cities data, you can edit the `utils/ph-location-data.js` file.

4. **Run the upload script**

```bash
node scripts/upload-ph-locations.js
```

## Data Structure

The data will be uploaded to Firestore with the following structure:

### Provinces Collection

Document ID: province-name-in-lowercase-with-hyphens

Fields:
- name: String (province name)
- createdAt: Timestamp
- updatedAt: Timestamp

### Cities Collection

Document ID: province-name-city-name-in-lowercase-with-hyphens

Fields:
- name: String (city/municipality name)
- province: String (province name)
- provinceRef: Reference (reference to the province document)
- createdAt: Timestamp
- updatedAt: Timestamp

## Usage in Your Application

```javascript
import firebase from 'firebase/app';
import 'firebase/firestore';

// Get all provinces
async function getProvinces() {
  const provincesSnapshot = await firebase.firestore().collection('provinces').get();
  return provincesSnapshot.docs.map(doc => doc.data());
}

// Get cities by province
async function getCitiesByProvince(provinceName) {
  const formattedProvinceName = provinceName.toLowerCase().replace(/\s+/g, '-');
  const provinceRef = firebase.firestore().collection('provinces').doc(formattedProvinceName);
  
  const citiesSnapshot = await firebase.firestore()
    .collection('cities')
    .where('provinceRef', '==', provinceRef)
    .get();
    
  return citiesSnapshot.docs.map(doc => doc.data());
}
```

## Note

This script is designed to be run once to set up your Firestore database with location data. Running it multiple times will overwrite existing documents with the same IDs. 

## The local Supabase instance is now set up and running with: 
Database tables:
todas: Contains TODA data with spatial information
drivers: For storing driver information
rides: For tracking ride requests and status
spatial_ref_sys: PostGIS system table for spatial operations
Sample data:
6 TODAs in Las Piñas with their locations and service areas
Available services:
Supabase Studio: http://localhost:3010
REST API: http://localhost:8000/rest/v1
Auth API: http://localhost:8000/auth/v1
Realtime API: http://localhost:8000/realtime/v1
Database: localhost:5432