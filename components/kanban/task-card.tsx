import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Task, TaskStatus } from '../../schemas/task.schema';
import { PriorityBadge, TagBadge } from '../ui/badge';
import { TaskActionMenu } from '../ui/dropdown-menu';
import { useTaskStore } from '../../stores/task.store';

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'completed'];

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { moveTask, deleteTask } = useTaskStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const canMovePrev = currentIndex > 0;
  const canMoveNext = currentIndex < STATUS_ORDER.length - 1;

  const handlePrevColumn = () => {
    if (canMovePrev) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      moveTask(task.id, STATUS_ORDER[currentIndex - 1]);
    }
  };

  const handleNextColumn = () => {
    if (canMoveNext) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      moveTask(task.id, STATUS_ORDER[currentIndex + 1]);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            deleteTask(task.id);
          },
        },
      ]
    );
  };

  const isCompleted = task.status === 'completed';

  return (
    <>
      <Pressable
        onPress={() => onEdit(task)}
        onLongPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          setMenuVisible(true);
        }}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.08)' }}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
          isCompleted && styles.cardCompleted,
        ]}
      >
        {/* Top Header: Priority Badge + Three Dots Menu */}
        <View style={styles.topRow}>
          <PriorityBadge priority={task.priority} />
          
          <Pressable
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              setMenuVisible(true);
            }}
            style={styles.moreButton}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.15)' }}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Title & Description */}
        <Text
          style={[styles.title, isCompleted && styles.completedTitle]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {Boolean(task.description) && (
          <Text
            style={[styles.description, isCompleted && styles.completedDesc]}
            numberOfLines={3}
          >
            {task.description}
          </Text>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {task.tags.map((tag, idx) => (
              <TagBadge key={idx} label={tag} />
            ))}
          </View>
        )}

        {/* Bottom Footer: Due Date & Quick Column Movement buttons */}
        <View style={styles.footerRow}>
          {task.dueDate ? (
            <View style={styles.dueDateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
              <Text style={styles.dueDateText}>{task.dueDate}</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {/* Quick column movement arrows */}
          <View style={styles.moveButtonsGroup}>
            <Pressable
              disabled={!canMovePrev}
              onPress={(e) => {
                e.stopPropagation();
                handlePrevColumn();
              }}
              style={[styles.shiftBtn, !canMovePrev && styles.shiftBtnDisabled]}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Ionicons
                name="arrow-back"
                size={14}
                color={canMovePrev ? '#CBD5E1' : '#475569'}
              />
            </Pressable>

            <Pressable
              disabled={!canMoveNext}
              onPress={(e) => {
                e.stopPropagation();
                handleNextColumn();
              }}
              style={[styles.shiftBtn, !canMoveNext && styles.shiftBtnDisabled]}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Ionicons
                name="arrow-forward"
                size={14}
                color={canMoveNext ? '#818CF8' : '#475569'}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>

      <TaskActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        taskTitle={task.title}
        currentStatus={task.status}
        onMove={(newStatus) => moveTask(task.id, newStatus)}
        onEdit={() => onEdit(task)}
        onDelete={confirmDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
    }),
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardCompleted: {
    backgroundColor: '#0D1524',
    borderColor: '#16233B',
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moreButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 20,
    marginBottom: 6,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 10,
  },
  completedDesc: {
    color: '#475569',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1A2338',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  moveButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shiftBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftBtnDisabled: {
    backgroundColor: '#131B2A',
  },
});
