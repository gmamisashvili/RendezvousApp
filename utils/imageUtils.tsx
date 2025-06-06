/**
 * Image utilities for handling safe image loading in React Native
 */
import React from 'react';
import { Image, ImageProps, View, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * Validates if a URI is a proper string and not an object
 * Fixes the common Android issue where URI becomes a ReadableNativeMap
 */
export const validateImageUri = (uri: any): string | null => {
  // Check if uri is a proper string
  if (typeof uri === 'string' && uri.trim().length > 0) {
    return uri;
  }
  
  // If it's an object, try to extract uri property (common with malformed data)
  if (typeof uri === 'object' && uri !== null) {
    if (typeof uri.uri === 'string') {
      return uri.uri;
    }
    
    // Log warning for debugging
    console.warn('Invalid image URI object:', uri);
  }
  
  return null;
};

/**
 * Creates a safe image source object for React Native Image component
 */
export const createSafeImageSource = (uri: any): { uri: string } | null => {
  const validatedUri = validateImageUri(uri);
  
  if (validatedUri) {
    return { uri: validatedUri };
  }
  
  return null;
};

interface SafeImageProps extends Omit<ImageProps, 'source'> {
  uri: any;
  fallbackStyle?: ViewStyle;
  fallbackIcon?: string;
  fallbackIconSize?: number;
  fallbackIconColor?: string;
}

/**
 * Safe Image component wrapper that handles invalid URIs gracefully
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  style,
  fallbackStyle,
  fallbackIcon = 'image',
  fallbackIconSize = 24,
  fallbackIconColor = '#ccc',
  onError,
  ...props
}) => {
  const safeSource = createSafeImageSource(uri);
  
  const handleError = (error: any) => {
    console.log('SafeImage failed to load:', uri, error);
    if (onError) {
      onError(error);
    }
  };
  
  if (!safeSource) {
    // Render fallback
    return (
      <View style={[style, fallbackStyle, { justifyContent: 'center', alignItems: 'center' }]}>
        <FontAwesome name={fallbackIcon as any} size={fallbackIconSize} color={fallbackIconColor} />
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
