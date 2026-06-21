import type { CSSProperties } from "react";
import { WHY } from "@/lib/data";
import Reveal from "./Reveal";
import ScrubText from "./ScrubText";
import styles from "./Why.module.css";

export default function Why() {
  return (
    <section id="why" className={`${styles.why} section`}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">{WHY.eyebrow}</span>
          <ScrubText as="h2" className={styles.title}>
            A place that lets you stay awhile
          </ScrubText>
          <p className={styles.intro}>{WHY.intro}</p>
        </div>

        <Reveal className={styles.grid} stagger={0.07} y={30}>
          {WHY.items.map((item, i) => (
            <article
              key={item.title}
              className={styles.card}
              style={
                { "--c1": item.colors[0], "--c2": item.colors[1] } as CSSProperties
              }
            >
              <span className={styles.num}>0{i + 1}</span>
              <span className={styles.orb} />
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
