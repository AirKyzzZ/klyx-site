import type { Metadata } from "next";
import { mono, sans, serif } from "./fonts";
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
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
