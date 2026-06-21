"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { STATS } from "@/lib/data";
import styles from "./Stats.module.css";

function format(v: number, decimals: number) {
  return decimals > 0
    ? v.toFixed(decimals)
    : Math.round(v).toLocaleString("en-US");
}

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const cells = el.querySelectorAll<HTMLElement>("[data-val]");

    const ctx = gsap.context(() => {
      cells.forEach((cell) => {
        const target = parseFloat(cell.dataset.val || "0");
        const decimals = parseInt(cell.dataset.decimals || "0", 10);
        const suffix = cell.dataset.suffix || "";
        const numEl = cell.querySelector<HTMLElement>("[data-num]")!;

        if (reduced) {
          numEl.textContent = format(target, decimals) + suffix;
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          onUpdate: () => {
            numEl.textContent = format(obj.v, decimals) + suffix;
          },
        });
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className={`${styles.stats} container`} aria-label="Collection stats">
      <div className={styles.grid}>
        {STATS.map((s) => (
          <div
            key={s.label}
            className={styles.cell}
            data-val={s.value}
            data-suffix={s.suffix}
            data-decimals={0}
          >
            <div className={styles.value}>
              <span data-num>0</span>
            </div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
