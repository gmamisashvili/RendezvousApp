import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { discoveryService } from '../../services';
import { UserProfile } from '../../types';
import SafeImage from '../../utils/SafeImage';
import { imageCacheManager } from '../../utils/imageCacheManager';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await discoveryService.getMatches();
      
      if (response.success && response.data) {
        setMatches(response.data);
        
        // Preload images for better user experience
        const imageUrls = response.data
          .filter(match => match.photos && match.photos.length > 0)
          .map(match => match.photos.find(photo => photo.isMain)?.url || match.photos[0].url)
          .filter(url => url); // Filter out any undefined or null URLs
        
        if (imageUrls.length > 0) {
          imageCacheManager.preloadImages(imageUrls)
            .catch(error => console.warn('Failed to preload some match images:', error));
        }
      } else {
        console.error('Failed to fetch matches:', response.error);
        setMatches([]);
      }
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  }, [fetchMatches]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const renderMatch = ({ item }: { item: UserProfile }) => {
    // Use image cache manager for better performance
    const imageSource = item.photos.find(photo => photo.isMain) ? 
      imageCacheManager.getImageSource(item.photos.find(photo => photo.isMain)?.url || item.photos[0].url) : 
      null;

    return (
      <TouchableOpacity 
        style={styles.matchCard}
        onPress={() => {
          // TODO: Implement navigation to match details
        }}
      >
        <SafeImage 
          uri={imageSource?.uri || null}
          style={styles.matchPhoto}
          fallbackIcon="user"
          fallbackIconSize={30}
          fallbackIconColor={Colors.disabled}
        />
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.name}</Text>
          <Text style={styles.matchAge}>{item.age} years old</Text>
          <Text style={styles.matchDistance}>{item.distance}km away</Text>
        </View>
        <View style={styles.matchActions}>
          <FontAwesome name='info' size={24} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="heart-o" size={80} color={Colors.disabled} />
      <Text style={styles.emptyTitle}>No Matches Yet</Text>
      <Text style={styles.emptyText}>
        Keep swiping to find people you both like!
      </Text>
      <TouchableOpacity 
        style={styles.discoverButton}
        onPress={() => {
          router.push('/(tabs)/dashboard');
        }}
      >
        <Text style={styles.discoverButtonText}>Start Discovering</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Matches',
            headerShown: true,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Matches',
          headerShown: true,
        }}
      />
      
      <View style={styles.content}>
        {matches.length > 0 ? (
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={(item) => item.userId.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
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
  listContainer: {
    padding: 16,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  matchAge: {
    fontSize: 14,
    color: Colors.placeholder,
    marginBottom: 2,
  },
  matchDistance: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  matchActions: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.placeholder,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  discoverButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  discoverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
