// A figure card: label, value for the chosen year, change over ten years, sparkline and its source line.

import { formatValue, formatChange, toneOf } from '../lib/format.js';
import { latestAtOrBefore, changeOver } from '../lib/series-tools.js';
import { lineChart } from '../charts/line-chart.js';
import { citeLine } from './cite.js';

export function statCard(ind, series, year) {
  const hit = latestAtOrBefore(series, year);
  if (!hit) return '';
  const ch = changeOver(series, year, 10);
  const change = ch ? `<span class="chg ${toneOf(ch.delta, ind)}">${formatChange(ch.delta, ind)} <small>since ${ch.from}</small></span>` : '';
  const stale = hit[0] < year ? ` <em class="stale" title="Latest year the source has">latest ${hit[0]}</em>` : '';
  return `<a class="card" href="#/indicator/${ind.key}?y=${hit[0]}">
<span class="card-label">${ind.label}</span>
<span class="card-value">${formatValue(hit[1], ind)}</span>
<span class="card-unit">${ind.unit}${stale}</span>
${change}
${lineChart(series, ind, { width: 220, height: 44, mark: hit[0], compact: true })}
${citeLine(ind, hit[0])}
</a>`;
}
