// #/indicator/<key> one figure in full: trend chart with a year slider, changes, neighbours and every year.

import { byKey, TOPICS, sourceUrl, sourceOf } from '../catalog.js';
import { lineChart } from '../charts/line-chart.js';
import { peerBars } from '../charts/peer-bars.js';
import { formatValue, formatChange, toneOf } from '../lib/format.js';
import { points, latestAtOrBefore, changeOver, yearRange } from '../lib/series-tools.js';
import { peerRows } from './peer-rows.js';
import { chartSize } from '../charts/chart-size.js';
import { pinButton } from '../ui/pins.js';

export function indicatorPage(data, key, year, extra) {
  const ind = byKey[key];
  if (!ind) return null;
  const s = data.indonesia[key];
  const [first, last] = yearRange(s);
  const y = Math.min(Math.max(year || last, first), last);
  const hit = latestAtOrBefore(s, y);
  const topic = TOPICS.find((t) => t.id === ind.topic);
  const changes = [1, 5, 10].map((n) => {
    const c = changeOver(s, hit[0], n);
    return c ? `<li><span>vs ${c.from}</span><b class="chg ${toneOf(c.delta, ind)}">${formatChange(c.delta, ind)}</b></li>` : '';
  }).join('');
  const rows = points(s).reverse().map(([yy, v]) => `<tr${yy === hit[0] ? ' class="sel"' : ''}><td>${yy}</td><td>${formatValue(v, ind)}</td><td class="cite">${sourceOf(ind).short} ${ind.code}</td></tr>`).join('');
  return `<section class="hero"><div><p class="crumb"><a href="#/">Overview</a> / <a href="#/topic/${topic.id}">${topic.name}</a> / ${ind.label}</p><h1>${ind.label}</h1><p class="lede">${ind.note}</p></div>
<div class="big"><span class="card-value">${formatValue(hit[1], ind)}</span><span class="card-unit">${ind.unit}, ${hit[0]}</span></div></section>
<section class="panel"><div class="chart-head"><h2>${first}\u2013${last}</h2><label class="slider">Year <input type="range" min="${first}" max="${last}" value="${hit[0]}" data-slide="${key}"><output>${hit[0]}</output></label></div>
${lineChart(s, ind, { mark: hit[0], ...chartSize(250) })}<p class="cite">Source: ${sourceOf(ind).name} \u00B7 ${ind.code} \u00B7 ${first}\u2013${last}</p></section>
<div class="split">
<section class="panel"><h2>Change to ${hit[0]}</h2><ul class="changes">${changes}</ul>
${data.peers[key] ? `<h2>Indonesia and neighbours</h2>${peerBars(peerRows(data, key), ind)}<p class="cite">Latest year each country has in WDI ${ind.code}</p>` : ''}${extra ? extra(data, key, hit[0]) : ''}</section>
<section class="panel"><div class="chart-head"><h2>Every year</h2><span class="tools">${pinButton(key)}<button class="btn" data-csv="${key}">Download CSV</button></span></div>
<div class="scroll"><table><thead><tr><th>Year</th><th>${ind.unit}</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="small"><a href="${sourceUrl(ind)}" rel="noopener">${ind.code} at ${sourceOf(ind).short}</a></p></section>
</div>`;
}
