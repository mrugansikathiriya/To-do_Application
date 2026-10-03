import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TaskPriority, TaskStatus } from '../../schemas/task.schema';

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'outline' | 'priority' | 'status' | 'tag';
  priority?: TaskPriority;
  status?: TaskStatus;
  color?: string;
  bgColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PriorityBadge: React.FC<{
  priority: TaskPriority;
  style?: ViewStyle;
}> = ({ priority, style }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'urgent':
        return {
          label: 'Urgent',
          color: '#F87171',
          bgColor: 'rgba(239, 68, 68, 0.15)',
          borderColor: '#EF4444',
          dot: true,
        };
      case 'high':
        return {
          label: 'High',
          color: '#FB923C',
          bgColor: 'rgba(249, 115, 22, 0.15)',
          borderColor: '#F97316',
          dot: false,
        };
      case 'medium':
        return {
          label: 'Medium',
          color: '#38BDF8',
          bgColor: 'rgba(14, 165, 233, 0.15)',
          borderColor: '#0284C7',
          dot: false,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          color: '#94A3B8',
          bgColor: 'rgba(148, 163, 184, 0.15)',
          borderColor: '#64748B',
          dot: false,
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {config.dot && (
        <View style={[styles.pulseDot, { backgroundColor: config.color }]} />
      )}
      <Text style={[styles.badgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

export const StatusBadge: React.FC<{
  status: TaskStatus;
  style?: ViewStyle;
}> = ({ status, style }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'todo':
        return { label: 'To Do', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
      case 'in_progress':
        return { label: 'In Progress', color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.12)' };
      case 'in_review':
        return { label: 'In Review', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)' };
      case 'completed':
        return { label: 'Completed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

export const TagBadge: React.FC<{
  label: string;
  style?: ViewStyle;
}> = ({ label, style }) => {
  return (
    <View style={[styles.tagBadge, style]}>
      <Text style={styles.tagText}>#{label}</Text>
    </View>
  );
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#818CF8',
  bgColor = 'rgba(99, 102, 241, 0.15)',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, style]}>
      <Text style={[styles.badgeText, { color }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
});
