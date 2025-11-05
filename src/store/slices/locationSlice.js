// Redux Slice - Location
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  selectedLocation: null,
  isDetecting: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setDetectingLocation: (state, action) => {
      state.isDetecting = action.payload;
      state.error = null;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.selectedLocation = action.payload;
      state.isDetecting = false;
      state.error = null;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setLocationError: (state, action) => {
      state.error = action.payload;
      state.isDetecting = false;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
    clearLocation: (state) => {
      state.currentLocation = null;
      state.selectedLocation = null;
      state.isDetecting = false;
      state.error = null;
    },
  },
});

export const {
  setDetectingLocation,
  setCurrentLocation,
  setSelectedLocation,
  setLocationError,
  clearLocationError,
  clearLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
