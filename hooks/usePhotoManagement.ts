import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { photoService } from '../services';
import { Photo } from '../types';

interface UsePhotoManagementReturn {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  uploadPhoto: () => Promise<void>;
  deletePhoto: (photoId: number) => Promise<void>;
  setMainPhoto: (photoId: number) => Promise<void>;
  refreshPhotos: () => Promise<void>;
}

export const usePhotoManagement = (): UsePhotoManagementReturn => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to sort photos - main photo first, then by date added (newest first)
  const sortPhotos = useCallback((photosToSort: Photo[]): Photo[] => {
    return [...photosToSort].sort((a, b) => {
      // Main photo always comes first
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      
      // If both are main or both are not main, sort by date (newest first)
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
  }, []);

  const refreshPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await photoService.getUserPhotos();
      
      if (response.success && response.data) {
        setPhotos(sortPhotos(response.data));
      } else {
        setError(response.error || 'Failed to load photos');
      }
    } catch (err) {
      setError('Failed to load photos');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Sorry, we need camera roll permissions to upload photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const uploadPhoto = useCallback(async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        setError(null);

        const asset = result.assets[0];
        const formData = new FormData();
        
        // Create file object for upload
        const fileExtension = asset.uri.split('.').pop() || 'jpg';
        const fileName = `photo_${Date.now()}.${fileExtension}`;
        
        formData.append('file', {
          uri: asset.uri,
          type: `image/${fileExtension}`,
          name: fileName,
        } as any);

        const response = await photoService.uploadPhoto(formData);
        
        if (response.success && response.data) {
          setPhotos(prev => sortPhotos([...prev, response.data!]));
          Alert.alert('Success', 'Photo uploaded successfully!');
        } else {
          setError(response.error || 'Failed to upload photo');
          Alert.alert('Error', response.error || 'Failed to upload photo');
        }
      }
    } catch (err) {
      setError('Failed to upload photo');
      Alert.alert('Error', 'Failed to upload photo');
      console.error('Error uploading photo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePhoto = useCallback(async (photoId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await photoService.deletePhoto(photoId);
      
      if (response.success) {
        setPhotos(prev => sortPhotos(prev.filter(photo => photo.photoId !== photoId)));
        Alert.alert('Success', 'Photo deleted successfully!');
      } else {
        setError(response.error || 'Failed to delete photo');
        Alert.alert('Error', response.error || 'Failed to delete photo');
      }
    } catch (err) {
      setError('Failed to delete photo');
      Alert.alert('Error', 'Failed to delete photo');
      console.error('Error deleting photo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setMainPhoto = useCallback(async (photoId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await photoService.setMainPhoto(photoId);
      
      if (response.success) {
        // Update local state to reflect the main photo change and sort photos
        setPhotos(prev => sortPhotos(prev.map(photo => ({
          ...photo,
          isMain: photo.photoId === photoId
        }))));
        Alert.alert('Success', 'Main photo updated successfully!');
      } else {
        setError(response.error || 'Failed to set main photo');
        Alert.alert('Error', response.error || 'Failed to set main photo');
      }
    } catch (err) {
      setError('Failed to set main photo');
      Alert.alert('Error', 'Failed to set main photo');
      console.error('Error setting main photo:', err);
    } finally {
      setLoading(false);
    }
  }, []);



  return {
    photos,
    loading,
    error,
    uploadPhoto,
    deletePhoto,
    setMainPhoto,
    refreshPhotos,
  };
};
