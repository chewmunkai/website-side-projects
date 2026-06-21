"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Starfield from "@/components/scene/Starfield";
import { useReducedMotion, useIsTouch } from "@/lib/useReducedMotion";
import Earth, { SUN_DIR } from "./Earth";
import Malaysia from "./Malaysia";
import KLCity from "./KLCity";
import CameraRig from "./CameraRig";

/**
 * The full space → Earth → Malaysia → KL canvas. Rendering is gated by an
 * IntersectionObserver (off-screen = no render) and paused on tab-blur, so it
 * only burns GPU while the journey is actually on screen.
 */
export default function JourneyScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "0px",
    });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const active = inView && visible;
  const sunPos: [number, number, number] = [
    SUN_DIR.x * 10,
    SUN_DIR.y * 10,
    SUN_DIR.z * 10,
  ];

  return (
    <div ref={wrap} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0.4, 0.2, 9.6], fov: 45, near: 0.01, far: 220 }}
        dpr={[1, touch ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
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
      </Canvas>
    </div>
  );
}
