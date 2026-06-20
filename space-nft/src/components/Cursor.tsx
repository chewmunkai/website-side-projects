"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./Cursor.module.css";

/**
 * Bespoke cursor: a difference-blended ring that lags behind a tight dot,
 * scaling + labelling itself over interactive targets. Pointer-fine only —
 * touch devices keep their native behaviour.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    document.body.classList.add("cursor-custom");
    setReady(true);

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const root = rootRef.current!;
    const labelEl = labelRef.current!;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      xRing(e.clientX);
      yRing(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    let scaleTween: gsap.core.Tween | null = null;
    const setHover = (active: boolean, label?: string) => {
      scaleTween?.kill();
      scaleTween = gsap.to(ring, {
        scale: active ? (label ? 2.1 : 1.7) : 1,
        borderColor: active
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.7)",
        backgroundColor: active && label ? "#fff" : "rgba(255,255,255,0)",
        duration: 0.4,
        ease: "power3",
      });
      gsap.to(dot, { scale: active ? 0 : 1, duration: 0.3 });
      if (label) {
        labelEl.textContent = label;
        root.classList.add(styles.hasLabel);
      } else {
        root.classList.remove(styles.hasLabel);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (!target) {
        setHover(false);
        return;
      }
      setHover(true, target.dataset.cursor || undefined);
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${ready ? styles.ready : ""}`}
      aria-hidden="true"
    >
      <div ref={ringRef} className={styles.ring}>
        <span ref={labelRef} className={styles.label} />
      </div>
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
