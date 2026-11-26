// Gathers every publisher's figures into one object the pages read: World Bank series, IMF series
// (actual years go into the indicator map, projections stay in data.imf) and BPS province tables.

import * as wdi from './series.js';
import { imf, IMF_EDITION, IMF_PROJECTED_FROM } from './imf.js';
import * as bps from './bps.js';
import { intl, checks } from './intl.js';

function upTo(series, lastYear) {
  const [y0, vals] = series;
  return [y0, vals.slice(0, lastYear - y0 + 1)];
}

export const RETRIEVED = wdi.RETRIEVED;
export const PEERS = wdi.PEERS;
export const peers = wdi.peers;
export const indonesia = { ...wdi.indonesia, debt: upTo(imf.debt, IMF_PROJECTED_FROM - 1), current: upTo(imf.current, IMF_PROJECTED_FROM - 1), ...intl };
export const secondReadings = checks;
export const imfData = { series: imf, edition: IMF_EDITION, projectedFrom: IMF_PROJECTED_FROM };
export const provinces = bps;
