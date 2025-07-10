import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (telegramId: string, userData?: Partial<User>) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId,
          ...userData,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        return { success: false, error: errorData.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return {
    user,
    loading,
    authLoading: loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}