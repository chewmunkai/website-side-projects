"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/data";
import MagneticButton from "./MagneticButton";
import styles from "./CtaCosmos.module.css";

const PlanetCanvas = dynamic(() => import("./scene/PlanetCanvas"), {
  ssr: false,
});

export default function CtaCosmos() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
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
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        fades,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 60%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="mint" className={styles.cta}>
      <div className={styles.planetBg}>
        <PlanetCanvas
          seed={63}
          colorLow="#3a0f33"
          colorHigh="#ffb347"
          atmosphere="#ff5da2"
          hasRings
          radius={1.6}
          rotationSpeed={0.04}
          bloom={1.15}
        />
      </div>
      <div className={styles.glow} />

      <div className={styles.inner}>
        <span className="eyebrow" data-fade>
          The Final Frontier
        </span>
        <h2 className={styles.title} aria-label="Embrace the cosmos">
          <span className={styles.line} aria-hidden="true">
            <span data-w>Embrace</span>
          </span>
          <span className={styles.line} aria-hidden="true">
            <span data-w>the</span> <span data-w><em>cosmos</em></span>
          </span>
        </h2>
        <p className={styles.sub} data-fade>
          1,555 worlds are waiting. Connect your wallet and claim a piece of the
          planetarium before the constellation completes.
        </p>
        <div className={styles.meta} data-fade>
          <div>
            Supply<b>1,555</b>
          </div>
          <div>
            Price<b>0.025 ETH</b>
          </div>
          <div>
            Network<b>Ethereum</b>
          </div>
        </div>
        <div className={styles.mint} data-fade>
          <MagneticButton
            href={SITE.openSeaUrl}
            variant="primary"
            dataCursor="Mint"
            strength={0.5}
          >
            Mint Now
            <span className="btn__arrow">↗</span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
