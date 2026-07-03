/**
 * Tracks which readings the user has opened ("read") and played ("listened"),
 * persisted on-device via AsyncStorage. Powers the "what have I done / missed"
 * view. All local — nothing leaves the device.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getItem, setItem } from './storage';
import { useAudio } from '../audio/AudioProvider';

const READ_KEY = 'founded.progress.read';
const LISTENED_KEY = 'founded.progress.listened';

type ProgressState = {
  ready: boolean;
  read: Set<string>;
  listened: Set<string>;
  hasRead: (id: string) => boolean;
  hasListened: (id: string) => boolean;
  isDone: (id: string) => boolean;
  markRead: (id: string) => void;
  markListened: (id: string) => void;
};

const ProgressContext = createContext<ProgressState>({
  ready: false,
  read: new Set(),
  listened: new Set(),
  hasRead: () => false,
  hasListened: () => false,
  isDone: () => false,
  markRead: () => {},
  markListened: () => {},
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [read, setRead] = useState<Set<string>>(new Set());
  const [listened, setListened] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [r, l] = await Promise.all([
        getItem<string[]>(READ_KEY, []),
        getItem<string[]>(LISTENED_KEY, []),
      ]);
      setRead(new Set(r));
      setListened(new Set(l));
      setReady(true);
    })();
  }, []);

  const markRead = useCallback((id: string) => {
    if (!id) return;
    setRead((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      setItem(READ_KEY, [...next]);
      return next;
    });
  }, []);

  const markListened = useCallback((id: string) => {
    if (!id) return;
    setListened((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      setItem(LISTENED_KEY, [...next]);
      return next;
    });
  }, []);

  const value = useMemo<ProgressState>(
    () => ({
      ready,
      read,
      listened,
      hasRead: (id) => read.has(id),
      hasListened: (id) => listened.has(id),
      isDone: (id) => read.has(id) || listened.has(id),
      markRead,
      markListened,
    }),
    [ready, read, listened, markRead, markListened],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return useContext(ProgressContext);
}

/**
 * Invisible bridge: watches the audio player and marks a reading as
 * "listened" only once playback actually reaches the end (>= 95%, so the
 * closing breath doesn't have to fully run out). Rendered once, inside both
 * the Audio and Progress providers. markListened is idempotent.
 *
 * Device-speech fallback exposes no playback position, so those (rare) plays
 * still count from the start — better than never counting at all.
 */
export function ListenTracker() {
  const audio = useAudio();
  const { markListened } = useProgress();

  // Primary: the provider's explicit end-of-playback signal. The position
  // check stays as a belt-and-braces fallback (e.g. seeking to the end).
  const nearEnd =
    audio.currentId != null &&
    audio.durationMillis > 0 &&
    audio.positionMillis >= audio.durationMillis * 0.95;

  useEffect(() => {
    if (audio.finishedId) markListened(audio.finishedId);
  }, [audio.finishedId, markListened]);

  useEffect(() => {
    if (nearEnd && audio.currentId) markListened(audio.currentId);
  }, [nearEnd, audio.currentId, markListened]);
  return null;
}
