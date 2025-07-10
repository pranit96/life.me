import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimatedView, FadeInView } from '@/components/ui/AnimatedView';
import { ExpenseCard } from '@/components/ExpenseCard';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { Expense } from '@/types';

export default function ExpensesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();

  const { data: expenses, loading, refetch } = useApi<Expense[]>(
    user ? `/api/expenses/${user.id}` : ''
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const thisMonth = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    const currentDate = new Date();
    return expenseDate.getMonth() === currentDate.getMonth() &&
           expenseDate.getFullYear() === currentDate.getFullYear();
  }) || [];

  const monthlyTotal = thisMonth.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryBreakdown = () => {
    const categories: { [key: string]: number } = {};
    expenses?.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const topCategories = getCategoryBreakdown();

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
          Expenses
        </Text>
      </AnimatedView>

      <View style={styles.summary}>
        <AnimatedView delay={200} type="slide">
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Total Spent
            </Text>
          </Card>
        </AnimatedView>

        <AnimatedView delay={300} type="slide">
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.accent }]}>
              ${monthlyTotal.toFixed(2)}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              This Month
            </Text>
          </Card>
        </AnimatedView>
      </View>

      {topCategories.length > 0 && (
        <AnimatedView delay={400} type="slide">
          <Card style={styles.categoryCard}>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>
              Top Categories
            </Text>
            {topCategories.map(([category, amount], index) => (
              <View key={category} style={styles.categoryRow}>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category}
                </Text>
                <Text style={[styles.categoryAmount, { color: colors.textSecondary }]}>
                  ${amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </Card>
        </AnimatedView>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Expenses
        </Text>
        {loading ? (
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading expenses...
          </Text>
        ) : expenses && expenses.length > 0 ? (
          <FadeInView>
            {expenses.map((expense, index) => (
              <ExpenseCard key={expense.id} expense={expense} index={index} />
            ))}
          </FadeInView>
        ) : (
          <AnimatedView delay={500} type="fade">
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Expenses Yet
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Start tracking your expenses to get personalized insights and better financial control!
              </Text>
              <Button
                title="Add Expense"
                onPress={() => setShowCreateForm(true)}
                style={styles.createButton}
              />
            </Card>
          </AnimatedView>
        )}
      </View>

      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Expense"
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
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
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
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  categoryCard: {
    marginBottom: 24,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  categoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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