import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
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
    const initDatabase = async () => {
      try {
        if (process.env.EXPO_PUBLIC_NEON_DATABASE_URL && 
            process.env.EXPO_PUBLIC_NEON_DATABASE_URL !== 'your_neon_database_url_here') {
          const response = await fetch('/api/database/init', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Database init failed:', response.status, errorText);
            return;
          }
          
          const data = await response.json();
          console.log('Database initialized:', data);
        } else {
          console.warn('Database URL not configured. Please set EXPO_PUBLIC_NEON_DATABASE_URL in your .env file.');
        }
      } catch (error) {
        console.error('Database init error:', error);
      }
    };

    initDatabase();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}