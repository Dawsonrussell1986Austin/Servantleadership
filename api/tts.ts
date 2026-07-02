/**
 * On-demand ElevenLabs narration.
 *
 * GET /api/tts?id=<readingId>&voice=<slug>   → MP3 of that reading in that voice
 * GET /api/tts?preview=1&voice=<slug>        → MP3 of a short sample
 *
 * The response is cached at the edge (immutable, 1yr), so ElevenLabs is only
 * hit on the first request for a given reading+voice; every play after is
 * served from Vercel's CDN. The API key never leaves the server.
 *
 * "studio" is served as a pre-generated static file (/audio/<id>.mp3), so it
 * isn't handled here — this endpoint covers the other voices.
 */
// Precomputed narration text per reading id (generated from the content at
// build time — see scripts). Keeps this function free of the TS content graph.
import NARRATION from './_narration.json';

const BY_ID: Record<string, string> = NARRATION as Record<string, string>;

// Voice slug → ElevenLabs voice id. Only these are allowed (keeps the endpoint
// from being used to generate arbitrary voices).
const VOICES: Record<string, string> = {
  studio: 'onwK4e9ZLuTAKqWW03F9', // Daniel — British male (also the cached one)
  george: 'JBFqnCBsd6RMkjVDRZzb', // British male, mature
  adam: 'pNInz6obpgDQGcFmaJgB', // American male, deep
  rachel: '21m00Tcm4TlvDq8ikWAM', // American female, calm
  charlotte: 'XB0fDUnXU5powFXDhCwa', // British female, warm
};

const PREVIEW_TEXT =
  'This is how your daily reading will sound — a quiet minute to begin the day well.';

export default async function handler(req: any, res: any) {
  const q = req.query ?? {};
  const voiceSlug = String(q.voice ?? 'studio');
  const voiceId = VOICES[voiceSlug];
  if (!voiceId) {
    res.status(400).json({ error: 'unknown voice' });
    return;
  }

  let text: string;
  if (q.preview) {
    text = PREVIEW_TEXT;
  } else {
    const reading = BY_ID[String(q.id ?? '')];
    if (!reading) {
      res.status(404).json({ error: 'unknown reading' });
      return;
    }
    text = reading;
  }

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'narration not configured' });
    return;
  }

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`,
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
      res.status(502).json({ error: 'tts_failed', detail: detail.slice(0, 200) });
      return;
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.status(200).send(buf);
  } catch (e: any) {
    res.status(502).json({ error: 'tts_error', detail: String(e).slice(0, 200) });
  }
}
