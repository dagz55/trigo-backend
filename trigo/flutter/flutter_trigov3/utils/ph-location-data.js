/**
 * Philippine Provinces and Cities/Municipalities Data
 * This is a sample dataset with major provinces and some of their cities/municipalities
 */

const locationData = {
  provinces: [
    { id: 'metro-manila', name: 'Metro Manila' },
    { id: 'cebu', name: 'Cebu' },
    { id: 'davao', name: 'Davao' },
    { id: 'cavite', name: 'Cavite' },
    { id: 'laguna', name: 'Laguna' },
    { id: 'pampanga', name: 'Pampanga' },
    { id: 'bulacan', name: 'Bulacan' },
    { id: 'iloilo', name: 'Iloilo' },
    { id: 'batangas', name: 'Batangas' },
    { id: 'rizal', name: 'Rizal' }
  ],
  cities: [
    // Metro Manila cities
    { id: 'metro-manila-quezon-city', name: 'Quezon City', provinceId: 'metro-manila', population: 2960048 },
    { id: 'metro-manila-manila', name: 'Manila', provinceId: 'metro-manila', population: 1780148 },
    { id: 'metro-manila-caloocan', name: 'Caloocan', provinceId: 'metro-manila', population: 1583978 },
    { id: 'metro-manila-makati', name: 'Makati', provinceId: 'metro-manila', population: 582602 },
    { id: 'metro-manila-pasig', name: 'Pasig', provinceId: 'metro-manila', population: 755300 },
    { id: 'metro-manila-taguig', name: 'Taguig', provinceId: 'metro-manila', population: 804915 },
    
    // Cebu cities/municipalities
    { id: 'cebu-cebu-city', name: 'Cebu City', provinceId: 'cebu', population: 922611 },
    { id: 'cebu-mandaue', name: 'Mandaue', provinceId: 'cebu', population: 362654 },
    { id: 'cebu-lapu-lapu', name: 'Lapu-Lapu', provinceId: 'cebu', population: 408112 },
    { id: 'cebu-talisay', name: 'Talisay', provinceId: 'cebu', population: 227645 },
    
    // Davao cities/municipalities
    { id: 'davao-davao-city', name: 'Davao City', provinceId: 'davao', population: 1632991 },
    { id: 'davao-tagum', name: 'Tagum', provinceId: 'davao', population: 259444 },
    { id: 'davao-digos', name: 'Digos', provinceId: 'davao', population: 169393 },
    
    // Cavite cities/municipalities
    { id: 'cavite-dasmarinas', name: 'Dasmariñas', provinceId: 'cavite', population: 659019 },
    { id: 'cavite-bacoor', name: 'Bacoor', provinceId: 'cavite', population: 579082 },
    { id: 'cavite-imus', name: 'Imus', provinceId: 'cavite', population: 418382 },
    
    // Laguna cities/municipalities
    { id: 'laguna-santa-rosa', name: 'Santa Rosa', provinceId: 'laguna', population: 353767 },
    { id: 'laguna-calamba', name: 'Calamba', provinceId: 'laguna', population: 454486 },
    { id: 'laguna-san-pedro', name: 'San Pedro', provinceId: 'laguna', population: 325809 },
    
    // Pampanga cities/municipalities
    { id: 'pampanga-angeles', name: 'Angeles', provinceId: 'pampanga', population: 411634 },
    { id: 'pampanga-san-fernando', name: 'San Fernando', provinceId: 'pampanga', population: 306659 },
    { id: 'pampanga-mabalacat', name: 'Mabalacat', provinceId: 'pampanga', population: 250799 },
    
    // Bulacan cities/municipalities
    { id: 'bulacan-meycauayan', name: 'Meycauayan', provinceId: 'bulacan', population: 209083 },
    { id: 'bulacan-malolos', name: 'Malolos', provinceId: 'bulacan', population: 252074 },
    { id: 'bulacan-san-jose-del-monte', name: 'San Jose Del Monte', provinceId: 'bulacan', population: 574089 },
    
    // Iloilo cities/municipalities
    { id: 'iloilo-iloilo-city', name: 'Iloilo City', provinceId: 'iloilo', population: 447992 },
    { id: 'iloilo-passi', name: 'Passi', provinceId: 'iloilo', population: 80538 },
    { id: 'iloilo-oton', name: 'Oton', provinceId: 'iloilo', population: 86970 },
    
    // Batangas cities/municipalities
    { id: 'batangas-batangas-city', name: 'Batangas City', provinceId: 'batangas', population: 329874 },
    { id: 'batangas-lipa', name: 'Lipa', provinceId: 'batangas', population: 332386 },
    { id: 'batangas-tanauan', name: 'Tanauan', provinceId: 'batangas', population: 173366 },
    
    // Rizal cities/municipalities
    { id: 'rizal-antipolo', name: 'Antipolo', provinceId: 'rizal', population: 776386 },
    { id: 'rizal-cainta', name: 'Cainta', provinceId: 'rizal', population: 322128 },
    { id: 'rizal-taytay', name: 'Taytay', provinceId: 'rizal', population: 299628 }
  ]
};

module.exports = locationData; 