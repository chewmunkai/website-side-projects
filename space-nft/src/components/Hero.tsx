"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SITE } from "@/lib/data";
import MagneticButton from "./MagneticButton";
import { PRELOADER_DONE } from "./Preloader";
import styles from "./Hero.module.css";

const PlanetCanvas = dynamic(() => import("./scene/PlanetCanvas"), {
  ssr: false,
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const q = gsap.utils.selector(el);
    const words = q("[data-h]");
    const fades = q("[data-fade]");

    if (reduced) {
      gsap.set([...words, ...fades], { opacity: 1, yPercent: 0, y: 0 });
      return;
    }

    let played = false;
    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115 });
      gsap.set(fades, { opacity: 0, y: 22 });

      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline();
        tl.to(q("[data-fade='eyebrow']"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })
          .to(
            words,
            { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 },
            "-=0.5"
          )
          .to(
            q("[data-fade='sub']"),
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.7"
          )
          .to(
            q("[data-fade='ctas']"),
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          )
          .to(
            q("[data-fade='cue'], [data-fade='tag']"),
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
            "-=0.6"
          )
          .fromTo(
            q("[data-stage]"),
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
            0.1
          );
      };

      // scroll parallax
      gsap.to(q("[data-parallax]"), {
        yPercent: -22,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // start when the curtain has lifted (or immediately if already done)
      const w = window as unknown as { __spaceLoaded?: boolean };
      if (w.__spaceLoaded) play();
      else window.addEventListener(PRELOADER_DONE, play, { once: true });
      // safety net
      const t = window.setTimeout(play, 4200);

      return () => {
        window.removeEventListener(PRELOADER_DONE, play);
        window.clearTimeout(t);
      };
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.copy}`} data-parallax>
            <span className={`eyebrow ${styles.eyebrow}`} data-fade="eyebrow">
              Generative · On-chain · 1 / 1
            </span>

            <h1 className={styles.title} aria-label={SITE.tagline}>
              <span className={styles.line} aria-hidden="true">
                <span data-h>Delving</span> <span data-h>into</span>{" "}
                <span data-h>the</span>
              </span>
              <span className={styles.line} aria-hidden="true">
                <span data-h>NFT</span>{" "}
                <span data-h className={styles.accent}>
                  planetarium
                </span>
              </span>
            </h1>

            <p className={styles.sub} data-fade="sub">
              {SITE.subline} A limited constellation of 1,555 worlds — each one
              born from code, none alike.
            </p>

            <div className={styles.ctas} data-fade="ctas">
              <MagneticButton href="#collection" variant="primary" dataCursor="Explore">
                Explore Collection
                <span className="btn__arrow">↗</span>
              </MagneticButton>
              <MagneticButton href={SITE.openSeaUrl} variant="ghost" dataCursor="OpenSea">
                View on OpenSea
              </MagneticButton>
            </div>
          </div>

          <div className={styles.stage}>
            <div className={styles.stageInner} data-stage>
              <PlanetCanvas
                seed={18}
                colorLow="#2a1a66"
                colorHigh="#5ce1ff"
                atmosphere="#8b5cf6"
                hasRings
                radius={1.55}
                rotationSpeed={0.05}
                bloom={1.05}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue} data-fade="cue">
        <i />
        Scroll to explore
      </div>

      <div className={styles.floatTag} data-fade="tag">
        <div>
          EDITION <b>1,555</b>
        </div>
        <div>
          FLOOR <b>0.025 ETH</b>
        </div>
      </div>
    </section>
  );
}
