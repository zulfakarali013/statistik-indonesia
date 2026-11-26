// The audit strip: counts of what the site holds, computed from the data itself, never typed in.

import { INDICATORS, SOURCES } from '../catalog.js';
import { allChecks } from '../views/sources-differ.js';
import { countValues, yearRange } from '../lib/series-tools.js';

export function auditCounts(data) {
  let values = 0, peerValues = 0, first = 9999, last = 0;
  for (const ind of INDICATORS) {
    values += countValues(data.indonesia[ind.key]);
    const r = yearRange(data.indonesia[ind.key]);
    if (r) { first = Math.min(first, r[0]); last = Math.max(last, r[1]); }
    peerValues += (data.peers[ind.key] || []).filter(Boolean).length;
  }
  const provinceValues = (data.provinces.tables || []).reduce((n, t) => n + t.values.length + 1, 0);
  const checks = allChecks(data);
  return { indicators: INDICATORS.length, values, peerValues, provinceValues, first, last, countries: data.PEERS.length + 1,
    publishers: Object.keys(SOURCES).length, checks: checks.length, differ: checks.filter((c) => !c.agree).length };
}

export function auditStrip(data) {
  const a = auditCounts(data);
  const cited = a.values + a.peerValues + a.provinceValues;
  return `<div class="audit" aria-label="What this site holds">
<span><b>${a.indicators}</b> indicators</span>
<span><b>${a.values.toLocaleString('en-US')}</b> yearly figures for Indonesia</span>
<span><b>${a.first}\u2013${a.last}</b> years covered</span>
${a.provinceValues ? `<span><b>${a.provinceValues}</b> province figures</span>` : ''}
<span><b>${a.countries}</b> countries compared</span>
<span><b>${a.publishers}</b> publishers</span>
<span><b>${a.checks}</b> cross-checks, <b>${a.differ}</b> differ (both shown)</span>
<span class="ok"><b>${cited.toLocaleString('en-US')}/${cited.toLocaleString('en-US')}</b> figures carry source + year</span>
<span>Retrieved <b>${data.RETRIEVED}</b></span>
</div>`;
}
