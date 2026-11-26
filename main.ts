// Statistik Indonesia hands itself in (Node 22, standard library only). The site is app/: plain static
// files a browser opens at app/index.html (ES modules, CSS, no build step, no network). This program copies
// app/ and screenshots/ to /output and writes /output/dossier.json with the vendored make.fun library,
// left exactly as the kit ships it.
//
// Browse locally: `node serve.ts`, then open http://localhost:8080.
// Outside the grader MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
// The screenshots live in the repo as one-line base64 text (screenshots/*.jpg.b64) so the whole entry is
// plain text; each is decoded back to its JPEG. A plain .jpg/.png beside them is copied as is.
const shotDir = join(here, 'screenshots');
if (existsSync(shotDir)) {
  for (const name of readdirSync(shotDir).sort()) {
    if (name.endsWith('.b64')) writeFileSync(join(out, 'screenshots', name.slice(0, -4)), Buffer.from(readFileSync(join(shotDir, name), 'utf8').trim(), 'base64'));
    else if (/\.(jpe?g|png)$/i.test(name)) cpSync(join(shotDir, name), join(out, 'screenshots', name));
  }
}

// The scorer's own caps (reference/gate.json), as the kit's starter passes them.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
