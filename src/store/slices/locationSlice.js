import { createSlice } from '@reduxjs/toolkit';
import { STORES } from '../../data/storeMenus';

const initialState = {
  currentLocation: null,
  selectedStore: STORES[0], // Default to first store (Kompally - Soft Sand)
  stores: STORES, // All 5 stores available
  isLocationEnabled: false,
  isDetectingLocation: false,
  locationError: null,
  locationPermissionGranted: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // Location detection actions
    setLoadingLocation: (state, action) => {
      state.isDetectingLocation = action.payload;
      if (action.payload) {
        state.locationError = null;
      }
    },
    
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.isLocationEnabled = true;
      state.isDetectingLocation = false;
      state.locationError = null;
    },
    
    // Alias for setCurrentLocation (used by LocationLoginScreen)
    setUserLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.isLocationEnabled = true;
      state.isDetectingLocation = false;
      state.locationError = null;
    },
    
    setLocationError: (state, action) => {
      state.locationError = action.payload;
      state.isDetectingLocation = false;
    },
    
    setLocationPermission: (state, action) => {
      state.locationPermissionGranted = action.payload;
    },
    
    // Store selection actions
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
      console.log('✅ Store changed to:', action.payload.name, '-', action.payload.spaceName);
    },
    
    setSelectedStoreById: (state, action) => {
      const storeId = action.payload;
      const store = state.stores.find(s => s.id === storeId);
      if (store) {
        state.selectedStore = store;
        console.log('✅ Store changed to:', store.name, '-', store.spaceName);
      }
    },
    
    // Find nearest store based on coordinates
    setNearestStore: (state, action) => {
      const { latitude, longitude } = action.payload;
      
      // Calculate distance to each store
      const storesWithDistance = state.stores.map(store => {
        const distance = calculateDistance(
          latitude,
          longitude,
          store.latitude,
          store.longitude
        );
        return { ...store, distance };
      });
      
      // Sort by distance and select nearest
      storesWithDistance.sort((a, b) => a.distance - b.distance);
      const nearestStore = storesWithDistance[0];
      
      state.selectedStore = nearestStore;
      console.log('✅ Nearest store:', nearestStore.name, '-', nearestStore.spaceName);
    },
    
    clearLocation: (state) => {
      state.currentLocation = null;
      state.isLocationEnabled = false;
      state.isDetectingLocation = false;
      state.locationError = null;
      state.locationPermissionGranted = false;
    },
  },
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

export const { 
  setLoadingLocation,
  setCurrentLocation,
  setUserLocation,
  setLocationError,
  setLocationPermission,
  setSelectedStore, 
  setSelectedStoreById,
  setNearestStore,
  clearLocation 
} = locationSlice.actions;

export default locationSlice.reducer;
