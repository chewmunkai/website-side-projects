"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { CTA, SITE } from "@/lib/data";
import MagneticButton from "./MagneticButton";
import styles from "./Cta.module.css";

/** Renders the CTA title with one *accent* word marked by asterisks. */
function titleWords(text: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok)) return <span key={i}> </span>;
    const accent = tok.startsWith("*") && tok.endsWith("*");
    const word = accent ? tok.slice(1, -1) : tok;
    return (
      <span key={i} data-w className={accent ? styles.accentWrap : undefined}>
        {accent ? <em>{word}</em> : word}
      </span>
    );
  });
}

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    const fades = el.querySelectorAll<HTMLElement>("[data-fade]");
    if (reduced) {
      gsap.set([...words, ...fades], { yPercent: 0, opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        fades,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 60%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="mint" className={styles.cta}>
      <div className={styles.glow} />
      <div className={styles.skyline} />
      <div className={styles.inner}>
        <span className="eyebrow" data-fade>
          {CTA.eyebrow}
        </span>
        <h2 className={styles.title} aria-label="Your second home is waiting">
          <span className={styles.line}>{titleWords(CTA.title)}</span>
        </h2>
        <p className={styles.sub} data-fade>
          {CTA.sub}
        </p>
        <div className={styles.actions} data-fade>
          <MagneticButton href={SITE.officialUrl} variant="primary" dataCursor="Begin" strength={0.5}>
            {CTA.button}
            <span className="btn__arrow">↗</span>
          </MagneticButton>
          <MagneticButton href="#why" variant="ghost" dataCursor="Explore">
            Why Malaysia
          </MagneticButton>
        </div>
        <p className={styles.disclaimer} data-fade>
          This is an independent concept experience. For official Malaysia My
          Second Home requirements and applications, always refer to{" "}
          <a href={SITE.officialUrl} target="_blank" rel="noopener noreferrer">
            the official MM2H programme
          </a>
          .
        </p>
      </div>
    </section>
  );
}
