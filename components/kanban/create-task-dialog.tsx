import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  createTaskSchema,
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
} from '../../schemas/task.schema';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';

export interface CreateTaskDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmitTask: (taskData: CreateTaskInput) => void;
  editingTask?: Task | null;
  defaultStatus?: TaskStatus;
}

const PRESET_TAGS = ['Design', 'Dev', 'Bug', 'Feature', 'DevOps', 'Mobile', 'UI/UX'];

const PRIORITIES: { id: TaskPriority; label: string; color: string; bg: string }[] = [
  { id: 'low', label: 'Low', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' },
  { id: 'medium', label: 'Medium', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  { id: 'high', label: 'High', color: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)' },
  { id: 'urgent', label: 'Urgent', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' },
];

const STATUS_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#F59E0B' },
  { id: 'in_progress', label: 'In Progress', color: '#0EA5E9' },
  { id: 'in_review', label: 'In Review', color: '#A855F7' },
  { id: 'completed', label: 'Completed', color: '#10B981' },
];

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  visible,
  onClose,
  onSubmitTask,
  editingTask,
  defaultStatus = 'todo',
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: defaultStatus,
      dueDate: '',
      tags: [],
    },
  });

  const currentPriority = watch('priority');
  const currentStatus = watch('status');

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate || '',
        tags: editingTask.tags || [],
      });
      setSelectedTags(editingTask.tags || []);
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: defaultStatus,
        dueDate: new Date().toISOString().split('T')[0],
        tags: ['Feature'],
      });
      setSelectedTags(['Feature']);
    }
    setCustomTagInput('');
  }, [editingTask, defaultStatus, visible]);

  const toggleTag = (tag: string) => {
    let nextTags: string[];
    if (selectedTags.includes(tag)) {
      nextTags = selectedTags.filter((t) => t !== tag);
    } else {
      nextTags = [...selectedTags, tag];
    }
    setSelectedTags(nextTags);
    setValue('tags', nextTags);
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      const nextTags = [...selectedTags, trimmed];
      setSelectedTags(nextTags);
      setValue('tags', nextTags);
      setCustomTagInput('');
    }
  };

  const handleFormSubmit = (data: CreateTaskInput) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSubmitTask({
      ...data,
      tags: selectedTags,
    });
    onClose();
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : 'Create New Task'}
      description={
        editingTask
          ? 'Update the details and partition of this task.'
          : 'Add a new task to your Kanban workflow.'
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 460 }}
      >
        {/* Title Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Task Title <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="e.g., Implement OAuth authentication flow"
                placeholderTextColor="#475569"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title.message}</Text>
          )}
        </View>

        {/* Description Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide additional context, acceptance criteria, or links..."
                placeholderTextColor="#475569"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </View>

        {/* Priority Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Priority Level</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const isSelected = currentPriority === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setValue('priority', p.id)}
                  style={[
                    styles.priorityBtn,
                    {
                      backgroundColor: isSelected ? p.bg : '#1E293B',
                      borderColor: isSelected ? p.color : '#334155',
                    },
                  ]}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      { color: isSelected ? p.color : '#94A3B8' },
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Target Column Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Target Column</Text>
          <View style={styles.statusGrid}>
            {STATUS_COLUMNS.map((col) => {
              const isSelected = currentStatus === col.id;
              return (
                <Pressable
                  key={col.id}
                  onPress={() => setValue('status', col.id)}
                  style={[
                    styles.statusBtn,
                    isSelected && {
                      backgroundColor: col.color + '20',
                      borderColor: col.color,
                    },
                  ]}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Text
                    style={[
                      styles.statusBtnText,
                      isSelected && { color: col.color, fontWeight: '700' },
                    ]}
                  >
                    {col.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.dateInputWrapper}>
                <Ionicons name="calendar-outline" size={18} color="#818CF8" />
                <TextInput
                  style={styles.dateInput}
                  placeholder="2026-10-25"
                  placeholderTextColor="#475569"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            )}
          />
        </View>

        {/* Tags Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tags / Categories</Text>
          <View style={styles.tagsRow}>
            {PRESET_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    isSelected && styles.tagChipSelected,
                  ]}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      isSelected && styles.tagChipTextSelected,
                    ]}
                  >
                    #{tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom Tag Adder */}
          <View style={styles.customTagRow}>
            <TextInput
              style={styles.customTagInput}
              placeholder="Add custom tag..."
              placeholderTextColor="#475569"
              value={customTagInput}
              onChangeText={setCustomTagInput}
              onSubmitEditing={handleAddCustomTag}
              returnKeyType="done"
            />
            <Button
              title="Add"
              size="sm"
              variant="secondary"
              onPress={handleAddCustomTag}
            />
          </View>
        </View>

        {/* Actions Button */}
        <View style={styles.actionButtons}>
          <Button
            title="Cancel"
            variant="outline"
            style={{ flex: 1 }}
            onPress={onClose}
          />
          <Button
            title={editingTask ? 'Save Changes' : 'Create Task'}
            variant="primary"
            style={{ flex: 1.5 }}
            onPress={handleSubmit(handleFormSubmit)}
          />
        </View>
      </ScrollView>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    fontSize: 14,
  },
  textArea: {
    minHeight: 70,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    minWidth: '45%',
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1.2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBtnText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagChipSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366F1',
  },
  tagChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tagChipTextSelected: {
    color: '#818CF8',
    fontWeight: '700',
  },
  customTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  customTagInput: {
    flex: 1,
    height: 38,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    color: '#F8FAFC',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
});
