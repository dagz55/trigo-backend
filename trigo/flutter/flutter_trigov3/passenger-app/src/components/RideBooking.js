import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { calculateDistance } from '../utils/todaService';
import NearbyTODAs from './NearbyTODAs';

const RideBooking = () => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    pickup: '',
    destination: '',
    vehicleType: 'tricycle',
    paymentMethod: 'cash',
    notes: ''
  });
  const [fare, setFare] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTODA, setSelectedTODA] = useState(null);

  // Popular Las Piñas locations served by TODAs
  const locationOptions = [
    { id: 1, name: 'BF Resort Village Commercial Area, Las Piñas City', popular: true, lat: 14.4518, lng: 120.9774 },
    { id: 2, name: 'SM Southmall, Alabang-Zapote Rd, Las Piñas City', popular: true, lat: 14.4350, lng: 120.9831 },
    { id: 3, name: 'Las Piñas City Hall, Las Piñas City', popular: true, lat: 14.4500, lng: 120.9820 },
    { id: 4, name: 'Pilar Village Main Gate, Las Piñas City', popular: true, lat: 14.4623, lng: 120.9810 },
    { id: 5, name: 'University of Perpetual Help, Las Piñas City', popular: false, lat: 14.4579, lng: 120.9818 },
    { id: 6, name: 'Casimiro Village Gate, Las Piñas City', popular: false, lat: 14.4470, lng: 120.9720 },
    { id: 7, name: "Las Piñas Doctor's Hospital, Las Piñas City", popular: false, lat: 14.4482, lng: 120.9837 },
    { id: 8, name: 'BFRV TODA Terminal, BF Resort Village, Las Piñas City', popular: false, lat: 14.4503, lng: 120.9765 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });

    // Show location suggestions when typing in pickup or destination
    if (name === 'pickup' || name === 'destination') {
      if (value.length > 2) {
        const filtered = locationOptions.filter(loc => 
          loc.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestedLocations(filtered);
      } else {
        setSuggestedLocations([]);
      }
    }
  };

  const selectLocation = (location, field) => {
    setBooking({ ...booking, [field]: location.name });
    setSuggestedLocations([]);
    
    // Set selected location for TODA search if it's the pickup location
    if (field === 'pickup') {
      setSelectedLocation({
        lat: location.lat,
        lng: location.lng
      });
    }
    
    // Calculate fare if both pickup and destination are set
    if (
      (field === 'pickup' && booking.destination) || 
      (field === 'destination' && booking.pickup)
    ) {
      calculateFare(
        field === 'pickup' ? location : locationOptions.find(loc => loc.name === booking.pickup),
        field === 'destination' ? location : locationOptions.find(loc => loc.name === booking.destination)
      );
    }
  };

  const calculateFare = (pickup, destination) => {
    // Simple distance-based fare calculation
    if (!pickup || !destination) return;
    
    const distance = calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng);
    
    // Base fare for tricycles
    const baseFare = 40; // Base fare in PHP
    const perKmRate = 35; // PHP per km
    
    // Calculate fare (base + distance-based)
    let calculatedFare = baseFare + (distance * perKmRate);
    
    // Minimum fare
    calculatedFare = Math.max(calculatedFare, 50);
    
    // Round to nearest 5 pesos (common in Philippines)
    calculatedFare = Math.ceil(calculatedFare / 5) * 5;
    
    setFare(calculatedFare);
  };

  const handleTODASelection = (toda) => {
    setSelectedTODA(toda);
    toast.success(`${toda.name} selected from ${toda.area}`);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!booking.pickup || !booking.destination) {
        toast.error('Please enter pickup and destination locations');
        return;
      }
      
      // If no TODA selected but we have a pickup location, automatically select the first available TODA
      if (!selectedTODA && selectedLocation) {
        toast.info('Please select a TODA association for your ride');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add selected TODA to booking information
      const bookingData = {
        ...booking,
        fare,
        toda: selectedTODA ? {
          id: selectedTODA.todaId,
          name: selectedTODA.name,
          area: selectedTODA.area
        } : null
      };
      
      console.log('Booking submitted:', bookingData);
      
      // Success response
      toast.success(`Ride booked successfully! Looking for driver from ${selectedTODA.name}...`);
      setLoading(false);
      setStep(3); // Move to confirmation step
    } catch (error) {
      toast.error('Failed to book ride. Please try again.');
      setLoading(false);
    }
  };

  const renderLocationStep = () => (
    <div className="ride-booking-step location-step">
      <h2>Book a Ride</h2>
      
      <div className="form-group">
        <label htmlFor="pickup">Pickup Location</label>
        <input
          type="text"
          id="pickup"
          name="pickup"
          value={booking.pickup}
          onChange={handleInputChange}
          placeholder="Enter pickup location"
          autoComplete="off"
        />
        {suggestedLocations.length > 0 && booking.pickup && (
          <ul className="location-suggestions">
            {suggestedLocations.map(location => (
              <li 
                key={location.id}
                onClick={() => selectLocation(location, 'pickup')}
              >
                {location.name}
                {location.popular && <span className="popular-tag">Popular</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={booking.destination}
          onChange={handleInputChange}
          placeholder="Enter destination"
          autoComplete="off"
        />
        {suggestedLocations.length > 0 && booking.destination && (
          <ul className="location-suggestions">
            {suggestedLocations.map(location => (
              <li 
                key={location.id}
                onClick={() => selectLocation(location, 'destination')}
              >
                {location.name}
                {location.popular && <span className="popular-tag">Popular</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {fare > 0 && (
        <div className="fare-estimate">
          <h3>Estimated Fare</h3>
          <p className="fare">₱{fare.toFixed(2)}</p>
          <p className="fare-note">*Actual fare may vary slightly</p>
        </div>
      )}
      
      {selectedLocation && (
        <div className="toda-selection-section">
          <NearbyTODAs 
            location={selectedLocation} 
            onSelectTODA={handleTODASelection} 
            loading={loading}
          />
        </div>
      )}
      
      {selectedTODA && (
        <div className="selected-toda">
          <h3>Selected TODA</h3>
          <div className="toda-detail">
            <p><strong>{selectedTODA.name}</strong></p>
            <p>{selectedTODA.area}</p>
            <p>{selectedTODA.distance.toFixed(2)} km from pickup point</p>
          </div>
        </div>
      )}
      
      <div className="button-group">
        <button onClick={nextStep} className="primary-button">
          Next
        </button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="ride-booking-step details-step">
      <h2>Ride Details</h2>
      
      <div className="booking-summary">
        <div className="summary-item">
          <span className="label">From:</span>
          <span className="value">{booking.pickup}</span>
        </div>
        <div className="summary-item">
          <span className="label">To:</span>
          <span className="value">{booking.destination}</span>
        </div>
        <div className="summary-item">
          <span className="label">Estimated Fare:</span>
          <span className="value">₱{fare.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="label">TODA:</span>
          <span className="value">{selectedTODA?.name || 'Any available'}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vehicle Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="vehicleType"
                value="tricycle"
                checked={booking.vehicleType === 'tricycle'}
                onChange={handleInputChange}
              />
              <span>Tricycle</span>
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Payment Method</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={booking.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              <span>Cash</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="paymentMethod"
                value="gcash"
                checked={booking.paymentMethod === 'gcash'}
                onChange={handleInputChange}
              />
              <span>GCash</span>
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Special Instructions (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={booking.notes}
            onChange={handleInputChange}
            placeholder="Any special instructions for the driver..."
          />
        </div>
        
        <div className="button-group">
          <button type="button" onClick={prevStep} className="secondary-button">
            Back
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Booking...' : 'Book Ride'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="ride-booking-step confirmation-step">
      <div className="success-animation">
        <div className="checkmark-circle">
          <div className="checkmark"></div>
        </div>
      </div>
      
      <h2>Ride Booked Successfully!</h2>
      
      <div className="confirmation-details">
        <p>Your ride with {selectedTODA?.name || 'local TODA'} has been booked.</p>
        <p>Looking for available drivers in your area...</p>
        <p>You'll be notified once a driver accepts your booking.</p>
        
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-item">
            <span className="label">From:</span>
            <span className="value">{booking.pickup}</span>
          </div>
          <div className="summary-item">
            <span className="label">To:</span>
            <span className="value">{booking.destination}</span>
          </div>
          <div className="summary-item">
            <span className="label">Fare:</span>
            <span className="value">₱{fare.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Payment Method:</span>
            <span className="value">{booking.paymentMethod === 'cash' ? 'Cash' : 'GCash'}</span>
          </div>
        </div>
      </div>
      
      <div className="button-group">
        <button 
          onClick={() => {
            setStep(1);
            setBooking({
              pickup: '',
              destination: '',
              vehicleType: 'tricycle',
              paymentMethod: 'cash',
              notes: ''
            });
            setFare(0);
            setSelectedLocation(null);
            setSelectedTODA(null);
          }} 
          className="primary-button"
        >
          Book Another Ride
        </button>
      </div>
    </div>
  );

  return (
    <div className="ride-booking-container">
      <div className="booking-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Location</div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Details</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Confirmation</div>
      </div>
      
      {step === 1 && renderLocationStep()}
      {step === 2 && renderDetailsStep()}
      {step === 3 && renderConfirmationStep()}
    </div>
  );
};

export default RideBooking; 