import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

export const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
