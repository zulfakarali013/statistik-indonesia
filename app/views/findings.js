// Plain-language findings, each sentence built from the data so the numbers always match the charts.

import { byKey } from '../catalog.js';
import { formatValue } from '../lib/format.js';
import { points } from '../lib/series-tools.js';

function firstLast(series) {
  const p = points(series);
  return [p[0], p[p.length - 1]];
}

function line(key, verb, d) {
  const ind = byKey[key];
  const [a, b] = firstLast(d[key]);
  return `<li><a href="#/indicator/${key}">${ind.label}</a> ${verb} from <b>${formatValue(a[1], ind)}</b> in ${a[0]} to <b>${formatValue(b[1], ind)}</b> in ${b[0]}. <span class="cite">WDI ${ind.code}</span></li>`;
}

export function keyFindings(d) {
  const growth = points(d.growth);
  const dip = growth.reduce((m, p) => (p[1] < m[1] ? p : m));
  return `<ul class="findings">
${line('pop', 'rose', d)}
${line('gdppc', 'grew', d)}
${line('poverty', 'fell', d)}
${line('internet', 'jumped', d)}
${line('infant', 'fell', d)}
<li>The only year of shrinking output was <b>${dip[0]}</b>, when GDP growth was <b>${formatValue(dip[1], byKey.growth)}</b>. <span class="cite">WDI ${byKey.growth.code}</span></li>
</ul>`;
}
