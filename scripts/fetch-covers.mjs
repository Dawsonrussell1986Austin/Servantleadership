/**
 * Sources business/workspace cover photos from Pexels (no people), downloads a
 * pool of unique candidates as thumbnails for review, and writes metadata.
 *
 * Usage:  PEXELS_API_KEY=xxx node scripts/fetch-covers.mjs
 *
 * Step 1 (this script): fills scratchpad/cand/<id>.jpg + cand.json.
 * Step 2 (manual): review thumbnails, pick the keepers, then finalize-covers.
 */
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error('Missing PEXELS_API_KEY');
  process.exit(1);
}

const OUT = process.env.CAND_DIR || '/tmp/cand';
fs.mkdirSync(OUT, { recursive: true });

// Queries biased toward business/work scenes that are typically PEOPLE-FREE.
const QUERIES = [
  'empty modern office',
  'office desk workspace',
  'minimal desk laptop',
  'city skyline',
  'skyscraper architecture',
  'modern office building',
  'boardroom empty',
  'conference room empty',
  'coworking space empty',
  'glass building facade',
  'business district city',
  'office interior architecture',
  'workspace flat lay',
  'desk coffee notebook',
  'staircase architecture',
  'city street dusk',
  'startup office interior',
  'bookshelf library',
  'rooftop city view',
  'bridge architecture',
];

const PEOPLE = /\b(man|woman|women|men|person|people|girl|boy|guy|lady|male|female|hand|hands|portrait|face|model|worker|team|businessman|businesswoman|she|he|her|his|sitting|standing|holding)\b/i;

const seen = new Set();
const meta = [];

async function searchQuery(q) {
  for (const page of [1, 2]) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=portrait&size=large&per_page=20&page=${page}`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) {
      console.error(`  ${q} p${page}: HTTP ${res.status}`);
      return;
    }
    const data = await res.json();
    for (const p of data.photos ?? []) {
      if (seen.has(p.id)) continue;
      const alt = (p.alt || '').trim();
      if (PEOPLE.test(alt)) continue; // skip obvious people shots by alt text
      seen.add(p.id);
      meta.push({
        id: p.id,
        alt,
        query: q,
        photographer: p.photographer,
        photographer_url: p.photographer_url,
        url: p.url,
        full: p.src.large, // ~940px tall
        thumb: p.src.portrait, // small portrait crop
      });
    }
  }
}

async function download(u, dest) {
  const res = await fetch(u);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

for (const q of QUERIES) {
  await searchQuery(q);
  console.log(`${q}: pool now ${meta.length}`);
}

// Download thumbnails for review.
let ok = 0;
for (const m of meta) {
  try {
    await download(m.thumb, path.join(OUT, `${m.id}.jpg`));
    ok++;
  } catch {
    /* skip */
  }
}

fs.writeFileSync(path.join(OUT, 'cand.json'), JSON.stringify(meta, null, 2));
console.log(`\nCandidates: ${meta.length}, thumbnails saved: ${ok} -> ${OUT}`);
