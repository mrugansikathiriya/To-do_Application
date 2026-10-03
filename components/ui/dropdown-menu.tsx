import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskStatus } from '../../schemas/task.schema';

export interface ActionMenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress: () => void;
  destructive?: boolean;
}

export interface TaskActionMenuProps {
  visible: boolean;
  onClose: () => void;
  taskTitle: string;
  currentStatus: TaskStatus;
  onMove: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskActionMenu: React.FC<TaskActionMenuProps> = ({
  visible,
  onClose,
  taskTitle,
  currentStatus,
  onMove,
  onEdit,
  onDelete,
}) => {
  const statusOptions: { status: TaskStatus; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { status: 'todo', label: 'Move to To Do', icon: 'list', color: '#F59E0B' },
    { status: 'in_progress', label: 'Move to In Progress', icon: 'hourglass-outline', color: '#0EA5E9' },
    { status: 'in_review', label: 'Move to In Review', icon: 'eye-outline', color: '#A855F7' },
    { status: 'completed', label: 'Move to Completed', icon: 'checkmark-circle-outline', color: '#10B981' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              <View style={styles.handle} />
              
              <Text style={styles.title} numberOfLines={1}>
                {taskTitle}
              </Text>
              <Text style={styles.subtitle}>Manage task actions and column position</Text>

              {/* Status Move Options */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>COLUMN PLACEMENT</Text>
                {statusOptions.map((opt) => {
                  const isCurrent = opt.status === currentStatus;
                  return (
                    <Pressable
                      key={opt.status}
                      disabled={isCurrent}
                      onPress={() => {
                        onMove(opt.status);
                        onClose();
                      }}
                      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                      style={[
                        styles.menuRow,
                        isCurrent && styles.menuRowActive,
                      ]}
                    >
                      <View style={styles.leftRow}>
                        <Ionicons name={opt.icon} size={18} color={opt.color} />
                        <Text style={[styles.menuText, isCurrent && { color: '#64748B' }]}>
                          {opt.label}
                        </Text>
                      </View>
                      {isCurrent && (
                        <View style={styles.activePill}>
                          <Text style={styles.activePillText}>Current</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* General Actions: Edit, Delete */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>TASK OPTIONS</Text>
                
                <Pressable
                  onPress={() => {
                    onClose();
                    onEdit();
                  }}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                  style={styles.menuRow}
                >
                  <View style={styles.leftRow}>
                    <Ionicons name="create-outline" size={18} color="#818CF8" />
                    <Text style={styles.menuText}>Edit Task Details</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#64748B" />
                </Pressable>

                <Pressable
                  onPress={() => {
                    onClose();
                    onDelete();
                  }}
                  android_ripple={{ color: 'rgba(239, 68, 68, 0.15)' }}
                  style={[styles.menuRow, styles.destructiveRow]}
                >
                  <View style={styles.leftRow}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={[styles.menuText, { color: '#EF4444' }]}>Delete Task</Text>
                  </View>
                </Pressable>
              </View>

              <Pressable
                onPress={onClose}
                style={styles.cancelButton}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 13, 0.75)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    ...Platform.select({
      android: { elevation: 16 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.5,
        shadowRadius: 18,
      },
    }),
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    marginBottom: 6,
  },
  menuRowActive: {
    opacity: 0.5,
    backgroundColor: '#111827',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  activePill: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  destructiveRow: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  cancelButton: {
    marginTop: 4,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
