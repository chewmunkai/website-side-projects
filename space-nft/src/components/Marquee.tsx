import styles from "./Marquee.module.css";

interface MarqueeProps {
  items: string[];
  duration?: number;
  reverse?: boolean;
  outline?: boolean;
}

/** Infinite CSS marquee. Duplicates the track so the loop is seamless. */
export default function Marquee({
  items,
  duration = 28,
  reverse = false,
  outline = false,
}: MarqueeProps) {
  const Row = () => (
    <div className={styles.track} style={{ ["--duration" as string]: `${duration}s` }}>
      {items.map((it, i) => (
        <span
          key={i}
          className={`${styles.item} ${outline && i % 2 ? styles.outline : ""}`}
        >
          {it}
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`${styles.marquee} ${reverse ? styles.reverse : ""}`}
      aria-hidden="true"
    >
      <Row />
      <Row />
    </div>
  );
}
