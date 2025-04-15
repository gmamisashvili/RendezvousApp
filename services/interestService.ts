import api from './api';
import { Interest, ApiResponse } from '../types';

// Interest service with typed methods
const interestService = {
  // Get all interests
  getAllInterests: async (): Promise<ApiResponse<Interest[]>> => {
    return api.get<Interest[]>('/interests');
  },
  
  // Get all interest categories
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return api.get<string[]>('/interests/categories');
  },
  
  // Get interests by category
  getInterestsByCategory: async (category: string): Promise<ApiResponse<Interest[]>> => {
    return api.get<Interest[]>(`/interests/by-category/${category}`);
  }
};

export default interestService; 