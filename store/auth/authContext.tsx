import React, {createContext, useContext, useEffect, useState} from 'react';
import {User, UserLogin, UserRegistration} from '../../types';
import {authService} from '../../services';
import {useRouter, useSegments} from 'expo-router';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<{ success: boolean; error?: string }>;
  register: (userData: UserRegistration) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  
  // Compute authentication state
  const isAuthenticated = !!user;

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token exists but user data couldn't be fetched
            await authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === 'dashboard';

    if (!isAuthenticated && inProtectedGroup) {
      // Redirect to login if trying to access protected routes while not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to dashboard if already authenticated and trying to access auth routes
      router.replace('/dashboard');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  const login = async (credentials: UserLogin) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { 
        success: false, 
        error: response.error || 'Login failed. Please check your credentials.' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during login.' 
      };
    }
  };

  const register = async (userData: UserRegistration) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        router.replace('/dashboard');
        return { success: true };
      }
      return { 
        success: false, 
        error: response.error || 'Registration failed. Please try again.' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred during registration.' 
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.replace('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
