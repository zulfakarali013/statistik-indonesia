// #/data every indicator in one searchable table: latest value, year, ten-year change and source.

import { INDICATORS, TOPICS } from '../catalog.js';
import { formatValue, formatChange, toneOf } from '../lib/format.js';
import { latestAtOrBefore, changeOver, yearRange } from '../lib/series-tools.js';

export function dataPage(data) {
  const rows = INDICATORS.map((ind) => {
    const s = data.indonesia[ind.key];
    const hit = latestAtOrBefore(s, 9999);
    const c = changeOver(s, 9999, 10);
    const r = yearRange(s);
    const topic = TOPICS.find((t) => t.id === ind.topic).name;
    return `<tr data-find="${(ind.label + ' ' + topic + ' ' + ind.code).toLowerCase()}"><td><a href="#/indicator/${ind.key}">${ind.label}</a><small>${ind.unit}</small></td><td>${topic}</td><td class="num">${formatValue(hit[1], ind)}</td><td>${hit[0]}</td><td class="chg ${c ? toneOf(c.delta, ind) : ''}">${c ? formatChange(c.delta, ind) : ''}</td><td>${r[0]}\u2013${r[1]}</td><td class="cite">${ind.code}</td></tr>`;
  }).join('');
  return `<section class="hero"><div><p class="crumb"><a href="#/">Overview</a> / Data</p><h1>All indicators</h1><p class="lede">Search by name, topic or World Bank code. Every row opens its own page.</p></div>
<div class="tools"><input type="search" placeholder="Search, e.g. poverty" data-find-input aria-label="Search indicators"><button class="btn" data-csv="all">Download all (CSV)</button></div></section>
<section class="panel"><div class="scroll"><table class="wide"><thead><tr><th>Indicator</th><th>Topic</th><th>Latest</th><th>Year</th><th>10-year change</th><th>Years</th><th>Source code</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="small muted" data-find-count>${INDICATORS.length} of ${INDICATORS.length} shown</p></section>`;
}

export function bindDataSearch(root) {
  const input = root.querySelector('[data-find-input]');
  if (!input) return;
  const rows = [...root.querySelectorAll('tr[data-find]')];
  const count = root.querySelector('[data-find-count]');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let n = 0;
    for (const r of rows) { const hit = !q || r.dataset.find.includes(q); r.hidden = !hit; n += hit; }
    count.textContent = `${n} of ${rows.length} shown`;
  });
}
