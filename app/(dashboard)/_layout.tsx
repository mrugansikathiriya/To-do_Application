import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../stores/auth.store';

export default function DashboardLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#090D16' },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
