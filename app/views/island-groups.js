// Island groups: how Indonesia's people are spread, summed from the BPS province population table.

export function islandGroups(data) {
  const P = data.provinces;
  const pop = P.tables.find((t) => t.key === 'pop');
  const sums = {};
  P.ISLAND.forEach((g, i) => { sums[g] = (sums[g] || 0) + pop.values[i]; });
  const total = Object.values(sums).reduce((a, b) => a + b, 0);
  const rows = Object.entries(sums).sort((a, b) => b[1] - a[1]).map(([g, v]) => {
    const n = P.ISLAND.filter((x) => x === g).length;
    const pct = (v / total) * 100;
    return `<div class="bar-row"><span>${g}<small> ${n} prov.</small></span><span class="bar-track"><span class="bar-fill" style="width:${pct.toFixed(1)}%"></span></span><span class="bar-val">${(v / 1000).toFixed(1)} m <small>${pct.toFixed(1)}%</small></span></div>`;
  }).join('');
  return `<h2>Where people live</h2><div class="bars">${rows}</div><p class="cite">Source: BPS \u00B7 population by province, 2025 \u00B7 island totals are our sums of the 38 rows (${(total / 1000).toFixed(1)} m)</p>`;
}
