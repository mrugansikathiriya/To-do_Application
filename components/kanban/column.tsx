import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../../schemas/task.schema';
import { TaskCard } from './task-card';

export interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  badgeBg: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTaskToColumn: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  iconName,
  accentColor,
  badgeBg,
  tasks,
  onEditTask,
  onAddTaskToColumn,
}) => {
  return (
    <View style={[styles.columnContainer, { borderColor: accentColor + '30' }]}>
      {/* Column Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
            <Ionicons name={iconName} size={16} color={accentColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.countBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.countText, { color: accentColor }]}>{tasks.length}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => onAddTaskToColumn(status)}
          hitSlop={8}
          style={styles.addBtn}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.15)' }}
        >
          <Ionicons name="add" size={18} color="#94A3B8" />
        </Pressable>
      </View>

      {/* Task List or Empty Placeholder */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { borderColor: accentColor + '25' }]}>
              <Ionicons name="file-tray-outline" size={26} color={accentColor + '60'} />
            </View>
            <Text style={styles.emptyTitle}>Empty Partition</Text>
            <Text style={styles.emptySubtitle}>
              Tap + above to add a task to {title}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    width: 300,
    backgroundColor: '#0C1220',
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 16,
    padding: 14,
    height: '100%',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#172238',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    paddingHorizontal: 16,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
  },
});
