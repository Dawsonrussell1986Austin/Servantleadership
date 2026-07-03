import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduledDevotionalId } from '../content/schedule';
import { DEVOTIONALS } from '../content/devotionals';

/**
 * User-driven changes to the daily schedule ("swipe for another devotional").
 *
 * Semantics are a SWAP, not a discard: when today's reading is swapped for X,
 * X's next scheduled date this year is given today's original reading. Every
 * devotional still appears exactly once; nothing repeats because of a swipe.
 * Keys are year-specific (YYYY-M-D), so next year the frozen calendar rules
 * again.
 */
type Overrides = Record<string, string>;

const KEY = 'founded:schedule-overrides';

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

type ScheduleState = {
  ready: boolean;
  /** The devotional id for a date, honoring any swaps. */
  resolveId: (date: Date) => string;
  /** Swap today's devotional for a fresh one; returns the new id. */
  swapToday: () => string;
};

const ScheduleContext = createContext<ScheduleState>({
  ready: false,
  resolveId: (d) => scheduledDevotionalId(d),
  swapToday: () => scheduledDevotionalId(new Date()),
});

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setOverrides(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const resolveId = useCallback(
    (date: Date) => overrides[dateKey(date)] ?? scheduledDevotionalId(date),
    [overrides],
  );

  const swapToday = useCallback(() => {
    const today = new Date();
    const todayId = overrides[dateKey(today)] ?? scheduledDevotionalId(today);

    // Walk forward through the rest of the year and pick a nearby upcoming
    // devotional to trade places with — random among the next 14 distinct ones
    // so repeated swipes feel fresh.
    const upcoming: { key: string; id: string }[] = [];
    const seen = new Set<string>([todayId]);
    const cursor = new Date(today);
    const year = today.getFullYear();
    while (cursor.getFullYear() === year && upcoming.length < 14) {
      cursor.setDate(cursor.getDate() + 1);
      const k = dateKey(cursor);
      const id = overrides[k] ?? scheduledDevotionalId(cursor);
      if (!seen.has(id)) {
        seen.add(id);
        upcoming.push({ key: k, id });
      }
    }
    if (upcoming.length === 0) return todayId; // late December — nothing to trade

    const pick = upcoming[Math.floor(Math.random() * upcoming.length)];
    const next: Overrides = {
      ...overrides,
      [dateKey(today)]: pick.id, // today shows the traded-in reading
      [pick.key]: todayId, // its old slot gets today's original
    };
    setOverrides(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    return pick.id;
  }, [overrides]);

  const value = useMemo(
    () => ({ ready, resolveId, swapToday }),
    [ready, resolveId, swapToday],
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

export function useSchedule() {
  return useContext(ScheduleContext);
}

/** Safety net: an override should always point at a real devotional. */
export function isValidDevotionalId(id: string): boolean {
  return DEVOTIONALS.some((d) => d.id === id);
}
