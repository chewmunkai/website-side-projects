"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * Bloom for the journey canvas. Works here (unlike the old inline planet
 * canvases) because the scene has an opaque background, so the composer has
 * something to composite onto. Only bright pixels — city lights, neon
 * coastlines, the KL skyline, the atmosphere — bloom.
 */
export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.32}
        luminanceSmoothing={0.55}
        mipmapBlur
        radius={0.72}
      />
    </EffectComposer>
  );
}
