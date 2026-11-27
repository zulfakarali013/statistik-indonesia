// An annotated trend chart for one range of years: gridlines, area, line, and three labelled
// points (start, latest and the high or low worth naming), so the chart tells its own story.

import { points } from '../lib/series-tools.js';
import { formatValue } from '../lib/format.js';

function extreme(pts, ind) {
  // For "lower is better" figures name the worst year (the high); otherwise name the peak.
  return pts.reduce((a, b) => (b[1] > a[1] ? b : a));
}

function tag(x, y, text, cls, width) {
  const w = text.length * 6.6 + 14;
  const left = Math.min(Math.max(x - w / 2, 2), width - w - 2);
  const top = y < 34 ? y + 12 : y - 30;
  return `<g class="ann ${cls}"><rect x="${left}" y="${top}" width="${w}" height="20" rx="4"/><text x="${left + 7}" y="${top + 14}">${text}</text></g>`;
}

export function storyChart(series, ind, { from = 0, to = 9999, width = 600, height = 220 } = {}) {
  const pts = points(series).filter(([y]) => y >= from && y <= to);
  if (pts.length < 2) return '<p class="muted">Not enough years in this range to draw a chart.</p>';
  const pad = { l: 52, r: 18, t: 16, b: 26 };
  const ys = pts.map((p) => p[1]);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  const span = hi - lo || Math.abs(hi) || 1;
  lo -= span * 0.12; hi += span * 0.22;
  if (lo < 0 && Math.min(...ys) >= 0) lo = 0;
  const x0 = pts[0][0], x1 = pts.at(-1)[0];
  const X = (x) => pad.l + ((x - x0) / (x1 - x0)) * (width - pad.l - pad.r);
  const Y = (y) => pad.t + (1 - (y - lo) / (hi - lo)) * (height - pad.t - pad.b);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('');
  const area = `${line}L${X(x1).toFixed(1)},${Y(lo).toFixed(1)}L${X(x0).toFixed(1)},${Y(lo).toFixed(1)}Z`;
  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4;
    grid += `<line x1="${pad.l}" x2="${width - pad.r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" class="grid"/><text x="${pad.l - 7}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end">${formatValue(v, { ...ind, dp: Math.min(ind.dp, 1) })}</text>`;
  }
  const step = x1 - x0 > 16 ? 5 : x1 - x0 > 6 ? 2 : 1;
  for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) grid += `<text x="${X(x).toFixed(1)}" y="${height - 7}" text-anchor="middle">${x}</text>`;
  const first = pts[0], last = pts.at(-1), ext = extreme(pts, ind);
  const marks = [first, last];
  if (ext[0] !== first[0] && ext[0] !== last[0]) marks.push(ext);
  const dots = marks.map(([x, y]) => `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="4.5" class="${x === last[0] ? 'dot latest' : 'dot'}"/>`).join('');
  const tags = [
    tag(X(first[0]), Y(first[1]), `Start \u00B7 ${first[0]} \u00B7 ${formatValue(first[1], ind)}`, 'start', width),
    tag(X(last[0]), Y(last[1]), `Latest \u00B7 ${last[0]} \u00B7 ${formatValue(last[1], ind)}`, 'latest', width),
    marks.length > 2 ? tag(X(ext[0]), Y(ext[1]), `High \u00B7 ${ext[0]} \u00B7 ${formatValue(ext[1], ind)}`, 'high', width) : '',
  ].join('');
  return `<svg class="chart story" viewBox="0 0 ${width} ${height}" role="img" aria-label="${ind.label}, ${x0} to ${x1}">${grid}<path d="${area}" class="area"/><path d="${line}" class="line"/>${dots}${tags}</svg>`;
}

export function rangeOf(params, first, last) {
  const r = params.get('r');
  if (r === '2010') return [Math.max(2010, first), last];
  if (r === '10') return [Math.max(last - 9, first), last];
  const from = parseInt(params.get('from'), 10), to = parseInt(params.get('to'), 10);
  return [from >= first && from < last ? from : first, to > first && to <= last ? to : last];
}
