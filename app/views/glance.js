// Two small overview panels: Indonesia at a glance (largest provinces and the poverty spread, from BPS)
// and "In this edition", the period each publisher's newest figures cover.

const millions = (thousands) => `${(thousands / 1000).toFixed(2)} m`;

export function atAGlance(data) {
  const P = data.provinces;
  const pop = P.tables.find((t) => t.key === 'pop');
  const poor = P.tables.find((t) => t.key === 'poor');
  const top = pop.values.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 3);
  const max = top[0][0];
  const rows = top.map(([v, i]) => `<li><span>${P.NAMES[i]}</span><span class="g-track"><span style="width:${((v / max) * 100).toFixed(1)}%"></span></span><b>${millions(v)}</b></li>`).join('');
  const lo = poor.values.indexOf(Math.min(...poor.values)), hi = poor.values.indexOf(Math.max(...poor.values));
  return `<section class="panel glance"><div class="chart-head"><h2>Indonesia at a glance</h2><a class="more" href="#/provinces?i=pop">All 38 provinces \u2192</a></div>
<p class="small muted">Largest provinces \u00B7 residents, ${pop.period}</p>
<ul class="g-bars">${rows}</ul>
<p class="g-spread">Poverty runs from <b>${poor.values[lo]}%</b> in ${P.NAMES[lo]} to <b class="hot">${poor.values[hi]}%</b> in ${P.NAMES[hi]}</p>
<span class="cite">Source: BPS \u00B7 population projection ${pop.period}; poverty rate ${poor.period}</span></section>`;
}

export function inThisEdition(data) {
  const P = data.provinces;
  const period = (k) => P.tables.find((t) => t.key === k).period;
  const items = [
    [period('tpt'), 'Open unemployment by province', 'BPS'],
    [period('poor'), 'Poverty rate by province', 'BPS'],
    ['Oct 2026', 'Growth, prices and debt outlook to 2027', 'IMF WEO'],
    ['to 2025', 'Indicators for Indonesia and 7 neighbours', 'World Bank WDI'],
  ];
  return `<section class="panel edition-list"><div class="chart-head"><h2>In this edition</h2><a class="more" href="#/sources">All sources \u2192</a></div>
<ul>${items.map(([when, what, who]) => `<li><em>${when}</em><b>${what}</b><small>${who}</small></li>`).join('')}</ul>
<span class="cite">All read ${data.RETRIEVED}</span></section>`;
}
