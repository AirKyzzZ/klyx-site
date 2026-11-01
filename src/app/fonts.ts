import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

export const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
  adjustFontFallback: true,
});
