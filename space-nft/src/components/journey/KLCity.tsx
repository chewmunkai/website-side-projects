"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fadeWindow, clamp01, invlerp } from "@/lib/anim";
import { journey } from "./journeyState";

/** Seeded RNG so the skyline layout is stable across renders. */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Procedural "lit windows" texture for the generic buildings. */
function makeWindowTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#05060c";
  ctx.fillRect(0, 0, c.width, c.height);
  const rng = makeRng(99);
  for (let y = 4; y < c.height - 4; y += 8) {
    for (let x = 4; x < c.width - 4; x += 8) {
      if (rng() > 0.45) {
        const warm = rng() > 0.4;
        ctx.fillStyle = warm ? "#ffcf8a" : "#9fe8ff";
        ctx.globalAlpha = 0.5 + rng() * 0.5;
        ctx.fillRect(x, y, 4, 5);
      }
    }
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

export default function KLCity() {
  const group = useRef<THREE.Group>(null);

  const windowTex = useMemo(() => makeWindowTexture(), []);

  const buildings = useMemo<Building[]>(() => {
    const rng = makeRng(7);
    const list: Building[] = [];
    for (let i = 0; i < 90; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = 2.2 + rng() * 14;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.8 - 2;
      // keep clear of the Petronas footprint
      if (Math.abs(x) < 1.6 && Math.abs(z + 0.5) < 1.6) continue;
      const falloff = clamp01(1 - radius / 18);
      const h = 0.8 + rng() * 3.4 * (0.4 + falloff);
      list.push({ x, z, w: 0.5 + rng() * 0.7, d: 0.5 + rng() * 0.7, h });
    }
    return list;
  }, []);

  const buildingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a0c1a"),
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: windowTex,
        emissiveIntensity: 1.1,
        roughness: 0.6,
        metalness: 0.2,
        transparent: true,
        opacity: 1,
      }),
    [windowTex]
  );

  const towerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a2236"),
        emissive: new THREE.Color("#7fd4ff"),
        emissiveIntensity: 0.5,
        roughness: 0.25,
        metalness: 0.8,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  const spireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffe7b0"),
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const groundMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#04060e"),
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  useFrame(() => {
    const p = journey.progress;
    const op = fadeWindow(p, 0.72, 0.82, 3, 4);
    const rise = invlerp(0.74, 0.95, p); // buildings grow in
    const g = group.current;
    if (g) {
      g.visible = op > 0.001;
      g.scale.y = 0.2 + rise * 0.8;
    }
    buildingMat.opacity = op;
    towerMat.opacity = op;
    spireMat.opacity = op;
    groundMat.opacity = op;
  });

  // a single Petronas-style tapered tower built from stacked tiers
  const Tower = ({ x }: { x: number }) => {
    const tiers = 5;
    return (
      <group position={[x, 0, 0]}>
        {Array.from({ length: tiers }).map((_, i) => {
          const t = i / tiers;
          const r = 0.42 * (1 - t * 0.55);
          const y = i * 1.05;
          return (
            <mesh key={i} material={towerMat} position={[0, y + 0.52, 0]}>
              <cylinderGeometry args={[r * 0.9, r, 1.05, 14]} />
            </mesh>
          );
        })}
        {/* pinnacle / spire */}
        <mesh material={towerMat} position={[0, tiers * 1.05 + 0.35, 0]}>
          <coneGeometry args={[0.12, 0.7, 12]} />
        </mesh>
        <mesh material={spireMat} position={[0, tiers * 1.05 + 0.95, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* ground */}
      <mesh material={groundMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[70, 70]} />
      </mesh>
      <gridHelper args={[70, 70, "#10314a", "#091a2a"]} position={[0, 0.01, 0]} />

      {/* generic skyline */}
      {buildings.map((b, i) => (
        <mesh
          key={i}
          material={buildingMat}
          position={[b.x, b.h / 2, b.z]}
          scale={[1, 1, 1]}
        >
          <boxGeometry args={[b.w, b.h, b.d]} />
        </mesh>
      ))}

      {/* Petronas Towers + skybridge */}
      <Tower x={-0.85} />
      <Tower x={0.85} />
      <mesh material={towerMat} position={[0, 2.7, 0]}>
        <boxGeometry args={[1.7, 0.12, 0.16]} />
      </mesh>

      {/* KL Tower (Menara KL) */}
      <group position={[4.2, 0, -3]}>
        <mesh material={towerMat} position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 4.8, 12]} />
        </mesh>
        <mesh material={towerMat} position={[0, 4.7, 0]}>
          <sphereGeometry args={[0.42, 16, 12]} />
        </mesh>
        <mesh material={spireMat} position={[0, 5.6, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.1, 6]} />
        </mesh>
      </group>
    </group>
  );
}
