"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP entry point. Registers plugins exactly once (guarded for
 * Fast Refresh / repeated imports) and re-exports the shared instances so
 * every component animates against the same timeline + ScrollTrigger registry.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
