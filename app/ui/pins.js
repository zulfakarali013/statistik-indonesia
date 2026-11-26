// Pinned figures: a visitor stars indicators and they stay on the overview, kept in this browser only.

import { byKey } from '../catalog.js';

const KEY = 'statistik-indonesia-pins';

export function readPins() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]').filter((k) => byKey[k]); } catch { return []; }
}

function writePins(pins) {
  try { localStorage.setItem(KEY, JSON.stringify(pins)); } catch { /* private mode: pins last for this visit */ }
}

export function pinButton(key) {
  const on = readPins().includes(key);
  return `<button class="btn ghost" data-pin="${key}" aria-pressed="${on}">${on ? '\u2605 Pinned' : '\u2606 Pin to overview'}</button>`;
}

export function bindPins(root) {
  root.querySelectorAll('[data-pin]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.pin, pins = readPins();
    const next = pins.includes(k) ? pins.filter((x) => x !== k) : [...pins, k];
    writePins(next);
    const on = next.includes(k);
    b.setAttribute('aria-pressed', on);
    b.textContent = on ? '\u2605 Pinned' : '\u2606 Pin to overview';
  }));
}
