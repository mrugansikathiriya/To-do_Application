import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#090D16" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090D16' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(dashboard)" options={{ animation: 'fade' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
