import { getDatabase, off, onValue, ref } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getFirebaseApp } from '../../firebase';

// Load Google Maps API script
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
  script.async = true;
  script.defer = true;
  script.addEventListener('load', callback);
  document.head.appendChild(script);
};

/**
 * RealTimeTracking component for showing current driver location on a map
 * @param {Object} props
 * @param {string} props.rideId - ID of the current ride
 * @param {string} props.driverId - ID of the driver
 * @param {Object} props.initialPosition - Optional initial position to center the map
 * @param {Function} props.onLocationUpdate - Optional callback for location updates
 */
function RealTimeTracking({ 
  rideId, 
  driverId, 
  initialPosition = { lat: 14.5031, lng: 120.9859 },  // Default to Las Piñas coordinates
  onLocationUpdate
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialPosition);
  const [driverInfo, setDriverInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Refs for Google Maps objects
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const pathRef = useRef([]);
  const polylineRef = useRef(null);
  
  // Initialize Google Maps
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setMapLoaded(true);
    });
    
    return () => {
      // Cleanup if script is still loading
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script && script.parentNode && !window.google) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  // Initialize map once script is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    try {
      const mapOptions = {
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true
      };
      
      const mapInstance = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = mapInstance;
      
      // Create marker for driver
      const driverMarker = new window.google.maps.Marker({
        position: currentLocation,
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
          rotation: 0
        },
        title: "Driver Location"
      });
      markerRef.current = driverMarker;
      
      // Create polyline for tracking path
      const trackingPath = new window.google.maps.Polyline({
        path: [currentLocation],
        geodesic: true,
        strokeColor: '#4285F4',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      trackingPath.setMap(mapInstance);
      polylineRef.current = trackingPath;
      pathRef.current = [currentLocation];
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map. Please refresh the page.');
    }
  }, [mapLoaded, currentLocation]);
  
  // Subscribe to real-time location updates
  useEffect(() => {
    if (!driverId) return;
    
    setLoading(true);
    const db = getDatabase(getFirebaseApp());
    const locationRef = ref(db, `drivers/${driverId}/location`);
    const driverRef = ref(db, `drivers/${driverId}/info`);
    
    // Listen for location updates
    onValue(locationRef, (snapshot) => {
      setLoading(false);
      
      if (snapshot.exists()) {
        const locationData = snapshot.val();
        
        // Update current location
        const newLocation = {
          lat: locationData.latitude,
          lng: locationData.longitude,
          heading: locationData.heading || 0,
          speed: locationData.speed || 0,
          timestamp: locationData.timestamp || Date.now()
        };
        
        setCurrentLocation(newLocation);
        
        // Update Google Maps marker and path
        if (markerRef.current && mapInstanceRef.current) {
          // Update marker position and rotation
          markerRef.current.setPosition(newLocation);
          
          if (markerRef.current.getIcon()) {
            const icon = { ...markerRef.current.getIcon() };
            icon.rotation = newLocation.heading;
            markerRef.current.setIcon(icon);
          }
          
          // Add to path history
          pathRef.current.push(newLocation);
          if (polylineRef.current) {
            polylineRef.current.setPath(pathRef.current);
          }
          
          // Pan map to new location
          mapInstanceRef.current.panTo(newLocation);
        }
        
        // Call callback if provided
        if (onLocationUpdate) {
          onLocationUpdate(newLocation);
        }
      } else {
        setError('No location data available for this driver');
      }
    }, (error) => {
      console.error('Error getting location:', error);
      setLoading(false);
      setError('Failed to get driver location. Please try again.');
      toast.error('Error tracking driver location');
    });
    
    // Get driver info
    onValue(driverRef, (snapshot) => {
      if (snapshot.exists()) {
        setDriverInfo(snapshot.val());
      }
    });
    
    // Cleanup function
    return () => {
      off(locationRef);
      off(driverRef);
    };
  }, [driverId, onLocationUpdate]);
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        <h3 className="text-lg font-semibold mb-2">Real-Time Tracking</h3>
        {driverInfo && (
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {driverInfo.photoURL ? (
                <img 
                  src={driverInfo.photoURL} 
                  alt={driverInfo.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl">🚗</span>
              )}
            </div>
            <div>
              <p className="font-medium">{driverInfo.name || 'Driver'}</p>
              <p className="text-sm text-gray-600">
                {driverInfo.vehicleInfo?.model} - {driverInfo.vehicleInfo?.plateNumber}
              </p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span className="text-sm">Live</span>
              </div>
              {currentLocation.speed > 0 && (
                <p className="text-sm text-gray-600">
                  {Math.round(currentLocation.speed * 3.6)} km/h
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 relative bg-gray-100 rounded-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">{error}</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg"
          aria-label="Map showing real-time driver location"
        />
      </div>
    </div>
  );
}

export default RealTimeTracking; 