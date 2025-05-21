import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { useAuth } from '../../store';
import { UserLogin } from '../../types';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const credentials: UserLogin = { email, password };
      const result = await login(credentials);

      if (!result.success) {
        setErrors({ ...errors, general: result.error || 'Login failed' });
      } else {
        // Navigation is handled by the auth context
      }
    } catch (error: any) {
      setErrors({ ...errors, general: error.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        
        {errors.general ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        ) : null}
        
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />
        
        <Button
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          mode="contained"
          style={styles.button}
          disabled={loading}
        />
        
        {loading && (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('auth/register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
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
    padding: Layout.padding,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: Colors.error,
    padding: Layout.padding,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
  },
  loader: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: Colors.text,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
}); 
