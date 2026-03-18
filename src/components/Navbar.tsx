'use client';

import { motion } from 'framer-motion';
import SoundToggle from './SoundToggle';
import { useAudioContext } from './AudioProvider';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Games', href: '#games' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { playTick } = useAudioContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(255, 243, 205, 0.15)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {/* Logo */}
      <motion.a
        href="#"
        className="font-[var(--font-bungee)] text-xl font-bold text-cartoon-black"
        style={{ fontFamily: 'var(--font-bungee)' }}
        whileHover={{ scale: 1.05, rotate: -2 }}
      >
        🧠 BrainGames
      </motion.a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-4">
        {NAV_LINKS.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="sticker-btn px-4 py-2 text-sm bg-cartoon-white"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => playTick()}
          >
            {link.label}
          </motion.a>
        ))}
        <SoundToggle />
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-3">
        <SoundToggle />
        <motion.button
          className="sticker-btn px-3 py-2 bg-cartoon-yellow text-lg"
          onClick={() => {
            playTick();
            setMenuOpen(!menuOpen);
          }}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? '✕' : '☰'}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="absolute top-full left-0 right-0 flex flex-col items-center gap-3 p-6 md:hidden"
          style={{ backgroundColor: 'rgba(255,243,205,0.95)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="sticker-btn px-6 py-3 bg-cartoon-white w-full text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
