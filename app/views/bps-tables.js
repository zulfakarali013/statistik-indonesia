// The BPS province tables the Provinces page uses, each with its exact title, period and link.

export function bpsTables(data) {
  const rows = data.provinces.tables.map((t) => `<tr><td><a href="#/provinces?i=${t.key}">${t.label}</a><small>${t.title}</small></td><td>BPS</td><td>${t.period}</td><td class="num">${t.values.length} + national</td><td><a href="${t.url}" rel="noopener">bps.go.id</a></td></tr>`).join('');
  return `<h2 class="gap">BPS province tables</h2><div class="scroll"><table><thead><tr><th>Table</th><th>Publisher</th><th>Period</th><th>Values</th><th>Link</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
