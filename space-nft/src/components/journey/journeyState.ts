/**
 * Mutable singleton shared between the GSAP ScrollTrigger (which writes the
 * pinned-section scroll progress) and the R3F scene (which reads it every
 * frame to drive the camera + world crossfades). A plain object beats React
 * state here: no re-renders, no frame-lag.
 */
export const journey = {
  /** 0 at the top of the pinned section, 1 at the bottom */
  progress: 0,
  /** smoothed pointer for subtle parallax, -1..1 */
  px: 0,
  py: 0,
};
