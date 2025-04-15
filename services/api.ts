import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = 'http://localhost:5166/api';

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