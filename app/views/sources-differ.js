// "Sources differ": the same Indonesian figure from two publishers, checked year by year.
// Pairs: World Bank vs IMF for six figures (2000 to 2025) and World Bank vs BPS for population (2024, 2025).
// A year "agrees" when the gap is within 0.15 points (rates) or 1% (people and dollars).

import { byKey } from '../catalog.js';
import { valueAt } from '../lib/series-tools.js';
import { formatValue } from '../lib/format.js';

const PAIRS = [
  ['pop', 'LP', 1e6, 'The World Bank uses UN population estimates; the IMF follows BPS, whose 2025 count is 284.7 m.'],
  ['gdp', 'NGDPD', 1e9, 'Same BPS national accounts; small gaps come from the exchange rate each uses.'],
  ['gdppc', 'NGDPDPC', 1, 'GDP divided by two different population counts.'],
  ['growth', 'NGDP_RPCH', 1, 'Both from BPS national accounts; the IMF rounds to one decimal and revises on its own calendar.'],
  ['cpi', 'PCPIPCH', 1, 'Both yearly averages of BPS consumer prices.'],
  ['unemp', 'LUR', 1, 'World Bank prints the ILO model; the IMF uses BPS\u2019s labour force survey, which gives a higher rate.'],
];

const tolerance = (ind, v) => (ind.fmt === 'pct' ? 0.15 : Math.abs(v) * 0.01);

function check(ind, year, wb, other, who) {
  return { ind, year, wb, other, who, agree: Math.abs(other - wb) <= tolerance(ind, wb) };
}

export function allChecks(data) {
  const out = [];
  for (const [key, imfKey, scale] of PAIRS) {
    const ind = byKey[key];
    for (let y = 2000; y <= 2025; y++) {
      const wb = valueAt(data.indonesia[key], y), im = valueAt(data.imfData.series[key], y);
      if (wb !== null && im !== null) out.push(check(ind, y, wb, im * scale, 'IMF ' + imfKey));
    }
  }
  const P = data.provinces;
  const wbPop = (y) => valueAt(data.indonesia.pop, y);
  out.push(check(byKey.pop, 2024, wbPop(2024), P.pop2024National * 1000, 'BPS'));
  out.push(check(byKey.pop, 2025, wbPop(2025), P.tables.find((t) => t.key === 'pop').national * 1000, 'BPS'));
  return out;
}

export function differRows(data) {
  const checks = allChecks(data);
  return PAIRS.map(([key, imfKey, , why]) => {
    const mine = checks.filter((c) => c.ind.key === key);
    const latest = mine.filter((c) => c.who.startsWith('IMF')).at(-1);
    return { ind: byKey[key], imfCode: imfKey, why, n: mine.length, differ: mine.filter((c) => !c.agree).length, latest };
  });
}

export function sourcesDiffer(data) {
  const checks = allChecks(data);
  const off = checks.filter((c) => !c.agree);
  const sum = differRows(data).map((r) => `<tr><td><a href="#/indicator/${r.ind.key}">${r.ind.label}</a><small>${r.why}</small></td><td class="num">${r.n}</td><td class="num ${r.differ ? 'warn' : 'ok'}">${r.differ}</td><td class="num">${formatValue(r.latest.wb, r.ind)}<small>WB ${r.latest.year}</small></td><td class="num">${formatValue(r.latest.other, r.ind)}<small>IMF ${r.latest.year}</small></td></tr>`).join('');
  const list = off.map((c) => `<tr><td>${c.ind.label}</td><td>${c.year}</td><td class="num">${formatValue(c.wb, c.ind)}</td><td class="num">${formatValue(c.other, c.ind)}<small>${c.who}</small></td></tr>`).join('');
  return `<h2>Sources differ: ${checks.length} year-by-year checks, ${off.length} disagree</h2>
<div class="scroll"><table><thead><tr><th>Figure</th><th>Years checked</th><th>Disagree</th><th>World Bank</th><th>Other</th></tr></thead><tbody>${sum}</tbody></table></div>
<h2 class="gap">Every disagreement, both versions</h2><div class="scroll short"><table><thead><tr><th>Figure</th><th>Year</th><th>World Bank</th><th>Other publisher</th></tr></thead><tbody>${list}</tbody></table></div>
<p class="cite">Agree = within 0.15 points for rates, 1% for people and dollars \u00B7 World Bank WDI, ${data.imfData.edition}, BPS \u00B7 read ${data.RETRIEVED}</p>`;
}
