/**
 * The daily devotional SCHEDULE — tied to the calendar date so a given day
 * always shows the same reading and never shifts when new devotionals are added.
 *
 *   1. Fixed-date holidays get a fitting reading (HOLIDAYS).
 *   2. Sundays draw from a rest/Sabbath pool (REST_POOL), rotating weekly.
 *   3. Every other day maps to a frozen slot in CALENDAR by day-of-year.
 *
 * CALENDAR is data, not a formula — it is deliberately frozen. When you add new
 * devotionals later, swap ids into specific slots rather than regenerating the
 * whole array, so existing dates stay put.
 */

export const REST_POOL: string[] = ['d-r-sabbath', 'd-rest', 'd-r-burnout', 'd-contentment', 'd-patience', 'd-r-identity', 'd-trust-outcomes', 'd-gratitude'];

export const HOLIDAYS: Record<string, string> = {
  '1-1': 'd-r-why',
  '7-4': 'd-rest',
  '12-24': 'd-r-sabbath',
  '12-25': 'd-gratitude',
  '12-31': 'd-contentment'
};

// day-of-year (0-indexed) → devotional id, for ordinary days. Frozen.
export const CALENDAR: string[] = [
  'd-calling', 'd-f-unknown', 'd-m-cashflow', 'd-p-hiring', 'd-r-long-middle', 'd-integrity',
  'd-f-risk', 'd-m-unseenprovision', 'd-p-letting-go', 'd-r-comparison', 'd-ambition', 'd-f-failure',
  'd-m-greed', 'd-p-criticism', 'd-r-success', 'd-generosity', 'd-f-money', 'd-m-scarcegiving',
  'd-p-humility', 'd-r-failure', 'd-identity', 'd-f-waiting', 'd-m-enough', 'd-p-listening',
  'd-r-finish', 'd-diligence', 'd-f-leap', 'd-m-debt', 'd-p-forgiving', 'd-r-small-beginnings',
  'd-serving-others', 'd-f-opinions', 'd-m-tool', 'd-p-serving', 'd-stewardship', 'd-f-worry',
  'd-m-firstfruits', 'd-p-loneliness', 'd-excellence', 'd-f-start', 'd-m-windfall', 'd-p-credit',
  'd-humility', 'd-f-pressure', 'd-m-longgame', 'd-p-feedback', 'd-courage', 'd-perseverance',
  'd-wisdom', 'd-servant-leader', 'd-failure', 'd-purpose', 'd-calling', 'd-f-unknown',
  'd-m-cashflow', 'd-p-hiring', 'd-r-long-middle', 'd-integrity', 'd-f-risk', 'd-m-unseenprovision',
  'd-p-letting-go', 'd-r-comparison', 'd-ambition', 'd-f-failure', 'd-m-greed', 'd-p-criticism',
  'd-r-success', 'd-generosity', 'd-f-money', 'd-m-scarcegiving', 'd-p-humility', 'd-r-failure',
  'd-identity', 'd-f-waiting', 'd-m-enough', 'd-p-listening', 'd-r-finish', 'd-diligence',
  'd-f-leap', 'd-m-debt', 'd-p-forgiving', 'd-r-small-beginnings', 'd-serving-others', 'd-f-opinions',
  'd-m-tool', 'd-p-serving', 'd-stewardship', 'd-f-worry', 'd-m-firstfruits', 'd-p-loneliness',
  'd-excellence', 'd-f-start', 'd-m-windfall', 'd-p-credit', 'd-humility', 'd-f-pressure',
  'd-m-longgame', 'd-p-feedback', 'd-courage', 'd-perseverance', 'd-wisdom', 'd-servant-leader',
  'd-failure', 'd-purpose', 'd-calling', 'd-f-unknown', 'd-m-cashflow', 'd-p-hiring',
  'd-r-long-middle', 'd-integrity', 'd-f-risk', 'd-m-unseenprovision', 'd-p-letting-go', 'd-r-comparison',
  'd-ambition', 'd-f-failure', 'd-m-greed', 'd-p-criticism', 'd-r-success', 'd-generosity',
  'd-f-money', 'd-m-scarcegiving', 'd-p-humility', 'd-r-failure', 'd-identity', 'd-f-waiting',
  'd-m-enough', 'd-p-listening', 'd-r-finish', 'd-diligence', 'd-f-leap', 'd-m-debt',
  'd-p-forgiving', 'd-r-small-beginnings', 'd-serving-others', 'd-f-opinions', 'd-m-tool', 'd-p-serving',
  'd-stewardship', 'd-f-worry', 'd-m-firstfruits', 'd-p-loneliness', 'd-excellence', 'd-f-start',
  'd-m-windfall', 'd-p-credit', 'd-humility', 'd-f-pressure', 'd-m-longgame', 'd-p-feedback',
  'd-courage', 'd-perseverance', 'd-wisdom', 'd-servant-leader', 'd-failure', 'd-purpose',
  'd-calling', 'd-f-unknown', 'd-m-cashflow', 'd-p-hiring', 'd-r-long-middle', 'd-integrity',
  'd-f-risk', 'd-m-unseenprovision', 'd-p-letting-go', 'd-r-comparison', 'd-ambition', 'd-f-failure',
  'd-m-greed', 'd-p-criticism', 'd-r-success', 'd-generosity', 'd-f-money', 'd-m-scarcegiving',
  'd-p-humility', 'd-r-failure', 'd-identity', 'd-f-waiting', 'd-m-enough', 'd-p-listening',
  'd-r-finish', 'd-diligence', 'd-f-leap', 'd-m-debt', 'd-p-forgiving', 'd-r-small-beginnings',
  'd-serving-others', 'd-f-opinions', 'd-m-tool', 'd-p-serving', 'd-stewardship', 'd-f-worry',
  'd-m-firstfruits', 'd-p-loneliness', 'd-excellence', 'd-f-start', 'd-m-windfall', 'd-p-credit',
  'd-humility', 'd-f-pressure', 'd-m-longgame', 'd-p-feedback', 'd-courage', 'd-perseverance',
  'd-wisdom', 'd-servant-leader', 'd-failure', 'd-purpose', 'd-calling', 'd-f-unknown',
  'd-m-cashflow', 'd-p-hiring', 'd-r-long-middle', 'd-integrity', 'd-f-risk', 'd-m-unseenprovision',
  'd-p-letting-go', 'd-r-comparison', 'd-ambition', 'd-f-failure', 'd-m-greed', 'd-p-criticism',
  'd-r-success', 'd-generosity', 'd-f-money', 'd-m-scarcegiving', 'd-p-humility', 'd-r-failure',
  'd-identity', 'd-f-waiting', 'd-m-enough', 'd-p-listening', 'd-r-finish', 'd-diligence',
  'd-f-leap', 'd-m-debt', 'd-p-forgiving', 'd-r-small-beginnings', 'd-serving-others', 'd-f-opinions',
  'd-m-tool', 'd-p-serving', 'd-stewardship', 'd-f-worry', 'd-m-firstfruits', 'd-p-loneliness',
  'd-excellence', 'd-f-start', 'd-m-windfall', 'd-p-credit', 'd-humility', 'd-f-pressure',
  'd-m-longgame', 'd-p-feedback', 'd-courage', 'd-perseverance', 'd-wisdom', 'd-servant-leader',
  'd-failure', 'd-purpose', 'd-calling', 'd-f-unknown', 'd-m-cashflow', 'd-p-hiring',
  'd-r-long-middle', 'd-integrity', 'd-f-risk', 'd-m-unseenprovision', 'd-p-letting-go', 'd-r-comparison',
  'd-ambition', 'd-f-failure', 'd-m-greed', 'd-p-criticism', 'd-r-success', 'd-generosity',
  'd-f-money', 'd-m-scarcegiving', 'd-p-humility', 'd-r-failure', 'd-identity', 'd-f-waiting',
  'd-m-enough', 'd-p-listening', 'd-r-finish', 'd-diligence', 'd-f-leap', 'd-m-debt',
  'd-p-forgiving', 'd-r-small-beginnings', 'd-serving-others', 'd-f-opinions', 'd-m-tool', 'd-p-serving',
  'd-stewardship', 'd-f-worry', 'd-m-firstfruits', 'd-p-loneliness', 'd-excellence', 'd-f-start',
  'd-m-windfall', 'd-p-credit', 'd-humility', 'd-f-pressure', 'd-m-longgame', 'd-p-feedback',
  'd-courage', 'd-perseverance', 'd-wisdom', 'd-servant-leader', 'd-failure', 'd-purpose',
  'd-calling', 'd-f-unknown', 'd-m-cashflow', 'd-p-hiring', 'd-r-long-middle', 'd-integrity',
  'd-f-risk', 'd-m-unseenprovision', 'd-p-letting-go', 'd-r-comparison', 'd-ambition', 'd-f-failure',
  'd-m-greed', 'd-p-criticism', 'd-r-success', 'd-generosity', 'd-f-money', 'd-m-scarcegiving',
  'd-p-humility', 'd-r-failure', 'd-identity', 'd-f-waiting', 'd-m-enough', 'd-p-listening',
  'd-r-finish', 'd-diligence', 'd-f-leap', 'd-m-debt', 'd-p-forgiving', 'd-r-small-beginnings',
  'd-serving-others', 'd-f-opinions', 'd-m-tool', 'd-p-serving', 'd-stewardship', 'd-f-worry',
  'd-m-firstfruits', 'd-p-loneliness', 'd-excellence', 'd-f-start', 'd-m-windfall', 'd-p-credit',
  'd-humility', 'd-f-pressure', 'd-m-longgame', 'd-p-feedback', 'd-courage', 'd-perseverance',
  'd-wisdom', 'd-servant-leader', 'd-failure', 'd-purpose', 'd-calling', 'd-f-unknown',
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000); // 1..366
}

/** The devotional id scheduled for a given date. Deterministic and stable. */
export function scheduledDevotionalId(date: Date): string {
  const key = `${date.getMonth() + 1}-${date.getDate()}`;
  if (HOLIDAYS[key]) return HOLIDAYS[key];
  if (date.getDay() === 0) {
    const week = Math.floor((dayOfYear(date) - 1) / 7);
    return REST_POOL[week % REST_POOL.length];
  }
  const doy = dayOfYear(date);
  return CALENDAR[(doy - 1) % CALENDAR.length];
}
