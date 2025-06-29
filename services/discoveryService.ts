import api from './api';
import photoService from './photoService';
import { UserProfile, SwipeResult, SwipeAction, ApiResponse } from '../types';

// Discovery service for browsing and matching with nearby users
const discoveryService = {
  // Helper function to load photos for users
  loadPhotosForUsers: async (users: UserProfile[]): Promise<UserProfile[]> => {
    const usersWithPhotos = await Promise.all(
      users.map(async (user) => {
        try {
          const photosResult = await photoService.getUserPhotosByUserId(user.userId);
          return {
            ...user,
            photos: photosResult.success ? photosResult.data || [] : []
          };
        } catch (error) {
          console.error(`Failed to load photos for user ${user.userId}:`, error);
          return {
            ...user,
            photos: []
          };
        }
      })
    );
    return usersWithPhotos;
  },

  // Get nearby users based on current location
  getNearbyUsers: async (
    latitude: number, 
    longitude: number, 
    radius: number = 10,
    minAge?: number,
    maxAge?: number
  ): Promise<ApiResponse<UserProfile[]>> => {
    try {
      // Build query parameters for the API request
      const params: any = { 
        latitude, 
        longitude, 
        radius 
      };
      
      if (minAge !== undefined) params.minAge = minAge;
      if (maxAge !== undefined) params.maxAge = maxAge;

      const result = await api.get<UserProfile[]>('/discovery/nearby', {
        params
      });
      
      if (__DEV__) {
        console.log('Discovery API call:', {
          url: '/discovery/nearby',
          params,
          success: result.success,
          dataLength: result.data?.length || 0,
          error: result.error
        });
      }
      
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
      
      // If we got users, load their photos separately
      if (result.success && result.data) {
        const usersWithPhotos = await discoveryService.loadPhotosForUsers(result.data);
        return {
          ...result,
          data: usersWithPhotos
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
    try {
      const result = await api.get<UserProfile>(`/discovery/profile/${userId}`);
      
      // If we got a user profile, load photos separately
      if (result.success && result.data) {
        const photosResult = await photoService.getUserPhotosByUserId(result.data.userId);
        const userWithPhotos = {
          ...result.data,
          photos: photosResult.success ? photosResult.data || [] : []
        };
        return {
          ...result,
          data: userWithPhotos
        };
      }
      
      return result;
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: 'Failed to load user profile.'
      };
    }
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
    try {
      const result = await api.get<UserProfile[]>('/discovery/matches');
      
      // If we got matches, load their photos separately
      if (result.success && result.data) {
        const matchesWithPhotos = await discoveryService.loadPhotosForUsers(result.data);
        return {
          ...result,
          data: matchesWithPhotos
        };
      }
      
      return result;
    } catch (error: any) {
      console.error('Get matches error:', error);
      return {
        success: false,
        error: 'Failed to load matches.'
      };
    }
  }
};

export default discoveryService;
