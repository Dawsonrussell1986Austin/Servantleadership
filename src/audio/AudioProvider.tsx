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

type AudioState = {
  currentId: string | null;
  currentTitle: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  /** The narration file for the current reading couldn’t be loaded. */
  unavailable: boolean;
  positionMillis: number;
  durationMillis: number;
};

type AudioContextValue = AudioState & {
  /** Play (or resume/pause if it’s already the active reading) by reading id. */
  toggleReading: (id: string) => Promise<void>;
  /** Pause/resume whatever is loaded. */
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
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>(initialState);
  const soundRef = useRef<Sound | null>(null);
  const audioModuleRef = useRef<typeof import('expo-av') | null>(null);

  const patch = useCallback((p: Partial<AudioState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const getAudio = useCallback(async () => {
    if (!audioModuleRef.current) {
      audioModuleRef.current = await import('expo-av');
      try {
        await audioModuleRef.current.Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
      } catch {
        // non-fatal — some platforms reject options
      }
    }
    return audioModuleRef.current;
  }, []);

  const unload = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    if (sound) {
      sound.setOnPlaybackStatusUpdate(() => {});
      try {
        await sound.unloadAsync();
      } catch {
        // ignore
      }
    }
  }, []);

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
        // reset to start, paused
        patch({ isPlaying: false, positionMillis: 0 });
        soundRef.current?.setPositionAsync(0).catch(() => {});
      }
    },
    [patch],
  );

  const toggleReading = useCallback(
    async (id: string) => {
      // Same reading already loaded → just toggle play/pause.
      if (soundRef.current && state.currentId === id) {
        if (state.isPlaying) await soundRef.current.pauseAsync();
        else await soundRef.current.playAsync();
        return;
      }

      const reading = getReadingById(id);
      await unload();
      patch({
        currentId: id,
        currentTitle: reading?.title ?? null,
        isLoading: true,
        unavailable: false,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: 0,
      });

      try {
        const { Audio } = await getAudio();
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl(id) },
          { shouldPlay: true },
          onStatus as never,
        );
        soundRef.current = sound as unknown as Sound;
      } catch {
        patch({ unavailable: true, isLoading: false, isPlaying: false });
      }
    },
    [getAudio, onStatus, patch, state.currentId, state.isPlaying, unload],
  );

  const togglePlayPause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) {
      if (state.currentId) await toggleReading(state.currentId);
      return;
    }
    if (state.isPlaying) await sound.pauseAsync();
    else await sound.playAsync();
  }, [state.currentId, state.isPlaying, toggleReading]);

  const seekToFraction = useCallback(
    async (fraction: number) => {
      const sound = soundRef.current;
      if (!sound || !state.durationMillis) return;
      const clamped = Math.max(0, Math.min(1, fraction));
      await sound.setPositionAsync(Math.floor(clamped * state.durationMillis));
    },
    [state.durationMillis],
  );

  const stop = useCallback(async () => {
    await unload();
    setState(initialState);
  }, [unload]);

  useEffect(() => {
    return () => {
      // unmount cleanup
      void unload();
    };
  }, [unload]);

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
