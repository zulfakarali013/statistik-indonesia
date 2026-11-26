// Picks a chart's drawing size for the screen, so axis labels stay readable on a phone.

export function chartSize(desktopHeight = 240) {
  return innerWidth < 760 ? { width: 360, height: 200 } : { width: 1100, height: desktopHeight };
}
