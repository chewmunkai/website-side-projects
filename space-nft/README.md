# Malaysia · My Second Home — a cinematic scroll

> The folder is named `space-nft` for monorepo/URL stability — the project
> inside is a **Malaysia / "My Second Home" (MM2H)** concept experience.

An awwwards-style, scroll-driven journey that falls **from outer space, into a
real-textured Earth, down to a stylized 3D Malaysia, and home to the Kuala
Lumpur skyline** — all rendered live in three.js and scrubbed to the scrollbar
with GSAP.

> Independent concept experience — **not** affiliated with the official MM2H
> programme. It deliberately states no official requirements/fees; the copy
> points users to official sources.

## The journey (one pinned WebGL canvas)

Scroll progress (0 → 1) drives a single camera rig + crossfades between three
worlds, all in one canvas:

1. **Space** — a twinkling starfield + nebula; the hero copy.
2. **Earth** — real NASA Blue Marble textures with a custom day/night shader
   (city lights on the dark side), drifting clouds and a fresnel atmosphere;
   the globe turns to bring **South-East Asia / Malaysia** to face you as you
   fall toward it.
3. **Malaysia** — a stylized 3D map: Peninsular + Borneo as glowing extruded
   landmasses over a lat/long grid, with a luminous beam over Kuala Lumpur.
4. **Kuala Lumpur** — a low-poly night skyline with procedural lit windows, the
   **Petronas Towers** + skybridge and **KL Tower**.

Crossfades are masked by light "altitude" flashes. Captions fade in per stage.

## Everything else

Re-themed MM2H sections (Why Malaysia, evocative stats with count-up, a 4-step
"your journey" timeline, FAQ, CTA, footer with a live KL clock) over the shared
infrastructure: Lenis smooth-scroll → one GSAP/ScrollTrigger loop, animated
preloader, difference-blend custom cursor, magnetic buttons, text-flip nav,
full-screen mobile menu. Full `prefers-reduced-motion` support (the journey
degrades to a calm static Earth + hero).

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · three.js +
React Three Fiber + drei · GSAP (ScrollTrigger) · Lenis · hand-authored CSS
Modules.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

Earth textures (public-domain NASA Blue Marble, via the three.js examples set)
live in `public/textures/` and load through a base-path-aware `asset()` helper
so they resolve under the GitHub Pages sub-path.

## Map

```
src/
├─ app/                 layout (fonts, metadata, providers), page, globals.css
├─ components/
│  ├─ journey/          the WebGL journey: Earth, Malaysia, KLCity, CameraRig,
│  │                    JourneyScene, earthShaders, journeyState
│  ├─ Journey.tsx       pinned section: scrubs progress, captions, flashes
│  ├─ Why, Stats, Roadmap, Faq, Cta, Footer
│  └─ Nav, Cursor, Preloader, SmoothScroll, MagneticButton, SplitText, …
└─ lib/                 data (all copy), gsap + lenis + scroll-lock, anim math
```
