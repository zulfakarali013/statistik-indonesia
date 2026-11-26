// Turning raw numbers into the short strings the site prints.

export function formatValue(v, ind) {
  if (v === null || v === undefined) return '\u2014';
  if (ind.fmt === 'usd') return usd(v);
  if (ind.fmt === 'people') return people(v);
  const s = v.toLocaleString('en-US', { minimumFractionDigits: ind.dp, maximumFractionDigits: ind.dp });
  return ind.fmt === 'pct' ? s + '%' : s;
}

export function usd(v) {
  const a = Math.abs(v), sign = v < 0 ? '\u2212' : '';
  if (a >= 1e12) return `${sign}$${(a / 1e12).toFixed(2)} tn`;
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(1)} bn`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(0)} m`;
  return `${sign}$${Math.round(a).toLocaleString('en-US')}`;
}

export function people(v) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)} bn`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)} m`;
  return Math.round(v).toLocaleString('en-US');
}

export function formatChange(delta, ind) {
  if (delta === null) return '';
  const arrow = delta > 0 ? '\u25B2' : delta < 0 ? '\u25BC' : '\u25CF';
  let mag;
  if (ind.fmt === 'usd') mag = usd(Math.abs(delta));
  else if (ind.fmt === 'people') mag = people(Math.abs(delta));
  else mag = Math.abs(delta).toFixed(ind.dp) + (ind.fmt === 'pct' ? ' pts' : '');
  return `${arrow} ${mag}`;
}

export function toneOf(delta, ind) {
  if (!delta || !ind.better) return 'flat';
  return delta * ind.better > 0 ? 'good' : 'bad';
}

export const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
