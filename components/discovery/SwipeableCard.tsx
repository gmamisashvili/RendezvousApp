import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import Colors from '../../constants/Colors';

interface SwipeableCardProps {
  user: UserProfile;
  onLike: () => void;
  onDislike: () => void;
  onReport: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const cardHeight = screenHeight * 0.7;

const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  user, 
  onLike, 
  onDislike, 
  onReport 
}) => {
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return 'Less than 1 km away';
    }
    return `${Math.round(distance)} km away`;
  };

  return (
    <Card style={styles.container}>
      <View style={styles.imageContainer}>
        {user.photos && user.photos.length > 0 ? (
          <Image 
            source={{ uri: user.photos[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="user" size={100} color={Colors.disabled} />
          </View>
        )}
        
        {/* Overlay gradient */}
        <View style={styles.overlay} />
        
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

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.dislikeButton} onPress={onDislike}>
          <FontAwesome name="times" size={30} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={onLike}>
          <FontAwesome name="heart" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 40,
    height: cardHeight,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    bottom: 80,
    left: 20,
    right: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  verifiedIcon: {
    marginLeft: 5,
    marginBottom: 2,
  },
  age: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
  },
  distance: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: 'white',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  interestText: {
    color: 'white',
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
