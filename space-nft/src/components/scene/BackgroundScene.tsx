"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Starfield from "./Starfield";
import Nebula from "./Nebula";
import { useReducedMotion, useIsTouch } from "@/lib/useReducedMotion";

/**
 * The persistent cosmic backdrop — a fixed, full-viewport canvas living behind
 * all DOM content. Cheap on purpose (additive points + one nebula sphere, no
 * postprocessing) so it can run for the whole scroll without taxing the GPU.
 */
export default function BackgroundScene() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const [mounted, setMounted] = useState(false);
  const starCount = touch ? 900 : 1800;

  // never instantiate WebGL during static SSR
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, touch ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Nebula />
        <Starfield count={starCount} />
      </Canvas>
    </div>
  );
}
