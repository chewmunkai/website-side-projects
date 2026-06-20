"use client";

import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  /** animate direct children with a stagger instead of the wrapper itself */
  stagger?: number;
}

/** Lightweight scroll-into-view reveal used across content sections. */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 34,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets = stagger ? Array.from(el.children) : el;

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, stagger]);

  return createElement(Tag, { ref, className }, children);
}
