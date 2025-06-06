import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import ProfileForm from '../../components/profile/ProfileForm';
import PhotoManagement from '../../components/profile/PhotoManagement';
import LogoutButton from '../../components/profile/LogoutButton';
import Colors from '../../constants/Colors';
import { useAuth } from '../../store';
import { Photo } from '../../types';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [photosExpanded, setPhotosExpanded] = useState(false);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);

  if (!user) {
    return null;
  }

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handlePhotosChanged = (photos: Photo[]) => {
    setUserPhotos(photos);
  };

  // Get main photo URL from Photo objects
  const getMainPhotoUrl = (): string | null => {
    // First check for main photo from userPhotos (Photo objects)
    const mainPhoto = userPhotos.find(photo => photo.isMain);
    if (mainPhoto?.url && typeof mainPhoto.url === 'string') {
      return mainPhoto.url;
    }
    
    // Then check for any photo from userPhotos
    const firstPhoto = userPhotos[0];
    if (firstPhoto?.url && typeof firstPhoto.url === 'string') {
      return firstPhoto.url;
    }
    
    // Finally check user.photos (string array) as fallback
    const fallbackPhoto = user.photos?.[0];
    if (fallbackPhoto && typeof fallbackPhoto === 'string') {
      return fallbackPhoto;
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'My Profile',
          headerShown: true,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.photoContainer}>
              {getMainPhotoUrl() ? (
                <Image 
                  source={{ uri: getMainPhotoUrl()! }}
                  style={styles.profilePhoto}
                  defaultSource={require('../../assets/images/default-avatar.png')}
                  onError={() => console.warn('Failed to load profile image')}
                />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <FontAwesome name="user" size={60} color={Colors.disabled} />
                </View>
              )}
            </View>
            <Text style={styles.profileName}>
              {user.name}, {user.age || calculateAge(user.dateOfBirth)}
            </Text>
            {user.bio && (
              <Text style={styles.profileBio}>{user.bio}</Text>
            )}
          </View>

          {/* Profile Management Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.collapsibleHeader}
              onPress={() => setProfileExpanded(!profileExpanded)}
            >
              <FontAwesome name="user-circle" size={20} color={Colors.text} />
              <Text style={styles.sectionTitle}>Profile Management</Text>
              <FontAwesome 
                name={profileExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={Colors.disabled} 
              />
            </TouchableOpacity>
            {profileExpanded && (
              <View style={styles.collapsibleContent}>
                <ProfileForm user={user} />
              </View>
            )}
          </View>

          {/* Photos Management Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.collapsibleHeader}
              onPress={() => setPhotosExpanded(!photosExpanded)}
            >
              <FontAwesome name="camera" size={20} color={Colors.text} />
              <Text style={styles.sectionTitle}>Photos</Text>
              <FontAwesome 
                name={photosExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color={Colors.disabled} 
              />
            </TouchableOpacity>
            {photosExpanded && (
              <View style={styles.collapsibleContent}>
                <PhotoManagement onPhotosChanged={handlePhotosChanged} />
              </View>
            )}
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.settingItem}>
              <FontAwesome name="cog" size={20} color={Colors.text} />
              <Text style={styles.settingText}>App Settings</Text>
              <FontAwesome name="chevron-right" size={16} color={Colors.disabled} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <FontAwesome name="shield" size={20} color={Colors.text} />
              <Text style={styles.settingText}>Privacy & Safety</Text>
              <FontAwesome name="chevron-right" size={16} color={Colors.disabled} />
            </TouchableOpacity>
          </View>

          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.disabled,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    color: Colors.placeholder,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 16,
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 16,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collapsibleContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
