// #/sources the audit: each series with its code, years, value count and link, plus notes on reading it well.

import { INDICATORS, SOURCES, sourceUrl, sourceOf } from '../catalog.js';
import { countValues, yearRange } from '../lib/series-tools.js';
import { auditStrip } from '../ui/audit-strip.js';
import { differSummary, differList } from './sources-differ.js';
import { bpsTables } from './bps-tables.js';

const CAVEATS = [
  ['Poverty lines differ by country', 'SI.POV.NAHC uses each country\u2019s own national line, so Indonesia\u2019s rate is best read as a trend, not ranked against neighbours.'],
  ['Unemployment is a modelled estimate', 'SL.UEM.TOTL.ZS is the ILO\u2019s harmonised model, so it can differ from the national labour force survey published by BPS-Statistics Indonesia.'],
  ['Money is in current US dollars', 'GDP and investment move with the rupiah exchange rate as well as with real output; use GDP growth for real change.'],
  ['2020 and 2021 are pandemic years', 'Growth turned negative in 2020 and life expectancy dipped in 2020 to 2021; both recovered by 2022.'],
  ['National poverty: survey month matters', 'BPS\u2019s March 2026 rate for Indonesia is 8.07%; the World Bank series shows 8.5% for 2025. Both use the national line; they are different survey rounds.'],
  ['Two unemployment counts', 'BPS\u2019s open unemployment for August 2026 is 4.75%, against the ILO-modelled 3.24% for 2025 on the World Bank series.'],
  ['Stunting: survey or model', 'The UN figure (22.6% for 2024) is a modelled joint estimate; BPS and the health ministry\u2019s own nutrition survey report their own rate, so the two need not match.'],
  ['Literacy has gaps', 'SE.ADT.LITR.ZS has no value for some years; cards then show the latest earlier year and say so.'],
];

export function sourcesPage(data) {
  const rows = INDICATORS.map((ind) => {
    const r = yearRange(data.indonesia[ind.key]);
    return `<tr><td><a href="#/indicator/${ind.key}">${ind.label}</a></td><td>${sourceOf(ind).short}<small><a href="${sourceUrl(ind)}" rel="noopener">${ind.code}</a></small></td><td>${r[0]}\u2013${r[1]}</td><td class="num">${countValues(data.indonesia[ind.key])}</td><td class="ok">\u2713 cited</td></tr>`;
  }).join('');
  const notes = CAVEATS.map(([h, t]) => `<li><b>${h}.</b> ${t}</li>`).join('');
  return `<section class="hero"><div><p class="crumb"><a href="#/">Overview</a> / Sources</p><h1>Sources and method</h1><p class="lede">${Object.keys(SOURCES).length} publishers: ${Object.values(SOURCES).map((s) => s.name).join(', ')}. Each figure names its publisher and code; where two publishers report the same figure, both are shown. Read ${data.RETRIEVED}.</p></div></section>
${auditStrip(data)}
<section class="panel">${differSummary(data)}</section>
<div class="split">
<section class="panel"><h2>Every series</h2><div class="scroll"><table><thead><tr><th>Indicator</th><th>Publisher and code</th><th>Years</th><th>Values</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>${bpsTables(data)}</section>
<section class="panel">${differList(data)}<h2 class="gap">Read with care</h2><ul class="notes">${notes}</ul></section>
</div>`;
}
