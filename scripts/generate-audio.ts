/**
 * Pre-generate ElevenLabs narration for every reading (devotionals + liturgies)
 * and save them as static MP3s under public/audio/<id>.mp3. The app streams
 * these files; no API key ever ships to the client.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... npm run audio:generate
 *
 * Options (env):
 *   ELEVENLABS_VOICE_ID   voice to use (default: a calm, warm preset)
 *   ELEVENLABS_MODEL_ID   model (default: eleven_multilingual_v2)
 *   FORCE=1               re-generate even if the file already exists
 *   ONLY=<id>[,<id>]      only generate these reading ids
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_READINGS } from '../src/content';
import { buildNarration } from '../src/content/narration';

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'onwK4e9ZLuTAKqWW03F9'; // "Daniel" — calm, measured
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const FORCE = process.env.FORCE === '1';
const ONLY = (process.env.ONLY || '')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/audio');

async function ttsToFile(text: string, outPath: string): Promise<void> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY as string,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0 },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 300)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

async function main() {
  if (!API_KEY) {
    console.error('✗ Missing ELEVENLABS_API_KEY. Set it and re-run.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const readings = ONLY.length
    ? ALL_READINGS.filter((r) => ONLY.includes(r.id))
    : ALL_READINGS;

  console.log(
    `Generating narration for ${readings.length} reading(s) → ${OUT_DIR}`,
  );
  console.log(`Voice: ${VOICE_ID}   Model: ${MODEL_ID}\n`);

  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (const reading of readings) {
    const outPath = path.join(OUT_DIR, `${reading.id}.mp3`);
    if (!FORCE && fs.existsSync(outPath)) {
      skipped++;
      console.log(`• skip   ${reading.id} (exists)`);
      continue;
    }
    try {
      const text = buildNarration(reading);
      await ttsToFile(text, outPath);
      made++;
      console.log(`✓ made   ${reading.id}`);
    } catch (err) {
      failed++;
      console.error(`✗ fail   ${reading.id}: ${(err as Error).message}`);
    }
  }

  console.log(`\nDone. ${made} generated, ${skipped} skipped, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

void main();
