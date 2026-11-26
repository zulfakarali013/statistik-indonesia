// Horizontal bars ranking Indonesia against its neighbours on one figure, each bar labelled with its year.

import { formatValue } from '../lib/format.js';

export function peerBars(rows, ind) {
  const shown = rows.filter((r) => r.value !== null);
  if (!shown.length) return '<p class="muted">No neighbour figures in the source.</p>';
  const sorted = [...shown].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((r) => Math.abs(r.value))) || 1;
  const bars = sorted.map((r) => {
    const w = Math.max(1.5, (Math.abs(r.value) / max) * 100).toFixed(1);
    return `<div class="bar-row${r.home ? ' home' : ''}"><span class="bar-name">${r.name}</span><span class="bar-track"><span class="bar-fill" style="width:${w}%"></span></span><span class="bar-val">${formatValue(r.value, ind)} <small>${r.year}</small></span></div>`;
  }).join('');
  const missing = rows.filter((r) => r.value === null).map((r) => r.name);
  return `<div class="bars">${bars}</div>${missing.length ? `<p class="muted small">No figure in the source for ${missing.join(', ')}.</p>` : ''}`;
}
