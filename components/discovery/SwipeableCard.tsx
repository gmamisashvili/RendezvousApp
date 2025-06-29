import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { UserProfile } from '../../types';
import Colors from '../../constants/Colors';
import { imageCacheManager } from '../../utils/imageCacheManager';

interface SwipeableCardProps {
  user: UserProfile;
  onReport: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export interface SwipeableCardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
  reset: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const cardHeight = screenHeight * 0.7;

const SwipeableCard = forwardRef<SwipeableCardRef, SwipeableCardProps>((props, ref) => {
  const { user, onReport, onSwipeLeft, onSwipeRight } = props;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  // Photo navigation state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  
  // Preload all user photos using the cache manager
  useEffect(() => {
    if (user.photos && user.photos.length > 0) {
      setImagesPreloaded(false);
      
      // Extract URLs from Photo objects
      user.photos.sort((a, b) => a.isMain ? -1 : 1); // Ensure main photo is first
      const photoUrls = user.photos.map(photo => photo.url);
      
      imageCacheManager.preloadImages(photoUrls)
        .then(() => {
          setImagesPreloaded(true);
          console.log('✅ All user photos preloaded for:', user.name);
          console.log('📊 Cache info:', imageCacheManager.getCacheInfo());
        })
        .catch((error) => {
          console.warn('⚠️ Some photos failed to preload for:', user.name, error);
          setImagesPreloaded(true); // Still allow navigation even if some failed
        });
    }
    
    // Reset photo index when user changes
    setCurrentPhotoIndex(0);
  }, [user.photos, user.name]);
  
  const navigateToNextPhoto = () => {
    if (user.photos && user.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length);
    }
  };
  
  const navigateToPrevPhoto = () => {
    if (user.photos && user.photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length);
    }
  };
  
  const handleImageTap = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenHalf = (screenWidth - 40) / 2; // Account for margins
    
    if (locationX > screenHalf) {
      navigateToNextPhoto();
    } else {
      navigateToPrevPhoto();
    }
  };
  
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return 'Less than 1 km away';
    }
    return `${Math.round(distance)} km away`;
  };

  const animateSwipeOut = (direction: 'left' | 'right') => {
    const toValue = direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5;
    
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Call the appropriate callback after animation completes
      if (direction === 'right') {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    });
  };

  const animateReset = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }),
    ]).start();
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    swipeLeft: () => animateSwipeOut('left'),
    swipeRight: () => animateSwipeOut('right'),
    reset: () => {
      translateX.setValue(0);
      translateY.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);
      setCurrentPhotoIndex(0); // Reset photo index when card is reset
    },
  }));

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = screenWidth * 0.3;
      const velocity = Math.abs(velocityX);
      
      // Determine swipe direction
      if (Math.abs(translationX) > swipeThreshold || velocity > 1000) {
        if (translationX > 0) {
          // Right swipe (like)
          animateSwipeOut('right');
        } else {
          // Left swipe (dislike)
          animateSwipeOut('left');
        }
      } else {
        // Return to center
        animateReset();
      }
    }
  };

  // Calculate rotation based on translateX
  const rotateInterpolate = translateX.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  // Calculate like/dislike opacity
  const likeOpacity = translateX.interpolate({
    inputRange: [0, screenWidth * 0.3],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = translateX.interpolate({
    inputRange: [-screenWidth * 0.3, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateX },
              { translateY },
              { rotate: rotateInterpolate },
            ],
            opacity,
          },
        ]}
      >
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.imageContainer}>
            <TouchableOpacity 
              style={styles.imageTouch}
              onPressIn={handleImageTap}
              activeOpacity={1}
            >
              {user.photos && user.photos.length > 0 ? (
                <View style={styles.imageWrapper}>
                  <Image 
                    source={imageCacheManager.getImageSource(user.photos[currentPhotoIndex].url)}
                    style={styles.image}
                    resizeMode="cover"
                    defaultSource={require('../../assets/images/default-avatar.png')}
                    onLoad={() => {
                      if (__DEV__) {
                        console.log('🖼️ Image loaded from cache:', user.photos[currentPhotoIndex].url);
                      }
                    }}
                    onError={(error) => {
                      console.warn('❌ Failed to load image:', user.photos[currentPhotoIndex].url, error);
                    }}
                  />
                  {/* Show subtle loading indicator if images aren't preloaded yet */}
                  {!imagesPreloaded && !imageCacheManager.isImageLoaded(user.photos[currentPhotoIndex].url) && (
                    <View style={styles.imageLoadingOverlay}>
                      <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.8)" />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.placeholderImage}>
                  <FontAwesome name="user" size={100} color={Colors.disabled} />
                </View>
              )}
            </TouchableOpacity>
            
            {/* Photo indicators */}
            {user.photos && user.photos.length > 1 && (
              <View style={styles.photoIndicators}>
                {user.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoIndicator,
                      index === currentPhotoIndex && styles.activePhotoIndicator
                    ]}
                  />
                ))}
              </View>
            )}
            
            {/* Like overlay */}
            <Animated.View style={[styles.likeOverlay, { opacity: likeOpacity }]}>
              <Text style={styles.likeText}>LIKE</Text>
            </Animated.View>
            
            {/* Dislike overlay */}
            <Animated.View style={[styles.dislikeOverlay, { opacity: dislikeOpacity }]}>
              <Text style={styles.dislikeText}>PASS</Text>
            </Animated.View>
            
            {/* Report button */}
            <TouchableOpacity style={styles.reportButton} onPress={onReport}>
              <FontAwesome name="flag" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{user.name}</Text>
              {user.isVerified && (
                <FontAwesome name="check-circle" size={16} color={Colors.primary} style={styles.verifiedIcon} />
              )}
              <Text style={styles.age}>, {user.age}</Text>
            </View>
            
            <Text style={styles.distance}>{formatDistance(user.distance)}</Text>
            
            {user.bio && (
              <Text style={styles.bio} numberOfLines={3}>
                {user.bio}
              </Text>
            )}
            
            {user.interests && user.interests.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.interestsScroll}
              >
                <View style={styles.interestsContainer}>
                  {user.interests.slice(0, 5).map((interest) => (
                    <View key={interest.interestId} style={styles.interestChip}>
                      <Text style={styles.interestText}>{interest.name}</Text>
                    </View>
                  ))}
                  {user.interests.length > 5 && (
                    <View style={styles.interestChip}>
                      <Text style={styles.interestText}>+{user.interests.length - 5}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
            </View>
          </View>
        </Card>
      </Animated.View>
    </PanGestureHandler>
  );
});

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 40,
    height: cardHeight,
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: 'white',
    height: '100%',
  },
  cardContent: {
    borderRadius: 20,
    overflow: 'hidden',
    height: '100%',
  },
  imageContainer: {
    height: '100%',
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  imageTouch: {
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 5,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIndicators: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  photoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activePhotoIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(76, 217, 100, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
  },
  likeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dislikeOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 68, 88, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
  dislikeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  reportButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    flex: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  verifiedIcon: {
    marginLeft: 5,
    marginBottom: 2,
  },
  age: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: '300',
  },
  distance: {
    fontSize: 16,
    color: Colors.placeholder,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 10,
  },
  interestsScroll: {
    marginTop: 5,
  },
  interestsContainer: {
    flexDirection: 'row',
  },
  interestChip: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  interestText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
  },
  dislikeButton: {
    backgroundColor: Colors.error,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  likeButton: {
    backgroundColor: Colors.success,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default SwipeableCard;
