import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '../../components/common/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Rendezvous</Text>
          <Text style={styles.tagline}>Let's fix dating</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Login" 
            onPress={() => router.replace('auth/login')}
            mode="contained"
            style={styles.button}
          />
          <Button 
            title="Sign Up" 
            onPress={() => router.replace('auth/register')}
            mode="outlined"
            style={styles.button}
          />
        </View>
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
    justifyContent: 'space-between',
    padding: Layout.padding,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
  button: {
    marginVertical: 8,
  },
}); 
