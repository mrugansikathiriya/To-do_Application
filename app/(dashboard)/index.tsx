import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Navbar } from '../../components/layout/navbar';
import { KanbanBoard } from '../../components/kanban/board';
import { CreateTaskDialog } from '../../components/kanban/create-task-dialog';
import { useTaskStore } from '../../stores/task.store';
import { CreateTaskInput } from '../../schemas/task.schema';

export default function DashboardScreen() {
  const addTask = useTaskStore((state) => state.addTask);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleCreateTask = (taskData: CreateTaskInput) => {
    addTask(taskData);
  };

  const handleOpenFab = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCreateModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar with Greeting, Avatar & Logout */}
        <Navbar onOpenCreateModal={() => setCreateModalVisible(true)} />

        {/* 4-Partition Kanban Board */}
        <KanbanBoard />

        {/* Floating Action Button (FAB) */}
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
          onPress={handleOpenFab}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.25)' }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>

        {/* Create Task Modal Dialog */}
        <CreateTaskDialog
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onSubmitTask={handleCreateTask}
          defaultStatus="todo"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
    }),
  },
  fabPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
});
