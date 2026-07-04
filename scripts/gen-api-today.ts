/**
 * Regenerate api/_today.json — the full text of every devotional the daily
 * schedule can serve, keyed by id. Consumed by /api/today so the Apple Watch
 * (and anything else) can show the complete reading, not just the email-length
 * summary in _email.json.
 *
 * Run after editing devotional content:  npx tsx scripts/gen-api-today.ts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getReadingById } from '../src/content';
import EMAIL from '../api/_email.json';

const ids = new Set<string>([
  ...EMAIL.calendar,
  ...EMAIL.restPool,
  ...Object.values(EMAIL.holidays as Record<string, string>),
]);

const content: Record<string, unknown> = {};
let missing = 0;
for (const id of ids) {
  const r = getReadingById(id);
  if (!r) {
    console.warn(`⚠ no reading found for scheduled id "${id}"`);
    missing++;
    continue;
  }
  content[id] = {
    title: r.title,
    situation: r.situation,
    minutes: r.minutes,
    sections: r.sections.map((s) => ({
      type: s.type,
      ...(s.label ? { label: s.label } : {}),
      body: s.body,
      ...(s.reference ? { reference: s.reference } : {}),
    })),
  };
}

const out = join(__dirname, '..', 'api', '_today.json');
writeFileSync(out, JSON.stringify({ content }, null, 1));
console.log(`Wrote ${Object.keys(content).length} readings to api/_today.json (${missing} missing)`);
