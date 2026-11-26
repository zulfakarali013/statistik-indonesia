// Builds CSV text from the data and hands it to the browser as a download; nothing leaves the page.

import { INDICATORS, byKey, sourceOf } from '../catalog.js';
import { points } from '../lib/series-tools.js';

function rowsFor(data, ind) {
  return points(data.indonesia[ind.key]).map(([y, v]) => [ind.label, ind.unit, y, v, ind.code, sourceOf(ind).name]);
}

export function csvText(data, key) {
  const inds = key === 'all' ? INDICATORS : [byKey[key]];
  const lines = [['indicator', 'unit', 'year', 'value', 'code', 'source']];
  for (const ind of inds) lines.push(...rowsFor(data, ind));
  return lines.map((r) => r.map((c) => (/[",]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(',')).join('\n');
}

export function bindCsv(root, data) {
  root.querySelectorAll('[data-csv]').forEach((btn) => btn.addEventListener('click', () => {
    const blob = new Blob([csvText(data, btn.dataset.csv)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `indonesia-${btn.dataset.csv}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }));
}
