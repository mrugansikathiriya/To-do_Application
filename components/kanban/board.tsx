import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../../stores/task.store';
import { KanbanColumn } from './column';
import { CreateTaskDialog } from './create-task-dialog';
import { Task, TaskStatus, TaskPriority, CreateTaskInput } from '../../schemas/task.schema';

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  badgeBg: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'todo',
    title: 'Total / To Do',
    iconName: 'list-circle',
    accentColor: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    iconName: 'hourglass',
    accentColor: '#0EA5E9',
    badgeBg: 'rgba(14, 165, 233, 0.15)',
  },
  {
    id: 'in_review',
    title: 'In Review',
    iconName: 'eye',
    accentColor: '#A855F7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
  },
  {
    id: 'completed',
    title: 'Completed',
    iconName: 'checkmark-circle',
    accentColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
  },
];

const PRIORITY_FILTERS: { id: TaskPriority | 'all'; label: string; color?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'urgent', label: 'Urgent', color: '#F87171' },
  { id: 'high', label: 'High', color: '#FB923C' },
  { id: 'medium', label: 'Medium', color: '#38BDF8' },
  { id: 'low', label: 'Low', color: '#94A3B8' },
];

export function KanbanBoard() {
  const {
    tasks,
    searchQuery,
    selectedPriority,
    setSearchQuery,
    setSelectedPriority,
    addTask,
    updateTask,
  } = useTaskStore();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<TaskStatus>('todo');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search matching
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Priority matching
      const matchesPriority =
        selectedPriority === 'all' || task.priority === selectedPriority;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, selectedPriority]);

  const handleOpenCreateForColumn = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatusForNew(status);
    setDialogVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogVisible(true);
  };

  const handleSaveTask = (taskData: CreateTaskInput) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <View style={styles.boardWrapper}>
      {/* Search Bar & Stats Header */}
      <View style={styles.toolbar}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={17} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Filter tasks, descriptions, or #tags..."
              placeholderTextColor="#475569"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {Boolean(searchQuery) && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color="#64748B" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Priority Filter Badges & Progress Overview */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {PRIORITY_FILTERS.map((pf) => {
              const isSelected = selectedPriority === pf.id;
              return (
                <Pressable
                  key={pf.id}
                  onPress={() => setSelectedPriority(pf.id)}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  {pf.color && (
                    <View
                      style={[
                        styles.filterDot,
                        { backgroundColor: pf.color },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.filterText,
                      isSelected && styles.filterTextSelected,
                    ]}
                  >
                    {pf.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Progress pill */}
          <View style={styles.statsPill}>
            <Ionicons name="speedometer-outline" size={14} color="#818CF8" />
            <Text style={styles.statsText}>
              {completedTasks}/{totalTasks} ({progressPercent}%)
            </Text>
          </View>
        </View>
      </View>

      {/* 4-Partition Kanban Columns */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContainer}
      >
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              status={col.id}
              title={col.title}
              iconName={col.iconName}
              accentColor={col.accentColor}
              badgeBg={col.badgeBg}
              tasks={colTasks}
              onEditTask={handleEditTask}
              onAddTaskToColumn={handleOpenCreateForColumn}
            />
          );
        })}
      </ScrollView>

      {/* Create / Edit Modal Dialog */}
      <CreateTaskDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false);
          setEditingTask(null);
        }}
        onSubmitTask={handleSaveTask}
        editingTask={editingTask}
        defaultStatus={defaultStatusForNew}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#0C1220',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2338',
  },
  searchRow: {
    marginBottom: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131D31',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterScroll: {
    gap: 6,
    paddingRight: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131D31',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  filterChipSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366F1',
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#818CF8',
    fontWeight: '700',
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statsText: {
    fontSize: 11,
    color: '#A5B4FC',
    fontWeight: '700',
  },
  columnsContainer: {
    padding: 16,
    paddingBottom: 24,
  },
});
