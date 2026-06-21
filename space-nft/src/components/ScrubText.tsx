"use client";

import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";

interface ScrubTextProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** dim start colour (kept readable for no-JS / reduced motion) */
  from?: string;
  /** filled colour the characters paint to as you scroll */
  to?: string;
}

/**
 * The original site's signature motif: a heading whose characters paint from a
 * dim colour to a bright one, left-to-right, *tied to the scrollbar* (scrub) —
 * and un-paint on scroll up. Re-themed to the MM2H palette.
 */
export default function ScrubText({
  children,
  as = "h2",
  className,
  from = "#6c6b82",
  to = "#ecebf5",
}: ScrubTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const chars = el.querySelectorAll<HTMLElement>("[data-c]");
    if (!chars.length) return;
    if (reduced) {
      gsap.set(chars, { color: to });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { color: from },
        {
          color: to,
          ease: "none",
          stagger: 0.6,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "top 38%",
            scrub: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [children, from, to]);

  const chars = Array.from(children).map((ch, i) =>
    ch === " " ? (
      <span key={i}> </span>
    ) : (
      <span key={i} data-c style={{ color: from }}>
        {ch}
      </span>
    )
  );

  return createElement(as, { ref, className, "aria-label": children }, chars);
}
