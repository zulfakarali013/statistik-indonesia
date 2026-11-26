// Indonesia's latest value next to each neighbour's, ready for the bar chart and the compare table.

import { latestAtOrBefore } from '../lib/series-tools.js';

export function peerRows(data, key) {
  const home = latestAtOrBefore(data.indonesia[key], 9999);
  const rows = [{ name: 'Indonesia', home: true, year: home ? home[0] : null, value: home ? home[1] : null }];
  data.PEERS.forEach((name, i) => {
    const p = (data.peers[key] || [])[i];
    rows.push({ name, year: p ? p[0] : null, value: p ? p[1] : null });
  });
  return rows;
}
