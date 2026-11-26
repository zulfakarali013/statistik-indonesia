// The year selector shared by the overview and topic pages; changing it rewrites the hash.

export function yearPicker(year, first, last, route) {
  const opts = [];
  for (let y = last; y >= first; y--) opts.push(`<option${y === year ? ' selected' : ''}>${y}</option>`);
  return `<label class="year-pick">Year <select data-year-for="${route}">${opts.join('')}</select></label>`;
}

export function bindYearPicker(root) {
  const sel = root.querySelector('[data-year-for]');
  if (!sel) return;
  sel.addEventListener('change', () => {
    location.hash = `${sel.dataset.yearFor}?y=${sel.value}`;
  });
}
