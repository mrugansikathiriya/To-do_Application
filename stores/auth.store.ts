import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/auth.types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string }) => Promise<boolean>;
  register: (credentials: { username: string; email: string }) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async ({ username }) => {
        set({ isLoading: true });
        // Simulating quick async network latency for smooth UI feedback
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        const mockUser: UserProfile = {
          id: 'usr_' + Date.now().toString(36),
          username: username.trim(),
          email: `${username.trim().toLowerCase()}@example.com`,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(username.trim())}`,
        };

        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      register: async ({ username, email }) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 700));

        const mockUser: UserProfile = {
          id: 'usr_' + Date.now().toString(36),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          avatarUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(username.trim())}`,
        };

        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'to-do-app-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
