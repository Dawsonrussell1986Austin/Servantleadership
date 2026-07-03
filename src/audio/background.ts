import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Optional ambient bed that plays quietly under the narration (like Dwell).
 * Loops live at /audio/bg-<slug>.mp3 next to the narration files.
 */
export type BackgroundSound = {
  id: string;
  label: string;
  /** File slug, or null for silence. */
  slug: string | null;
};

export const BACKGROUND_SOUNDS: BackgroundSound[] = [
  { id: 'off', label: 'Off', slug: null },
  { id: 'ambient', label: 'Ambient', slug: 'bg-ambient' },
  { id: 'piano', label: 'Piano', slug: 'bg-piano' },
  { id: 'strings', label: 'Strings', slug: 'bg-strings' },
];

/** Under-the-voice volume for the ambient bed. */
export const BACKGROUND_VOLUME = 0.16;

const KEY = 'founded:background-sound';

// Ambient by default — a quiet bed under the voice unless the user opts out.
let current: BackgroundSound =
  BACKGROUND_SOUNDS.find((s) => s.id === 'ambient') ?? BACKGROUND_SOUNDS[0];
const listeners = new Set<(s: BackgroundSound) => void>();

export async function loadBackgroundSound(): Promise<BackgroundSound> {
  try {
    const id = await AsyncStorage.getItem(KEY);
    const found = BACKGROUND_SOUNDS.find((s) => s.id === id);
    if (found) current = found;
  } catch {
    /* default stands */
  }
  listeners.forEach((l) => l(current));
  return current;
}

export function getBackgroundSound(): BackgroundSound {
  return current;
}

export function setBackgroundSound(id: string): void {
  const found = BACKGROUND_SOUNDS.find((s) => s.id === id);
  if (!found) return;
  current = found;
  AsyncStorage.setItem(KEY, id).catch(() => {});
  listeners.forEach((l) => l(current));
}

export function useBackgroundSoundId(): string {
  const [id, setId] = useState(current.id);
  useEffect(() => {
    const l = (s: BackgroundSound) => setId(s.id);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return id;
}
