import type { Metadata } from "next";
import { dmSans, inter, mono, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klyx",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
