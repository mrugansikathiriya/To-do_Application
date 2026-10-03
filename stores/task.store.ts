import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus, TaskPriority } from '../schemas/task.schema';

const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'task_001',
    title: 'Design Dark Mode System Architecture',
    description: 'Establish high contrast color palette (#090D16, #6366F1) and accessible components.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-10-15',
    tags: ['Design', 'UI/UX'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_002',
    title: 'Setup Zustand State Persistence',
    description: 'Persist authentication sessions and task board states via AsyncStorage.',
    priority: 'urgent',
    status: 'completed',
    dueDate: '2026-10-05',
    tags: ['Architecture', 'Core'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_003',
    title: 'Kanban Column Drag & Drop Gestures',
    description: 'Provide smooth haptic feedbacks and drop transitions between 4 partitions.',
    priority: 'high',
    status: 'in_review',
    dueDate: '2026-10-18',
    tags: ['Feature', 'Gestures'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_004',
    title: 'Zod Validation on Task Form Modal',
    description: 'Validate title length, priority, and date picker inputs with custom error tooltips.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-10-20',
    tags: ['Security', 'Validation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_005',
    title: 'Prepare Docker & Bun Containerization',
    description: 'Configure multi-stage Dockerfile and docker-compose.yml for reproducible builds.',
    priority: 'low',
    status: 'todo',
    dueDate: '2026-10-25',
    tags: ['DevOps', 'Docker'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_006',
    title: 'Implement Haptic Vibrations on Card Drag',
    description: 'Integrate expo-haptics selection and impact triggers on card press.',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-10-19',
    tags: ['Mobile', 'UX'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  selectedPriority: TaskPriority | 'all';
  setSearchQuery: (query: string) => void;
  setSelectedPriority: (priority: TaskPriority | 'all') => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: TaskStatus) => void;
  reorderTasks: (newTasks: Task[]) => void;
  resetTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: INITIAL_SAMPLE_TASKS,
      searchQuery: '',
      selectedPriority: 'all',

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedPriority: (priority) => set({ selectedPriority: priority }),

      addTask: (taskData) =>
        set((state) => {
          const newTask: Task = {
            ...taskData,
            id: 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { tasks: [newTask, ...state.tasks] };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (taskId, targetStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: targetStatus, updatedAt: new Date().toISOString() }
              : task
          ),
        })),

      reorderTasks: (newTasks) => set({ tasks: newTasks }),

      resetTasks: () => set({ tasks: INITIAL_SAMPLE_TASKS }),
    }),
    {
      name: 'to-do-app-task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
