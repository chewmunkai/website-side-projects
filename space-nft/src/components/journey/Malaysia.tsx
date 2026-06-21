"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fadeWindow } from "@/lib/anim";
import { journey } from "./journeyState";

/**
 * Stylized 3D Malaysia: Peninsular + East Malaysia (Borneo) as softly
 * extruded, self-lit landmasses over a dark sea, with glowing coastlines, a
 * faint lat/long grid and a luminous beam marking Kuala Lumpur. Recognisable,
 * not cartographic.
 */

// Simplified outlines in local plane units (x right, y up).
const PENINSULA: [number, number][] = [
  [-2.05, 1.35], [-1.5, 1.42], [-1.18, 1.28], [-1.05, 0.85], [-1.0, 0.35],
  [-1.08, -0.15], [-1.05, -0.7], [-1.2, -1.2], [-1.45, -1.62], [-1.62, -1.35],
  [-1.7, -0.85], [-1.9, -0.3], [-2.08, 0.35], [-2.12, 0.9],
];

const BORNEO: [number, number][] = [
  [0.45, -1.15], [1.0, -0.95], [1.5, -0.55], [1.9, -0.18], [2.18, 0.2],
  [2.42, 0.62], [2.3, 0.92], [2.0, 0.7], [1.72, 0.32], [1.3, -0.05],
  [0.85, -0.45], [0.5, -0.85],
];

/** KL marker position on the peninsula (west-central coast). */
const KL_POS = new THREE.Vector2(-1.72, 0.18);
export const MALAYSIA_KL = new THREE.Vector3(KL_POS.x, KL_POS.y, 0);

function shapeFrom(points: [number, number][]) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1]);
  s.closePath();
  return s;
}

export default function Malaysia() {
  const group = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  const { landMat, edgeMat, seaMat, beamMat } = useMemo(() => {
    const landMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#103f38"),
      emissive: new THREE.Color("#1fc9a6"),
      emissiveIntensity: 1.5,
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: 1,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#9bffe9"),
      transparent: true,
      opacity: 1,
    });
    const seaMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#08283f"),
      transparent: true,
      opacity: 1,
    });
    const beamMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffd27d"),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { landMat, edgeMat, seaMat, beamMat };
  }, []);

  const { geoms, edges } = useMemo(() => {
    const extrude = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 };
    const geoms = [PENINSULA, BORNEO].map((pts) =>
      new THREE.ExtrudeGeometry(shapeFrom(pts), extrude)
    );
    const edges = geoms.map((g) => new THREE.EdgesGeometry(g, 30));
    return { geoms, edges };
  }, []);

  useFrame((state, delta) => {
    const p = journey.progress;
    const op = fadeWindow(p, 0.42, 0.52, 0.72, 0.8);
    const g = group.current;
    if (g) g.visible = op > 0.001;
    landMat.opacity = op;
    edgeMat.opacity = op * 0.9;
    seaMat.opacity = op * 0.9;
    beamMat.opacity = op * (0.6 + 0.4 * Math.sin(state.clock.elapsedTime * 2.4));
    if (ring.current) {
      const s = 1 + 0.5 * ((state.clock.elapsedTime * 0.6) % 1);
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.Material).opacity =
        op * (1 - ((state.clock.elapsedTime * 0.6) % 1));
    }
  });

  return (
    <group ref={group} rotation={[-0.42, 0, 0]}>
      {/* sea */}
      <mesh material={seaMat} position={[0, 0, -0.2]}>
        <planeGeometry args={[14, 10]} />
      </mesh>
      {/* faint grid */}
      <gridHelper
        args={[14, 28, "#13324a", "#0c2236"]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -0.18]}
      />

      {/* landmasses */}
      {geoms.map((g, i) => (
        <mesh key={i} geometry={g} material={landMat} />
      ))}
      {edges.map((e, i) => (
        <lineSegments key={i} geometry={e} material={edgeMat} />
      ))}

      {/* KL marker: beam + base + pulse ring */}
      <group position={[KL_POS.x, KL_POS.y, 0.12]}>
        <mesh
          ref={beam}
          material={beamMat}
          position={[0, 0, 0.65]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.012, 0.05, 1.3, 12, 1, true]} />
        </mesh>
        <mesh material={beamMat}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh ref={ring} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.1, 0.12, 32]} />
          <meshBasicMaterial
            color="#ffd27d"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
