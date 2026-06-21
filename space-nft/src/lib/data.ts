/**
 * Single source of truth for all site content.
 * Theme: "Malaysia — My Second Home" (MM2H). A cinematic scroll falls from
 * space, into Earth, down to a stylized Malaysia, and lands in Kuala Lumpur.
 *
 * NOTE: This is an experiential/aspirational concept site. It deliberately does
 * NOT state official MM2H requirements, fees or eligibility — those are set by
 * the Malaysian government and must be checked via official sources.
 */

export const SITE = {
  name: "MM2H",
  wordmark: "SECOND HOME",
  tagline: "Malaysia · My Second Home",
  city: "Kuala Lumpur",
  officialUrl: "https://mm2h.gov.my/",
  year: 2026,
} as const;

export const NAV_LINKS = [
  { label: "The Descent", href: "#journey" },
  { label: "Why Malaysia", href: "#why" },
  { label: "Your Journey", href: "#journey-steps" },
  { label: "FAQ", href: "#faq" },
] as const;

export const HERO = {
  eyebrow: "Malaysia · My Second Home",
  titleLine1: "Somewhere out there,",
  titleLine2: "home is waiting in *Malaysia*",
  sub: "Begin in the quiet of space and fall gently toward a country that feels like an exhale — warm air, open doors, and a long, unhurried life in the heart of Kuala Lumpur.",
  primaryCta: "Begin Your Descent",
  secondaryCta: "Why Malaysia",
} as const;

export type JourneyStage = "space" | "earth" | "malaysia" | "kl";

export interface JourneyBeat {
  stage: JourneyStage;
  kicker: string;
  line: string;
}

export const JOURNEY_BEATS: JourneyBeat[] = [
  {
    stage: "space",
    kicker: "60,000 km out",
    line: "From here, every border disappears. Only the blue remains.",
  },
  {
    stage: "earth",
    kicker: "Falling home",
    line: "One small planet turns below — and one corner of it is calling.",
  },
  {
    stage: "malaysia",
    kicker: "Tropical latitude",
    line: "Two coastlines, green islands, a country wrapped in equatorial sun.",
  },
  {
    stage: "kl",
    kicker: "Touchdown · Kuala Lumpur",
    line: "The towers rise to meet you. Welcome to your second home.",
  },
];

export const WHY = {
  eyebrow: "Why Malaysia",
  title: "A place that lets you stay awhile",
  intro:
    "Some countries you visit. Malaysia is one you settle into — slowly, comfortably, like a city that already knows your name.",
  items: [
    {
      title: "Summer that never leaves",
      body: "A warm, green, tropical climate the whole year through. No harsh winters to outrun — just long days, sudden rain that clears the air, and evenings made for the outdoors.",
      colors: ["#ffb347", "#ff5da2"] as [string, string],
    },
    {
      title: "A country fluent in welcome",
      body: "Bahasa Malaysia, English, Mandarin and Tamil share the same streets. English is widely spoken, so daily life feels open and easy from your very first week.",
      colors: ["#5ce1ff", "#8b5cf6"] as [string, string],
    },
    {
      title: "One of the world's great food cities",
      body: "Nasi lemak at dawn, char kway teow at midnight, mamak stalls that never sleep. Malay, Chinese and Indian kitchens turn every ordinary meal into a celebration.",
      colors: ["#ff7a59", "#ffd27d"] as [string, string],
    },
    {
      title: "Nature an hour from the skyline",
      body: "Step out of Kuala Lumpur and into ancient rainforest, tea-green highlands, or islands ringed by coral. Few capitals keep the wild so close at hand.",
      colors: ["#38e8c6", "#5ce1ff"] as [string, string],
    },
    {
      title: "A crossroads of Asia",
      body: "Centrally placed and well-connected, Malaysia puts much of the region within an easy flight — a comfortable base for a life lived across more than one country.",
      colors: ["#a78bfa", "#5ce1ff"] as [string, string],
    },
    {
      title: "City comfort, gentle pace",
      body: "Modern apartments, world-class hospitals, fast connectivity and walkable neighbourhoods — wrapped in a rhythm of life that lets you breathe.",
      colors: ["#ff5da2", "#a78bfa"] as [string, string],
    },
  ],
} as const;

export const STATS = [
  { value: 365, suffix: "", label: "warm tropical days a year, near the equator" },
  { value: 4, suffix: "+", label: "languages woven through everyday streets" },
  { value: 130, suffix: "M", label: "years of rainforest — older than the Amazon" },
  { value: 24, suffix: "/7", label: "hawker stalls and mamak tables, always open" },
] as const;

export interface Phase {
  index: string;
  kicker: string;
  title: string;
  body: string;
}

export const ROADMAP: Phase[] = [
  {
    index: "01",
    kicker: "Dream",
    title: "Discover",
    body: "Wander the idea before you commit to it. Picture your mornings in Kuala Lumpur, your weekends in the highlands, the life you'd build. The second home begins as a feeling.",
  },
  {
    index: "02",
    kicker: "Prepare",
    title: "Plan",
    body: "Map out the practical shape of a long stay — your neighbourhood, your budget, the rhythm of your days. Gather your questions and get a clear, honest picture first.",
  },
  {
    index: "03",
    kicker: "Apply",
    title: "Apply",
    body: "Take the formal step toward long-stay status. Because this is an official government programme, follow the current requirements through the proper channels and trusted guidance.",
  },
  {
    index: "04",
    kicker: "Arrive",
    title: "Arrive",
    body: "Step off the plane into the warm air and begin. Find your café, learn your route, meet your neighbours. The descent is over — you're home now.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What exactly is Malaysia My Second Home?",
    a: "It's a long-stay pathway that lets eligible foreigners make Malaysia a home base for an extended period, rather than visiting on short trips. Think of it less as a holiday and more as putting down soft roots — a place to return to, settle into, and call your second home.",
  },
  {
    q: "What are the official requirements, fees and eligibility rules?",
    a: "These are set by the Malaysian government and can change over time, so we won't quote figures here — accuracy matters more than a tidy number on a website. For the current, authoritative requirements, please refer to the official MM2H programme and Malaysian government sources, or speak with a licensed agent.",
  },
  {
    q: "Where should I actually live — is it only Kuala Lumpur?",
    a: "Kuala Lumpur is the natural heart of it: international, walkable, and endlessly alive. But long-stayers also love Penang's seaside heritage, the cool calm of the highlands, and the laid-back coasts. KL is where many people begin, then explore outward.",
  },
  {
    q: "Will I be able to get by in English?",
    a: "Comfortably. English is widely spoken across cities, healthcare, business and daily services, alongside Bahasa Malaysia, Mandarin and Tamil. Most newcomers find the language barrier far gentler than they expected.",
  },
  {
    q: "What is daily life really like?",
    a: "Warm, unhurried and richly textured. Mornings over kopi, world-class food on every corner, modern conveniences in the city, and rainforest or islands within easy reach for the weekend. It balances comfort with a real sense of adventure.",
  },
  {
    q: "How do I take the first real step?",
    a: "Start by exploring and planning — picture the life, ask your questions, get oriented. When you're ready to move from dreaming to doing, confirm the official process through Malaysian government sources and qualified, licensed guidance before committing.",
  },
];

export const CTA = {
  eyebrow: "The descent is over",
  title: "Your second home is *waiting*",
  sub: "You've travelled from the edge of space to the foot of the Petronas Towers. There's only one thing left to do — start the life that's waiting at the bottom of the scroll.",
  button: "Begin Your Journey",
} as const;

export const FOOTER_TAGLINE =
  "From the stars to the skyline — Malaysia, the home you arrive at twice.";

export const SOCIALS = [
  { label: "Official MM2H", href: "https://mm2h.gov.my/" },
  { label: "Tourism Malaysia", href: "https://www.malaysia.travel/" },
  { label: "Visit KL", href: "https://www.visitkl.gov.my/" },
] as const;
