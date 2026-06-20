"use client";

import type Lenis from "lenis";

/** Shared Lenis instance so nav/anchors can drive smooth programmatic scroll. */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** Smooth-scroll to an element/selector, gracefully falling back to native. */
export function scrollTo(
  target: string | HTMLElement,
  opts: { offset?: number; duration?: number } = {}
) {
  const { offset = 0, duration = 1.2 } = opts;
  if (instance) {
    instance.scrollTo(target, { offset, duration });
    return;
  }
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
