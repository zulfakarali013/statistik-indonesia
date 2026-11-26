// Clicks through the site's controls and checks each does what it says. Usage: node tools/control-test.mjs
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = new URL('../app/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer((req, res) => {
  const p = join(root, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  try { res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(readFileSync(p)); } catch { res.writeHead(404); res.end(); }
}).listen(8094);
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
const ready = () => page.waitForFunction(() => window.__shotReady === true);
const ok = (name, cond) => console.log(cond ? 'PASS' : 'FAIL', name);
await page.goto('http://localhost:8094/#/indicator/life'); await ready();
await page.click('[data-pin]');
await page.goto('http://localhost:8094/#/'); await ready();
ok('pin shows on overview', (await page.locator('text=Your pinned figures').count()) === 1);
await page.goto('http://localhost:8094/#/provinces?i=poor'); await ready();
await page.selectOption('[data-prov]', 'ipm'); await ready();
ok('province figure picker', (await page.locator('h2:has-text("Human Development Index")').count()) >= 1);
await page.click('.tiles-map a >> nth=10'); await ready();
ok('tile click switches province', (await page.textContent('.prov-name')) === 'DKI Jakarta');
await page.fill('[data-find-input]', 'papua');
ok('province search', (await page.textContent('[data-find-count]')).startsWith('6 of'));
await page.goto('http://localhost:8094/#/sources'); await ready();
console.log('  sources:', (await page.textContent('h2:has-text("year-by-year")')).trim());
await page.goto('http://localhost:8094/#/compare'); await ready();
await page.selectOption('[data-compare="c"]', 'Thailand'); await ready();
ok('compare country picker', (await page.locator('h2:has-text("Indonesia vs Thailand")').count()) === 1);
await page.goto('http://localhost:8094/#/data'); await ready();
const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-csv="all"]')]);
ok('CSV download', dl.suggestedFilename() === 'indonesia-all.csv');
await page.goto('http://localhost:8094/#/nope'); await ready();
ok('404 page', (await page.locator('text=Page not found').count()) === 1);
await page.goto('http://localhost:8094/#/?y=2010'); await ready();
ok('year picker via hash', (await page.locator('text=Headline figures, 2010').count()) === 1);
console.log('page errors', errs);
await b.close(); server.close();
