"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Starfield from "@/components/scene/Starfield";
import { useReducedMotion, useIsTouch } from "@/lib/useReducedMotion";
import Earth, { SUN_DIR } from "./Earth";
import Malaysia from "./Malaysia";
import KLCity from "./KLCity";
import CameraRig from "./CameraRig";
import Effects from "./Effects";

/**
 * The full space → Earth → Malaysia → KL canvas.
 *
 * Rendering pauses only on tab-blur. We deliberately do NOT gate on an
 * IntersectionObserver: this canvas lives inside a GSAP-pinned (position:fixed)
 * element, and an observer on it mis-fires when the pin engages, freezing the
 * frameloop mid-journey. The canvas is a fixed full-viewport layer at the top
 * of the page, so "render while the tab is visible" is the correct, robust gate.
 */
export default function JourneyScene() {
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // Observe the tall #journey SECTION (not the pinned wrap): it spans the
    // whole journey scroll, so it stays intersecting throughout the pin and is
    // robust to scroll jumps, while still pausing once we scroll into content.
    const section = document.getElementById("journey");
    let io: IntersectionObserver | undefined;
    if (section) {
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
        rootMargin: "20% 0px",
      });
      io.observe(section);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  const active = visible && inView;

  const sunPos: [number, number, number] = [
    SUN_DIR.x * 10,
    SUN_DIR.y * 10,
    SUN_DIR.z * 10,
  ];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0.4, 0.2, 9.6], fov: 45, near: 0.01, far: 220 }}
        dpr={[1, touch ? 1.5 : 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : active ? "always" : "never"}
      >
        <color attach="background" args={["#03040b"]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={sunPos} intensity={1.1} />
        <Starfield count={touch ? 1200 : 2200} />
        {/* only the Earth needs textures; keep its loading from blanking the
            map + city stages */}
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        <Malaysia />
        <KLCity />
        <CameraRig />
        {!touch && !reduced && <Effects />}
      </Canvas>
    </div>
  );
}
