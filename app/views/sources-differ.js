// "Sources differ": the same Indonesian figure from two publishers, checked year by year.
// Pairs: World Bank vs IMF for six figures, vs WHO for life expectancy, vs ILOSTAT survey for jobs, vs BPS for population.
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
  for (const [key, c] of Object.entries(data.secondReadings || {})) {
    for (let y = 2000; y <= 2025; y++) {
      const wb = valueAt(data.indonesia[key], y), o = valueAt(c.series, y);
      if (wb !== null && o !== null) out.push(check(byKey[key], y, wb, o, c.who));
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
  const why = Object.fromEntries(PAIRS.map(([k, , , w]) => [k + '|IMF', w]));
  for (const [k, c] of Object.entries(data.secondReadings || {})) why[k + '|' + c.who] = c.why;
  why['pop|BPS'] = 'BPS projection table against the UN estimate the World Bank prints.';
  const groups = new Map();
  for (const c of checks) {
    const g = c.ind.key + '|' + (c.who.startsWith('IMF') ? 'IMF' : c.who);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(c);
  }
  return [...groups.entries()].map(([g, mine]) => {
    const latest = mine.at(-1);
    return { ind: latest.ind, who: latest.who, why: why[g] || '', n: mine.length, differ: mine.filter((c) => !c.agree).length, latest };
  });
}

const gapOf = (c) => Math.abs(c.other - c.wb) / (c.ind.fmt === 'pct' ? 1 : Math.abs(c.wb) / 100);
const gapText = (c) => (c.ind.fmt === 'pct' || c.ind.fmt === 'num' && c.ind.unit.startsWith('years')) ? `${Math.abs(c.other - c.wb).toFixed(2)} pts` : `${((Math.abs(c.other - c.wb) / Math.abs(c.wb)) * 100).toFixed(1)}%`;
const pubs = 'World Bank WDI, IMF WEO Oct 2026, WHO GHO, ILOSTAT, BPS';

export function differSummary(data) {
  const checks = allChecks(data);
  const off = checks.filter((c) => !c.agree).length;
  const rows = differRows(data).map((r) => `<tr><td><a href="#/indicator/${r.ind.key}">${r.ind.label}</a><small>${r.why}</small></td><td>${r.who}</td><td class="num">${r.n}</td><td class="num ${r.differ ? 'warn' : 'ok'}">${r.differ}</td><td class="num">${formatValue(r.latest.wb, r.ind)}<small>World Bank ${r.latest.year}</small></td><td class="num">${formatValue(r.latest.other, r.ind)}<small>${r.latest.year}</small></td></tr>`).join('');
  return `<h2>Sources differ: ${checks.length} year-by-year checks, ${off} disagree, both versions shown</h2>
<table class="differ"><thead><tr><th>Figure and why they differ</th><th>Second publisher</th><th>Years checked</th><th>Disagree</th><th>World Bank, latest</th><th>Second publisher, latest</th></tr></thead><tbody>${rows}</tbody></table>
<p class="cite">Agree = within 0.15 points for rates, 1% for people and dollars \u00B7 ${pubs} \u00B7 read ${data.RETRIEVED}</p>`;
}

export function differList(data) {
  const off = allChecks(data).filter((c) => !c.agree).sort((a, b) => gapOf(b) - gapOf(a));
  const list = off.map((c) => `<tr><td>${c.ind.label}</td><td>${c.year}</td><td class="num">${formatValue(c.wb, c.ind)}</td><td class="num">${formatValue(c.other, c.ind)}<small>${c.who}</small></td><td class="num warn">${gapText(c)}</td></tr>`).join('');
  return `<h2>Every disagreement, widest gap first</h2><div class="scroll short"><table><thead><tr><th>Figure</th><th>Year</th><th>World Bank</th><th>Other publisher</th><th>Gap</th></tr></thead><tbody>${list}</tbody></table></div><p class="cite">${off.length} rows \u00B7 ${pubs}</p>`;
}

export function sourcesDiffer(data) {
  return differSummary(data) + differList(data);
}
