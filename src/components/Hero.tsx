'use client';

import { motion } from 'framer-motion';
import { useAudioContext } from './AudioProvider';

const TITLE = 'BRAIN GAMES';
const LETTER_COLORS = [
  '#FF6B6B', '#FFD93D', '#4ECDC4', '#A66CFF', '#FF61D2',
  '#FFD93D', '#2ECC71', '#FF9F43', '#4ECDC4', '#A66CFF', '#FF6B6B',
];

export default function Hero() {
  const { playNote, playPop } = useAudioContext();

  return (
    <section className="section-panel relative" style={{ background: 'linear-gradient(180deg, #FFD93D 0%, #FFF3CD 100%)' }}>
      {/* Central Brain SVG */}
      <motion.div
        className="mb-8"
        animate={{ y: [0, -15, 0], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
      >
        <svg width="160" height="160" viewBox="0 0 100 100">
          {/* Brain body */}
          <ellipse cx="50" cy="50" rx="38" ry="35" fill="#FF61D2" stroke="#1A1A2E" strokeWidth="4" />
          {/* Brain squiggles */}
          <path d="M30,40 Q40,25 50,40 Q60,55 70,40" fill="none" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" />
          <path d="M32,55 Q42,42 52,55 Q62,68 72,55" fill="none" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" />
          <path d="M50,20 Q50,30 50,35" fill="none" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" />
          {/* Sparkle */}
          <circle cx="30" cy="28" r="4" fill="#FFD93D" stroke="#1A1A2E" strokeWidth="2" />
          <circle cx="72" cy="30" r="3" fill="#4ECDC4" stroke="#1A1A2E" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Piano Title */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-8 px-4">
        {TITLE.split('').map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block cursor-pointer select-none text-stroke"
            style={{
              fontFamily: 'var(--font-bungee)',
              fontSize: 'clamp(2rem, 8vw, 5rem)',
              color: LETTER_COLORS[i % LETTER_COLORS.length],
              textShadow: '4px 4px 0px #1A1A2E',
              minWidth: letter === ' ' ? '1rem' : undefined,
            }}
            whileHover={{
              scale: 1.2,
              y: -10,
              textShadow: `0 0 20px ${LETTER_COLORS[i % LETTER_COLORS.length]}, 4px 4px 0px #1A1A2E`,
            }}
            whileTap={{ scale: 0.9, y: 5 }}
            onHoverStart={() => playNote(i)}
            onTap={() => playNote(i)}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        className="text-xl sm:text-2xl font-bold text-center text-cartoon-black max-w-lg"
        style={{ fontFamily: 'var(--font-body)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Train your brain with fun, playful mini-games! 🎮✨
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-5xl">👇</span>
      </motion.div>
    </section>
  );
}
