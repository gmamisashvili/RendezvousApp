import React, { useState, useCallback } from 'react';
import { Image, View, ActivityIndicator, ImageProps } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ImageUrlRefreshManager } from './ImageUrlRefreshManager';

interface SafeImageProps extends Omit<ImageProps, 'source'> {
  uri?: string | null;
  fallbackIcon?: string;
  fallbackIconSize?: number;
  fallbackIconColor?: string;
  fallbackStyle?: object;
  photoId?: number; // Optional photo ID for refreshing expired URLs
  onRefresh?: (photoId: number) => Promise<string | null>; // Callback to refresh URL
}

/**
 * Validates and extracts proper URI strings from various input types
 */
export const validateImageUri = (uri: any): string | null => {
  if (!uri) return null;
  
  // If it's already a string, validate it
  if (typeof uri === 'string') {
    const trimmed = uri.trim();
    if (!trimmed) return null;
    
    // Check for valid URL formats
    if (trimmed.startsWith('http://') || 
        trimmed.startsWith('https://') ||
        trimmed.startsWith('file://') ||
        trimmed.startsWith('data:image/') ||
        trimmed.startsWith('/')) {
      return trimmed;
    }
  }
  
  // If it's an object (ReadableNativeMap), try to extract uri property
  if (typeof uri === 'object' && uri.uri && typeof uri.uri === 'string') {
    return validateImageUri(uri.uri);
  }
  
  return null;
};

/**
 * Creates a safe image source object for React Native Image component
 */
export const createSafeImageSource = (uri: any) => {
  const validUri = validateImageUri(uri);
  if (!validUri) return null;
  
  return { uri: validUri };
};

/**
 * SafeImage component that handles URI validation, error handling, and automatic refresh for expired URLs
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  style,
  fallbackIcon = 'image',
  fallbackIconSize = 32,
  fallbackIconColor = Colors.disabled,
  fallbackStyle,
  photoId,
  onRefresh,
  onError,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedUri, setRefreshedUri] = useState<string | null>(null);

  const currentUri = refreshedUri || uri;
  const safeSource = createSafeImageSource(currentUri);

  const handleError = useCallback(async (error?: any) => {
    console.warn('Image load error:', error);
    setImageError(true);

    // If we have a photoId and refresh callback, try to refresh the URL
    if (photoId && onRefresh && !refreshing) {
      setRefreshing(true);
      try {
        const newUrl = await onRefresh(photoId);
        if (newUrl && newUrl !== currentUri) {
          setRefreshedUri(newUrl);
          setImageError(false); // Reset error state to try again
        }
      } catch (refreshError) {
        console.warn('Failed to refresh image URL:', refreshError);
      } finally {
        setRefreshing(false);
      }
    } else if (currentUri && ImageUrlRefreshManager.isExpiredAzureUrl(currentUri) && !refreshing) {
      // Try to refresh expired Azure SAS URL
      setRefreshing(true);
      try {
        const newUrl = await ImageUrlRefreshManager.refreshExpiredUrl(currentUri);
        if (newUrl && newUrl !== currentUri) {
          setRefreshedUri(newUrl);
          setImageError(false); // Reset error state to try again
          console.log('Successfully refreshed expired Azure URL');
        } else {
          console.warn('Could not refresh expired Azure URL - photo ID not found in URL');
        }
      } catch (refreshError) {
        console.warn('Failed to refresh expired Azure URL:', refreshError);
      } finally {
        setRefreshing(false);
      }
    }

    // Call original onError if provided
    if (onError) {
      onError(error);
    }
  }, [photoId, onRefresh, refreshing, currentUri, onError]);

  // Show loading indicator while refreshing
  if (refreshing) {
    return (
      <View style={[style, fallbackStyle, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  // Show fallback if no valid source or error occurred
  if (!safeSource || imageError) {
    return (
      <View style={[style, fallbackStyle, { justifyContent: 'center', alignItems: 'center' }]}>
        <FontAwesome 
          name={fallbackIcon as any} 
          size={fallbackIconSize} 
          color={fallbackIconColor} 
        />
      </View>
    );
  }

  return (
    <Image
      {...props}
      source={safeSource}
      style={style}
      onError={handleError}
    />
  );
};

export default SafeImage;
