// Reading values out of a [first year, values] series.

export function points(series) {
  if (!series) return [];
  const [y0, vals] = series;
  return vals.map((v, i) => [y0 + i, v]).filter(([, v]) => v !== null);
}

export function valueAt(series, year) {
  if (!series) return null;
  const [y0, vals] = series;
  const v = vals[year - y0];
  return v === undefined ? null : v;
}

// The latest year at or before `year` that has a value, so a card never shows an empty slot.
export function latestAtOrBefore(series, year) {
  const pts = points(series).filter(([y]) => y <= year);
  return pts.length ? pts[pts.length - 1] : null;
}

export function yearRange(series) {
  const pts = points(series);
  return pts.length ? [pts[0][0], pts[pts.length - 1][0]] : null;
}

export function changeOver(series, year, back) {
  const now = latestAtOrBefore(series, year);
  if (!now) return null;
  const then = latestAtOrBefore(series, now[0] - back);
  if (!then) return null;
  return { from: then[0], to: now[0], delta: now[1] - then[1] };
}

export function countValues(series) {
  return points(series).length;
}
