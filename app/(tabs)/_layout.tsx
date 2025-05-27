import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.disabled,
        tabBarStyle: {
          backgroundColor: Colors.background,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={28} 
              name={focused ? 'heart' : 'heart-o'} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={28} 
              name={focused ? 'comments' : 'comments-o'} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={28} 
              name={focused ? 'user' : 'user-o'} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

