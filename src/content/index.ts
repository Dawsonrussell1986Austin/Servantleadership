import { Liturgy } from './types';
import { LITURGIES } from './liturgies';
import { DEVOTIONALS } from './devotionals';

export * from './types';
export {
  LITURGIES,
  getLiturgyById,
  getLiturgiesByCategory,
} from './liturgies';
export {
  DEVOTIONALS,
  getDevotionalById,
  getDailyDevotional,
} from './devotionals';
export { scheduledDevotionalId } from './schedule';

/** Everything readable in the app — devotionals + liturgies. */
export const ALL_READINGS: Liturgy[] = [...DEVOTIONALS, ...LITURGIES];

/** Resolve any reading (devotional or liturgy) by id. */
export const getReadingById = (id: string): Liturgy | undefined =>
  ALL_READINGS.find((r) => r.id === id);

/** The label shown for a reading: "Devotional" or "Liturgy". */
export const readingKindLabel = (reading: Liturgy): string =>
  reading.kind === 'devotional' ? 'Devotional' : 'Liturgy';
