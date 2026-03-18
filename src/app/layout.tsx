import type { Metadata } from "next";
import { Bungee, Outfit } from "next/font/google";
import "./globals.css";

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brain Games Hub — Train Your Brain with Fun Mini Games",
  description:
    "A playful, animated brain games hub featuring reaction speed tests, memory matrix games, and more. Built with Next.js, Framer Motion, and a cartoon 3D style.",
  keywords: ["brain games", "mini games", "reaction test", "memory game", "brain training"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bungee.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
