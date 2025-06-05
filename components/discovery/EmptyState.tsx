import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface EmptyStateProps {
  onRefresh: () => void;
  onOpenSettings?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh, onOpenSettings, isLoading = false, errorMessage }) => {
  // Show error state if there's a backend error
  if (errorMessage) {
    return (
      <View style={styles.container}>
        <FontAwesome 
          name="exclamation-triangle" 
          size={100} 
          color={Colors.disabled} 
          style={styles.icon} 
        />
        
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          {errorMessage}
        </Text>
        
        <TouchableOpacity 
          style={[styles.refreshButton, isLoading && styles.refreshButtonLoading]} 
          onPress={onRefresh}
          disabled={isLoading}
        >
          <FontAwesome 
            name={isLoading ? "spinner" : "refresh"} 
            size={20} 
            color="white" 
            style={isLoading ? styles.spinningIcon : styles.icon} 
          />
          <Text style={styles.refreshButtonText}>
            {isLoading ? 'Trying again...' : 'Try Again'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Default empty state
  return (
    <View style={styles.container}>
      <FontAwesome 
        name="heart-o" 
        size={100} 
        color={Colors.disabled} 
        style={styles.icon} 
      />
      
      <Text style={styles.title}>You're all caught up!</Text>
      <Text style={styles.subtitle}>
        We've shown you everyone in your area. Check back later for new people, or try expanding your distance settings!
      </Text>
      
      <TouchableOpacity 
        style={[styles.refreshButton, isLoading && styles.refreshButtonLoading]} 
        onPress={onRefresh}
        disabled={isLoading}
      >
        <FontAwesome 
          name={isLoading ? "spinner" : "refresh"} 
          size={20} 
          color="white" 
          style={isLoading ? styles.spinningIcon : styles.icon} 
        />
        <Text style={styles.refreshButtonText}>
          {isLoading ? 'Looking for new people...' : 'Look Again'}
        </Text>
      </TouchableOpacity>

      {onOpenSettings && (
        <TouchableOpacity style={styles.settingsButton} onPress={onOpenSettings}>
          <Text style={styles.settingsButtonText}>Adjust Discovery Settings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 10,
    marginBottom: 20,
  },
  refreshButtonLoading: {
    opacity: 0.7,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  settingsButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  spinningIcon: {
    // In a real app, you'd add rotation animation here
  },
});

export default EmptyState;
