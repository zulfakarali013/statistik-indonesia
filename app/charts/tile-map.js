// A tile map of Indonesia's 38 provinces: one square each, placed roughly where the province lies,
// shaded by the chosen BPS figure in five equal steps from lowest to highest.

const SPOTS = [[0,0],[1,0],[1,1],[2,1],[2,2],[2,3],[1,2],[3,4],[3,2],[3,0],[5,3],[5,4],[6,4],[6,5],[7,4],[4,4],[8,5],[9,5],[10,5],[5,1],[6,2],[7,2],[7,1],[7,0],[10,1],[9,2],[9,3],[10,3],[9,1],[8,2],[11,3],[11,1],[13,1],[12,1],[14,1],[14,3],[13,2],[14,2]];
const CODES = ['ACE','SUT','SUB','RIA','JAM','SUS','BEN','LAM','BBL','KEP','JKT','JBR','JTG','YOG','JTM','BAN','BAL','NTB','NTT','KBR','KTG','KSL','KTM','KTR','SUL','STG','SSL','SGR','GOR','SBR','MAL','MLU','PBR','PBD','PAP','PSL','PTG','PPG'];

export function tileMap(names, table, selected) {
  const vals = table.values;
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const step = (v) => Math.min(4, Math.floor(((v - lo) / (hi - lo || 1)) * 5));
  const S = 46, G = 4;
  const tiles = names.map((n, i) => {
    const [c, r] = SPOTS[i];
    const shade = step(vals[i]);
    return `<a href="#/provinces?i=${table.key}&p=${i}&keep=1"><g transform="translate(${c * (S + G)},${r * (S + G)})"><title>${n}: ${vals[i]}</title><rect class="t${shade}${i === selected ? ' pick' : ''}" width="${S}" height="${S}" rx="6"/><text x="${S / 2}" y="20" class="tc">${CODES[i]}</text><text x="${S / 2}" y="36" class="tv">${vals[i].toLocaleString('en', { maximumFractionDigits: vals[i] > 1000 ? 0 : 1 })}</text></g></a>`;
  }).join('');
  const w = 15 * (S + G), h = 6 * (S + G);
  const tone = `lower \u2192 higher${table.better < 0 ? ' (higher is worse)' : table.better > 0 ? ' (higher is better)' : ''}`;
  const key = [0, 1, 2, 3, 4].map((k) => `<i class="t${k}"></i>`).join('');
  return `<svg class="tiles-map" viewBox="0 0 ${w} ${h}" role="img" aria-label="Tile map of ${table.label} by province">${tiles}</svg><p class="map-key">${key}<span>${tone}</span><span class="muted">Squares are placed roughly west to east; not to scale.</span></p>`;
}
