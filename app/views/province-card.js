// One province at a glance: its four BPS figures beside the national figure, and its population change.

import { formatValue } from '../lib/format.js';

export function provinceCard(data, i) {
  const P = data.provinces;
  const items = P.tables.map((t) => {
    const v = t.values[i], diff = v - t.national;
    const isPop = t.key === 'pop';
    const val = isPop ? formatValue(v * 1000, { fmt: 'people' }) : formatValue(v, { fmt: t.key === 'ipm' ? 'num' : 'pct', dp: t.dp });
    const share = isPop ? `${((v / t.national) * 100).toFixed(1)}% of Indonesia` : `${diff >= 0 ? '+' : '\u2212'}${Math.abs(diff).toFixed(2)} vs Indonesia`;
    const tone = isPop ? 'flat' : (diff * t.better > 0 ? 'good' : diff * t.better < 0 ? 'bad' : 'flat');
    return `<li><span class="card-label">${t.label}, ${t.period}</span><b>${val}</b><span class="chg ${tone}">${share}</span></li>`;
  }).join('');
  const g = ((P.tables[0].values[i] / P.pop2024[i] - 1) * 100).toFixed(2);
  return `<section class="panel"><p class="crumb">${P.ISLAND[i]}</p><h2 class="prov-name">${P.NAMES[i]}</h2><ul class="prov-facts">${items}</ul>
<p class="small">Population grew <b>${g}%</b> from 2024 to 2025 (Indonesia ${((P.tables[0].national / P.pop2024National - 1) * 100).toFixed(2)}%).</p>
<p class="cite">Source: BPS province tables \u00B7 tap any square or name to switch province</p></section>`;
}
