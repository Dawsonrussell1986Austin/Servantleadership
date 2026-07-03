/**
 * The user's personal, on-device collection:
 *  - saved: lines they highlighted ("words that held me")
 *  - prayers: things they're praying about, tied to a reading, that the app
 *    gently resurfaces later.
 * All local, persisted via AsyncStorage. Nothing leaves the device.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { getItem, setItem } from './storage';

export type SavedLine = {
  id: string;
  readingId: string;
  readingTitle: string;
  text: string;
  reference?: string;
  createdAt: number;
};

export type Prayer = {
  id: string;
  readingId: string;
  readingTitle: string;
  text: string;
  createdAt: number;
  answered: boolean;
};

const SAVED_KEY = 'founded.saved';
const PRAYERS_KEY = 'founded.prayers';

/**
 * Scheduled follow-up for a saved prayer, RESURFACE_AFTER_DAYS out. Delivered
 * as a local notification, so a paired Apple Watch gets it on the wrist too.
 */
async function schedulePrayerFollowUp(prayer: { id: string; text: string }): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    const perms = await Notifications.getPermissionsAsync();
    if (!perms.granted) return; // never prompt from here; reminders own the ask
    const snippet =
      prayer.text.length > 90 ? `${prayer.text.slice(0, 90)}…` : prayer.text;
    await Notifications.scheduleNotificationAsync({
      identifier: `prayer-${prayer.id}`,
      content: {
        title: 'A while ago, you prayed',
        body: `“${snippet}” — how is it going?`,
        data: { url: '/prayers' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: RESURFACE_AFTER_DAYS * 86400,
      },
    });
  } catch {
    /* follow-up is a nicety */
  }
}

async function cancelPrayerFollowUp(id: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelScheduledNotificationAsync(`prayer-${id}`);
  } catch {
    /* ignore */
  }
}

/** Prayers older than this (and not answered) get gently resurfaced. */
export const RESURFACE_AFTER_DAYS = 12;

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type PersonalState = {
  ready: boolean;
  saved: SavedLine[];
  prayers: Prayer[];
  addSaved: (v: Omit<SavedLine, 'id' | 'createdAt'>) => void;
  removeSaved: (id: string) => void;
  isSaved: (readingId: string, text: string) => boolean;
  addPrayer: (v: Omit<Prayer, 'id' | 'createdAt' | 'answered'>) => void;
  setPrayerAnswered: (id: string, answered: boolean) => void;
  removePrayer: (id: string) => void;
  /** The oldest unanswered prayer past the resurface window, if any. */
  resurfacedPrayer: () => Prayer | null;
};

const noop = () => {};
const PersonalContext = createContext<PersonalState>({
  ready: false,
  saved: [],
  prayers: [],
  addSaved: noop,
  removeSaved: noop,
  isSaved: () => false,
  addPrayer: noop,
  setPrayerAnswered: noop,
  removePrayer: noop,
  resurfacedPrayer: () => null,
});

export function PersonalProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedLine[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, p] = await Promise.all([
        getItem<SavedLine[]>(SAVED_KEY, []),
        getItem<Prayer[]>(PRAYERS_KEY, []),
      ]);
      setSaved(s);
      setPrayers(p);
      setReady(true);
    })();
  }, []);

  const persistSaved = (next: SavedLine[]) => {
    setSaved(next);
    setItem(SAVED_KEY, next);
  };
  const persistPrayers = (next: Prayer[]) => {
    setPrayers(next);
    setItem(PRAYERS_KEY, next);
  };

  const addSaved = useCallback(
    (v: Omit<SavedLine, 'id' | 'createdAt'>) => {
      setSaved((prev) => {
        if (prev.some((x) => x.readingId === v.readingId && x.text === v.text)) return prev;
        const next = [{ ...v, id: makeId(), createdAt: Date.now() }, ...prev];
        setItem(SAVED_KEY, next);
        return next;
      });
    },
    [],
  );

  const removeSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.filter((x) => x.id !== id);
      setItem(SAVED_KEY, next);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (readingId: string, text: string) =>
      saved.some((x) => x.readingId === readingId && x.text === text),
    [saved],
  );

  const addPrayer = useCallback((v: Omit<Prayer, 'id' | 'createdAt' | 'answered'>) => {
    const prayer = { ...v, id: makeId(), createdAt: Date.now(), answered: false };
    setPrayers((prev) => {
      const next = [prayer, ...prev];
      setItem(PRAYERS_KEY, next);
      return next;
    });
    // Follow up as a real notification (mirrors to Apple Watch), not just the
    // in-app card. Best-effort: quietly skipped on web or without permission.
    void schedulePrayerFollowUp(prayer);
  }, []);

  const setPrayerAnswered = useCallback((id: string, answered: boolean) => {
    setPrayers((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, answered } : x));
      setItem(PRAYERS_KEY, next);
      return next;
    });
    if (answered) void cancelPrayerFollowUp(id);
  }, []);

  const removePrayer = useCallback((id: string) => {
    setPrayers((prev) => {
      const next = prev.filter((x) => x.id !== id);
      setItem(PRAYERS_KEY, next);
      return next;
    });
    void cancelPrayerFollowUp(id);
  }, []);

  const resurfacedPrayer = useCallback((): Prayer | null => {
    const cutoff = Date.now() - RESURFACE_AFTER_DAYS * 86400000;
    const candidates = prayers
      .filter((p) => !p.answered && p.createdAt <= cutoff)
      .sort((a, b) => a.createdAt - b.createdAt);
    return candidates[0] ?? null;
  }, [prayers]);

  const value = useMemo<PersonalState>(
    () => ({
      ready,
      saved,
      prayers,
      addSaved,
      removeSaved,
      isSaved,
      addPrayer,
      setPrayerAnswered,
      removePrayer,
      resurfacedPrayer,
    }),
    [ready, saved, prayers, addSaved, removeSaved, isSaved, addPrayer, setPrayerAnswered, removePrayer, resurfacedPrayer],
  );

  return <PersonalContext.Provider value={value}>{children}</PersonalContext.Provider>;
}

export function usePersonal() {
  return useContext(PersonalContext);
}
