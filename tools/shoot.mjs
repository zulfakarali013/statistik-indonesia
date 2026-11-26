// Takes the screenshots: serves app/ locally, opens each view in headless Chromium, waits for
// window.__shotReady, saves a JPEG under 256 KiB and a one-line base64 copy for the repo.
// Usage: node tools/shoot.mjs <outdir>

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = new URL('../app/', import.meta.url).pathname;
const outDir = process.argv[2] || 'shots';
mkdirSync(outDir, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const p = join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  try { res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(readFileSync(p)); }
  catch { res.writeHead(404); res.end(); }
}).listen(8093);

const shots = JSON.parse(readFileSync(new URL('../shots.json', import.meta.url)));
const browser = await chromium.launch();
const external = [];
const errors = [];
for (const s of shots) {
  const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: 1 });
  page.on('request', (r) => { if (!r.url().startsWith('http://localhost:8093')) external.push(r.url()); });
  page.on('pageerror', (e) => errors.push(`${s.file}: ${e.message}`));
  await page.goto(`http://localhost:8093/${s.path}`);
  await page.waitForFunction(() => window.__shotReady === true);
  if (s.type) await page.fill('[data-find-input]', s.type);
  if (s.select) await page.selectOption(s.select[0], s.select[1]);
  if (s.select) await page.waitForFunction(() => window.__shotReady === true);
  await page.waitForTimeout(250);
  let q = 82, buf;
  do { buf = await page.screenshot({ type: 'jpeg', quality: q }); q -= 6; } while (buf.length > 250000 && q > 30);
  writeFileSync(join(outDir, s.file), buf);
  writeFileSync(join(outDir, s.file + '.b64'), buf.toString('base64'));
  console.log(s.file, buf.length, 'q', q + 6);
  await page.close();
}
await browser.close();
server.close();
console.log('external requests:', external.length, external.slice(0, 3));
console.log('page errors:', errors.length, errors);
