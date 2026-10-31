import { DM_Sans, Geist_Mono, Inter, Instrument_Serif } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
