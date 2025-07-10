import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedView } from '@/components/ui/AnimatedView';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedView style={styles.header} type="fade">
        <Text style={[styles.title, { color: colors.text }]}>
          Profile
        </Text>
      </AnimatedView>

      <AnimatedView delay={200} type="slide">
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username || 'User'}
          </Text>
          <Text style={[styles.telegramId, { color: colors.textSecondary }]}>
            Telegram ID: {user?.telegramId}
          </Text>
        </Card>
      </AnimatedView>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account Information
        </Text>
        
        <AnimatedView delay={300} type="slide">
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Username
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user?.username || 'Not provided'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                First Name
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user?.firstName || 'Not provided'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Last Name
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user?.lastName || 'Not provided'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Member Since
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
          </Card>
        </AnimatedView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About
        </Text>
        
        <AnimatedView delay={400} type="slide">
          <Card style={styles.aboutCard}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>
              SmartTracker
            </Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              AI-powered goal and expense tracking app that helps you achieve your financial goals with personalized insights and smart analytics.
            </Text>
            <Text style={[styles.version, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
          </Card>
        </AnimatedView>
      </View>

      <AnimatedView delay={500} type="slide">
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  telegramId: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  aboutCard: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});