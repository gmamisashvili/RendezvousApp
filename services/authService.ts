import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiResponse, AuthResponse, User, UserLogin, UserRegistration} from '../types';

// Auth service with typed methods
const authService = {
    // Register a new user
    register: async (userData: UserRegistration): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<AuthResponse>('/auth/register', userData);

        if (response.success && response.data) {
            // Store the auth token
            await AsyncStorage.setItem('authToken', response.data.token);
        }

        return response;
    },

    login: async (credentials: UserLogin): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        if (response.success && response.data) {
            await AsyncStorage.setItem('authToken', response.data.token);
        }

        return response;
    },

    logout: async (): Promise<void> => {
        try {
            // No explicit logout endpoint in the backend, just clear the token
        } finally {
            // Clear the token from storage
            await AsyncStorage.removeItem('authToken');
        }
    },

    // Check if user is authenticated
    isAuthenticated: async (): Promise<boolean> => {
        const token = await AsyncStorage.getItem('authToken');
        return !!token;
    },

    // Get current user profile - this would need to be implemented on the backend
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        return api.get<User>('/auth/me');
    },

    // Update user profile - this would need to be implemented on the backend
    updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
        return api.put<User>('/auth/profile', userData);
    },

    // Change password - this would need to be implemented on the backend
    changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
        return api.put<void>('/auth/password', {oldPassword, newPassword});
    }
};

export default authService; 
