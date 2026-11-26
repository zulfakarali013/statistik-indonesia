// The age mix for a year as one bar: children, working age, older people.

import { latestAtOrBefore } from '../lib/series-tools.js';

export function ageMix(d, year) {
  const young = latestAtOrBefore(d.young, year), old = latestAtOrBefore(d.old, year);
  if (!young || !old) return '';
  const work = 100 - young[1] - old[1];
  const parts = [['0\u201314', young[1], 'a1'], ['15\u201364', work, 'a2'], ['65+', old[1], 'a3']];
  const segs = parts.map(([l, v, c]) => `<span class="seg ${c}" style="width:${v.toFixed(1)}%">${l} ${v.toFixed(1)}%</span>`).join('');
  return `<h2>Age mix, ${young[0]}</h2><div class="stack ages">${segs}</div><p class="cite">Source: World Bank WDI \u00B7 SP.POP.0014.TO.ZS / SP.POP.65UP.TO.ZS \u00B7 ${young[0]}; 15\u201364 is the remainder</p>`;
}
