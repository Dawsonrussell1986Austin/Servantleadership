/**
 * GET /api/cron/daily  — sends the day's devotional to every subscriber.
 * Triggered by Vercel Cron (see vercel.json). Protected by CRON_SECRET.
 *
 * Env: RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM, CRON_SECRET, APP_URL
 */
const DATA = require('../_email.json');

function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000); // 1..366
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

function emailHtml(reading, id, appUrl) {
  const readUrl = `${appUrl}/liturgy/${id}`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F4F0E9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F0E9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FBF9F4;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 28px 8px 28px;">
          <div style="font:700 12px/1 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:2px;color:#BF4A2B;">FOUNDED · TODAY’S DEVOTIONAL</div>
        </td></tr>
        <tr><td style="padding:8px 28px 0 28px;">
          <div style="font:400 28px/1.2 Georgia,'Times New Roman',serif;color:#1A1613;">${reading.title}</div>
          <div style="font:italic 16px/1.5 Georgia,serif;color:#5F574D;margin-top:8px;">${reading.situation}</div>
        </td></tr>
        <tr><td style="padding:20px 28px 0 28px;">
          <div style="border-left:3px solid #BF4A2B;padding-left:16px;">
            <div style="font:italic 18px/1.55 Georgia,serif;color:#1A1613;">${reading.verse}</div>
            <div style="font:700 12px/1 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:1px;color:#8A8177;margin-top:12px;">${reading.ref}</div>
          </div>
        </td></tr>
        <tr><td style="padding:28px;">
          <a href="${readUrl}" style="display:inline-block;background:#BF4A2B;color:#FBF9F4;text-decoration:none;font:700 15px/1 -apple-system,Helvetica,Arial,sans-serif;padding:14px 24px;border-radius:14px;">Read today’s devotional →</a>
        </td></tr>
        <tr><td style="padding:0 28px 28px 28px;">
          <div style="font:400 12px/1.5 -apple-system,Helvetica,Arial,sans-serif;color:#A79F93;">A quiet few minutes for the work of building something.</div>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

module.exports = async function handler(req, res) {
  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };

  try {
    // Auth: Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Also allow
    // ?key= for manual runs.
    const secret = process.env.CRON_SECRET;
    const url = new URL(req.url || '', 'http://localhost');
    const auth = req.headers?.authorization || '';
    const provided = auth.replace(/^Bearer\s+/i, '') || url.searchParams.get('key') || '';
    if (secret && provided !== secret) return send(401, { error: 'unauthorized' });

    const key = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const from = process.env.RESEND_FROM || 'Founded <daily@foundedapp.com>';
    const appUrl = (process.env.APP_URL || 'https://servant-liturgies.vercel.app').replace(/\/$/, '');
    if (!key || !audienceId) return send(503, { error: 'not_configured' });

    const now = new Date();
    const id = scheduledId(now);
    const reading = DATA.content[id];
    if (!reading) return send(500, { error: 'no_reading', id });

    // Subscribers
    const cr = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!cr.ok) {
      const d = await cr.text().catch(() => '');
      return send(502, { error: 'contacts_failed', detail: d.slice(0, 200) });
    }
    const contacts = (await cr.json()).data || [];
    const recipients = contacts.filter((c) => !c.unsubscribed).map((c) => c.email);

    const html = emailHtml(reading, id, appUrl);
    const subject = `Today: ${reading.title}`;

    let sent = 0;
    for (const email of recipients) {
      try {
        const er = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to: [email], subject, html }),
        });
        if (er.ok) sent++;
      } catch {
        /* skip one bad recipient */
      }
    }

    return send(200, { ok: true, id, recipients: recipients.length, sent });
  } catch (e) {
    return send(500, { error: 'server_error', detail: String((e && e.stack) || e).slice(0, 200) });
  }
};
