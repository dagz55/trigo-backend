import { Autocomplete, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 14.5995, // Philippines center
  lng: 120.9842,
};

const BookRide = () => {
  const { currentUser } = useAuth();
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(0);
  const db = getFirestore();

  const onPickupPlaceChanged = useCallback((autocomplete) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setPickup({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setPickupAddress(place.formatted_address);
    }
  }, []);

  const onDestinationPlaceChanged = useCallback((autocomplete) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setDestination({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setDestinationAddress(place.formatted_address);
      // Calculate estimated fare based on distance
      if (pickup) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(pickup.lat, pickup.lng),
          new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())
        );
        const baseFare = 50; // PHP
        const ratePerKm = 13.5; // PHP per kilometer
        const estimatedFare = baseFare + (distance / 1000) * ratePerKm;
        setFare(Math.round(estimatedFare));
      }
    }
  }, [pickup]);

  const handleBookRide = async () => {
    if (!pickup || !destination) {
      toast.error('Please select both pickup and destination locations');
      return;
    }

    try {
      setLoading(true);
      const rideData = {
        userId: currentUser.uid,
        pickup: {
          lat: pickup.lat,
          lng: pickup.lng,
          address: pickupAddress,
        },
        destination: {
          lat: destination.lat,
          lng: destination.lng,
          address: destinationAddress,
        },
        status: 'pending',
        fare,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'rides'), rideData);
      toast.success('Ride booked successfully! Searching for nearby drivers...');
      // You would typically implement real-time driver matching here
    } catch (error) {
      toast.error('Failed to book ride: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book a Ride</h1>
      
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <div className="mb-6 space-y-4">
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.addListener('place_changed', () => onPickupPlaceChanged(autocomplete));
            }}
          >
            <input
              type="text"
              placeholder="Enter pickup location"
              className="w-full p-2 border rounded"
            />
          </Autocomplete>

          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.addListener('place_changed', () => onDestinationPlaceChanged(autocomplete));
            }}
          >
            <input
              type="text"
              placeholder="Enter destination"
              className="w-full p-2 border rounded"
            />
          </Autocomplete>
        </div>

        <div className="mb-6">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={pickup || center}
          >
            {pickup && <Marker position={pickup} />}
            {destination && <Marker position={destination} />}
          </GoogleMap>
        </div>

        {fare > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h2 className="text-xl font-semibold mb-2">Estimated Fare</h2>
            <p className="text-2xl text-indigo-600">₱{fare.toFixed(2)}</p>
          </div>
        )}

        <button
          onClick={handleBookRide}
          disabled={loading || !pickup || !destination}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Booking...' : 'Book Ride'}
        </button>
      </LoadScript>
    </div>
  );
};

export default BookRide; 