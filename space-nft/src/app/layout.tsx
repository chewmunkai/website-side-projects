import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SPACEPLANET — Delving into the NFT Planetarium",
  description:
    "Embark on a galactic journey of distinctive digital worlds. A limited collection of 1,555 procedurally-born planets, where generative art meets the blockchain.",
  keywords: [
    "NFT",
    "planet",
    "generative art",
    "space",
    "WebGL",
    "three.js",
    "collectible",
  ],
  authors: [{ name: "SPACEPLANET" }],
  openGraph: {
    title: "SPACEPLANET — Delving into the NFT Planetarium",
    description:
      "A limited collection of 1,555 procedurally-born digital worlds.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050409",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
