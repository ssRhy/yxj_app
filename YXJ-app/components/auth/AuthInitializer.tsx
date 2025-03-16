import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthInitializer = () => {
  const { user, login } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user data exists in AsyncStorage
        const userJson = await AsyncStorage.getItem('user_info');
        
        if (userJson) {
          // User data exists, attempt to log in automatically
          const userData = JSON.parse(userJson);
          await login(userData);
          
          // Navigate to dashboard
          router.replace('/(routes)/dashboard');
        } else {
          // No saved user data, redirect to welcome screen
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On error, redirect to welcome screen
        router.replace('/');
      } finally {
        setIsChecking(false);
      }
    };

    // Only run the check if user is not already logged in
    if (!user) {
      checkAuthStatus();
    } else {
      setIsChecking(false);
      router.replace('/(routes)/dashboard');
    }
  }, []);

  // Show loading indicator while checking auth status
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fded13" />
      </View>
    );
  }

  // This component doesn't render anything after checking
  return null;
};

export default AuthInitializer;
