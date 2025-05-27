import api from './api';
import { UserProfile, SwipeResult, SwipeAction, ApiResponse } from '../types';

// Discovery service for browsing and matching with nearby users
const discoveryService = {
  // Get nearby users based on current location
  getNearbyUsers: async (
    latitude: number, 
    longitude: number, 
    radius: number = 10
  ): Promise<ApiResponse<UserProfile[]>> => {
    try {
      const result = await api.get<UserProfile[]>('/discovery/nearby', {
        params: { latitude, longitude, radius }
      });
      
      // If the API call fails due to server not running or endpoint not found
      if (!result.success && (
        result.error?.includes('404') || 
        result.error?.includes('ECONNREFUSED') ||
        result.error?.includes('Network Error') ||
        result.error?.includes('Request failed with status code 404')
      )) {
        return {
          success: false,
          error: 'Backend service is not available. Please try again later.'
        };
      }
      
      return result;
    } catch (error: any) {
      console.error('Discovery service error:', error);
      return {
        success: false,
        error: 'Backend service is not available. Please try again later.'
      };
    }
  },
  
  // Swipe action (like or dislike a user)
  swipeUser: async (
    targetUserId: number, 
    action: SwipeAction
  ): Promise<ApiResponse<SwipeResult>> => {
    return api.post<SwipeResult>('/discovery/swipe', {
      targetUserId,
      action
    });
  },
  
  // Get user profile by ID
  getUserProfile: async (userId: number): Promise<ApiResponse<UserProfile>> => {
    return api.get<UserProfile>(`/discovery/profile/${userId}`);
  },
  
  // Report a user
  reportUser: async (
    targetUserId: number, 
    reason: string
  ): Promise<ApiResponse<void>> => {
    return api.post<void>('/discovery/report', {
      targetUserId,
      reason
    });
  },
  
  // Get user's match history
  getMatches: async (): Promise<ApiResponse<UserProfile[]>> => {
    return api.get<UserProfile[]>('/discovery/matches');
  }
};

export default discoveryService;
