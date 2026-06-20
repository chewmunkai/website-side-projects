"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_3D } from "./glsl";

interface PlanetProps {
  seed?: number;
  colorLow?: string;
  colorHigh?: string;
  atmosphere?: string;
  radius?: number;
  detail?: number;
  hasRings?: boolean;
  position?: [number, number, number];
  rotationSpeed?: number;
  animate?: boolean;
}

const planetVertex = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewV;
  varying vec3 vObj;
  void main(){
    vObj = position;
    vNormalV = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const planetFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uAtmo;
  uniform vec3 uLightDir;
  varying vec3 vNormalV;
  varying vec3 vViewV;
  varying vec3 vObj;
  ${SIMPLEX_3D}
  void main(){
    vec3 p = normalize(vObj) * 1.7 + uSeed;
    float n = fbm(p + vec3(0.0, uTime * 0.015, 0.0));
    vec3 base = mix(uLow, uHigh, smoothstep(0.25, 0.75, n));
    float land = smoothstep(0.52, 0.62, n);
    base = mix(base, uHigh * 1.25, land * 0.5);

    // drifting cloud band
    float clouds = fbm(p * 1.9 + vec3(uTime * 0.03, 0.0, 0.0));
    clouds = smoothstep(0.58, 0.85, clouds);
    base = mix(base, vec3(1.0), clouds * 0.16);

    // day / night
    vec3 L = normalize(uLightDir);
    float diff = clamp(dot(normalize(vNormalV), L), 0.0, 1.0);
    float light = mix(0.08, 1.0, smoothstep(0.0, 0.4, diff));
    vec3 col = base * light;

    // night-side glow specks
    float night = smoothstep(0.25, 0.0, diff);
    float cities = step(0.93, fbm(p * 6.0));
    col += uHigh * cities * night * 0.6;

    // fresnel rim
    float fres = pow(1.0 - clamp(dot(normalize(vNormalV), normalize(vViewV)), 0.0, 1.0), 3.0);
    col += uAtmo * fres * 1.5;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const atmoVertex = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewV;
  void main(){
    vNormalV = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const atmoFragment = /* glsl */ `
  uniform vec3 uAtmo;
  varying vec3 vNormalV;
  varying vec3 vViewV;
  void main(){
    float fres = pow(1.0 - clamp(dot(normalize(vNormalV), normalize(vViewV)), 0.0, 1.0), 2.1);
    gl_FragColor = vec4(uAtmo * 1.25, fres * 1.15);
  }
`;

const ringVertex = /* glsl */ `
  varying float vR;
  void main(){
    vR = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  uniform float uTime;
  varying float vR;
  void main(){
    float t = clamp((vR - uInner) / (uOuter - uInner), 0.0, 1.0);
    float edge = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.85, t);
    float bands = 0.55 + 0.45 * sin(t * 46.0 + sin(t * 9.0));
    float a = edge * bands;
    gl_FragColor = vec4(uColor, a * 0.55);
  }
`;

export default function Planet({
  seed = 12.0,
  colorLow = "#241a55",
  colorHigh = "#5ce1ff",
  atmosphere = "#8b5cf6",
  radius = 1,
  detail = 24,
  hasRings = false,
  position = [0, 0, 0],
  rotationSpeed = 0.05,
  animate = true,
}: PlanetProps) {
  const group = useRef<THREE.Group>(null);
  const planetMat = useRef<THREE.ShaderMaterial>(null);
  const ringMat = useRef<THREE.ShaderMaterial>(null);

  const planetUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeed: { value: seed },
      uLow: { value: new THREE.Color(colorLow) },
      uHigh: { value: new THREE.Color(colorHigh) },
      uAtmo: { value: new THREE.Color(atmosphere) },
      uLightDir: { value: new THREE.Vector3(0.75, 0.45, 0.8).normalize() },
    }),
    [seed, colorLow, colorHigh, atmosphere]
  );

  const atmoUniforms = useMemo(
    () => ({ uAtmo: { value: new THREE.Color(atmosphere) } }),
    [atmosphere]
  );

  const ringUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(atmosphere) },
      uInner: { value: radius * 1.35 },
      uOuter: { value: radius * 2.15 },
      uTime: { value: 0 },
    }),
    [atmosphere, radius]
  );

  useFrame((_, delta) => {
    if (!animate) return;
    const d = Math.min(delta, 0.05);
    if (planetMat.current) planetMat.current.uniforms.uTime.value += d;
    if (ringMat.current) ringMat.current.uniforms.uTime.value += d;
    if (group.current) group.current.rotation.y += d * rotationSpeed;
  });

  return (
    <group ref={group} position={position} rotation={[0.35, 0, 0.18]}>
      {/* surface */}
      <mesh>
        <icosahedronGeometry args={[radius, detail]} />
        <shaderMaterial
          ref={planetMat}
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          uniforms={planetUniforms}
        />
      </mesh>

      {/* atmosphere shell */}
      <mesh scale={1.22}>
        <icosahedronGeometry args={[radius, 12]} />
        <shaderMaterial
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          uniforms={atmoUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* rings */}
      {hasRings && (
        <mesh rotation={[-1.35, 0.2, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.15, 128]} />
          <shaderMaterial
            ref={ringMat}
            vertexShader={ringVertex}
            fragmentShader={ringFragment}
            uniforms={ringUniforms}
            transparent
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
