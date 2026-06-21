"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { asset } from "@/lib/asset";
import { fadeWindow } from "@/lib/anim";
import { journey } from "./journeyState";
import {
  earthVertex,
  earthFragment,
  atmosphereVertex,
  atmosphereFragment,
} from "./earthShaders";

/** Sun direction (world space): front-right so the approaching face is lit. */
export const SUN_DIR = new THREE.Vector3(0.55, 0.28, 0.78).normalize();

/** Y rotation that brings South-East Asia / Malaysia toward the camera (+Z). */
const MALAYSIA_FACING = 3.15;

export default function Earth() {
  const group = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Mesh>(null);

  const [day, night, spec, cloudTex] = useTexture([
    asset("/textures/earth_day_2k.jpg"),
    asset("/textures/earth_lights_2048.png"),
    asset("/textures/earth_specular_2048.jpg"),
    asset("/textures/earth_clouds_2k.jpg"),
  ]);

  day.colorSpace = THREE.SRGBColorSpace;
  night.colorSpace = THREE.SRGBColorSpace;
  // spec + clouds are data/masks, keep them linear
  [day, night, spec, cloudTex].forEach((t) => {
    t.anisotropy = 16;
  });

  const earthMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthVertex,
        fragmentShader: earthFragment,
        transparent: true,
        uniforms: {
          uDay: { value: day },
          uNight: { value: night },
          uSpec: { value: spec },
          uSunDir: { value: SUN_DIR },
          uOpacity: { value: 1 },
        },
      }),
    [day, night, spec]
  );

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uSunDir: { value: SUN_DIR }, uOpacity: { value: 1 } },
      }),
    []
  );

  const cloudMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        alphaMap: cloudTex,
        transparent: true,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
        opacity: 0.9,
      }),
    [cloudTex]
  );

  useFrame((_, delta) => {
    const p = journey.progress;
    const op = fadeWindow(p, -1, 0, 0.44, 0.52);
    const approach = Math.min(1, p / 0.42);
    const g = group.current;
    if (g) {
      g.visible = op > 0.001;
      // turn to present Malaysia as we approach
      g.rotation.y = MALAYSIA_FACING - (1 - approach) * 0.85;
      g.rotation.z = 0.41; // axial tilt
    }
    earthMat.uniforms.uOpacity.value = op;
    atmoMat.uniforms.uOpacity.value = op;
    // thin the clouds as we get close so the land (and Malaysia) reveals
    cloudMat.opacity = op * 0.45 * (1 - approach * 0.7);
    if (clouds.current) clouds.current.rotation.y += delta * 0.01;
  });

  return (
    <group ref={group} rotation={[0, MALAYSIA_FACING, 0.41]}>
      {/* surface */}
      <mesh material={earthMat}>
        <sphereGeometry args={[1, 96, 96]} />
      </mesh>
      {/* clouds */}
      <mesh ref={clouds} material={cloudMat}>
        <sphereGeometry args={[1.012, 64, 64]} />
      </mesh>
      {/* atmosphere */}
      <mesh material={atmoMat} scale={1.16}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
    </group>
  );
}
