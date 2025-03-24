import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../../../../firebase';
import { getCurrentUserWithData, signOut } from '../../../../../utils/security';
import withSecurityAndMonitoring from '../../../../hoc/withSecurityAndMonitoring';

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    vehicleInfo: {
      plateNumber: '',
      model: '',
      color: '',
      year: ''
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      availabilityHours: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '10:00', end: '15:00', available: true },
        sunday: { start: '10:00', end: '15:00', available: false }
      }
    }
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await getCurrentUserWithData();
      
      if (user) {
        setUserData(user);
        
        // Populate form with user data
        setFormData({
          fullName: user.fullName || '',
          phone: user.phone || '',
          address: user.address || '',
          emergencyContact: user.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          },
          vehicleInfo: user.vehicleInfo || {
            plateNumber: '',
            model: '',
            color: '',
            year: ''
          },
          preferences: user.preferences || {
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            availabilityHours: {
              monday: { start: '09:00', end: '17:00', available: true },
              tuesday: { start: '09:00', end: '17:00', available: true },
              wednesday: { start: '09:00', end: '17:00', available: true },
              thursday: { start: '09:00', end: '17:00', available: true },
              friday: { start: '09:00', end: '17:00', available: true },
              saturday: { start: '10:00', end: '15:00', available: true },
              sunday: { start: '10:00', end: '15:00', available: false }
            }
          }
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Handle nested properties
      if (name.includes('.')) {
        const [parent, child, grandchild] = name.split('.');
        
        if (grandchild) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent][child],
                [grandchild]: value
              }
            }
          };
        }
        
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    // Handle nested properties for checkboxes
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      
      setFormData(prev => {
        if (grandchild) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent][child],
                [grandchild]: checked
              }
            }
          };
        }
        
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        availabilityHours: {
          ...prev.preferences.availabilityHours,
          [day]: {
            ...prev.preferences.availabilityHours[day],
            [field]: field === 'available' ? !prev.preferences.availabilityHours[day].available : value
          }
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!userData || !userData.uid) {
        throw new Error('User data not available');
      }

      // Update user data in Firestore
      const userRef = doc(firestore, 'users', userData.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        vehicleInfo: formData.vehicleInfo,
        preferences: formData.preferences,
        updatedAt: new Date()
      });

      // Refresh user data
      const updatedUserDoc = await getDoc(userRef);
      if (updatedUserDoc.exists()) {
        setUserData({
          ...userData,
          ...updatedUserDoc.data()
        });
      }

      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Profile</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
              <input
                type="text"
                name="vehicleInfo.plateNumber"
                value={formData.vehicleInfo.plateNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
              <input
                type="text"
                name="vehicleInfo.model"
                value={formData.vehicleInfo.model}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
              <input
                type="text"
                name="vehicleInfo.color"
                value={formData.vehicleInfo.color}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                name="vehicleInfo.year"
                value={formData.vehicleInfo.year}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          
          {/* Notification Preferences */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  name="preferences.notifications.email"
                  checked={formData.preferences.notifications.email}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="email-notifications" className="text-sm">Email Notifications</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="push-notifications"
                  name="preferences.notifications.push"
                  checked={formData.preferences.notifications.push}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="push-notifications" className="text-sm">Push Notifications</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms-notifications"
                  name="preferences.notifications.sms"
                  checked={formData.preferences.notifications.sms}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="sms-notifications" className="text-sm">SMS Notifications</label>
              </div>
            </div>
          </div>
          
          {/* Availability Hours */}
          <div>
            <h3 className="text-lg font-medium mb-2">Availability Hours</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Day</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Available</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Start Time</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">End Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(formData.preferences.availabilityHours).map(([day, hours]) => (
                    <tr key={day}>
                      <td className="py-2 px-4 capitalize">{day}</td>
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={hours.available}
                          onChange={() => handleAvailabilityChange(day, 'available')}
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                          className="p-1 border rounded-md"
                          disabled={!hours.available}
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                          className="p-1 border rounded-md"
                          disabled={!hours.available}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-md shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withSecurityAndMonitoring(ProfilePage, {
  requireAuth: true,
  requireDriverApproval: true,
  pageId: 'driver-profile'
}); 