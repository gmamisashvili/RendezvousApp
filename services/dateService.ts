import api from './api';
import { DateRequest, Match, DateStatus, Location, MatchStatus, ApiResponse } from '../types';

// Date service with typed methods
const dateService = {
  // Create a new date request
  createDateRequest: async (request: { locationPreferences?: number[] }): Promise<ApiResponse<DateRequest>> => {
    return api.post<DateRequest>('/date/request', request);
  },
  
  // Get current user's active match
  getActiveMatch: async (): Promise<ApiResponse<Match>> => {
    return api.get<Match>('/date/active-match');
  },
  
  // Update date status
  updateDateStatus: async (matchId: number, status: string): Promise<ApiResponse<void>> => {
    return api.post<void>('/date/update-status', { matchId, status });
  },
  
  // Get location details - this would need to be implemented on the backend
  getLocationDetails: async (locationId: number): Promise<ApiResponse<Location>> => {
    return api.get<Location>(`/locations/${locationId}`);
  },
  
  // Get nearby locations - this would need to be implemented on the backend
  getNearbyLocations: async (latitude: number, longitude: number, radius: number = 5): Promise<ApiResponse<Location[]>> => {
    return api.get<Location[]>('/locations/nearby', {
      params: { latitude, longitude, radius }
    });
  },
  
  // Get date history (past matches)
  getDateHistory: async (): Promise<ApiResponse<Match[]>> => {
    return api.get<Match[]>('/matches/history');
  },
  
  // Rate a completed date
  rateDate: async (matchId: number, rating: number, feedback?: string): Promise<ApiResponse<void>> => {
    return api.post<void>(`/matches/${matchId}/rate`, { rating, feedback });
  }
};

export default dateService; 