import type { CSSProperties } from "react";
import { TEAM } from "@/lib/data";
import Reveal from "./Reveal";
import styles from "./Team.module.css";

export default function Team() {
  return (
    <section id="team" className={`${styles.team} section`}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <span className="eyebrow" style={{ marginBottom: "1rem", display: "inline-flex" }}>
              Our Team
            </span>
            <h2 className={styles.title}>
              The <em>visionaries</em> behind us
            </h2>
          </div>
          <p className={styles.sub}>
            A small constellation of builders, designers and dreamers charting
            the planetarium together.
          </p>
        </div>

        <Reveal className={styles.grid} stagger={0.08} y={28}>
          {TEAM.map((m, i) => (
            <article
              key={m.name}
              className={styles.card}
              style={
                {
                  "--m-a": m.colors[0],
                  "--m-b": m.colors[1],
                  "--m-glow": m.colors[0],
                } as CSSProperties
              }
            >
              <span className={styles.idx}>0{i + 1}</span>
              <div className={styles.avatar}>
                <span />
                {m.name.charAt(0)}
              </div>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.role}>{m.role}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
