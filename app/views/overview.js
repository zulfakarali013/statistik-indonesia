// #/ the overview: audit strip, headline cards for the chosen year, the economy's make-up and topic tiles.

import { TOPICS, HEADLINE, byKey, INDICATORS } from '../catalog.js';
import { readPins } from '../ui/pins.js';
import { statCard } from '../ui/stat-card.js';
import { auditStrip } from '../ui/audit-strip.js';
import { yearPicker } from '../ui/year-picker.js';
import { structureBar } from '../charts/structure-bar.js';
import { latestAtOrBefore } from '../lib/series-tools.js';
import { keyFindings } from './findings.js';
import { ageMix } from '../charts/age-mix.js';

function pinned(d, year) {
  const pins = readPins();
  if (!pins.length) return '<p class="small muted pin-hint">\u2606 Pin any figure from its own page and it appears here, in this browser only.</p>';
  return `<h2 class="sec">Your pinned figures</h2><div class="cards">${pins.map((k) => statCard(byKey[k], d[k], year)).join('')}</div>`;
}

export function overviewPage(data, year) {
  const d = data.indonesia;
  const cards = HEADLINE.map((k) => statCard(byKey[k], d[k], year)).join('');
  const parts = [['agri', 'Farming, forestry, fishing', 'p1'], ['manuf', 'Manufacturing', 'p2'], ['services', 'Services', 'p3']]
    .map(([k, label, cls]) => ({ label, cls, value: (latestAtOrBefore(d[k], year) || [0, 0])[1] }));
  const tiles = TOPICS.map((t) => {
    const n = INDICATORS.filter((i) => i.topic === t.id).length;
    return `<a class="tile" href="#/topic/${t.id}?y=${year}"><b>${t.name}</b><span>${t.blurb}</span><small>${n} indicators \u2192</small></a>`;
  }).join('');
  return `<section class="hero">
<div><h1>Indonesia in numbers</h1><p class="lede">${TOPICS.length} topics, ${INDICATORS.length} indicators, every figure with its source and year. Pick a year to redraw the page.</p></div>
${yearPicker(year, 2000, 2025, '#/')}
</section>
${auditStrip(data)}
<h2 class="sec">Headline figures, ${year}</h2>
<div class="cards">${cards}</div>${pinned(d, year)}
<div class="split">
<section class="panel"><h2>What the economy is made of, ${year}</h2>${structureBar(parts, year)}<p class="cite">Source: World Bank WDI \u00B7 NV.AGR / NV.IND.MANF / NV.SRV \u00B7 ${year}</p>${ageMix(d, year)}</section>
<section class="panel"><h2>Since 2000</h2>${keyFindings(d)}</section>
</div>
<h2 class="sec">Explore by topic</h2>
<div class="tiles">${tiles}</div>`;
}
