import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { audioUrl } from './audioUrl';
import { getReadingById } from '../content';
import { buildSpeechText } from '../content/narration';

// expo-av's types — kept loose so we can dynamically import it (and keep it out
// of the web static-render pass entirely).
type Sound = {
  unloadAsync: () => Promise<unknown>;
  playAsync: () => Promise<unknown>;
  pauseAsync: () => Promise<unknown>;
  setPositionAsync: (millis: number) => Promise<unknown>;
  setOnPlaybackStatusUpdate: (cb: (status: PlaybackStatus) => void) => void;
};

type PlaybackStatus = {
  isLoaded: boolean;
  isPlaying?: boolean;
  positionMillis?: number;
  durationMillis?: number;
  didJustFinish?: boolean;
  error?: string;
};

type Mode = 'file' | 'speech' | null;

type AudioState = {
  currentId: string | null;
  currentTitle: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  /** Neither a narration file nor device speech could play this reading. */
  unavailable: boolean;
  positionMillis: number;
  durationMillis: number;
  /** 'file' = streamed MP3, 'speech' = device text-to-speech fallback. */
  mode: Mode;
};

type AudioContextValue = AudioState & {
  toggleReading: (id: string) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekToFraction: (fraction: number) => Promise<void>;
  stop: () => Promise<void>;
};

const initialState: AudioState = {
  currentId: null,
  currentTitle: null,
  isPlaying: false,
  isLoading: false,
  unavailable: false,
  positionMillis: 0,
  durationMillis: 0,
  mode: null,
};

const AudioContext = createContext<AudioContextValue | null>(null);

// ~2.6 spoken words per second at a calm rate — used to estimate a progress
// timeline for the device-speech fallback (which has no real position).
const WORDS_PER_SEC = 2.6;
const SPEECH_RATE = 0.92;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const soundRef = useRef<Sound | null>(null);
  const audioModuleRef = useRef<typeof import('expo-av') | null>(null);
  const speechModuleRef = useRef<typeof import('expo-speech') | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const patch = useCallback((p: Partial<AudioState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  // ---- module loaders (dynamic, keeps them out of web static render) ----
  const getAudio = useCallback(async () => {
    if (!audioModuleRef.current) {
      audioModuleRef.current = await import('expo-av');
      try {
        await audioModuleRef.current.Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      } catch {
        /* non-fatal */
      }
    }
    return audioModuleRef.current;
  }, []);

  const getSpeech = useCallback(async () => {
    if (!speechModuleRef.current) {
      speechModuleRef.current = await import('expo-speech');
    }
    return speechModuleRef.current;
  }, []);

  // ---- progress timer for the speech fallback ----
  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    clearTick();
    tickRef.current = setInterval(() => {
      const s = stateRef.current;
      const next = s.positionMillis + 250;
      if (s.durationMillis && next >= s.durationMillis) {
        clearTick();
        patch({ positionMillis: s.durationMillis });
      } else {
        patch({ positionMillis: next });
      }
    }, 250);
  }, [clearTick, patch]);

  // ---- teardown helpers ----
  const unloadFile = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    if (sound) {
      sound.setOnPlaybackStatusUpdate(() => {});
      try {
        await sound.unloadAsync();
      } catch {
        /* ignore */
      }
    }
  }, []);

  const stopSpeech = useCallback(async () => {
    clearTick();
    try {
      const Speech = speechModuleRef.current;
      if (Speech) await Speech.stop();
    } catch {
      /* ignore */
    }
  }, [clearTick]);

  const stopAll = useCallback(async () => {
    await unloadFile();
    await stopSpeech();
  }, [unloadFile, stopSpeech]);

  // ---- file playback status ----
  const onStatus = useCallback(
    (status: PlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) patch({ unavailable: true, isLoading: false });
        return;
      }
      patch({
        isPlaying: !!status.isPlaying,
        positionMillis: status.positionMillis ?? 0,
        durationMillis: status.durationMillis ?? 0,
        isLoading: false,
      });
      if (status.didJustFinish) {
        patch({ isPlaying: false, positionMillis: 0 });
        soundRef.current?.setPositionAsync(0).catch(() => {});
      }
    },
    [patch],
  );

  // Does a narration MP3 actually exist for this reading?
  const fileExists = useCallback(async (url: string) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const ct = res.headers.get('content-type') ?? '';
      return res.ok && !ct.includes('text/html');
    } catch {
      return false;
    }
  }, []);

  const speakReading = useCallback(
    async (id: string) => {
      const reading = getReadingById(id);
      if (!reading) {
        patch({ unavailable: true, isLoading: false });
        return;
      }
      const text = buildSpeechText(reading);
      const words = text.split(/\s+/).filter(Boolean).length;
      const durationMillis = Math.round((words / WORDS_PER_SEC) * 1000);
      try {
        const Speech = await getSpeech();
        Speech.speak(text, {
          rate: SPEECH_RATE,
          onDone: () => {
            clearTick();
            patch({ isPlaying: false, positionMillis: stateRef.current.durationMillis });
          },
          onStopped: () => clearTick(),
          onError: () => {
            clearTick();
            patch({ unavailable: true, isPlaying: false });
          },
        });
        patch({
          mode: 'speech',
          isPlaying: true,
          isLoading: false,
          positionMillis: 0,
          durationMillis,
        });
        startTick();
      } catch {
        patch({ unavailable: true, isPlaying: false, isLoading: false });
      }
    },
    [clearTick, getSpeech, patch, startTick],
  );

  const togglePlayPauseInternal = useCallback(async () => {
    const s = stateRef.current;
    if (s.mode === 'file') {
      const sound = soundRef.current;
      if (!sound) return;
      if (s.isPlaying) await sound.pauseAsync();
      else await sound.playAsync();
      return;
    }
    if (s.mode === 'speech') {
      const Speech = await getSpeech();
      if (s.isPlaying) {
        clearTick();
        try {
          await Speech.pause();
        } catch {
          await Speech.stop();
        }
        patch({ isPlaying: false });
      } else {
        let resumed = false;
        try {
          await Speech.resume();
          resumed = true;
        } catch {
          resumed = false;
        }
        if (resumed) {
          patch({ isPlaying: true });
          startTick();
        } else if (s.currentId) {
          // Couldn't resume (some platforms) — restart from the top.
          patch({ positionMillis: 0 });
          await speakReading(s.currentId);
        }
      }
    }
  }, [clearTick, getSpeech, patch, speakReading, startTick]);

  const toggleReading = useCallback(
    async (id: string) => {
      const s = stateRef.current;

      // Already the active reading → just toggle play/pause.
      if (s.currentId === id && s.mode) {
        await togglePlayPauseInternal();
        return;
      }

      await stopAll();
      patch({
        currentId: id,
        currentTitle: getReadingById(id)?.title ?? null,
        isLoading: true,
        unavailable: false,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: 0,
        mode: null,
      });

      const url = audioUrl(id);
      const hasFile = await fileExists(url);

      if (hasFile) {
        try {
          const { Audio } = await getAudio();
          const { sound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: true },
            onStatus as never,
          );
          soundRef.current = sound as unknown as Sound;
          patch({ mode: 'file' });
          return;
        } catch {
          /* fall through to speech */
        }
      }
      await speakReading(id);
    },
    [
      fileExists,
      getAudio,
      onStatus,
      patch,
      speakReading,
      stopAll,
      togglePlayPauseInternal,
    ],
  );

  const togglePlayPause = useCallback(async () => {
    const s = stateRef.current;
    if (!s.mode && s.currentId) {
      await toggleReading(s.currentId);
      return;
    }
    await togglePlayPauseInternal();
  }, [toggleReading, togglePlayPauseInternal]);

  const seekToFraction = useCallback(
    async (fraction: number) => {
      const s = stateRef.current;
      if (s.mode !== 'file') return; // can't seek device speech
      const sound = soundRef.current;
      if (!sound || !s.durationMillis) return;
      const clamped = Math.max(0, Math.min(1, fraction));
      await sound.setPositionAsync(Math.floor(clamped * s.durationMillis));
    },
    [],
  );

  const stop = useCallback(async () => {
    await stopAll();
    setState(initialState);
  }, [stopAll]);

  useEffect(() => {
    return () => {
      clearTick();
      void unloadFile();
      void stopSpeech();
    };
  }, [clearTick, unloadFile, stopSpeech]);

  return (
    <AudioContext.Provider
      value={{ ...state, toggleReading, togglePlayPause, seekToFraction, stop }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
}

export function formatMillis(millis: number): string {
  const total = Math.max(0, Math.floor(millis / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
