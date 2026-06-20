# Website Side Projects

A monorepo of small, experimental front-end builds. Each project lives in its
own folder and is published to a sub-path of one GitHub Pages site.

**Live:** https://chewmunkai.github.io/website-side-projects/

| Project | Path | Stack | Live |
| --- | --- | --- | --- |
| **SPACEPLANET** — an awwwards-style NFT planetarium | [`/space-nft`](./space-nft) | Next.js · React Three Fiber · GSAP · Lenis | [↗](https://chewmunkai.github.io/website-side-projects/space-nft/) |

## Structure

```
website-side-projects/
├─ .github/workflows/deploy-pages.yml   # builds every project → one Pages site
├─ pages-hub/index.html                 # the landing hub (served at site root)
└─ space-nft/                           # project #1 (Next.js static export)
```

## How deployment works

GitHub Pages serves a project repo at `/<repo-name>/`. The workflow:

1. Builds `space-nft` as a static export with
   `PAGES_BASE_PATH=/website-side-projects/space-nft` so every asset resolves
   under that sub-path.
2. Assembles a `_site/` artifact: the hub at the root, each project in its own
   sub-folder.
3. Publishes `_site/` to GitHub Pages.

So the hub lands at `/website-side-projects/` and the app at
`/website-side-projects/space-nft/`.

## Adding a new project

1. Create a new folder (e.g. `cool-thing/`) with its own build.
2. If it's a Next.js static export, give it a `PAGES_BASE_PATH`-aware
   `next.config` like `space-nft`'s.
3. Add build + copy steps to `.github/workflows/deploy-pages.yml`.
4. Add a card to `pages-hub/index.html`.

## Local development

```bash
cd space-nft
npm install
npm run dev      # http://localhost:3000
```

Built with [Claude Code](https://claude.com/claude-code).
