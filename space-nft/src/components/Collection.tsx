"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { COLLECTION, type PlanetNFT } from "@/lib/data";
import { getLenis } from "@/lib/lenis";
import { useReducedMotion, useIsTouch } from "@/lib/useReducedMotion";
import PlanetViz from "./PlanetViz";
import MagneticButton from "./MagneticButton";
import styles from "./Collection.module.css";

const PlanetCanvas = dynamic(() => import("./scene/PlanetCanvas"), {
  ssr: false,
});

export default function Collection() {
  const section = useRef<HTMLElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState<PlanetNFT | null>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  // pinned horizontal scroll (desktop / pointer only)
  useEffect(() => {
    const sectionEl = section.current;
    const trackEl = track.current;
    const pinEl = pinWrap.current;
    if (!sectionEl || !trackEl || !pinEl) return;
    if (reduced || touch) return;

    const ctx = gsap.context(() => {
      const distance = () =>
        trackEl.scrollWidth - window.innerWidth + 80;

      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current)
              progress.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => tween.kill();
    }, sectionEl);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced, touch]);

  // card tilt
  const onCardMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (touch) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateY: px * 14,
      rotateX: -py * 14,
      transformPerspective: 900,
      transformOrigin: "center",
      duration: 0.5,
      ease: "power2.out",
    });
  };
  const onCardLeave = (e: MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  };

  // lightbox open / close
  const lbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const el = lbRef.current;
    if (el) {
      gsap.fromTo(
        el.querySelector(`.${styles.backdrop}`),
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );
      gsap.fromTo(
        el.querySelector(`.${styles.panel}`),
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "expo.out" }
      );
    }
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const close = () => {
    const el = lbRef.current;
    const done = () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      setSelected(null);
    };
    if (!el || reduced) return done();
    gsap.to(el.querySelector(`.${styles.panel}`), {
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.35,
      ease: "power2.in",
    });
    gsap.to(el.querySelector(`.${styles.backdrop}`), {
      opacity: 0,
      duration: 0.35,
      onComplete: done,
    });
  };

  return (
    <section ref={section} id="collection" className={styles.collection}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow" style={{ marginBottom: "1rem", display: "inline-flex" }}>
              The Collection
            </span>
            <h2 className={styles.title}>
              Ten worlds, <em>infinite</em> orbits
            </h2>
          </div>
          <div>
            <p className={styles.intro}>
              Every planet is procedurally born — surface, atmosphere and rings
              tuned by code so no two ever align. Open one to step closer.
            </p>
            <span className={styles.hint}>
              {touch ? "Swipe" : "Scroll"} to traverse →
            </span>
          </div>
        </div>
      </div>

      <div
        ref={pinWrap}
        className={`${styles.pinWrap} ${reduced || touch ? styles.touchScroll : ""}`}
      >
        <div ref={track} className={styles.track}>
          {COLLECTION.map((nft, i) => (
            <button
              key={nft.id}
              className={styles.card}
              style={{ ["--card-atmo" as string]: nft.atmosphere }}
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              onClick={() => setSelected(nft)}
              data-cursor="View"
              aria-label={`View ${nft.name}`}
            >
              <span className={styles.cardGlow} />
              <span className={styles.idx}>
                {String(i + 1).padStart(2, "0")} / 10
              </span>
              <div className={styles.viz}>
                <PlanetViz
                  low={nft.palette[0]}
                  high={nft.palette[1]}
                  atmosphere={nft.atmosphere}
                  seed={nft.seed}
                  hasRings={nft.hasRings}
                />
              </div>
              <div className={styles.meta}>
                <div>
                  <div className={styles.name}>{nft.name}</div>
                  <div className={styles.rarity}>{nft.rarity}</div>
                </div>
                <div className={styles.price}>
                  <b>{nft.price} ETH</b>
                  <small>Price</small>
                </div>
              </div>
              <span className={styles.viewTag}>◷ View world</span>
            </button>
          ))}
        </div>
        <span
          ref={progress}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "var(--gutter)",
            right: "var(--gutter)",
            bottom: "8%",
            height: "2px",
            transformOrigin: "left",
            transform: "scaleX(0)",
            background: "var(--grad)",
            display: reduced || touch ? "none" : "block",
          }}
        />
      </div>

      {selected && (
        <div
          ref={lbRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} details`}
          style={{ ["--lb-atmo" as string]: selected.atmosphere }}
        >
          <div className={styles.backdrop} onClick={close} />
          <div className={styles.panel}>
            <button className={styles.close} onClick={close} aria-label="Close">
              ✕
            </button>
            <div className={styles.lbStage}>
              <PlanetCanvas
                seed={selected.seed}
                colorLow={selected.palette[0]}
                colorHigh={selected.palette[1]}
                atmosphere={selected.atmosphere}
                hasRings={selected.hasRings}
                radius={1.5}
                rotationSpeed={0.12}
                bloom={1.0}
              />
            </div>
            <div className={styles.lbInfo}>
              <div className={styles.lbRarity}>{selected.rarity} · 1 / 1</div>
              <h3 className={styles.lbName}>{selected.name}</h3>
              <p className={styles.lbBlurb}>{selected.blurb}</p>
              <div className={styles.traits}>
                <div className={styles.trait}>
                  <span>Surface</span>
                  <b>
                    <i
                      className={styles.swatch}
                      style={{ background: selected.palette[1] }}
                    />
                    Crystalline
                  </b>
                </div>
                <div className={styles.trait}>
                  <span>Atmosphere</span>
                  <b>
                    <i
                      className={styles.swatch}
                      style={{ background: selected.atmosphere }}
                    />
                    Ionised
                  </b>
                </div>
                <div className={styles.trait}>
                  <span>Rings</span>
                  <b>{selected.hasRings ? "Present" : "None"}</b>
                </div>
                <div className={styles.trait}>
                  <span>Mint Price</span>
                  <b>{selected.price} ETH</b>
                </div>
              </div>
              <div className={styles.lbActions}>
                <MagneticButton href="#mint" variant="primary" dataCursor="Mint">
                  Mint this world
                </MagneticButton>
                <MagneticButton href="#collection" variant="ghost" onClick={close}>
                  Back to grid
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
