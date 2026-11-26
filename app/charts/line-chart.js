// A line chart drawn as inline SVG: axis ticks, the series, a dot on the selected year and its label.

import { points } from '../lib/series-tools.js';
import { formatValue } from '../lib/format.js';

export function lineChart(series, ind, { width = 640, height = 240, mark = null, compact = false } = {}) {
  const pts = points(series);
  if (pts.length < 2) return '<p class="muted">Not enough years to draw a chart.</p>';
  const pad = compact ? { l: 6, r: 6, t: 6, b: 6 } : { l: 58, r: 16, t: 14, b: 26 };
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  const fromZero = lo > 0 && lo / (hi || 1) < 0.35;
  const span = hi - (fromZero ? 0 : lo) || Math.abs(hi) || 1;
  lo = fromZero ? 0 : lo - span * 0.06;
  hi += span * 0.06;
  const x0 = xs[0], x1 = xs[xs.length - 1];
  const X = (x) => pad.l + ((x - x0) / (x1 - x0)) * (width - pad.l - pad.r);
  const Y = (y) => pad.t + (1 - (y - lo) / (hi - lo)) * (height - pad.t - pad.b);
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('');
  const area = `${path}L${X(x1).toFixed(1)},${Y(lo).toFixed(1)}L${X(x0).toFixed(1)},${Y(lo).toFixed(1)}Z`;
  let axes = '';
  if (!compact) {
    for (let i = 0; i <= 3; i++) {
      const v = lo + ((hi - lo) * i) / 3;
      axes += `<line x1="${pad.l}" x2="${width - pad.r}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${pad.l - 6}" y="${Y(v) + 4}" text-anchor="end">${formatValue(v, { ...ind, dp: Math.min(ind.dp, 1) })}</text>`;
    }
    const step = x1 - x0 > 15 ? 5 : 2;
    for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) axes += `<text x="${X(x)}" y="${height - 6}" text-anchor="middle">${x}</text>`;
    if (lo < 0 && hi > 0) axes += `<line x1="${pad.l}" x2="${width - pad.r}" y1="${Y(0)}" y2="${Y(0)}" class="zero"/>`;
  }
  let dot = '';
  const hit = mark && pts.find((p) => p[0] === mark);
  if (hit) {
    const cx = X(hit[0]), cy = Y(hit[1]);
    dot = `<line x1="${cx}" x2="${cx}" y1="${pad.t}" y2="${height - pad.b}" class="mark"/><circle cx="${cx}" cy="${cy}" r="${compact ? 2.5 : 5}" class="dot"/>`;
    if (!compact) dot += `<text x="${Math.min(cx + 8, width - 90)}" y="${Math.max(cy - 10, 14)}" class="tag">${hit[0]}: ${formatValue(hit[1], ind)}</text>`;
  }
  return `<svg class="chart${compact ? ' spark' : ''}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${ind.label}, ${x0} to ${x1}">${axes}<path d="${area}" class="area"/><path d="${path}" class="line"/>${dot}</svg>`;
}
