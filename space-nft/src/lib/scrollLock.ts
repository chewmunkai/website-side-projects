"use client";

import { getLenis } from "./lenis";

/**
 * Ref-counted scroll lock so multiple overlays (mobile menu, modals) compose
 * correctly — scroll only unlocks when the *last* lock is released.
 */
let count = 0;

export function lockScroll() {
  count += 1;
  if (count === 1) {
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  count = Math.max(0, count - 1);
  if (count === 0) {
    getLenis()?.start();
    document.body.style.overflow = "";
  }
}
