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
import { getSelectedVoice, loadSelectedVoice } from './voices';
import { narrationUrl } from './audioUrl';
import {
  getBackgroundSound,
  loadBackgroundSound,
  BACKGROUND_VOLUME,
} from './background';

// expo-av's types — kept loose so we can dynamically import it (and keep it out
// of the web static-render pass entirely).
type Sound = {
  unloadAsync: () => Promise<unknown>;
  playAsync: () => Promise<unknown>;
  pauseAsync: () => Promise<unknown>;
  setPositionAsync: (millis: number) => Promise<unknown>;
  setVolumeAsync: (volume: number) => Promise<unknown>;
  setOnPlaybackStatusUpdate: (cb: (status: PlaybackStatus) => void) => void;
};

/**
 * Ramp a sound's volume from `from` to `to` over `ms`, so playback eases in and
 * out instead of clicking on/off. Best-effort — a failed step never throws.
 */
async function fadeVolume(sound: Sound, from: number, to: number, ms: number): Promise<void> {
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const v = from + (to - from) * (i / steps);
    try {
      await sound.setVolumeAsync(v);
    } catch {
      return;
    }
    await new Promise((r) => setTimeout(r, ms / steps));
  }
}

const FADE_MS = 320;

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
  /**
   * The last reading whose narration played to the very end. Explicit signal
   * for listen-tracking: position updates are throttled, so "reached the end"
   * can otherwise be missed entirely when playback finishes and resets.
   */
  finishedId: string | null;
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
  finishedId: null,
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
  const endFadingRef = useRef(false); // guards the one-shot fade near the end

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
          // Keep the narration going when the screen locks or the user goes
          // home. Requires the UIBackgroundModes=audio entry in app.json.
          staysActiveInBackground: true,
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

      // Ease the narration out over its final moments instead of clicking off.
      const pos = status.positionMillis ?? 0;
      const dur = status.durationMillis ?? 0;
      if (status.isPlaying && dur > 2000 && pos >= dur - FADE_MS - 80 && !endFadingRef.current) {
        endFadingRef.current = true;
        const sound = soundRef.current;
        if (sound) void fadeVolume(sound, 1, 0, FADE_MS);
      } else if (pos < dur - 1200) {
        endFadingRef.current = false; // user scrubbed back — allow fading again
      }

      if (status.didJustFinish) {
        patch({
          isPlaying: false,
          positionMillis: 0,
          finishedId: stateRef.current.currentId,
        });
        endFadingRef.current = false;
        soundRef.current?.setPositionAsync(0).catch(() => {});
        soundRef.current?.setVolumeAsync(1).catch(() => {}); // restore for next play
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
            patch({
              isPlaying: false,
              positionMillis: stateRef.current.durationMillis,
              finishedId: stateRef.current.currentId,
            });
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
      if (s.isPlaying) {
        // Fade down, then pause — no hard cut.
        await fadeVolume(sound, 1, 0, FADE_MS);
        await sound.pauseAsync();
        await sound.setVolumeAsync(1);
      } else {
        // Start silent and fade up.
        await sound.setVolumeAsync(0);
        await sound.playAsync();
        await fadeVolume(sound, 0, 1, FADE_MS);
      }
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

      // Play the reading in the selected voice — studio from a static MP3,
      // the others from the on-demand /api/tts endpoint. Fall back to the
      // device's built-in speech only if that fails (e.g. offline).
      const voice = getSelectedVoice();
      const url = narrationUrl(id, voice.slug, voice.kind);
      try {
        const { Audio } = await getAudio();
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          // Explicit progress interval: without it some platforms deliver
          // position updates too rarely for the scrubber to visibly move.
          { shouldPlay: true, progressUpdateIntervalMillis: 250 },
          onStatus as never,
        );
        soundRef.current = sound as unknown as Sound;
        patch({ mode: 'file' });
        return;
      } catch {
        /* fall through to device speech */
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

  // ---- ambient bed (optional, under the narration) ----
  // Driven by observing playback state, so every path — file, speech, pause,
  // finish, stop — keeps the bed in sync without touching each code path.
  const bgRef = useRef<any>(null);
  const bgSlugRef = useRef<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const want = state.isPlaying ? getBackgroundSound().slug : null;
      if (!want) {
        const bg = bgRef.current;
        if (!bg) return;
        // Ease the bed out rather than cutting it.
        try {
          await fadeVolume(bg, BACKGROUND_VOLUME, 0, FADE_MS);
        } catch {}
        if (state.currentId) {
          // Narration paused — hold the bed (resumes at the same spot).
          try {
            await bg.pauseAsync();
          } catch {}
        } else {
          bgRef.current = null;
          bgSlugRef.current = null;
          try {
            await bg.unloadAsync();
          } catch {}
        }
        return;
      }
      if (bgRef.current && bgSlugRef.current === want) {
        // Resume the held bed, restoring its volume and easing back in.
        try {
          await bgRef.current.setVolumeAsync(0);
          await bgRef.current.playAsync();
          await fadeVolume(bgRef.current, 0, BACKGROUND_VOLUME, FADE_MS);
        } catch {}
        return;
      }
      const old = bgRef.current;
      bgRef.current = null;
      if (old) {
        try {
          await old.unloadAsync();
        } catch {}
      }
      try {
        const { Audio } = await getAudio();
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl(want) },
          { shouldPlay: true, isLooping: true, volume: BACKGROUND_VOLUME },
        );
        if (cancelled) {
          (sound as any).unloadAsync().catch(() => {});
          return;
        }
        // isLooping is unreliable for streamed files (the bed can cut out after
        // one pass) — restart it ourselves the moment it reports finished, so
        // the ambient sound stays continuous under the narration.
        (sound as any).setOnPlaybackStatusUpdate((st: any) => {
          if (st?.isLoaded && st.didJustFinish && bgRef.current === sound) {
            (sound as any).replayAsync?.().catch(() => {});
          }
        });
        bgRef.current = sound;
        bgSlugRef.current = want;
      } catch {
        // the bed is a nicety — narration must never fail because of it
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.isPlaying, state.currentId, getAudio]);

  useEffect(() => {
    void loadSelectedVoice();
    void loadBackgroundSound();
    return () => {
      clearTick();
      void unloadFile();
      void stopSpeech();
      const bg = bgRef.current;
      bgRef.current = null;
      if (bg) bg.unloadAsync().catch(() => {});
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
