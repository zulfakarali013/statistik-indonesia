// A compact headline card: label with its year chip, the big figure, change on the year before,
// a small trend to the right and the source line. The whole card links to the explorer.
// When BPS-Statistics Indonesia publishes the same figure, the BPS number leads the card and the
// international series supplies the trend line, each with its own source and period.

import { formatValue, formatChange, toneOf } from '../lib/format.js';
import { latestAtOrBefore, changeOver } from '../lib/series-tools.js';
import { lineChart } from '../charts/line-chart.js';
import { citeLine } from './cite.js';

export function kpiCard(ind, series, year, bps = null) {
  const hit = latestAtOrBefore(series, year);
  if (!hit) return '';
  const ch = changeOver(series, hit[0], 1);
  const change = ch ? `<span class="chg ${toneOf(ch.delta, ind)}">${formatChange(ch.delta, ind)}</span> <span class="vs">vs ${ch.from}</span>` : '';
  const spark = lineChart(series, ind, { width: 96, height: 30, mark: hit[0], compact: true });
  if (bps) {
    return `<a class="kpi" href="#/explore?i=${ind.key}">
<span class="kpi-head"><b>${ind.label}</b><em class="bps">BPS \u00B7 ${bps.period}</em></span>
<span class="kpi-row"><span class="kpi-value">${bps.text}</span>${spark}</span>
<span class="kpi-chg">${bps.change || `Trend ${change}`}</span>
<span class="cite">Source: BPS-Statistics Indonesia \u00B7 ${bps.period}</span>
<span class="cite second-cite">Trend: World Bank ${formatValue(hit[1], ind)} in ${hit[0]} \u00B7 ${ind.code}</span>
</a>`;
  }
  return `<a class="kpi" href="#/explore?i=${ind.key}">
<span class="kpi-head"><b>${ind.label}</b><em>${hit[0]}</em></span>
<span class="kpi-row"><span class="kpi-value">${formatValue(hit[1], ind)}</span>${spark}</span>
<span class="kpi-chg">${change}</span>
${citeLine(ind, hit[0])}
</a>`;
}

// The BPS reading for a headline indicator, if BPS publishes one in the province tables.
export function bpsReading(data, key, year) {
  if (year < 2025) return null;
  const T = (k) => data.provinces.tables.find((t) => t.key === k);
  if (key === 'pop') {
    const t = T('pop'), d = (t.national - data.provinces.pop2024National) / 1000;
    return { period: t.period, text: `${(t.national / 1000).toFixed(1)} m`, change: `<span class="chg">\u25B2 ${d.toFixed(1)} m</span> <span class="vs">vs 2024 (BPS)</span>` };
  }
  if (key === 'poverty') { const t = T('poor'); return { period: t.period, text: `${t.national}%` }; }
  if (key === 'unemp') { const t = T('tpt'); return { period: t.period, text: `${t.national}%` }; }
  return null;
}
