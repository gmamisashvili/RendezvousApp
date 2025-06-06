import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { usePhotoManagement } from '../../hooks';
import { Photo } from '../../types';
import Colors from '../../constants/Colors';
import { SafeImage, validateImageUri } from '../../utils/imageUtils';

interface PhotoManagementProps {
  onPhotosChanged?: (photos: Photo[]) => void;
}

export default function PhotoManagement({ onPhotosChanged }: PhotoManagementProps) {
  const {
    photos,
    loading,
    error,
    uploadPhoto,
    deletePhoto,
    setMainPhoto,
    refreshPhotos,
  } = usePhotoManagement();

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    refreshPhotos();
  }, [refreshPhotos]);

  useEffect(() => {
    if (onPhotosChanged) {
      onPhotosChanged(photos);
    }
  }, [photos, onPhotosChanged]);

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleDeletePhoto = (photo: Photo) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePhoto(photo.photoId),
        },
      ]
    );
  };

  const handleSetMainPhoto = (photo: Photo) => {
    Alert.alert(
      'Set Main Photo',
      'Set this as your main profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Main',
          onPress: () => setMainPhoto(photo.photoId),
        },
      ]
    );
  };



  const renderPhotoModal = () => {
    if (!selectedPhoto) return null;

    return (
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Photo Options</Text>
              <TouchableOpacity
                onPress={() => setSelectedPhoto(null)}
                style={styles.closeButton}
              >
                <FontAwesome name="times" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <SafeImage 
              uri={selectedPhoto.url}
              style={styles.modalImage}
              fallbackStyle={{ backgroundColor: Colors.background }}
              fallbackIcon="image"
              fallbackIconSize={48}
              fallbackIconColor={Colors.disabled}
            />

            {selectedPhoto.isMain && (
              <View style={styles.mainPhotoIndicator}>
                <FontAwesome name="star" size={16} color={Colors.primary} />
                <Text style={styles.mainPhotoText}>Main Photo</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              {!selectedPhoto.isMain && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => handleSetMainPhoto(selectedPhoto)}
                >
                  <FontAwesome name="star" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Set as Main</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={() => handleDeletePhoto(selectedPhoto)}
              >
                <FontAwesome name="trash" size={16} color="white" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshPhotos}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.photosGrid}>
        {photos.map((photo) => {
          // Validate photo URL before rendering
          const validatedUri = validateImageUri(photo.url);
          if (!validatedUri) {
            console.warn('Invalid photo URL, skipping:', photo);
            return null;
          }
          
          return (
            <TouchableOpacity
              key={photo.photoId}
              style={styles.photoItem}
              onPress={() => handlePhotoPress(photo)}
            >
              <SafeImage 
                uri={photo.url}
                style={styles.photoThumbnail}
                fallbackStyle={{ backgroundColor: Colors.background }}
                fallbackIcon="image"
                fallbackIconColor={Colors.disabled}
              />
              {photo.isMain && (
                <View style={styles.mainBadge}>
                  <FontAwesome name="star" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {photos.length < 6 && (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={uploadPhoto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <FontAwesome name="plus" size={24} color={Colors.primary} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {photos.length === 0 && !loading && (
        <Text style={styles.noPhotosText}>
          No photos added yet. Add your first photo to get started!
        </Text>
      )}

      {renderPhotoModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  photoItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  mainBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  addPhotoText: {
    color: Colors.primary,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  noPhotosText: {
    color: Colors.placeholder,
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  mainPhotoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainPhotoText: {
    marginLeft: 8,
    color: Colors.primary,
    fontWeight: '500',
  },
  modalActions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});
