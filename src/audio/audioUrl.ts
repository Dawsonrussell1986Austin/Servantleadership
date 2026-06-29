import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Narration files live at `/audio/<id>.mp3`.
 * On web they're served from the same origin (Expo copies `public/` into the
 * web build). On native we need an absolute URL, configured in app.json under
 * expo.extra.audioBaseUrl.
 */
const BASE =
  (Constants.expoConfig?.extra as { audioBaseUrl?: string } | undefined)
    ?.audioBaseUrl ?? '';

export function audioUrl(id: string): string {
  if (Platform.OS === 'web') return `/audio/${id}.mp3`;
  return `${BASE.replace(/\/$/, '')}/audio/${id}.mp3`;
}
