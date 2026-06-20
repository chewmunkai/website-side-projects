"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ROADMAP } from "@/lib/data";
import SplitText from "./SplitText";
import styles from "./Roadmap.module.css";

export default function Roadmap() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = timeline.current;
    const fl = fill.current;
    if (!tl || !fl) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const phases = tl.querySelectorAll<HTMLElement>(`.${styles.phase}`);

    if (reduced) {
      gsap.set(fl, { scaleY: 1 });
      phases.forEach((p) => p.classList.add(styles.lit));
      gsap.set(`.${styles.card}`, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // spine draws with scroll
      gsap.fromTo(
        fl,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: tl,
            start: "top 65%",
            end: "bottom 75%",
            scrub: 0.5,
          },
        }
      );

      phases.forEach((phase, i) => {
        const card = phase.querySelector(`.${styles.card}`);
        const fromX = i % 2 === 0 ? 40 : -40;
        gsap.fromTo(
          card,
          { opacity: 0, x: fromX },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: phase, start: "top 78%", once: true },
          }
        );
        ScrollTrigger.create({
          trigger: phase,
          start: "top 62%",
          onEnter: () => phase.classList.add(styles.lit),
          onLeaveBack: () => phase.classList.remove(styles.lit),
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="roadmap" className={`${styles.roadmap} section`}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">The Voyage</span>
          <h2 className={styles.title}>
            A <em>living</em> roadmap
          </h2>
          <SplitText as="p" className={styles.lede} mode="words">
            A dynamic timeline charts the heartbeats of the project — from
            inception to milestones. Join the digital voyage.
          </SplitText>
        </div>

        <div ref={timeline} className={styles.timeline}>
          <div className={styles.rail}>
            <span ref={fill} className={styles.railFill} />
          </div>

          {ROADMAP.map((p) => (
            <div key={p.index} className={styles.phase}>
              <span className={styles.node} />
              <div className={styles.content}>
                <div className={styles.card}>
                  <span className={styles.index}>PHASE {p.index}</span>
                  <span className={styles.kicker}>{p.kicker}</span>
                  <h3 className={styles.phaseTitle}>{p.title}</h3>
                  <p className={styles.body}>{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
