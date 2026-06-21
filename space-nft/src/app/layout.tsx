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
  title: "Malaysia · My Second Home — From the Stars to the Skyline",
  description:
    "A cinematic scroll that falls from space, into Earth, down to Malaysia and home to Kuala Lumpur. An immersive WebGL concept experience about making Malaysia your second home.",
  keywords: [
    "Malaysia",
    "MM2H",
    "My Second Home",
    "Kuala Lumpur",
    "long stay",
    "WebGL",
    "three.js",
    "relocation",
  ],
  authors: [{ name: "MM2H Concept" }],
  openGraph: {
    title: "Malaysia · My Second Home",
    description:
      "Fall from the edge of space to the foot of the Petronas Towers — a cinematic journey home to Malaysia.",
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
