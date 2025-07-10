import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { AnimatedView, FadeInView } from '@/components/ui/AnimatedView';
import { ExpenseCard } from '@/components/ExpenseCard';
import { GoalCard } from '@/components/GoalCard';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { Expense, Goal } from '@/types';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, isAuthenticated } = useAuth();

  const { data: expenses, loading: expensesLoading, refetch: refetchExpenses } = useApi<Expense[]>(
    user ? `/api/expenses/${user.id}` : ''
  );

  const { data: goals, loading: goalsLoading, refetch: refetchGoals } = useApi<Goal[]>(
    user ? `/api/goals/${user.id}` : ''
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && expenses && expenses.length > 0) {
      fetchAiInsights();
    }
  }, [user, expenses]);

  const fetchAiInsights = async () => {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          type: 'spending',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchExpenses(),
      refetchGoals(),
      fetchAiInsights(),
    ]);
    setRefreshing(false);
  };

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const activeGoals = goals?.filter(goal => goal.status === 'active') || [];
  const completedGoals = goals?.filter(goal => goal.status === 'completed') || [];

  if (!isAuthenticated) {
    return null;
  }

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
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          Welcome back,
        </Text>
        <Text style={[styles.username, { color: colors.text }]}>
          {user?.firstName || user?.username || 'User'}
        </Text>
      </AnimatedView>

      <View style={styles.statsContainer}>
        <AnimatedView delay={200} type="slide">
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Expenses
            </Text>
          </Card>
        </AnimatedView>

        <AnimatedView delay={300} type="slide">
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {activeGoals.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Active Goals
            </Text>
          </Card>
        </AnimatedView>

        <AnimatedView delay={400} type="slide">
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {completedGoals.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Completed
            </Text>
          </Card>
        </AnimatedView>
      </View>

      {aiInsights && (
        <AnimatedView delay={500} type="fade">
          <Card style={[styles.aiCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.aiTitle}>🤖 AI Insights</Text>
            <Text style={styles.aiText}>{aiInsights}</Text>
          </Card>
        </AnimatedView>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Active Goals
        </Text>
        {goalsLoading ? (
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading goals...
          </Text>
        ) : activeGoals.length > 0 ? (
          <FadeInView>
            {activeGoals.slice(0, 2).map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
          </FadeInView>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No active goals. Create your first goal to get started!
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Expenses
        </Text>
        {expensesLoading ? (
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading expenses...
          </Text>
        ) : expenses && expenses.length > 0 ? (
          <FadeInView>
            {expenses.slice(0, 5).map((expense, index) => (
              <ExpenseCard key={expense.id} expense={expense} index={index} />
            ))}
          </FadeInView>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No expenses found. Start tracking your spending!
          </Text>
        )}
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
    marginBottom: 24,
    marginTop: 20,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  aiCard: {
    marginBottom: 24,
    padding: 16,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  aiText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
});