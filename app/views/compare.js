// #/compare Indonesia beside one neighbour on every indicator, plus a ranking for the chosen indicator.

import { INDICATORS, byKey } from '../catalog.js';
import { formatValue } from '../lib/format.js';
import { peerBars } from '../charts/peer-bars.js';
import { peerRows } from './peer-rows.js';
import { rankList } from './rank-list.js';

export function comparePage(data, params) {
  const country = data.PEERS.includes(params.get('c')) ? params.get('c') : 'Malaysia';
  const key = byKey[params.get('i')] ? params.get('i') : 'gdppc';
  const ci = data.PEERS.indexOf(country);
  const countryOpts = data.PEERS.map((n) => `<option${n === country ? ' selected' : ''}>${n}</option>`).join('');
  const indOpts = INDICATORS.map((d) => `<option value="${d.key}"${d.key === key ? ' selected' : ''}>${d.label}</option>`).join('');
  const rows = INDICATORS.map((ind) => {
    const rs = peerRows(data, ind.key);
    const a = rs[0], b = rs[ci + 1];
    return `<tr><td><a href="#/indicator/${ind.key}">${ind.label}</a><small>${ind.unit}</small></td><td>${formatValue(a.value, ind)} <small>${a.year ?? ''}</small></td><td>${formatValue(b.value, ind)} <small>${b.year ?? ''}</small></td><td class="cite">${ind.code}</td></tr>`;
  }).join('');
  return `<section class="hero"><div><p class="crumb"><a href="#/">Overview</a> / Compare</p><h1>Compare with neighbours</h1><p class="lede">Latest figure each country has in the same World Bank series, so units and definitions match.</p></div></section>
<div class="split">
<section class="panel"><div class="chart-head"><h2>Ranking</h2><label class="year-pick">Indicator <select data-compare="i">${indOpts}</select></label></div>${peerBars(peerRows(data, key), byKey[key])}<p class="cite">Source: World Bank WDI \u00B7 ${byKey[key].code}</p><h2 class="gap">Indonesia's place on every figure</h2>${rankList(data)}</section>
<section class="panel"><div class="chart-head"><h2>Indonesia vs ${country}</h2><label class="year-pick">Country <select data-compare="c">${countryOpts}</select></label></div>
<div class="scroll"><table><thead><tr><th>Indicator</th><th>Indonesia</th><th>${country}</th><th>Code</th></tr></thead><tbody>${rows}</tbody></table></div></section>
</div>`;
}

export function bindCompare(root, params) {
  root.querySelectorAll('[data-compare]').forEach((sel) => sel.addEventListener('change', () => {
    const p = new URLSearchParams(params);
    p.set(sel.dataset.compare, sel.value);
    location.hash = `#/compare?${p}`;
  }));
}
