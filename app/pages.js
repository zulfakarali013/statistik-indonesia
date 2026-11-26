// Maps a parsed hash to a page and wires each page's controls after it is drawn.

import { overviewPage } from './views/overview.js';
import { topicPage } from './views/topic.js';
import { indicatorPage } from './views/indicator.js';
import { comparePage, bindCompare } from './views/compare.js';
import { dataPage, bindDataSearch } from './views/data-table.js';
import { sourcesPage } from './views/sources.js';
import { provincesPage, bindProvinces } from './views/provinces.js';
import { bindYearPicker } from './ui/year-picker.js';
import { bindCsv } from './export/csv.js';
import { bindPins } from './ui/pins.js';
import { TOPICS, byKey } from './catalog.js';

const LATEST = 2025;

function yearFrom(params) {
  const y = parseInt(params.get('y'), 10);
  return y >= 2000 && y <= LATEST ? y : LATEST;
}

const notFound = { title: 'Not found', section: '', html: '<section class="panel"><h1>Page not found</h1><p><a href="#/">Back to the overview</a></p></section>' };

export function route(data, parts, params) {
  const year = yearFrom(params);
  const [head, arg] = parts;
  if (!head) return { title: 'Indonesia in numbers', section: 'home', html: overviewPage(data, year) };
  if (head === 'topic') {
    const html = topicPage(data, arg, year);
    return html ? { title: TOPICS.find((t) => t.id === arg).name, section: arg, html } : notFound;
  }
  if (head === 'indicator') {
    const html = indicatorPage(data, arg, params.has('y') ? year : null);
    return html ? { title: byKey[arg].label, section: byKey[arg].topic, html } : notFound;
  }
  if (head === 'provinces') return { title: 'Provinces', section: 'provinces', html: provincesPage(data, params) };
  if (head === 'compare') return { title: 'Compare', section: 'compare', html: comparePage(data, params) };
  if (head === 'data') return { title: 'All indicators', section: 'data', html: dataPage(data) };
  if (head === 'sources') return { title: 'Sources', section: 'sources', html: sourcesPage(data) };
  return notFound;
}

export function bindPage(root, data, params) {
  bindYearPicker(root);
  bindCompare(root, params);
  bindProvinces(root, params);
  bindDataSearch(root);
  bindCsv(root, data);
  bindPins(root);
  const slide = root.querySelector('[data-slide]');
  if (slide) {
    slide.addEventListener('input', () => { slide.nextElementSibling.value = slide.value; });
    slide.addEventListener('change', () => { location.hash = `#/indicator/${slide.dataset.slide}?y=${slide.value}&keep=1`; });
  }
}
