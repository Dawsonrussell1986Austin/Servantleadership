import { Liturgy } from './types';
import { DURATIONS } from './durations';

/** Actual narration length in whole minutes (rounded, min 1), if we have it. */
export function listenMinutes(id: string): number | undefined {
  const s = DURATIONS[id];
  return s ? Math.max(1, Math.round(s / 60)) : undefined;
}

/**
 * A label that distinguishes the contemplative read estimate (the `minutes`
 * field) from the actual audio length, e.g. "4 min read · 2 min listen".
 */
export function lengthLabel(r: Liturgy): string {
  const lm = listenMinutes(r.id);
  return lm ? `${r.minutes} min read · ${lm} min listen` : `${r.minutes} min read`;
}
