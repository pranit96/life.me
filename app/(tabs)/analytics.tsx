import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from '@/components/ui/Card';
import { AnimatedView, FadeInView } from '@/components/ui/AnimatedView';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { Expense, Goal } from '@/types';

export default function AnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();

  const { data: expenses, loading: expensesLoading, refetch: refetchExpenses } = useApi<Expense[]>(
    user ? `/api/expenses/${user.id}` : ''
  );

  const { data: goals, loading: goalsLoading, refetch: refetchGoals } = useApi<Goal[]>(
    user ? `/api/goals/${user.id}` : ''
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchExpenses(), refetchGoals()]);
    setRefreshing(false);
  };

  const getAnalytics = () => {
    if (!expenses || !goals) return null;

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const thisMonth = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return expenseDate.getMonth() === currentDate.getMonth() &&
             expenseDate.getFullYear() === currentDate.getFullYear();
    });

    const monthlyExpenses = thisMonth.reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryBreakdown: { [key: string]: number } = {};
    expenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    const totalGoalProgress = goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / goals.length * 100;

    return {
      totalExpenses,
      monthlyExpenses,
      categoryBreakdown,
      goalProgress: totalGoalProgress || 0,
      expenseCount: expenses.length,
      activeGoals: goals.filter(goal => goal.status === 'active').length,
      completedGoals: goals.filter(goal => goal.status === 'completed').length,
    };
  };

  const analytics = getAnalytics();

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
          Analytics
        </Text>
      </AnimatedView>

      {analytics && (
        <>
          <View style={styles.metricsGrid}>
            <AnimatedView delay={200} type="slide">
              <Card style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: colors.primary }]}>
                  ${analytics.totalExpenses.toFixed(2)}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  Total Spent
                </Text>
              </Card>
            </AnimatedView>

            <AnimatedView delay={300} type="slide">
              <Card style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: colors.accent }]}>
                  ${analytics.monthlyExpenses.toFixed(2)}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  This Month
                </Text>
              </Card>
            </AnimatedView>

            <AnimatedView delay={400} type="slide">
              <Card style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: colors.success }]}>
                  {analytics.goalProgress.toFixed(1)}%
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  Goal Progress
                </Text>
              </Card>
            </AnimatedView>

            <AnimatedView delay={500} type="slide">
              <Card style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: colors.secondary }]}>
                  {analytics.expenseCount}
                </Text>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                  Transactions
                </Text>
              </Card>
            </AnimatedView>
          </View>

          <AnimatedView delay={600} type="slide">
            <Card style={styles.categoryCard}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Spending by Category
              </Text>
              {Object.entries(analytics.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount], index) => {
                  const percentage = (amount / analytics.totalExpenses) * 100;
                  return (
                    <View key={category} style={styles.categoryRow}>
                      <View style={styles.categoryInfo}>
                        <Text style={[styles.categoryName, { color: colors.text }]}>
                          {category}
                        </Text>
                        <Text style={[styles.categoryAmount, { color: colors.textSecondary }]}>
                          ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                        </Text>
                      </View>
                      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: colors.primary,
                              width: `${percentage}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
            </Card>
          </AnimatedView>

          <AnimatedView delay={700} type="slide">
            <Card style={styles.goalsCard}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Goals Overview
              </Text>
              <View style={styles.goalsStats}>
                <View style={styles.goalStat}>
                  <Text style={[styles.goalStatValue, { color: colors.primary }]}>
                    {analytics.activeGoals}
                  </Text>
                  <Text style={[styles.goalStatLabel, { color: colors.textSecondary }]}>
                    Active
                  </Text>
                </View>
                <View style={styles.goalStat}>
                  <Text style={[styles.goalStatValue, { color: colors.success }]}>
                    {analytics.completedGoals}
                  </Text>
                  <Text style={[styles.goalStatLabel, { color: colors.textSecondary }]}>
                    Completed
                  </Text>
                </View>
                <View style={styles.goalStat}>
                  <Text style={[styles.goalStatValue, { color: colors.accent }]}>
                    {analytics.goalProgress.toFixed(1)}%
                  </Text>
                  <Text style={[styles.goalStatLabel, { color: colors.textSecondary }]}>
                    Avg Progress
                  </Text>
                </View>
              </View>
            </Card>
          </AnimatedView>
        </>
      )}

      {(expensesLoading || goalsLoading) && (
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading analytics...
        </Text>
      )}

      {!expensesLoading && !goalsLoading && (!expenses || expenses.length === 0) && (
        <AnimatedView delay={400} type="fade">
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Data Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Start tracking expenses and creating goals to see your analytics here!
            </Text>
          </Card>
        </AnimatedView>
      )}
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  categoryCard: {
    marginBottom: 24,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  categoryAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalsCard: {
    marginBottom: 24,
    padding: 16,
  },
  goalsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goalStat: {
    alignItems: 'center',
  },
  goalStatValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  goalStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
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
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
});