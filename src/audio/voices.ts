/**
 * Narration voices the listener can choose in Settings.
 *
 * "Studio" is the warm, pre-recorded narration (an MP3 when one exists for the
 * reading, otherwise the device's default voice). The other options narrate
 * every reading live on-device, each tuned to sound distinct. Device voice
 * availability varies by phone, so we resolve to the best match at play time
 * and always apply a pitch/rate so the choice is audible even on a fallback.
 *
 * (elevenLabsVoiceId is carried for a future upgrade where each voice has its
 * own set of pre-generated MP3s; it isn't used yet.)
 */
import { useSyncExternalStore } from 'react';
import { getItem, setItem } from '../lib/storage';

export type VoiceKind = 'studio' | 'device';

export type Voice = {
  id: string;
  label: string;
  description: string;
  kind: VoiceKind;
  /** Candidate iOS system voice identifiers, best first. */
  ios?: string[];
  /** Language to fall back to if no candidate identifier is installed. */
  lang?: string;
  pitch?: number;
  /** Multiplier applied to the base speech rate. */
  rate?: number;
  elevenLabsVoiceId?: string;
};

export const VOICES: Voice[] = [
  {
    id: 'studio',
    label: 'Studio',
    description: 'Warm, pre-recorded narration',
    kind: 'studio',
    elevenLabsVoiceId: 'onwK4e9ZLuTAKqWW03F9',
  },
  {
    id: 'daniel',
    label: 'Daniel',
    description: 'Calm British baritone',
    kind: 'device',
    lang: 'en-GB',
    ios: ['com.apple.voice.compact.en-GB.Daniel', 'com.apple.ttsbundle.Daniel-compact'],
    pitch: 0.92,
    rate: 1,
  },
  {
    id: 'aaron',
    label: 'Aaron',
    description: 'Steady American narrator',
    kind: 'device',
    lang: 'en-US',
    ios: ['com.apple.voice.compact.en-US.Aaron'],
    pitch: 1,
    rate: 1,
  },
  {
    id: 'arthur',
    label: 'Arthur',
    description: 'Warm British storyteller',
    kind: 'device',
    lang: 'en-GB',
    ios: ['com.apple.voice.compact.en-GB.Arthur', 'com.apple.voice.enhanced.en-GB.Arthur'],
    pitch: 0.88,
    rate: 0.97,
  },
  {
    id: 'nathan',
    label: 'Nathan',
    description: 'Bright, clear reading',
    kind: 'device',
    lang: 'en-US',
    ios: ['com.apple.voice.compact.en-US.Nathan', 'com.apple.voice.enhanced.en-US.Nathan'],
    pitch: 1.06,
    rate: 1.04,
  },
];

const VOICE_KEY = 'founded.voice';
const DEFAULT_VOICE_ID = 'studio';

let selectedId = DEFAULT_VOICE_ID;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export async function loadSelectedVoice(): Promise<void> {
  selectedId = await getItem<string>(VOICE_KEY, DEFAULT_VOICE_ID);
  if (!VOICES.some((v) => v.id === selectedId)) selectedId = DEFAULT_VOICE_ID;
  emit();
}

export function getSelectedVoiceId(): string {
  return selectedId;
}

export function getSelectedVoice(): Voice {
  return VOICES.find((v) => v.id === selectedId) ?? VOICES[0];
}

export function setSelectedVoice(id: string): void {
  if (!VOICES.some((v) => v.id === id)) return;
  selectedId = id;
  setItem(VOICE_KEY, id);
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** React hook: the currently selected voice id, re-rendering on change. */
export function useSelectedVoiceId(): string {
  return useSyncExternalStore(subscribe, getSelectedVoiceId, getSelectedVoiceId);
}

/**
 * Resolve the actual device voice identifier to hand expo-speech. Returns
 * undefined for the studio voice or when nothing suitable is installed (in
 * which case the system default is used, still shaped by pitch/rate).
 */
export async function resolveVoiceIdentifier(
  Speech: typeof import('expo-speech'),
  voice: Voice,
): Promise<string | undefined> {
  if (voice.kind !== 'device') return undefined;
  try {
    const available = await Speech.getAvailableVoicesAsync();
    const ids = new Set(available.map((v) => v.identifier));
    for (const cand of voice.ios ?? []) {
      if (ids.has(cand)) return cand;
    }
    const prefix = (voice.lang ?? 'en').slice(0, 2);
    const langMatch = available.find((v) => (v.language ?? '').startsWith(prefix));
    return langMatch?.identifier;
  } catch {
    return undefined;
  }
}
