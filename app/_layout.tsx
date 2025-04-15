import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../store';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              title: 'Login',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              title: 'Sign Up',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 