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

/**
 * URL for a reading in a given voice. Studio uses the static MP3s; the other
 * voices are generated on demand by /api/tts (edge-cached).
 */
export function narrationUrl(id: string, slug: string, kind: 'studio' | 'eleven'): string {
  // v=3: narration script gained "Let's pray" — new URL busts the immutable
  // edge cache so old audio isn't served forever. Bump when the script changes.
  const path =
    kind === 'studio'
      ? `/audio/${id}.mp3`
      : `/api/tts?id=${encodeURIComponent(id)}&voice=${encodeURIComponent(slug)}&v=3`;
  if (Platform.OS === 'web') return path;
  return `${BASE.replace(/\/$/, '')}${path}`;
}

/** URL for a short spoken sample of a voice (used by the Settings preview). */
export function previewUrl(slug: string): string {
  const path = `/api/tts?preview=1&voice=${encodeURIComponent(slug)}`;
  if (Platform.OS === 'web') return path;
  return `${BASE.replace(/\/$/, '')}${path}`;
}
