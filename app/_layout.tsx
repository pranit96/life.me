import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, authLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    // Initialize database tables only if environment is configured
    if (process.env.EXPO_PUBLIC_NEON_DATABASE_URL && process.env.EXPO_PUBLIC_NEON_DATABASE_URL !== 'your_neon_database_url_here') {
      fetch('/api/database/init', { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => console.log('Database initialized:', data))
        .catch(error => console.error('Database init error:', error));
    } else {
      console.warn('Database URL not configured. Please set EXPO_PUBLIC_NEON_DATABASE_URL in your .env file.');
    }
  }, []);

  useEffect(() => {
    // Handle initial navigation after auth state is loaded
    if (!authLoading && fontsLoaded) {
      if (!isAuthenticated) {
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, authLoading, fontsLoaded]);

  if (!fontsLoaded || authLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}