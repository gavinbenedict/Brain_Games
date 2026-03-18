'use client';

import { AudioProvider } from '@/components/AudioProvider';
import FloatingShapes from '@/components/FloatingShapes';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import GamesSection from '@/components/GamesSection';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <AudioProvider>
      <FloatingShapes />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        <GamesSection />
        <Contact />
      </main>
    </AudioProvider>
  );
}
