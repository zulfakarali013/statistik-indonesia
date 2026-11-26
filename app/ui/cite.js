// The source-and-year line printed under every figure.

import { sourceOf } from '../catalog.js';

export function citeLine(ind, year) {
  const src = sourceOf(ind);
  return `<span class="cite" title="${src.name}, ${ind.code}">Source: ${src.short} \u00B7 ${ind.code} \u00B7 ${year}</span>`;
}
