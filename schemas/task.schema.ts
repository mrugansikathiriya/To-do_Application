import { z } from 'zod';

export const TaskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
export const TaskStatusEnum = z.enum(['todo', 'in_progress', 'in_review', 'completed']);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Task title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional(),
  priority: TaskPriorityEnum.default('medium'),
  status: TaskStatusEnum.default('todo'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional(),
  priority: TaskPriorityEnum.default('medium'),
  status: TaskStatusEnum.default('todo'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;
export type TaskStatus = z.infer<typeof TaskStatusEnum>;
