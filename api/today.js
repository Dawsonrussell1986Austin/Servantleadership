/**
 * GET /api/today — today's scheduled devotional as JSON.
 * Consumed by the Apple Watch app (and anything else that wants it).
 * Same schedule logic as the daily email cron.
 */
const DATA = require('./_email.json');
// Full text of every scheduled devotional (generated: scripts/gen-api-today.ts).
const FULL = require('./_today.json');

function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000);
}

function scheduledId(date) {
  const key = `${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  if (DATA.holidays[key]) return DATA.holidays[key];
  if (date.getUTCDay() === 0) {
    const week = Math.floor((dayOfYear(date) - 1) / 7);
    return DATA.restPool[week % DATA.restPool.length];
  }
  const doy = dayOfYear(date);
  return DATA.calendar[(doy - 1) % DATA.calendar.length];
}

// The client sends its LOCAL date as ?date=YYYY-MM-DD so the reading rolls over
// at the user's local midnight, not UTC midnight. We build the date at UTC noon
// so the UTC-based scheduledId reads back the exact calendar day requested
// (avoids any off-by-one from timezone parsing). Falls back to server time.
function requestedDate(req) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const d = url.searchParams.get('date');
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const dt = new Date(`${d}T12:00:00Z`);
      if (!Number.isNaN(dt.getTime())) return dt;
    }
  } catch {
    /* fall through */
  }
  return new Date();
}

module.exports = function handler(req, res) {
  const id = scheduledId(requestedDate(req));
  const reading = DATA.content[id];
  res.statusCode = reading ? 200 : 500;
  res.setHeader('Content-Type', 'application/json');
  // Cache at the edge for an hour; the payload only changes once a day.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.end(
    JSON.stringify(
      reading
        ? {
            id,
            title: reading.title,
            situation: reading.situation,
            ref: reading.ref,
            verse: reading.verse,
            prayer: reading.prayer || '',
            benediction: reading.benediction || '',
            minutes: (FULL.content[id] || {}).minutes || 0,
            // The complete reading, section by section (the watch shows it all).
            sections: (FULL.content[id] || {}).sections || [],
          }
        : { error: 'no_reading', id },
    ),
  );
};
