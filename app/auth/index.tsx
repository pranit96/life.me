import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedView } from '@/components/ui/AnimatedView';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
  const [telegramId, setTelegramId] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { login, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, authLoading]);

  const handleLogin = async () => {
    if (!telegramId.trim()) {
      setError('Please enter your Telegram ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await login(telegramId, {
        username: username.trim() || undefined,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      if (result.success) {
        router.replace('/(tabs)/index');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedView style={styles.content} type="fade">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to
          </Text>
          <Text style={[styles.appName, { color: colors.primary }]}>
            SmartTracker
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            AI-powered goal and expense tracking
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            Connect with Telegram
          </Text>
          
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Telegram ID *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: error && !telegramId.trim() ? colors.error : colors.border,
                  color: colors.text,
                },
              ]}
              value={telegramId}
              onChangeText={(text) => {
                setTelegramId(text);
                if (error) setError(null);
              }}
              placeholder="Enter your Telegram ID"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Username (optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>
                First Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>
                Last Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>
          </View>

          <Button
            title={loading ? 'Connecting...' : 'Connect & Continue'}
            onPress={handleLogin}
            disabled={loading || !telegramId.trim()}
            size="large"
            style={styles.loginButton}
          />
        </Card>

        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
          We'll use your Telegram ID to sync your expense data and provide personalized insights.
        </Text>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    fontFamily: 'Poppins-Regular',
  },
  appName: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  formCard: {
    padding: 24,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  loginButton: {
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});