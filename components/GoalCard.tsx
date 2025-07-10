import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { AnimatedView } from '@/components/ui/AnimatedView';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
  index: number;
}

export function GoalCard({ goal, index }: GoalCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const progressColor = progress >= 100 ? colors.success : colors.primary;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AnimatedView delay={index * 100} type="slide">
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {goal.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: progressColor }]}>
            <Text style={styles.statusText}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {goal.description}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: colors.text }]}>
              ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
            </Text>
            <Text style={[styles.progressPercentage, { color: progressColor }]}>
              {progress.toFixed(1)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progressColor,
                  width: `${Math.min(progress, 100)}%`,
                },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            {goal.category}
          </Text>
          <Text style={[styles.deadline, { color: colors.textSecondary }]}>
            Due: {formatDate(goal.deadline)}
          </Text>
        </View>
        
        {goal.aiInsights && (
          <View style={[styles.aiInsights, { backgroundColor: colors.background }]}>
            <Text style={[styles.aiText, { color: colors.textSecondary }]}>
              💡 {goal.aiInsights}
            </Text>
          </View>
        )}
      </Card>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  deadline: {
    fontSize: 12,
  },
  aiInsights: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  aiText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});