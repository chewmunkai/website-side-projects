"use client";

import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type SplitMode = "words" | "chars";

interface SplitTextProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** "words" => masked rise reveal; "chars" => per-letter fade/rotate */
  mode?: SplitMode;
  stagger?: number;
  duration?: number;
  delay?: number;
  /** start animation on scroll-into-view (default) or immediately on mount */
  trigger?: "scroll" | "mount";
  start?: string;
}

/**
 * Dependency-free text splitter + reveal. Splits a string into word- or
 * char-level spans and animates them with GSAP. Words use an overflow-hidden
 * mask so glyphs rise cleanly into place even when the line wraps.
 */
export default function SplitText({
  children,
  as: Tag = "span",
  className,
  mode = "words",
  stagger = 0.06,
  duration = 0.9,
  delay = 0,
  trigger = "scroll",
  start = "top 85%",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = el.querySelectorAll<HTMLElement>("[data-split-inner]");
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1, rotateX: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const from =
        mode === "words"
          ? { yPercent: 120, opacity: 1 }
          : { yPercent: 60, opacity: 0, rotateX: -55 };

      const tween = gsap.fromTo(targets, from, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration,
        delay,
        ease: "expo.out",
        stagger,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: el, start, once: true }
            : undefined,
      });

      return () => tween.kill();
    }, el);

    return () => ctx.revert();
  }, [children, mode, stagger, duration, delay, trigger, start]);

  const tokens =
    mode === "words" ? children.split(/(\s+)/) : Array.from(children);

  const content = tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}> </span>;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              overflow: mode === "words" ? "hidden" : "visible",
              verticalAlign: "top",
            }}
          >
            <span
              data-split-inner
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {token === " " ? " " : token}
            </span>
          </span>
        );
  });

  return createElement(
    Tag,
    { ref, className, "aria-label": children },
    content
  );
}

/** Re-export so callers can refresh triggers after layout shifts. */
export { ScrollTrigger };
