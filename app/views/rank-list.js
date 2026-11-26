// Where Indonesia places among the eight countries on every indicator that has a direction.

import { INDICATORS } from '../catalog.js';
import { peerRows } from './peer-rows.js';

export function rankList(data) {
  const items = INDICATORS.filter((ind) => ind.better && ind.key !== 'poverty' && data.peers[ind.key]).map((ind) => {
    const rows = peerRows(data, ind.key).filter((r) => r.value !== null);
    const sorted = [...rows].sort((a, b) => (b.value - a.value) * ind.better);
    const place = sorted.findIndex((r) => r.home) + 1;
    const tone = place <= Math.ceil(rows.length / 3) ? 'good' : place > rows.length - Math.ceil(rows.length / 3) ? 'bad' : 'flat';
    return `<li><a href="#/compare?i=${ind.key}">${ind.label}</a><b class="${tone}">#${place} of ${rows.length}</b></li>`;
  }).join('');
  return `<ul class="ranks">${items}</ul><p class="cite">#1 is the best outcome; poverty is left out because each country sets its own line \u00B7 latest year each country has in World Bank WDI</p>`;
}
