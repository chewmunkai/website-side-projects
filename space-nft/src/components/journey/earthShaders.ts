/**
 * Custom Earth surface shader: day texture on the lit hemisphere, city-light
 * night texture on the dark hemisphere, ocean specular glint, and a soft
 * day-side limb glow. Lit by a single directional "sun".
 */
export const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main(){
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewW = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const earthFragment = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uSpec;
  uniform vec3 uSunDir;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main(){
    vec3 N = normalize(vNormalW);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(vViewW);

    float sun = dot(N, L);
    float day = smoothstep(-0.12, 0.3, sun);

    vec3 dayCol = texture2D(uDay, vUv).rgb;
    vec3 nightCol = texture2D(uNight, vUv).rgb;

    // warm the city lights a touch
    nightCol *= vec3(1.25, 1.05, 0.7);

    vec3 col = mix(nightCol * 1.3, dayCol, day);
    col += dayCol * 0.05; // faint ambient

    // ocean specular glint (spec map: oceans bright)
    float ocean = texture2D(uSpec, vUv).r;
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 24.0) * ocean * day;
    col += vec3(0.85, 0.92, 1.0) * spec * 0.9;

    // atmospheric limb glow on the day side
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);
    col += vec3(0.32, 0.56, 1.0) * fres * (day * 0.6 + 0.1);

    gl_FragColor = vec4(col, uOpacity);
  }
`;

/** Outer atmosphere shell (BackSide, additive). */
export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main(){
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewW = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uOpacity;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main(){
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewW);
    vec3 L = normalize(uSunDir);
    float fres = pow(1.0 - abs(dot(N, V)), 2.4);
    float dayGlow = smoothstep(-0.35, 0.45, dot(N, L));
    vec3 col = vec3(0.35, 0.6, 1.0) * fres * (0.35 + dayGlow * 0.9);
    gl_FragColor = vec4(col, fres * uOpacity);
  }
`;
