/**
 * Prefix a public asset path with the deploy base path so textures/images
 * resolve correctly under the GitHub Pages sub-path. Next only auto-prefixes
 * `_next/*`, not arbitrary files in /public — so we do it explicitly.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}
