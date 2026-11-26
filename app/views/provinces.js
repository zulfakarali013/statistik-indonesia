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
  return `<section class="hero"><div><p class="crumb"><a href="#/">Overview</a> / Provinces</p><h1>38 provinces</h1><p class="lede">Population, poverty, jobs and human development for every province, from BPS-Statistics Indonesia\u2019s own tables.</p></div>
<label class="year-pick">Figure <select data-prov>${opts}</select></label></section>
<div class="split wide-left">
<section class="panel"><h2>${t.label} <small>${t.unit}, ${t.period} \u00B7 Indonesia ${fmt(t, t.national)}</small></h2>${tileMap(P.NAMES, t, pick)}${cite(t)}</section>
${provinceCard(data, pick)}
</div>
<div class="split">
<section class="panel"><h2>Ranking, ${t.better < 0 ? 'lowest first' : 'highest first'}</h2><div class="bars scroll short">${bars}</div>${cite(t)}</section>
<section class="panel">${islandGroups(data)}</section>
</div>
<section class="panel"><div class="chart-head"><h2>Every province</h2><input type="search" placeholder="Search a province or island" data-find-input aria-label="Search provinces"></div>
<div class="scroll"><table><thead><tr><th>Province</th>${P.tables.map((x) => `<th>${x.label}<small>${x.unit}, ${x.period}</small></th>`).join('')}</tr></thead><tbody>${nat}${rows}</tbody></table></div>
<p class="small muted" data-find-count>38 of 38 shown</p><p class="cite">Source: BPS-Statistics Indonesia, tables linked on the Sources page, read ${data.RETRIEVED}</p></section>`;
}

export function bindProvinces(root, params) {
  const sel = root.querySelector('[data-prov]');
  if (sel) sel.addEventListener('change', () => { const p = new URLSearchParams(params); p.set('i', sel.value); p.set('keep', '1'); location.hash = `#/provinces?${p}`; });
}
