import api from './api';
import { ApiResponse, Photo } from '../types';

// Photo service for managing user photos
const photoService = {
    // Get all photos for the current user
    getUserPhotos: async (): Promise<ApiResponse<Photo[]>> => {
        return api.get<Photo[]>('/photo');
    },

    // Upload a new photo
    uploadPhoto: async (photoData: FormData): Promise<ApiResponse<Photo>> => {
        return api.post<Photo>('/photo', photoData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        } as any);
    },

    // Delete a photo by ID
    deletePhoto: async (photoId: number): Promise<ApiResponse<void>> => {
        return api.delete<void>(`/photo/${photoId}`);
    },

    // Set a photo as main photo
    setMainPhoto: async (photoId: number): Promise<ApiResponse<void>> => {
        return api.put<void>(`/photo/${photoId}/set-main`);
    },

    // Get a specific photo by ID
    getPhoto: async (photoId: number): Promise<ApiResponse<Photo>> => {
        return api.get<Photo>(`/photo/${photoId}`);
    },
};

export default photoService;
