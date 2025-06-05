import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { DEVELOPMENT_CONFIG } from '../config/development';

// Get the IP address for development
const getApiBaseUrl = () => {
  if (__DEV__) {
    // If manual IP is set, use it (works for both physical devices and emulators)
    if (DEVELOPMENT_CONFIG.COMPUTER_IP) {
      return `http://${DEVELOPMENT_CONFIG.COMPUTER_IP}:${DEVELOPMENT_CONFIG.API_PORT}/api`;
    }
    
    // For Android emulator, use the special IP that maps to host localhost
    if (Platform.OS === 'android' && !Constants.isDevice) {
      return `http://10.0.2.2:${DEVELOPMENT_CONFIG.API_PORT}/api`;
    }
    
    // For iOS simulator, use localhost
    if (Platform.OS === 'ios' && !Constants.isDevice) {
      return `http://localhost:${DEVELOPMENT_CONFIG.API_PORT}/api`;
    }
    
    // Try to get from expo manifest for physical devices
    const manifest = Constants.expoConfig;
    if (manifest?.hostUri) {
      const debuggerHost = manifest.hostUri.split(':')[0];
      return `http://${debuggerHost}:${DEVELOPMENT_CONFIG.API_PORT}/api`;
    }
    
    // Fallback for development
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${DEVELOPMENT_CONFIG.API_PORT}/api`;
    } else {
      return `http://localhost:${DEVELOPMENT_CONFIG.API_PORT}/api`;
    }
  }
  
  // Production URL would go here
  return 'https://your-production-api.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL for debugging
if (DEVELOPMENT_CONFIG.DEBUG_API) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Platform:', Platform.OS);
  console.log('Is Device:', Constants.isDevice);
}

// Create a typed Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error accessing token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle global error responses (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      // For now, just log the error
      console.error('Unauthorized access. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Generic API request function with type safety
export const apiRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  config?: Partial<InternalAxiosRequestConfig>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await apiClient({
      method,
      url,
      data,
      ...config,
    });

    return {
      success: true,
      data: response.data as T,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

// Export typed API methods
export const api = {
  get: <T>(url: string, config?: Partial<InternalAxiosRequestConfig>) => 
    apiRequest<T>('GET', url, undefined, config),
  post: <T>(url: string, data?: any, config?: Partial<InternalAxiosRequestConfig>) => 
    apiRequest<T>('POST', url, data, config),
  put: <T>(url: string, data?: any, config?: Partial<InternalAxiosRequestConfig>) => 
    apiRequest<T>('PUT', url, data, config),
  delete: <T>(url: string, config?: Partial<InternalAxiosRequestConfig>) => 
    apiRequest<T>('DELETE', url, undefined, config),
};

export default api; 