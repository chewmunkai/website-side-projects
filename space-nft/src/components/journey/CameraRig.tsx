"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { invlerp, smootherstep } from "@/lib/anim";
import { journey } from "./journeyState";

/** Camera keyframes per phase (positions + look targets). */
const EARTH_START = new THREE.Vector3(0.4, 0.2, 9.6);
const EARTH_END = new THREE.Vector3(0, 0, 2.12);

const MAL_START = new THREE.Vector3(0, 0, 2.75);
const MAL_END = new THREE.Vector3(-1.72, 0.5, 1.0);
const MAL_LOOK_START = new THREE.Vector3(0, 0, 0);
const MAL_LOOK_END = new THREE.Vector3(-1.72, 0.12, 0);

const KL_START = new THREE.Vector3(0, 11, 19);
const KL_END = new THREE.Vector3(5.6, 3.4, 12.5);
const KL_LOOK_START = new THREE.Vector3(0, 3, 0);
const KL_LOOK_END = new THREE.Vector3(0, 3.3, 0);

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

export default function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const p = journey.progress;

    if (p < 0.5) {
      // falling toward Earth — accelerate
      const t = invlerp(0, 0.5, p);
      const e = t * t;
      _pos.lerpVectors(EARTH_START, EARTH_END, e);
      _look.set(0, 0, 0);
    } else if (p < 0.8) {
      const t = smootherstep(invlerp(0.5, 0.8, p));
      _pos.lerpVectors(MAL_START, MAL_END, t);
      _look.lerpVectors(MAL_LOOK_START, MAL_LOOK_END, t);
    } else {
      const t = smootherstep(invlerp(0.8, 1.0, p));
      _pos.lerpVectors(KL_START, KL_END, t);
      _look.lerpVectors(KL_LOOK_START, KL_LOOK_END, t);
    }

    // subtle pointer parallax (less as we get closer / into the city)
    const par = p < 0.5 ? 0.18 : 0.06;
    camera.position.set(
      _pos.x + journey.px * par,
      _pos.y + journey.py * par,
      _pos.z
    );
    camera.lookAt(_look);
  });

  return null;
}
