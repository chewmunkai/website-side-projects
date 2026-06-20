"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COLORS = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#bfe9ff"),
  new THREE.Color("#cdb4ff"),
  new THREE.Color("#ffe9bd"),
];

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTw;
  varying vec3 vColor;
  void main(){
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.55 + 0.45 * sin(uTime * 1.4 + aPhase);
    vTw = tw;
    gl_PointSize = aSize * uPixelRatio * (320.0 / -mv.z) * tw;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  varying float vTw;
  varying vec3 vColor;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vTw);
  }
`;

export default function Starfield({ count = 1800 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // shell distribution so stars surround the camera
      const r = 26 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = Math.random() * 1.6 + 0.4;
      phases[i] = Math.random() * Math.PI * 2;
      const c = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl]
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value += delta;
    if (group.current) {
      group.current.rotation.y += delta * 0.008;
      // gentle parallax toward the pointer
      group.current.rotation.x +=
        (state.pointer.y * 0.08 - group.current.rotation.x) * 0.03;
      group.current.rotation.z +=
        (-state.pointer.x * 0.05 - group.current.rotation.z) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} />
    </group>
  );
}
