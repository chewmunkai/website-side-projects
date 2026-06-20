import type { NextConfig } from "next";

/**
 * Static-export config tuned for GitHub Pages.
 *
 * In local dev `PAGES_BASE_PATH` is unset, so the site is served from "/".
 * The deploy workflow sets PAGES_BASE_PATH="/website-side-projects/space-nft"
 * so every asset + route resolves under the project-pages sub-path.
 */
const basePath = process.env.PAGES_BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
