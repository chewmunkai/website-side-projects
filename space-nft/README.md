# SPACEPLANET — NFT Planetarium

A ground-up redesign of [space-nft.webflow.io](https://space-nft.webflow.io/)
into an awwwards-style interactive experience: a live procedural cosmos rendered
in WebGL, choreographed with scroll-driven motion.

> Original concept & art direction: Nata Stelmakh. This is an independent
> engineering/design reinterpretation.

## Highlights

- **Live procedural planets** — the hero, the collection lightbox and the final
  CTA render real-time shader planets (FBM noise surface, day/night terminator,
  fresnel atmosphere, rings) via React Three Fiber. Each collection card is a
  pure-CSS procedural planet so we keep WebGL contexts to the few that earn it.
- **One cosmic backdrop** — a fixed, instanced, twinkling starfield + drifting
  nebula behind the whole page.
- **Scroll choreography** — Lenis smooth scroll feeds a single GSAP /
  ScrollTrigger rAF loop: a pinned horizontal collection gallery, a roadmap
  spine that draws itself, count-up stats, and masked text reveals everywhere.
- **Micro-interactions** — animated preloader, difference-blend custom cursor
  with contextual labels, magnetic buttons, a text-flip nav, a full-screen
  mobile menu, an accordion FAQ and a clickable planet lightbox.
- **Accessible & resilient** — full `prefers-reduced-motion` support (motion and
  WebGL animation degrade to a calm static state), semantic markup, keyboard
  support, and a clean static export that runs anywhere.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript ·
React Three Fiber + drei + three.js · GSAP (ScrollTrigger) · Lenis ·
hand-authored CSS Modules (no UI framework).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

The build is a fully static export (`output: 'export'`). Set `PAGES_BASE_PATH`
to serve it under a sub-path (used by the Pages deploy).

## Project map

```
src/
├─ app/                 layout (fonts, metadata, providers), page, globals.css
├─ components/
│  ├─ scene/            WebGL: Planet, Starfield, Nebula, BackgroundScene, PlanetCanvas
│  ├─ Hero, Mission, Collection, Stats, Roadmap, Team, Faq, CtaCosmos, Footer
│  └─ Nav, Cursor, Preloader, SmoothScroll, MagneticButton, SplitText, …
└─ lib/                 data (all content), gsap + lenis setup, hooks
```
