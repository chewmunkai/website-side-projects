"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Marquee from "./Marquee";
import styles from "./Mission.module.css";

/** word | accent flag */
const WORDS: Array<[string, boolean]> = [
  ["Uniting", false],
  ["art", true],
  ["&", false],
  ["technology", true],
  ["to", false],
  ["redefine", false],
  ["digital", false],
  ["creativity.", true],
];

export default function Mission() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets = el.querySelectorAll<HTMLElement>("[data-w]");

    if (reduced) {
      gsap.set(targets, { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={`${styles.mission} section`} aria-label="Mission">
      <div className={`${styles.marquees} ${styles.top}`}>
        <Marquee
          items={["Generative", "On-chain", "Immersive", "1 of 1"]}
          duration={32}
          outline
        />
      </div>

      <div className="container">
        <p className={styles.statement} aria-label="Uniting art and technology to redefine digital creativity.">
          {WORDS.map(([w, accent], i) => (
            <span key={i} className={styles.word} aria-hidden="true">
              <span data-w className={accent ? styles.accent : ""}>
                {w}
              </span>
              {i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>

      <div className={`${styles.marquees} ${styles.bottom}`}>
        <Marquee
          items={["Cosmic", "Rare", "Hand-tuned", "Collectible"]}
          duration={36}
          reverse
          outline
        />
      </div>
    </section>
  );
}
