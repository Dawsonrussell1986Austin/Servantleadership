/**
 * On-demand ElevenLabs narration (plain CommonJS so Vercel runs it without a
 * TypeScript build step).
 *
 * GET /api/tts?id=<readingId>&voice=<slug>   → MP3 of that reading in that voice
 * GET /api/tts?preview=1&voice=<slug>        → MP3 of a short sample
 *
 * Edge-cached immutable so ElevenLabs is hit once per reading+voice. Key stays
 * server-side.
 */
const NARRATION = require('./_narration.json');

const VOICES = {
  studio: 'onwK4e9ZLuTAKqWW03F9', // Daniel — British male (also the cached one)
  george: 'JBFqnCBsd6RMkjVDRZzb', // British male, mature
  adam: 'pNInz6obpgDQGcFmaJgB', // American male, deep
  rachel: '21m00Tcm4TlvDq8ikWAM', // American female, calm
  charlotte: 'XB0fDUnXU5powFXDhCwa', // British female, warm
};

const PREVIEW_TEXT =
  'This is how your daily reading will sound — a quiet minute to begin the day well.';

module.exports = async function handler(req, res) {
  const sendJson = (code, obj) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };

  try {
    const url = new URL(req.url || '', 'http://localhost');
    const voiceSlug = url.searchParams.get('voice') || 'studio';
    const voiceId = VOICES[voiceSlug];
    if (!voiceId) return sendJson(400, { error: 'unknown voice' });

    let text;
    if (url.searchParams.get('preview')) {
      text = PREVIEW_TEXT;
    } else {
      const id = url.searchParams.get('id') || '';
      text = NARRATION[id];
      if (!text) return sendJson(404, { error: 'unknown reading' });
    }

    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) return sendJson(503, { error: 'narration not configured' });

    const r = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId + '?output_format=mp3_44100_64',
      {
        method: 'POST',
        headers: {
          'xi-api-key': key,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0 },
        }),
      },
    );

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      return sendJson(502, { error: 'tts_failed', status: r.status, detail: detail.slice(0, 200) });
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.end(buf);
  } catch (e) {
    try {
      sendJson(500, { error: 'tts_error', detail: String((e && e.stack) || e).slice(0, 300) });
    } catch (e2) {
      /* nothing else to do */
    }
  }
};
