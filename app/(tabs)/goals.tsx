import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedView, FadeInView } from '@/components/ui/AnimatedView';
import { GoalCard } from '@/components/GoalCard';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { Goal } from '@/types';
import { Plus } from 'lucide-react-native';

export default function GoalsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();

  const { data: goals, loading, refetch } = useApi<Goal[]>(
    user ? `/api/goals/${user.id}` : ''
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const activeGoals = goals?.filter(goal => goal.status === 'active') || [];
  const completedGoals = goals?.filter(goal => goal.status === 'completed') || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <AnimatedView style={styles.header} type="fade">
        <Text style={[styles.title, { color: colors.text }]}>
          My Goals
        </Text>
        <Button
          title=""
          onPress={() => setShowCreateForm(true)}
          style={styles.addButton}
        />
      </AnimatedView>

      <View style={styles.summary}>
        <AnimatedView delay={200} type="slide">
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              {activeGoals.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Active Goals
            </Text>
          </Card>
        </AnimatedView>

        <AnimatedView delay={300} type="slide">
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {completedGoals.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Completed
            </Text>
          </Card>
        </AnimatedView>
      </View>

      {activeGoals.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Goals
          </Text>
          <FadeInView>
            {activeGoals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
          </FadeInView>
        </View>
      )}

      {completedGoals.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Completed Goals
          </Text>
          <FadeInView>
            {completedGoals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
          </FadeInView>
        </View>
      )}

      {loading && (
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading goals...
        </Text>
      )}

      {!loading && goals && goals.length === 0 && (
        <AnimatedView delay={400} type="fade">
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Goals Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Create your first goal to start tracking your progress with AI insights!
            </Text>
            <Button
              title="Create Goal"
              onPress={() => setShowCreateForm(true)}
              style={styles.createButton}
            />
          </Card>
        </AnimatedView>
      )}

      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Goal"
          onPress={() => setShowCreateForm(true)}
          style={styles.floatingButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    padding: 16,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Inter-Regular',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  createButton: {
    paddingHorizontal: 32,
  },
  addButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  floatingButton: {
    marginHorizontal: 20,
  },
});