/**
 * POST /api/subscribe  { email }
 * Adds an email to the Resend "audience" so it receives the daily devotional.
 * Storage is Resend's contact list — no database needed.
 *
 * Env: RESEND_API_KEY, RESEND_AUDIENCE_ID
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(obj));
  };

  if (req.method === 'OPTIONS') return send(200, { ok: true });
  if (req.method !== 'POST') return send(405, { error: 'method_not_allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    if (!body) {
      // read raw stream if body wasn't parsed
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', (c) => (data += c));
        req.on('end', () => {
          try {
            resolve(JSON.parse(data || '{}'));
          } catch {
            resolve({});
          }
        });
        req.on('error', () => resolve({}));
      });
    }

    const email = String((body && body.email) || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return send(400, { error: 'invalid_email' });

    const key = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!key || !audienceId) {
      return send(503, { error: 'not_configured' });
    }

    const r = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!r.ok && r.status !== 409) {
      const detail = await r.text().catch(() => '');
      return send(502, { error: 'subscribe_failed', detail: detail.slice(0, 200) });
    }

    return send(200, { ok: true });
  } catch (e) {
    return send(500, { error: 'server_error', detail: String((e && e.stack) || e).slice(0, 200) });
  }
};
