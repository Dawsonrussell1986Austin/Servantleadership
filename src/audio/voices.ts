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
  /** Browser voice NAME keywords to match on web (where iOS ids don't exist). */
  nameHints?: string[];
  gender?: 'male' | 'female';
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
    gender: 'male',
    lang: 'en-GB',
    ios: ['com.apple.voice.compact.en-GB.Daniel', 'com.apple.ttsbundle.Daniel-compact'],
    nameHints: ['Daniel', 'Arthur', 'George', 'UK English Male', 'Google UK English Male'],
    pitch: 0.82,
    rate: 0.98,
  },
  {
    id: 'aaron',
    label: 'Aaron',
    description: 'Steady American narrator',
    kind: 'device',
    gender: 'male',
    lang: 'en-US',
    ios: ['com.apple.voice.compact.en-US.Aaron', 'com.apple.ttsbundle.Alex-compact'],
    nameHints: ['Aaron', 'Alex', 'Fred', 'David', 'Eric', 'Guy', 'US English Male'],
    pitch: 0.9,
    rate: 1,
  },
  {
    id: 'grace',
    label: 'Grace',
    description: 'Warm American voice',
    kind: 'device',
    gender: 'female',
    lang: 'en-US',
    ios: [
      'com.apple.voice.enhanced.en-US.Ava',
      'com.apple.ttsbundle.Samantha-compact',
      'com.apple.voice.compact.en-US.Samantha',
    ],
    nameHints: ['Samantha', 'Ava', 'Victoria', 'Jenny', 'Aria', 'Zira', 'US English Female', 'Google US English'],
    pitch: 1.08,
    rate: 1.0,
  },
  {
    id: 'ruth',
    label: 'Ruth',
    description: 'Gentle British voice',
    kind: 'device',
    gender: 'female',
    lang: 'en-GB',
    ios: [
      'com.apple.voice.compact.en-GB.Serena',
      'com.apple.ttsbundle.Serena-compact',
      'com.apple.voice.compact.en-GB.Martha',
    ],
    nameHints: ['Serena', 'Kate', 'Martha', 'Hazel', 'Sonia', 'Stephanie', 'UK English Female', 'Google UK English Female'],
    pitch: 1.14,
    rate: 0.97,
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
const FEMALE_NAME = /(female|samantha|victoria|karen|moira|tessa|fiona|serena|kate|martha|zira|susan|hazel|sonia|ava|allison|nicky|joana|catherine|amelie|anna|ellen|zuzana|paulina|milena|alva|amira|google us english|google uk english female)/i;
const MALE_NAME = /(\bmale\b|daniel|alex|fred|david|aaron|arthur|george|oliver|thomas|gordon|lee|rishi|eric|guy|reed|rocko|junior|uk english male)/i;

/**
 * Resolve the actual voice identifier to hand expo-speech.
 *
 * On iOS we match the exact system voice ids. On the web (where those ids don't
 * exist) we match the browser's voice list by NAME keywords and, failing that,
 * by gender — so a "male" voice actually gets a male browser voice instead of
 * everything collapsing to the same default. Returns undefined only when
 * nothing suitable exists (system default is used, still shaped by pitch/rate).
 */
export async function resolveVoiceIdentifier(
  Speech: typeof import('expo-speech'),
  voice: Voice,
): Promise<string | undefined> {
  if (voice.kind !== 'device') return undefined;
  try {
    const available = await Speech.getAvailableVoicesAsync();
    const ids = new Set(available.map((v) => v.identifier));

    // 1. Exact iOS identifier.
    for (const cand of voice.ios ?? []) {
      if (ids.has(cand)) return cand;
    }

    const prefix = (voice.lang ?? 'en').slice(0, 2);
    const nameOf = (v: { name?: string; identifier: string }) =>
      (v.name ?? v.identifier ?? '').toLowerCase();

    // 2. Match by name keyword (works well for browser voices on Mac/desktop).
    const hints = (voice.nameHints ?? []).map((h) => h.toLowerCase());
    if (hints.length) {
      const byName =
        available.find(
          (v) => (v.language ?? '').startsWith(prefix) && hints.some((h) => nameOf(v).includes(h)),
        ) ?? available.find((v) => hints.some((h) => nameOf(v).includes(h)));
      if (byName) return byName.identifier;
    }

    // 3. Match by gender within the language, then any language.
    if (voice.gender) {
      const want = voice.gender === 'male' ? MALE_NAME : FEMALE_NAME;
      const avoid = voice.gender === 'male' ? FEMALE_NAME : MALE_NAME;
      const genderMatch =
        available.find(
          (v) => (v.language ?? '').startsWith(prefix) && want.test(nameOf(v)) && !avoid.test(nameOf(v)),
        ) ?? available.find((v) => want.test(nameOf(v)) && !avoid.test(nameOf(v)));
      if (genderMatch) return genderMatch.identifier;
    }

    // 4. Any voice in the language.
    const langMatch = available.find((v) => (v.language ?? '').startsWith(prefix));
    return langMatch?.identifier;
  } catch {
    return undefined;
  }
}
