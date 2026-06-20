"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Planet from "./Planet";
import { useReducedMotion, useIsTouch } from "@/lib/useReducedMotion";

interface PlanetCanvasProps {
  seed?: number;
  colorLow?: string;
  colorHigh?: string;
  atmosphere?: string;
  hasRings?: boolean;
  radius?: number;
  rotationSpeed?: number;
  /** strength of the soft CSS halo behind the planet (fakes a bloom glow) */
  bloom?: number;
  className?: string;
}

/** Tilts its children toward the pointer for a subtle hand-of-god parallax. */
function PointerTilt({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y +=
      (state.pointer.x * 0.4 - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x +=
      (-state.pointer.y * 0.3 - ref.current.rotation.x) * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * A self-contained planet in its own canvas, used inline within sections.
 * Rendering is gated by an IntersectionObserver so off-screen instances stop
 * consuming the GPU. The glow is a CSS halo rather than a WebGL bloom pass —
 * cheaper, bullet-proof across browsers, and it composites over the page.
 */
export default function PlanetCanvas({
  seed = 12,
  colorLow = "#241a55",
  colorHigh = "#5ce1ff",
  atmosphere = "#8b5cf6",
  hasRings = false,
  radius = 1.5,
  rotationSpeed = 0.06,
  bloom = 0.85,
  className,
}: PlanetCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const planet = (
    <Planet
      seed={seed}
      colorLow={colorLow}
      colorHigh={colorHigh}
      atmosphere={atmosphere}
      hasRings={hasRings}
      radius={radius}
      detail={touch ? 16 : 32}
      rotationSpeed={rotationSpeed}
      animate={!reduced}
    />
  );

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {/* soft halo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-6%",
          zIndex: 0,
          pointerEvents: "none",
          opacity: Math.min(0.85, bloom * 0.6),
          background: `radial-gradient(circle at 50% 48%, color-mix(in srgb, ${atmosphere} 70%, transparent) 0%, transparent 60%)`,
          filter: "blur(34px)",
        }}
      />
      <Canvas
        style={{ position: "relative", zIndex: 1 }}
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, touch ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
      >
        {touch || reduced ? planet : <PointerTilt>{planet}</PointerTilt>}
      </Canvas>
    </div>
  );
}
