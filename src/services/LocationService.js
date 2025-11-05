// Location Service - Handles location detection and permissions
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

class LocationService {
  /**
   * Request location permission
   */
  async requestLocationPermission() {
    if (Platform.OS === 'ios') {
      // iOS permissions are handled by Info.plist and automatically requested
      return true;
    }

    // Android permission request
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'TRUE BLACK needs access to your location to show nearby stores.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      // Try high accuracy first (GPS)
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.log('High accuracy failed, trying network location...', error);
          
          // Fallback to network location (faster, less accurate)
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({
                latitude,
                longitude,
                accuracy: position.coords.accuracy,
              });
            },
            (fallbackError) => {
              console.error('Network location also failed:', fallbackError);
              reject(fallbackError);
            },
            {
              enableHighAccuracy: false,  // Network-based location
              timeout: 30000,              // 30 seconds
              maximumAge: 60000,           // Accept 1 minute old location
            }
          );
        },
        {
          enableHighAccuracy: true,  // Try GPS first
          timeout: 10000,            // Give GPS 10 seconds
          maximumAge: 10000,
        }
      );
    });
  }

  /**
   * Reverse geocode - Get address from coordinates
   * Using Google Geocoding API
   */
  async reverseGeocode(latitude, longitude) {
    try {
      // Using free OpenStreetMap Nominatim API (no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );

      const data = await response.json();

      if (data && data.address) {
        return {
          formattedAddress: data.display_name,
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          country: data.address.country || '',
          postalCode: data.address.postcode || '',
          neighborhood: data.address.suburb || data.address.neighbourhood || '',
        };
      }

      // Fallback address
      return {
        formattedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        city: 'Unknown',
        state: '',
        country: '',
        postalCode: '',
        neighborhood: '',
      };
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return {
        formattedAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        city: 'Unknown',
        state: '',
        country: '',
        postalCode: '',
        neighborhood: '',
      };
    }
  }

  /**
   * Get location with address - All in one
   */
  async getLocationWithAddress() {
    try {
      // 1. Request permission
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      // 2. Get coordinates
      const location = await this.getCurrentLocation();

      // 3. Get address
      const address = await this.reverseGeocode(location.latitude, location.longitude);

      return {
        ...location,
        ...address,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new LocationService();
