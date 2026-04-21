import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Literata,
  Manrope,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif-cormorant",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-source",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-serif-literata",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simplicity, Love & Justice",
  description: "A discussion course",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${sourceSerif.variable} ${literata.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
