import { createSlice } from '@reduxjs/toolkit';

// Store locations with GPS coordinates
const STORES = [
  {
    id: 1,
    name: 'Kokapet',
    area: 'Kokapet',
    address: 'Financial District, Kokapet, Hyderabad',
    latitude: 17.4239,
    longitude: 78.3461,
    radius: 0.5, // km - radius for "at store" check
    phone: '+91 98765 43210',
    hours: '7:00 AM - 11:00 PM',
  },
  {
    id: 2,
    name: 'Kompally',
    area: 'Kompally',
    address: 'Kompally Main Road, Hyderabad',
    latitude: 17.5483,
    longitude: 78.4891,
    radius: 0.5,
    phone: '+91 98765 43211',
    hours: '7:00 AM - 10:00 PM',
  },
  {
    id: 3,
    name: 'Banjara Hills',
    area: 'Banjara Hills',
    address: 'Road No. 12, Banjara Hills, Hyderabad',
    latitude: 17.4126,
    longitude: 78.4479,
    radius: 0.5,
    phone: '+91 98765 43212',
    hours: '7:00 AM - 11:00 PM',
  },
  {
    id: 4,
    name: 'Jubilee Hills',
    area: 'Jubilee Hills',
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    latitude: 17.4336,
    longitude: 78.4067,
    radius: 0.5,
    phone: '+91 98765 43213',
    hours: '6:30 AM - 11:30 PM',
  },
];

const initialState = {
  // User's current GPS location
  userLocation: null,
  userLatitude: null,
  userLongitude: null,
  
  // Selected store
  selectedStore: STORES[0], // Default to first store
  
  // Available stores
  availableStores: STORES,
  
  // Location status
  isAtStore: false, // Is user physically at selected store?
  distanceToStore: null, // Distance in km
  
  // Loading states
  isLoadingLocation: false,
  locationError: null,
  locationPermission: null, // 'granted', 'denied', 'prompt'
};

// Helper: Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // Set user's GPS location
    setUserLocation: (state, action) => {
      const { latitude, longitude } = action.payload;
      state.userLatitude = latitude;
      state.userLongitude = longitude;
      state.userLocation = action.payload;
      
      // Calculate distance to selected store
      if (state.selectedStore) {
        const distance = calculateDistance(
          latitude,
          longitude,
          state.selectedStore.latitude,
          state.selectedStore.longitude
        );
        state.distanceToStore = distance;
        state.isAtStore = distance <= state.selectedStore.radius;
      }
    },
    
    // Select a store
    setSelectedStore: (state, action) => {
      const store = state.availableStores.find(s => s.id === action.payload);
      if (store) {
        state.selectedStore = store;
        
        // Recalculate distance if user location known
        if (state.userLatitude && state.userLongitude) {
          const distance = calculateDistance(
            state.userLatitude,
            state.userLongitude,
            store.latitude,
            store.longitude
          );
          state.distanceToStore = distance;
          state.isAtStore = distance <= store.radius;
        }
      }
    },
    
    // Set loading state
    setLoadingLocation: (state, action) => {
      state.isLoadingLocation = action.payload;
    },
    
    // Set location error
    setLocationError: (state, action) => {
      state.locationError = action.payload;
      state.isLoadingLocation = false;
    },
    
    // Set location permission
    setLocationPermission: (state, action) => {
      state.locationPermission = action.payload;
    },
    
    // Clear location error
    clearLocationError: (state) => {
      state.locationError = null;
    },
    
    // Force refresh location
    refreshLocation: (state) => {
      state.isLoadingLocation = true;
    },
  },
});

export const {
  setUserLocation,
  setSelectedStore,
  setLoadingLocation,
  setLocationError,
  setLocationPermission,
  clearLocationError,
  refreshLocation,
} = locationSlice.actions;

export default locationSlice.reducer;

// Selectors
export const selectUserLocation = (state) => state.location.userLocation;
export const selectSelectedStore = (state) => state.location.selectedStore;
export const selectAvailableStores = (state) => state.location.availableStores;
export const selectIsAtStore = (state) => state.location.isAtStore;
export const selectDistanceToStore = (state) => state.location.distanceToStore;
