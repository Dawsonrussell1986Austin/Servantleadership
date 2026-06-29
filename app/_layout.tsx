import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme/theme';
import { AudioProvider } from '../src/audio/AudioProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <StatusBar style="dark" />
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
          animation: 'fade',
        }}
      >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="liturgy/[id]"
            options={{ presentation: 'card', animation: 'slide_from_right' }}
          />
        </Stack>
      </AudioProvider>
    </SafeAreaProvider>
  );
}
