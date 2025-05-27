import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  Alert,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import SwipeableCard from '../../components/discovery/SwipeableCard';
import MatchModal from '../../components/discovery/MatchModal';
import EmptyState from '../../components/discovery/EmptyState';
import DiscoverySettingsModal, { DiscoverySettings } from '../../components/discovery/DiscoverySettingsModal';
import Colors from '../../constants/Colors';
import { locationService, discoveryService } from '../../services';
import { UserProfile, SwipeAction } from '../../types';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [matchModal, setMatchModal] = useState<{ visible: boolean; userName: string }>({
    visible: false,
    userName: ''
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [settingsModal, setSettingsModal] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [discoverySettings, setDiscoverySettings] = useState<DiscoverySettings>({
    maxDistance: 10,
    ageRange: { min: 18, max: 35 },
    showMeToMen: true,
    showMeToWomen: true,
  });

  const getCurrentLocation = useCallback(async () => {
    try {
      setLocationError(null);
      const locationResult = await locationService.getCurrentLocation();
      
      if (locationResult.success && locationResult.location) {
        setLocation(locationResult.location);
        
        // Update user location on server
        await locationService.updateUserLocation();
        
        return locationResult.location;
      } else {
        setLocationError(locationResult.error || 'Failed to get location');
        return null;
      }
    } catch (error: any) {
      setLocationError(error.message || 'Location access error');
      return null;
    }
  }, []);

  const fetchNearbyUsers = useCallback(async (userLocation?: { latitude: number; longitude: number }) => {
    try {
      setLoading(true);
      setBackendError(null); // Clear previous errors
      
      let currentLocation = userLocation || location;
      if (!currentLocation) {
        const newLocation = await getCurrentLocation();
        if (!newLocation) {
          return;
        }
        setLocation(newLocation);
        currentLocation = newLocation;
      }

      const response = await discoveryService.getNearbyUsers(
        currentLocation.latitude,
        currentLocation.longitude,
        10 // 10km radius
      );

      if (response.success && response.data) {
        // Users already have age calculated from backend
        setUsers(response.data);
        setCurrentUserIndex(0);
        setBackendError(null);
      } else {
        console.error('Failed to fetch nearby users:', response.error);
        
        // Check if it's a backend unavailable error
        if (response.error?.includes('Backend service is not available')) {
          setBackendError(response.error);
          setUsers([]);
          return;
        }
        
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching nearby users:', error);
      setBackendError('Something went wrong. Please try again later.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    const initializeScreen = async () => {
      const userLocation = await getCurrentLocation();
      if (userLocation) {
        await fetchNearbyUsers(userLocation);
      }
    };

    initializeScreen();
  }, []); // Empty dependency array - only run once on mount

  const handleSwipe = async (action: SwipeAction) => {
    const currentUser = users[currentUserIndex];
    if (!currentUser) return;

    // Add haptic feedback
    if (action === 'like') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const response = await discoveryService.swipeUser(currentUser.userId, action);
      
      if (response.success && response.data) {
        // Check if it's a match
        if (response.data.match && action === 'like') {
          // Extra haptic feedback for matches
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setMatchModal({
            visible: true,
            userName: currentUser.name
          });
        }
        
        // Move to next user
        setCurrentUserIndex(prev => prev + 1);
      } else {
        Alert.alert('Error', response.error || 'Failed to process swipe');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
  };

  const handleLike = () => handleSwipe('like');
  const handleDislike = () => handleSwipe('dislike');

  const handleReport = () => {
    const currentUser = users[currentUserIndex];
    if (!currentUser) return;

    Alert.alert(
      'Report User',
      'Why are you reporting this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Inappropriate Content', 
          onPress: () => reportUser(currentUser.userId, 'inappropriate_content') 
        },
        { 
          text: 'Fake Profile', 
          onPress: () => reportUser(currentUser.userId, 'fake_profile') 
        },
        { 
          text: 'Harassment', 
          onPress: () => reportUser(currentUser.userId, 'harassment') 
        },
      ],
      { cancelable: true }
    );
  };

  const reportUser = async (userId: number, reason: string) => {
    try {
      const response = await discoveryService.reportUser(userId, reason);
      if (response.success) {
        Alert.alert('Reported', 'Thank you for your report. We will review it shortly.');
        setCurrentUserIndex(prev => prev + 1);
      } else {
        Alert.alert('Error', response.error || 'Failed to submit report');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
  };

  const handleRefresh = () => {
    fetchNearbyUsers();
  };

  const handleOpenSettings = () => {
    setSettingsModal(true);
  };

  const handleSaveSettings = (newSettings: DiscoverySettings) => {
    setDiscoverySettings(newSettings);
    // Refetch users with new settings
    fetchNearbyUsers();
  };

  const currentUser = users[currentUserIndex];
  const hasMoreUsers = currentUserIndex < users.length;

  if (locationError) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Discover',
            headerShown: true,
          }}
        />
        <View style={styles.errorContainer}>
          <FontAwesome name="location-arrow" size={80} color={Colors.disabled} />
          <Text style={styles.errorTitle}>Location Required</Text>
          <Text style={styles.errorText}>
            We need your location to show you nearby people. Please enable location access and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
            <Text style={styles.retryButtonText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Discover',
            headerShown: true,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding people near you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Stack.Screen
        options={{
          title: 'Discover',
          headerShown: true,
        }}
      />
      
      <View style={styles.content}>
        {hasMoreUsers && currentUser ? (
          <View style={styles.cardContainer}>
            <SwipeableCard
              user={currentUser}
              onLike={handleLike}
              onDislike={handleDislike}
              onReport={handleReport}
            />
            
            {/* Show next card in background if available */}
            {users[currentUserIndex + 1] && (
              <View style={styles.nextCardContainer}>
                <SwipeableCard
                  user={users[currentUserIndex + 1]}
                  onLike={() => {}}
                  onDislike={() => {}}
                  onReport={() => {}}
                />
              </View>
            )}
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.dislikeActionButton]} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleDislike();
                }}
              >
                <FontAwesome name="times" size={32} color="#FF4458" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.superLikeButton]} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  // TODO: Implement super like functionality
                  handleLike();
                }}
              >
                <FontAwesome name="star" size={24} color="#1EC71E" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.likeActionButton]} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleLike();
                }}
              >
                <FontAwesome name="heart" size={28} color="#FF4458" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <EmptyState 
            onRefresh={handleRefresh} 
            onOpenSettings={handleOpenSettings}
            isLoading={loading}
            errorMessage={backendError}
          />
        )}
      </View>

      <MatchModal
        visible={matchModal.visible}
        userName={matchModal.userName}
        onClose={() => setMatchModal({ visible: false, userName: '' })}
        // You can add onSendMessage prop here if you implement messaging
      />

      <DiscoverySettingsModal
        visible={settingsModal}
        onClose={() => setSettingsModal(false)}
        onSave={handleSaveSettings}
        currentSettings={discoverySettings}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
    zIndex: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 30,
    gap: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dislikeActionButton: {
    backgroundColor: 'white',
  },
  superLikeButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeActionButton: {
    backgroundColor: 'white',
  },
});
