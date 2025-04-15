import * as Location from 'expo-location';
import api from './api';
import { UserLocation, ApiResponse } from '../types';

// Location permission result type
export type LocationPermissionResult = {
  granted: boolean;
  error?: string;
};

// Current location result type
export type CurrentLocationResult = {
  success: boolean;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number | undefined;
  };
  error?: string;
};

// Location service with typed methods
const locationService = {
  // Request location permissions
  requestPermissions: async (): Promise<LocationPermissionResult> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return {
        granted: status === 'granted',
        error: status !== 'granted' ? 'Permission to access location was denied' : undefined
      };
    } catch (error: any) {
      return {
        granted: false,
        error: error.message || 'Failed to request location permissions'
      };
    }
  },
  
  // Get current location
  getCurrentLocation: async (): Promise<CurrentLocationResult> => {
    try {
      const { granted } = await locationService.requestPermissions();
      
      if (!granted) {
        return {
          success: false,
          error: 'Location permission not granted'
        };
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      return {
        success: true,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get current location'
      };
    }
  },
  
  // Update user location on the server
  updateUserLocation: async (): Promise<ApiResponse<UserLocation>> => {
    try {
      const locationResult = await locationService.getCurrentLocation();
      
      if (!locationResult.success || !locationResult.location) {
        return {
          success: false,
          error: locationResult.error || 'Failed to get location'
        };
      }
      
      const { latitude, longitude } = locationResult.location;
      
      // This endpoint would need to be implemented on the backend
      return api.post<UserLocation>('/user/location', {
        latitude,
        longitude
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update user location'
      };
    }
  },
  
  // Calculate distance between two coordinates in kilometers
  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }
};

export default locationService; 