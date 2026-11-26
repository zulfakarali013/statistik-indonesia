// #/topic/<id> one topic: a card for each of its indicators and a trend chart for the first.

import { TOPICS, INDICATORS } from '../catalog.js';
import { statCard } from '../ui/stat-card.js';
import { yearPicker } from '../ui/year-picker.js';
import { lineChart } from '../charts/line-chart.js';
import { citeLine } from '../ui/cite.js';
import { chartSize } from '../charts/chart-size.js';
import { outlookPanel } from './outlook.js';

export function topicPage(data, id, year) {
  const topic = TOPICS.find((t) => t.id === id);
  if (!topic) return null;
  const inds = INDICATORS.filter((i) => i.topic === id);
  const lead = inds[0];
  const cards = inds.map((ind) => statCard(ind, data.indonesia[ind.key], year)).join('');
  return `<section class="hero"><div><p class="crumb"><a href="#/">Overview</a> / ${topic.name}</p><h1>${topic.name}</h1><p class="lede">${topic.blurb}</p></div>${yearPicker(year, 2000, 2025, `#/topic/${id}`)}</section>
<section class="panel"><h2>${lead.label} <small>${lead.unit}</small></h2>${lineChart(data.indonesia[lead.key], lead, { mark: year, ...chartSize(230) })}${citeLine(lead, year)}</section>
<div class="cards">${cards}</div>${id === 'economy' ? outlookPanel(data) : ''}`;
}
