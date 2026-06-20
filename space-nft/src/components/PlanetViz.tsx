import type { CSSProperties } from "react";
import styles from "./PlanetViz.module.css";

interface PlanetVizProps {
  low: string;
  high: string;
  atmosphere: string;
  seed?: number;
  hasRings?: boolean;
  className?: string;
}

/**
 * A pure-CSS procedural "planet" — layered radial gradients, a drifting
 * surface, a terminator shadow and an optional ring. Used for the collection
 * grid and team avatars so we keep WebGL contexts to the few that earn it.
 */
export default function PlanetViz({
  low,
  high,
  atmosphere,
  seed = 12,
  hasRings = false,
  className,
}: PlanetVizProps) {
  // deterministic light position from the seed
  const lx = 26 + ((seed * 7.3) % 34);
  const ly = 22 + ((seed * 4.1) % 30);

  const style = {
    "--p-low": low,
    "--p-high": high,
    "--p-atmo": atmosphere,
    "--lx": lx,
    "--ly": ly,
  } as CSSProperties;

  return (
    <div
      className={`${styles.viz} ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    >
      {hasRings && <span className={styles.ring} />}
      <div className={styles.planet}>
        <span className={styles.surface} />
        <span className={styles.shadow} />
      </div>
    </div>
  );
}
