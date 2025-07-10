import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { AnimatedView } from '@/components/ui/AnimatedView';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Expense } from '@/types';

interface ExpenseCardProps {
  expense: Expense;
  index: number;
}

export function ExpenseCard({ expense, index }: ExpenseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      Food: '#EF4444',
      Transportation: '#3B82F6',
      Entertainment: '#8B5CF6',
      Shopping: '#F59E0B',
      Bills: '#6B7280',
      Healthcare: '#10B981',
      Education: '#6366F1',
      Other: '#9CA3AF',
    };
    return categoryColors[category] || colors.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AnimatedView delay={index * 100} type="slide">
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: getCategoryColor(expense.category) },
              ]}
            />
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {expense.category}
            </Text>
          </View>
          <Text style={[styles.amount, { color: colors.text }]}>
            -${expense.amount.toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.description, { color: colors.text }]}>
          {expense.description}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(expense.date)}
        </Text>
      </Card>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
});