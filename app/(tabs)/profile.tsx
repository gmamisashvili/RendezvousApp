import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileForm from '../../components/profile/ProfileForm';
import LogoutButton from '../../components/profile/LogoutButton';
import { useAuth } from '../../store';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

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
          <ProfileForm user={user} />
          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});
