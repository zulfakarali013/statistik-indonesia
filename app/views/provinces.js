// #/provinces the 38 provinces on four BPS figures: tile map, ranking, island groups and a full table.

import { formatValue } from '../lib/format.js';
import { tileMap } from '../charts/tile-map.js';
import { provinceCard } from './province-card.js';
import { islandGroups } from './island-groups.js';

const fmt = (t, v) => formatValue(v, { fmt: t.key === 'pop' ? 'num' : t.key === 'ipm' ? 'num' : 'pct', dp: t.key === 'pop' ? 0 : t.dp });
const cite = (t) => `<span class="cite">Source: BPS \u00B7 ${t.title} \u00B7 ${t.period}</span>`;

export function provincesPage(data, params) {
  const P = data.provinces;
  const t = P.tables.find((x) => x.key === params.get('i')) || P.tables.find((x) => x.key === 'poor');
  const pick = Math.max(0, Math.min(37, parseInt(params.get('p'), 10) || 11));
  const opts = P.tables.map((x) => `<option value="${x.key}"${x.key === t.key ? ' selected' : ''}>${x.label} (${x.period})</option>`).join('');
  const order = t.values.map((v, i) => [v, i]).sort((a, b) => (t.better < 0 ? a[0] - b[0] : b[0] - a[0]));
  const max = Math.max(...t.values);
  const bars = order.map(([v, i], n) => `<div class="bar-row${i === pick ? ' home' : ''}"><span>${n + 1}. ${P.NAMES[i]}</span><span class="bar-track"><span class="bar-fill" style="width:${((v / max) * 100).toFixed(1)}%"></span></span><span class="bar-val">${fmt(t, v)}</span></div>`).join('');
  const rows = P.NAMES.map((n, i) => `<tr data-find="${n.toLowerCase()} ${P.ISLAND[i].toLowerCase()}"${i === pick ? ' class="sel"' : ''}><td><a href="#/provinces?i=${t.key}&p=${i}&keep=1">${n}</a><small>${P.ISLAND[i]}</small></td>${P.tables.map((x) => `<td class="num">${fmt(x, x.values[i])}</td>`).join('')}</tr>`).join('');
  const nat = `<tr class="nat"><td>Indonesia</td>${P.tables.map((x) => `<td class="num">${fmt(x, x.national)}</td>`).join('')}</tr>`;
  const kpis = P.tables.map((x) => `<a class="kpi prov-kpi${x.key === t.key ? ' on' : ''}" href="#/provinces?i=${x.key}&p=${pick}&keep=1"><span class="kpi-head"><b>Indonesia \u00B7 ${x.label}</b><em>${x.period}</em></span><span class="kpi-value">${x.key === 'pop' ? (x.national / 1000).toFixed(1) + ' m' : fmt(x, x.national)}</span><span class="cite">Source: BPS \u00B7 ${x.period}</span></a>`).join('');
  const seg = P.tables.map((x) => `<a class="seg-btn${x.key === t.key ? ' on' : ''}" href="#/provinces?i=${x.key}&p=${pick}&keep=1">${x.label.replace('Human Development Index', 'HDI').replace('Open unemployment', 'Unemployment').replace('Poverty rate', 'Poverty')}</a>`).join('');
  const rank = order.map(([v, i], n) => `<tr${i === pick ? ' class="sel"' : ''}><td class="muted">${n + 1}</td><td><a href="#/provinces?i=${t.key}&p=${i}&keep=1">${P.NAMES[i]}</a></td><td class="muted small">${P.ISLAND[i]}</td><td class="num">${fmt(t, v)}</td><td class="rbar"><span style="width:${((v / max) * 100).toFixed(1)}%"></span></td></tr>`).join('');
  return `<section class="hero"><div><h1 class="display">Indonesia\u2019s 38 provinces</h1><p class="lede">Population, poverty, jobs and human development for every province, from BPS-Statistics Indonesia\u2019s own tables.</p></div>
<label class="year-pick">Figure <select data-prov>${opts}</select></label></section>
<div class="kpis four">${kpis}</div>
<div class="split prov-row">
<section class="panel"><div class="chart-head"><div><h2>Province tile map</h2><p class="small muted">${t.label}, ${t.unit}, ${t.period} \u00B7 select a tile</p></div><span class="seg">${seg}</span></div>${tileMap(P.NAMES, t, pick)}${cite(t)}</section>
<section class="panel"><div class="chart-head"><div><h2>Province ranking</h2><p class="small muted">${t.label} \u00B7 ${t.better < 0 ? 'lowest first' : 'highest first'} \u00B7 Indonesia ${fmt(t, t.national)}</p></div><button class="btn ghost" data-prov-csv="${t.key}">\u2193 CSV</button></div>
<div class="scroll rank-scroll"><table class="rank"><thead><tr><th>#</th><th>Province</th><th>Island group</th><th>${t.unit}</th><th></th></tr></thead><tbody>${rank}</tbody></table></div>${cite(t)}</section>
</div>
<div class="split wide-left">
${provinceCard(data, pick)}
<section class="panel">${islandGroups(data)}</section>
</div>
<section class="panel"><h2>Ranking, ${t.better < 0 ? 'lowest first' : 'highest first'}</h2><div class="bars scroll short">${bars}</div>${cite(t)}</section>
<section class="panel"><div class="chart-head"><h2>Every province</h2><input type="search" placeholder="Search a province or island" data-find-input aria-label="Search provinces"></div>
<div class="scroll"><table><thead><tr><th>Province</th>${P.tables.map((x) => `<th>${x.label}<small>${x.unit}, ${x.period}</small></th>`).join('')}</tr></thead><tbody>${nat}${rows}</tbody></table></div>
<p class="small muted" data-find-count>38 of 38 shown</p><p class="cite">Source: BPS-Statistics Indonesia, tables linked on the Sources page, read ${data.RETRIEVED}</p></section>`;
}

export function bindProvinces(root, params, data) {
  const sel = root.querySelector('[data-prov]');
  if (sel) sel.addEventListener('change', () => { const p = new URLSearchParams(params); p.set('i', sel.value); p.set('keep', '1'); location.hash = `#/provinces?${p}`; });
  const csv = root.querySelector('[data-prov-csv]');
  if (csv) csv.addEventListener('click', () => {
    const P = data.provinces, t = P.tables.find((x) => x.key === csv.dataset.provCsv);
    const text = [['province', 'island_group', `${t.label} (${t.unit})`, 'period', 'source'], ...P.NAMES.map((n, i) => [n, P.ISLAND[i], t.values[i], t.period, 'BPS-Statistics Indonesia'])]
      .map((r) => r.map((c) => (/[",]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    a.download = `indonesia-provinces-${t.key}.csv`;
    a.click();
  });
}
