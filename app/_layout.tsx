import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from '@expo-google-fonts/instrument-sans';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';
import {
  SourceSerif4_400Regular,
  SourceSerif4_400Regular_Italic,
  SourceSerif4_600SemiBold,
  SourceSerif4_700Bold,
} from '@expo-google-fonts/source-serif-4';
import { colors } from '../src/theme/theme';
import { AudioProvider } from '../src/audio/AudioProvider';
import { EntitlementProvider } from '../src/purchases/Entitlements';
import { ProgressProvider, ListenTracker } from '../src/lib/progress';
import { PersonalProvider } from '../src/lib/personal';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
    SourceSerif4_400Regular,
    SourceSerif4_400Regular_Italic,
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.paper }} />;
  }

  return (
    <SafeAreaProvider>
      <EntitlementProvider>
        <AudioProvider>
        <ProgressProvider>
        <PersonalProvider>
        <StatusBar style="dark" />
        <ListenTracker />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.paper },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="settings"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="devotionals"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="saved" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="prayers" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen
            name="share"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="privacy"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="paywall"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="category/[id]"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="liturgy/[id]"
            options={{ presentation: 'card', animation: 'slide_from_right' }}
          />
        </Stack>
        </PersonalProvider>
        </ProgressProvider>
        </AudioProvider>
      </EntitlementProvider>
    </SafeAreaProvider>
  );
}
