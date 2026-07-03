/**
 * GET /api/today — today's scheduled devotional as JSON.
 * Consumed by the Apple Watch app (and anything else that wants it).
 * Same schedule logic as the daily email cron.
 */
const DATA = require('./_email.json');

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

module.exports = function handler(req, res) {
  const id = scheduledId(new Date());
  const reading = DATA.content[id];
  res.statusCode = reading ? 200 : 500;
  res.setHeader('Content-Type', 'application/json');
  // Cache at the edge for an hour; the payload only changes once a day.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.end(
    JSON.stringify(
      reading
        ? { id, title: reading.title, situation: reading.situation, ref: reading.ref, verse: reading.verse }
        : { error: 'no_reading', id },
    ),
  );
};
