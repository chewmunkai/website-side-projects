/**
 * Single source of truth for all site content.
 * Derived from the original space-nft.webflow.io copy, enriched with the
 * parameters the WebGL layer needs to render each NFT as a *live* procedural
 * planet (seed + palette) instead of a static image.
 */

export const SITE = {
  name: "SPACEPLANET",
  tagline: "Delving into the NFT planetarium",
  subline: "Embark on a galactic journey of distinctive digital worlds.",
  mission: "Uniting art and technology to redefine digital creativity.",
  openSeaUrl: "https://opensea.io/",
  year: 2026,
  credit: { name: "Nata Stelmakh", url: "https://www.behance.net/" },
} as const;

export const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
] as const;

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export interface PlanetNFT {
  id: number;
  name: string;
  rarity: Rarity;
  price: number; // ETH
  /** deterministic seed driving the surface noise pattern */
  seed: number;
  /** [low, high] surface colors */
  palette: [string, string];
  /** atmosphere / rim glow color */
  atmosphere: string;
  blurb: string;
  hasRings?: boolean;
}

export const COLLECTION: PlanetNFT[] = [
  {
    id: 1,
    name: "Nebula Nova",
    rarity: "Legendary",
    price: 0.025,
    seed: 11.7,
    palette: ["#3a1d6e", "#ff5da2"],
    atmosphere: "#c084fc",
    blurb: "A nascent world wrapped in the violet breath of a dying nebula.",
    hasRings: true,
  },
  {
    id: 2,
    name: "Ether Sphere",
    rarity: "Rare",
    price: 0.025,
    seed: 27.3,
    palette: ["#0b3a5e", "#5ce1ff"],
    atmosphere: "#5ce1ff",
    blurb: "Oceans of liquid light suspended in perfect, weightless calm.",
  },
  {
    id: 3,
    name: "Lumina Vortex",
    rarity: "Epic",
    price: 0.025,
    seed: 41.9,
    palette: ["#3d1466", "#ffd27d"],
    atmosphere: "#ffd27d",
    blurb: "A spiralling storm of molten gold that never stops turning.",
    hasRings: true,
  },
  {
    id: 4,
    name: "Celesti Wave",
    rarity: "Common",
    price: 0.025,
    seed: 8.2,
    palette: ["#072a4a", "#38e8c6"],
    atmosphere: "#38e8c6",
    blurb: "Tidal aurorae ripple across an endless mineral sea.",
  },
  {
    id: 5,
    name: "Quasar Quill",
    rarity: "Mythic",
    price: 0.025,
    seed: 63.4,
    palette: ["#4a0e3e", "#ff7a59"],
    atmosphere: "#ff5da2",
    blurb: "Forged at the edge of a quasar, its core still remembers the blast.",
    hasRings: true,
  },
  {
    id: 6,
    name: "Astral Pulse",
    rarity: "Rare",
    price: 0.025,
    seed: 19.6,
    palette: ["#10204f", "#8b5cf6"],
    atmosphere: "#8b5cf6",
    blurb: "A heartbeat of light pulses beneath a glassy violet crust.",
  },
  {
    id: 7,
    name: "Galacti Gem",
    rarity: "Epic",
    price: 0.025,
    seed: 52.1,
    palette: ["#063b46", "#9bffd6"],
    atmosphere: "#5ce1ff",
    blurb: "Carved from a single crystal, refracting a thousand suns.",
  },
  {
    id: 8,
    name: "Zenith Orbit",
    rarity: "Common",
    price: 0.025,
    seed: 33.8,
    palette: ["#241159", "#b794ff"],
    atmosphere: "#a78bfa",
    blurb: "Locked in flawless rotation at the apex of its system.",
  },
  {
    id: 9,
    name: "Cosmo Flare",
    rarity: "Legendary",
    price: 0.025,
    seed: 47.2,
    palette: ["#5a1020", "#ffb347"],
    atmosphere: "#ff7a59",
    blurb: "Solar flares braid the surface in ribbons of restless fire.",
    hasRings: true,
  },
  {
    id: 10,
    name: "Nova Sculpt",
    rarity: "Mythic",
    price: 0.025,
    seed: 71.5,
    palette: ["#1b1448", "#5ce1ff"],
    atmosphere: "#c084fc",
    blurb: "Hand-shaped from supernova dust into an impossible geometry.",
  },
];

export const STATS = [
  { value: 1555, suffix: "", label: "Total Supply" },
  { value: 50, suffix: "+", label: "Total Traits" },
  { value: 8, suffix: "", label: "Trait Categories" },
  { value: 0.025, suffix: " ETH", label: "Mint Price", decimals: 3 },
] as const;

export interface Phase {
  index: string;
  title: string;
  kicker: string;
  body: string;
}

export const ROADMAP: Phase[] = [
  {
    index: "01",
    kicker: "Creation",
    title: "Artistic Genesis",
    body: "Conceptualization and creation of unique, captivating digital worlds — the foundational art that gives the collection its soul.",
  },
  {
    index: "02",
    kicker: "Expansion",
    title: "Technological Innovation",
    body: "Cutting-edge tech, a fully realised website experience, and seamless blockchain integration for trustless minting.",
  },
  {
    index: "03",
    kicker: "Growth",
    title: "Collaborations & Beyond",
    body: "Exploring partnerships and new horizons — marking the continuous growth and evolution of the planetarium.",
  },
  {
    index: "04",
    kicker: "Community",
    title: "Thrilling Events",
    body: "Engaging community events, interactive exhibitions, and special promotions to keep the constellation vibrant and alive.",
  },
];

export interface Member {
  name: string;
  role: string;
  /** gradient seed colors for the procedural avatar */
  colors: [string, string];
}

export const TEAM: Member[] = [
  { name: "Stephan", role: "CEO / Owner", colors: ["#8b5cf6", "#5ce1ff"] },
  { name: "Miranda", role: "Head of Design", colors: ["#ff5da2", "#ffd27d"] },
  { name: "Roy", role: "The Creator", colors: ["#5ce1ff", "#38e8c6"] },
  { name: "Mark", role: "Designer & Co-Creator", colors: ["#a78bfa", "#ff7a59"] },
  { name: "Jully", role: "Collab Manager", colors: ["#ffd27d", "#ff5da2"] },
  { name: "Jonatan", role: "Community Lead", colors: ["#38e8c6", "#8b5cf6"] },
  { name: "Jastin", role: "Head Moderator", colors: ["#5ce1ff", "#c084fc"] },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What is the concept behind the collection?",
    a: "Each piece is an exploration of celestial form — where generative art converges with cutting-edge technology. The fusion produces a one-of-a-kind, immersive digital world that pushes past the boundaries of traditional art.",
  },
  {
    q: "Is there a limited supply of NFTs?",
    a: "Absolutely. Every world is part of a limited edition of 1,555, carefully crafted to ensure exclusivity and rarity for our collectors — adding lasting value to each piece in the ecosystem.",
  },
  {
    q: "How is my NFT ownership secured?",
    a: "Ownership details for each planet are stored immutably on-chain, providing a transparent and tamper-proof record that guarantees the authenticity and security of your digital assets.",
  },
  {
    q: "Are there future plans and collaborations?",
    a: "Yes — we have exciting collaborations and partnerships planned to further diversify the collection. Follow the roadmap for the latest on the evolving narrative of our universe.",
  },
  {
    q: "How do I stay updated on new releases?",
    a: "Follow us on social media, subscribe to the newsletter, and check back here. These channels deliver real-time updates on releases, events, and community happenings.",
  },
  {
    q: "How do I purchase from the collection?",
    a: "Visit the marketplace, connect your wallet securely, and browse the curated selection. Once you've found your world, complete the transaction to make it yours.",
  },
];

export const SOCIALS = [
  { label: "Discord", href: "https://discord.com/" },
  { label: "Telegram", href: "https://telegram.org/" },
  { label: "Twitter", href: "https://x.com/" },
] as const;
