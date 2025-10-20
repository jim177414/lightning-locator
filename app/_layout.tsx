import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InterstitialManager } from '../components/InterstitialManager';
import { palette } from '../constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <InterstitialManager>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerTintColor: palette.textPrimary,
              headerStyle: { backgroundColor: palette.background },
              contentStyle: { backgroundColor: palette.background }
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Lightning Locator' }} />
            <Stack.Screen name="map" options={{ title: 'Map' }} />
            <Stack.Screen name="history" options={{ title: 'History' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          </Stack>
        </InterstitialManager>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
