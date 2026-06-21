/** Small animation/math helpers for scroll-driven choreography. */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invlerp = (a: number, b: number, v: number) =>
  clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const smootherstep = (t: number) =>
  t * t * t * (t * (t * 6 - 15) + 10);

/** Fade window: ramps 0→1 over [inStart,inEnd], holds, ramps 1→0 over [outStart,outEnd]. */
export function fadeWindow(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) {
  const fin = invlerp(inStart, inEnd, p);
  const fout = 1 - invlerp(outStart, outEnd, p);
  return clamp01(Math.min(fin, fout));
}

/** Remap p from [a,b] into 0..1 (clamped), eased smooth. */
export function phase(p: number, a: number, b: number) {
  return smooth(invlerp(a, b, p));
}
