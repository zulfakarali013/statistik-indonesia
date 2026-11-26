// One stacked bar splitting GDP into farming, manufacturing, services and the rest for a year.

export function structureBar(parts, year) {
  const known = parts.reduce((s, p) => s + (p.value || 0), 0);
  const all = [...parts, { label: 'Other industry, mining, taxes', value: Math.max(0, 100 - known), cls: 'p4' }];
  const segs = all.map((p) => `<span class="seg ${p.cls}" style="width:${p.value.toFixed(1)}%" title="${p.label} ${p.value.toFixed(1)}%"></span>`).join('');
  const key = all.map((p) => `<li><i class="${p.cls}"></i>${p.label} <b>${p.value.toFixed(1)}%</b></li>`).join('');
  return `<div class="stack" aria-label="Economy by sector, ${year}">${segs}</div><ul class="stack-key">${key}</ul>`;
}
