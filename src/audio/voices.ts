/**
 * Narration voices — all real ElevenLabs voices.
 *
 * "Studio" plays the pre-generated static MP3s (free, instant, cached in the
 * repo). The other four are generated on demand through /api/tts and cached at
 * the edge, so every voice is genuine studio quality on web and iOS alike.
 */
import { useSyncExternalStore } from 'react';
import { getItem, setItem } from '../lib/storage';

export type VoiceKind = 'studio' | 'eleven';

export type Voice = {
  id: string;
  label: string;
  description: string;
  kind: VoiceKind;
  /** Voice slug understood by /api/tts (and the static MP3 set for studio). */
  slug: string;
  gender: 'male' | 'female';
};

export const VOICES: Voice[] = [
  { id: 'studio', label: 'Studio', description: 'Warm British male (recommended)', kind: 'studio', slug: 'studio', gender: 'male' },
  { id: 'george', label: 'George', description: 'British male, mature', kind: 'eleven', slug: 'george', gender: 'male' },
  { id: 'adam', label: 'Adam', description: 'American male, deep', kind: 'eleven', slug: 'adam', gender: 'male' },
  { id: 'rachel', label: 'Rachel', description: 'American female, calm', kind: 'eleven', slug: 'rachel', gender: 'female' },
  { id: 'charlotte', label: 'Charlotte', description: 'British female, warm', kind: 'eleven', slug: 'charlotte', gender: 'female' },
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
