import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../src/theme/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Generous bottom inset; on web there's no reported safe area, so use a
  // comfortable minimum so the labels never sit at the very edge.
  const bottom = Math.max(insets.bottom, Platform.OS === 'web' ? 14 : 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.paperRaised,
          borderTopColor: colors.line,
          height: 64 + bottom,
          paddingTop: 10,
          paddingBottom: bottom,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 11,
          lineHeight: 14,
          letterSpacing: 0.5,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <Ionicons name="sunny-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
