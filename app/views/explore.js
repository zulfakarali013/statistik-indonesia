// #/explore the indicator explorer: find a series on the left (search and topic chips), then set a
// year range, switch chart or table, read the latest value in range and download it as CSV.
// A second publisher's reading is shown under the chart whenever the site cross-checks that figure.

import { INDICATORS, TOPICS, byKey, sourceOf, sourceUrl } from '../catalog.js';
import { formatValue, escapeHtml } from '../lib/format.js';
import { points, latestAtOrBefore, yearRange, valueAt } from '../lib/series-tools.js';
import { storyChart, rangeOf } from '../charts/story-chart.js';
import { differRows } from './sources-differ.js';

function link(params, changes) {
  const p = new URLSearchParams(params);
  for (const [k, v] of Object.entries(changes)) (v === null ? p.delete(k) : p.set(k, v));
  p.set('keep', '1');
  return `#/explore?${p}`;
}

function listRow(data, ind, current, params) {
  const hit = latestAtOrBefore(data.indonesia[ind.key], 9999);
  return `<li><a class="ex-row${ind.key === current ? ' on' : ''}" href="${link(params, { i: ind.key, from: null, to: null, r: null })}" data-ex-name="${escapeHtml(ind.label.toLowerCase())} ${ind.topic}">
<span><b>${ind.label}</b><small>${sourceOf(ind).short} \u00B7 ${hit ? hit[0] : ''}</small></span><em>${hit ? formatValue(hit[1], ind) : '\u2014'}</em></a></li>`;
}

function secondReading(data, ind) {
  const row = differRows(data).find((r) => r.ind.key === ind.key);
  if (!row) return '';
  const l = row.latest;
  return `<p class="second"><b>Second reading</b> ${row.who} \u00B7 ${l.year}: <b>${formatValue(l.other, ind)}</b> vs ${formatValue(l.wb, ind)} here \u00B7 ${row.differ} of ${row.n} years differ. <a href="#/sources">Why</a></p>`;
}

export function explorePage(data, params) {
  const ind = byKey[params.get('i')] || byKey.unemp;
  const topic = TOPICS.some((t) => t.id === params.get('t')) ? params.get('t') : ind.topic;
  const s = data.indonesia[ind.key];
  const [first, last] = yearRange(s);
  const [from, to] = rangeOf(params, first, last);
  const view = params.get('v') === 'table' ? 'table' : 'chart';
  const shown = INDICATORS.filter((d) => topic === 'all' || d.topic === topic);
  const chips = [['all', 'All'], ...TOPICS.map((t) => [t.id, t.name])].map(([id, name]) => `<a class="chip${id === topic ? ' on' : ''}" href="${link(params, { t: id })}">${name}</a>`).join('');
  const years = (sel, attr) => points(s).map(([y]) => `<option${y === sel ? ' selected' : ''}>${y}</option>`).join('');
  const quick = [['all', 'All years', from === first && to === last], ['2010', 'Since 2010', params.get('r') === '2010'], ['10', 'Last 10', params.get('r') === '10']]
    .map(([r, label, on]) => `<a class="seg-btn${on ? ' on' : ''}" href="${link(params, { r: r === 'all' ? null : r, from: null, to: null })}">${label}</a>`).join('');
  const inRange = points(s).filter(([y]) => y >= from && y <= to).reverse();
  const recent = inRange.slice(0, 6).map(([y, v]) => `<tr><td>${y}</td><td class="num">${formatValue(v, ind)}</td></tr>`).join('');
  const table = `<div class="scroll ex-table"><table><thead><tr><th>Year</th><th>${ind.unit}</th><th>Source</th></tr></thead><tbody>${inRange.map(([y, v]) => `<tr><td>${y}</td><td class="num">${formatValue(v, ind)}</td><td class="cite">${sourceOf(ind).short} ${ind.code}</td></tr>`).join('')}</tbody></table></div>`;
  const latest = inRange[0];
  return `<section class="hero"><div><h1 class="display">Indicator explorer</h1><p class="lede">Search ${INDICATORS.length} annual series, set a year range and download the figures as CSV.</p></div>
<span class="edition"><i></i><b>${INDICATORS.length} indicators \u00B7 Indonesia</b><small>${first}\u2013${last} for this series</small></span></section>
<div class="explorer">
<aside class="panel ex-list"><h2>Find an indicator</h2>
<input type="search" placeholder="Search, e.g. poverty" aria-label="Search indicators" data-ex-find>
<div class="chips">${chips}</div>
<p class="small muted" data-ex-count>${shown.length} indicators</p>
<ul>${shown.map((d) => listRow(data, d, ind.key, params)).join('')}</ul></aside>
<section class="panel ex-main">
<div class="chart-head"><div><p class="kicker">${TOPICS.find((t) => t.id === ind.topic).name}</p><h2 class="ex-title">${ind.label}</h2><p class="small muted">${ind.unit} \u00B7 ${ind.note}</p></div><button class="btn" data-csv="${ind.key}">\u2193 Download CSV</button></div>
<div class="ex-controls"><label>Year range <select data-ex-range="from">${years(from)}</select> \u2013 <select data-ex-range="to">${years(to)}</select></label><span class="seg">${quick}</span>
<span class="seg right"><a class="seg-btn${view === 'chart' ? ' on' : ''}" href="${link(params, { v: null })}">Chart</a><a class="seg-btn${view === 'table' ? ' on' : ''}" href="${link(params, { v: 'table' })}">Table</a></span></div>
<div class="ex-body">${view === 'chart' ? `<div class="ex-chart">${storyChart(s, ind, { from, to, width: 470, height: 230 })}</div>` : table}
<div class="ex-latest"><h3>Latest in range</h3><span class="kpi-value">${latest ? formatValue(latest[1], ind) : '\u2014'}</span><small>${latest ? latest[0] : ''}</small><table><tbody>${recent}</tbody></table></div></div>
<div class="chart-foot"><span class="cite">Source: <a href="${sourceUrl(ind)}" rel="noopener">${sourceOf(ind).name}</a> \u00B7 ${ind.code} \u00B7 ${from}\u2013${to} \u00B7 ${inRange.length} observations</span><a class="more" href="#/indicator/${ind.key}">Full page \u2192</a></div>
${secondReading(data, ind)}
</section></div>`;
}

export function bindExplore(root, params) {
  root.querySelectorAll('[data-ex-range]').forEach((sel) => sel.addEventListener('change', () => {
    const p = new URLSearchParams(params);
    p.delete('r');
    p.set(sel.dataset.exRange, sel.value);
    p.set('keep', '1');
    location.hash = `#/explore?${p}`;
  }));
  const find = root.querySelector('[data-ex-find]');
  if (!find) return;
  const rows = [...root.querySelectorAll('[data-ex-name]')];
  const count = root.querySelector('[data-ex-count]');
  find.addEventListener('input', () => {
    const q = find.value.trim().toLowerCase();
    let n = 0;
    rows.forEach((r) => { const hit = !q || r.dataset.exName.includes(q); r.parentElement.hidden = !hit; n += hit; });
    count.textContent = `${n} indicator${n === 1 ? '' : 's'} found`;
  });
}
