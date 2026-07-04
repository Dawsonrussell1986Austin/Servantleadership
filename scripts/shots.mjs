// One-off App Store screenshot generator. Serves the web export (dist/) and
// drives Chromium through the key screens at iPhone 6.9" (1290x2796) and
// iPad 13" (2048x2732). Not part of the app — run manually.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
const OUT = path.resolve('screenshots');
const PORT = 8099;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ico': 'image/x-icon',
};

// Resolve a URL path to a file in dist, handling expo-router's static output
// and dynamic routes (/liturgy/<id> -> liturgy/[id].html).
function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [];
  if (clean === '/' ) candidates.push('index.html');
  candidates.push(clean.slice(1));
  candidates.push(clean.slice(1) + '.html');
  candidates.push(path.join(clean.slice(1), 'index.html'));
  if (clean.startsWith('/liturgy/')) candidates.push('liturgy/[id].html');
  if (clean.startsWith('/category/')) candidates.push('category/[id].html');
  for (const c of candidates) {
    const f = path.join(DIST, c);
    if (existsSync(f) && !f.endsWith(path.sep)) return f;
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const f = resolveFile(req.url);
  if (!f) { res.statusCode = 404; res.end('not found'); return; }
  try {
    const body = await readFile(f);
    res.setHeader('Content-Type', MIME[path.extname(f)] ?? 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 500; res.end('err');
  }
});

const base = `http://localhost:${PORT}`;
const READING = 'out-of-cash';

// Each shot: file name, route, and optional click-throughs (button text) to
// reach an inner onboarding step before capturing.
const SHOTS = [
  { name: 'welcome', path: '/onboarding' },
  { name: 'carrying', path: '/onboarding', clicks: ['Begin'] },
  { name: 'trial', path: '/onboarding', clicks: ['Begin', 'Continue', 'Continue', 'Continue', 'Not now'] },
  { name: 'home', path: '/', onboarded: true },
  { name: 'reading', path: `/liturgy/${READING}`, onboarded: true },
  { name: 'calendar', path: '/devotionals', onboarded: true },
  { name: 'library', path: '/', onboarded: true, scrollTo: 1500 },
];

const DEVICES = [
  { tag: 'iphone', width: 430, height: 932, scale: 3 }, // -> 1290 x 2796
  { tag: 'ipad', width: 1024, height: 1366, scale: 2 }, // -> 2048 x 2732
];

async function run() {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  let n = 1;
  for (const shot of SHOTS) {
    for (const dev of DEVICES) {
      const ctx = await browser.newContext({
        viewport: { width: dev.width, height: dev.height },
        deviceScaleFactor: dev.scale,
      });
      const page = await ctx.newPage();
      if (shot.onboarded) {
        await page.addInitScript(() => {
          try {
            localStorage.setItem('founded.onboarding.v1', JSON.stringify({ onboarded: true, interests: [] }));
          } catch {}
        });
      }
      await page.goto(base + shot.path, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(1600);
      if (shot.onboarded) {
        // Dismiss the one-time "get it in your inbox" sheet for a clean shot.
        try {
          await page.getByText('Not now', { exact: true }).first().click({ timeout: 2500 });
        } catch {}
      }
      await page.waitForTimeout(1400); // fonts, images, fade-ins
      for (const label of shot.clicks ?? []) {
        try {
          await page.getByText(label, { exact: true }).first().click({ timeout: 4000 });
          await page.waitForTimeout(1200);
        } catch (e) {
          console.log(`  (click "${label}" skipped: ${e.message.split('\n')[0]})`);
        }
      }
      if (shot.scrollTo) {
        await page.mouse.wheel(0, shot.scrollTo);
        await page.waitForTimeout(900);
      }
      const file = path.join(OUT, `${String(n).padStart(2, '0')}-${dev.tag}-${shot.name}.png`);
      await page.screenshot({ path: file });
      console.log('saved', path.relative(process.cwd(), file));
      await ctx.close();
    }
    n++;
  }
  await browser.close();
  server.close();
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
