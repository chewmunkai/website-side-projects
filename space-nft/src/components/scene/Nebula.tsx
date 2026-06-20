"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_3D } from "./glsl";

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main(){
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vDir;
  ${SIMPLEX_3D}
  void main(){
    vec3 d = normalize(vDir);
    float n = fbm(d * 1.3 + vec3(0.0, uTime * 0.01, 0.0));
    float n2 = fbm(d * 2.6 - vec3(uTime * 0.012, 0.0, 0.0));
    vec3 violet = vec3(0.36, 0.22, 0.62);
    vec3 cyan = vec3(0.12, 0.42, 0.62);
    vec3 col = mix(violet, cyan, n2);
    float density = smoothstep(0.45, 0.95, n) * 0.5;
    // fade toward the camera's forward axis so it stays as a backdrop
    col *= density;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Huge inward-facing sphere painting a faint, drifting nebula behind the stars. */
export default function Nebula() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh scale={90}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
