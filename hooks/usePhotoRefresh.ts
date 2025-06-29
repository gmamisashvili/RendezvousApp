import { useCallback } from 'react';
import { photoService } from '../services';

/**
 * Hook for refreshing expired photo URLs
 */
export const usePhotoRefresh = () => {
  const refreshPhotoUrl = useCallback(async (photoId: number): Promise<string | null> => {
    try {
      const response = await photoService.refreshPhotoUrl(photoId);
      if (response.success && response.data) {
        return response.data;
      } else {
        console.warn('Failed to refresh photo URL:', response.error);
        return null;
      }
    } catch (error) {
      console.warn('Error refreshing photo URL:', error);
      return null;
    }
  }, []);

  return { refreshPhotoUrl };
};

export default usePhotoRefresh;
