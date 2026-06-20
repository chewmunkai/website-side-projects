"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Preloader.module.css";

const WORD = "SPACEPLANET";

/** Fires once the curtain has lifted so the hero can begin its intro. */
export const PRELOADER_DONE = "spaceplanet:loaded";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finish = () => {
      (window as unknown as { __spaceLoaded?: boolean }).__spaceLoaded = true;
      setDone(true);
      window.dispatchEvent(new Event(PRELOADER_DONE));
      ScrollTrigger.refresh();
    };

    if (reduced) {
      finish();
      return;
    }

    const el = root.current!;
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.from(`.${styles.word} span`, {
        yPercent: 110,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.04,
      })
        .to(`.${styles.tag}`, { opacity: 1, duration: 0.6 }, "-=0.5")
        .to(
          counter,
          {
            v: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current)
                countRef.current.textContent = String(Math.round(counter.v));
            },
          },
          0.2
        )
        .to(`.${styles.barFill}`, { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0.2)
        .to(`.${styles.content}`, { opacity: 0, duration: 0.4 }, "+=0.15")
        .to(
          `.${styles.panel}`,
          {
            yPercent: -101,
            duration: 1,
            ease: "expo.inOut",
            stagger: 0.06,
          },
          "-=0.1"
        );
    }, el);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div className={styles.panels}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.panel} />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <span>Planetarium</span>
          <span>EST. 2026</span>
        </div>

        <div className={styles.center}>
          <div>
            <div className={styles.word}>
              {Array.from(WORD).map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
            <div className={styles.tag}>Delving into the unknown</div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bar}>
            <div className={styles.barFill} />
          </div>
          <div className={styles.count}>
            <span ref={countRef}>0</span>
            <em>%</em>
          </div>
        </div>
      </div>
    </div>
  );
}
