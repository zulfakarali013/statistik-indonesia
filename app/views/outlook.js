// The IMF's outlook: its projections for the next two years beside the latest actual year.

import { formatValue } from '../lib/format.js';
import { valueAt } from '../lib/series-tools.js';
import { byKey } from '../catalog.js';

const ROWS = [['growth', 'GDP growth'], ['cpi', 'Inflation'], ['unemp', 'Unemployment (BPS basis)'], ['debt', 'Government debt, % of GDP'], ['current', 'Current account, % of GDP']];

export function outlookPanel(data) {
  const { series, projectedFrom, edition } = data.imfData;
  const years = [projectedFrom - 1, projectedFrom, projectedFrom + 1];
  const head = years.map((y) => `<th>${y}${y >= projectedFrom ? ' <em class="proj">proj.</em>' : ''}</th>`).join('');
  const body = ROWS.map(([k, label]) => {
    const ind = { ...byKey[k === 'unemp' ? 'unemp' : k] || byKey.growth, fmt: 'pct', dp: 1 };
    return `<tr><td>${label}</td>${years.map((y) => `<td class="num">${formatValue(valueAt(series[k], y), ind)}</td>`).join('')}</tr>`;
  }).join('');
  return `<section class="panel"><h2>Outlook</h2><table><thead><tr><th>IMF figure</th>${head}</tr></thead><tbody>${body}</tbody></table><p class="cite">Source: ${edition} \u00B7 projections are the IMF\u2019s, not outcomes</p></section>`;
}
