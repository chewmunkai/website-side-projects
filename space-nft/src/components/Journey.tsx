"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { HERO, JOURNEY_BEATS } from "@/lib/data";
import MagneticButton from "./MagneticButton";
import { PRELOADER_DONE } from "./Preloader";
import { journey } from "./journey/journeyState";
import styles from "./Journey.module.css";

const JourneyScene = dynamic(() => import("./journey/JourneyScene"), {
  ssr: false,
});

function stageFor(p: number): number {
  if (p < 0.12) return 0; // hero / space
  if (p < 0.44) return 1; // earth
  if (p < 0.5) return -1; // crossfade
  if (p < 0.72) return 2; // malaysia
  if (p < 0.82) return -1; // crossfade
  return 3; // kl
}

const spike = (p: number, c: number, w: number) =>
  Math.max(0, 1 - Math.abs(p - c) / w);

function renderTitle(text: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok)) return <span key={i}> </span>;
    const accent = tok.startsWith("*") && tok.endsWith("*");
    const word = accent ? tok.slice(1, -1) : tok;
    return (
      <span key={i} data-h className={accent ? styles.accent : undefined}>
        {word}
      </span>
    );
  });
}

export default function Journey() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const railFill = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();

  // pointer parallax target
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      journey.px = (e.clientX / window.innerWidth) * 2 - 1;
      journey.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // scroll-driven journey
  useEffect(() => {
    if (reduced) {
      journey.progress = 0;
      setStage(0);
      return;
    }
    const sec = section.current;
    const pinEl = pin.current;
    if (!sec || !pinEl) return;

    let lastStage = -2;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        pin: pinEl,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          journey.progress = p;
          if (flash.current) {
            const f = Math.max(spike(p, 0.47, 0.04), spike(p, 0.78, 0.04));
            flash.current.style.opacity = String(Math.min(0.6, f));
          }
          if (railFill.current)
            railFill.current.style.transform = `scaleY(${p})`;
          const st = stageFor(p);
          if (st !== lastStage) {
            lastStage = st;
            setStage(st);
          }
        },
      });
    }, sec);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  // hero intro (after the preloader lifts)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const words = q("[data-h]");
    const fades = q("[data-fade]");
    if (reduced) {
      gsap.set([...words, ...fades], { yPercent: 0, opacity: 1, y: 0 });
      return;
    }
    let played = false;
    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115 });
      gsap.set(fades, { opacity: 0, y: 20 });
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline();
        tl.to(q("[data-fade='eyebrow']"), { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
          .to(words, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 }, "-=0.5")
          .to(q("[data-fade='sub']"), { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
          .to(q("[data-fade='ctas']"), { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
      };
      const w = window as unknown as { __spaceLoaded?: boolean };
      if (w.__spaceLoaded) play();
      else window.addEventListener(PRELOADER_DONE, play, { once: true });
      const t = window.setTimeout(play, 4200);
      return () => {
        window.removeEventListener(PRELOADER_DONE, play);
        window.clearTimeout(t);
      };
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const beats = JOURNEY_BEATS;

  return (
    <section
      id="journey"
      ref={section}
      className={`${styles.journey} ${reduced ? styles.static : ""}`}
    >
      <div ref={pin} className={styles.pin}>
        <div className={styles.canvas}>
          <JourneyScene />
        </div>

        <div ref={flash} className={styles.flash} aria-hidden="true" />

        <div className={styles.captions}>
          {/* space stage = hero copy */}
          <div
            ref={heroRef}
            className={`${styles.hero} ${stage !== 0 ? styles.gone : ""}`}
          >
            <span className={`eyebrow ${styles.eyebrow}`} data-fade="eyebrow">
              {HERO.eyebrow}
            </span>
            <h1 className={styles.title}>
              <span className={styles.line}>{renderTitle(HERO.titleLine1)}</span>
              <span className={styles.line}>{renderTitle(HERO.titleLine2)}</span>
            </h1>
            <p className={styles.sub} data-fade="sub">
              {HERO.sub}
            </p>
            <div className={styles.ctas} data-fade="ctas">
              <MagneticButton
                variant="primary"
                dataCursor="Descend"
                onClick={() =>
                  getLenis()?.scrollTo(window.scrollY + window.innerHeight * 1.4, {
                    duration: 2,
                  })
                }
              >
                {HERO.primaryCta}
                <span className="btn__arrow">↓</span>
              </MagneticButton>
              <MagneticButton href="#why" variant="ghost" dataCursor="Explore">
                {HERO.secondaryCta}
              </MagneticButton>
            </div>
          </div>

          {/* journey beats */}
          {[1, 2, 3].map((idx) => {
            const beat = beats[idx];
            return (
              <div
                key={beat.stage}
                className={`${styles.beat} ${stage === idx ? styles.active : ""}`}
                aria-hidden={stage === idx ? "false" : "true"}
              >
                <span className={styles.beatKicker}>{beat.kicker}</span>
                <p className={styles.beatLine}>{beat.line}</p>
              </div>
            );
          })}
        </div>

        {!reduced && (
          <>
            <div className={styles.rail} aria-hidden="true">
              <span ref={railFill} className={styles.railFill} />
            </div>
            <div
              className={`${styles.scrollCue} ${stage === 0 ? styles.show : ""}`}
            >
              Scroll to descend ↓
            </div>
          </>
        )}
      </div>
    </section>
  );
}
