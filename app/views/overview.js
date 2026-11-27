// #/ the overview: eight headline cards, one annotated story chart with range buttons,
// Indonesia at a glance from BPS province tables and what this edition contains; topic tiles below.

import { TOPICS, HEADLINE, byKey, INDICATORS } from '../catalog.js';
import { readPins } from '../ui/pins.js';
import { kpiCard, bpsReading } from '../ui/kpi-card.js';
import { statCard } from '../ui/stat-card.js';
import { auditStrip } from '../ui/audit-strip.js';
import { yearPicker } from '../ui/year-picker.js';
import { structureBar } from '../charts/structure-bar.js';
import { storyChart, rangeOf } from '../charts/story-chart.js';
import { latestAtOrBefore, yearRange, valueAt } from '../lib/series-tools.js';
import { keyFindings } from './findings.js';
import { ageMix } from '../charts/age-mix.js';
import { atAGlance, inThisEdition } from './glance.js';

const STORY = 'poverty';

function pinned(d, year) {
  const pins = readPins();
  if (!pins.length) return '';
  return `<h2 class="sec">Your pinned figures</h2><div class="cards">${pins.map((k) => statCard(byKey[k], d[k], year)).join('')}</div>`;
}

function storyPanel(data, params) {
  const ind = byKey[STORY];
  const s = data.indonesia[STORY];
  const [first, last] = yearRange(s);
  const [from, to] = rangeOf(params, first, last);
  const a = valueAt(s, from), b = valueAt(s, to);
  const r = params.get('r') || 'all';
  const btn = (key, label) => `<a class="seg-btn${r === key ? ' on' : ''}" href="#/?r=${key}&keep=1" aria-pressed="${r === key}">${label}</a>`;
  const share = a ? Math.round((b / a) * 100) : null;
  return `<section class="panel story-panel">
<div class="chart-head"><div><h2 class="story-title">Poverty is down to <span class="hot">${b}%</span>, ${share < 50 ? 'less than half' : share + '% of'} its ${from} rate</h2>
<p class="small muted">Share of Indonesians below the national poverty line \u00B7 ${from}\u2013${to} \u00B7 % of people</p></div>
<div class="seg">${btn('all', 'All years')}${btn('2010', 'Since 2010')}${btn('10', 'Last 10')}</div></div>
${storyChart(s, ind, { from, to, width: 720, height: 190 })}
<div class="chart-foot"><button class="btn ghost" data-csv="${STORY}">\u2193 Download chart CSV</button><span class="cite">Source: World Bank WDI \u00B7 ${ind.code} \u00B7 ${from}\u2013${to}. BPS March 2026 national rate: ${data.provinces.tables.find((t) => t.key === 'poor').national}%</span><a class="more" href="#/explore?i=${STORY}">Explore annual data \u2192</a></div>
</section>`;
}

export function overviewPage(data, year, params = new URLSearchParams()) {
  const d = data.indonesia;
  const cards = HEADLINE.map((k) => kpiCard(byKey[k], d[k], year, bpsReading(data, k, year))).join('');
  const parts = [['agri', 'Farming, forestry, fishing', 'p1'], ['manuf', 'Manufacturing', 'p2'], ['services', 'Services', 'p3']]
    .map(([k, label, cls]) => ({ label, cls, value: (latestAtOrBefore(d[k], year) || [0, 0])[1] }));
  const tiles = TOPICS.map((t) => {
    const n = INDICATORS.filter((i) => i.topic === t.id).length;
    return `<a class="tile" href="#/topic/${t.id}?y=${year}"><b>${t.name}</b><span>${t.blurb}</span><small>${n} indicators \u2192</small></a>`;
  }).join('');
  return `<section class="hero">
<div><h1 class="display">Indonesia in numbers</h1><p class="lede">Headline figures from BPS-Statistics Indonesia, the World Bank, IMF, WHO, UN and ILO, each with its source and year.</p></div>
<div class="hero-side"><span class="edition"><i></i><b>November 2026 edition</b><small>Headline figures, ${year}</small></span>${yearPicker(year, 2000, 2025, '#/')}</div>
</section>
<div class="kpis">${cards}</div>
<div class="split story-row">
${storyPanel(data, params)}
<div class="side-col">${atAGlance(data)}${inThisEdition(data)}</div>
</div>
${pinned(d, year)}
${auditStrip(data)}
<div class="split">
<section class="panel"><h2>What the economy is made of, ${year}</h2>${structureBar(parts, year)}<p class="cite">Source: World Bank WDI \u00B7 NV.AGR / NV.IND.MANF / NV.SRV \u00B7 ${year}</p>${ageMix(d, year)}</section>
<section class="panel"><h2>Since 2000</h2>${keyFindings(d)}</section>
</div>
<h2 class="sec">Explore by topic</h2>
<div class="tiles">${tiles}</div>`;
}
