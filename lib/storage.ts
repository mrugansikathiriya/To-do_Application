import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    return AsyncStorage.removeItem(name);
  },
};
