'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    icon: '🧠',
    title: 'Pick a Game',
    description: 'Choose from our collection of fun brain-training mini games.',
    color: '#FFD93D',
  },
  {
    icon: '🎮',
    title: 'Play & Challenge',
    description: 'Test your reactions, memory, and focus with playful challenges.',
    color: '#4ECDC4',
  },
  {
    icon: '📊',
    title: 'Track Your Score',
    description: 'See your results instantly and try to beat your personal best!',
    color: '#A66CFF',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-panel" style={{ background: 'linear-gradient(180deg, #FFF3CD 0%, #FFE0E0 50%, #FFF3CD 100%)' }}>
      <motion.h2
        className="text-4xl sm:text-6xl font-bold text-center mb-4 text-stroke"
        style={{ fontFamily: 'var(--font-bungee)', color: '#FF6B6B' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        How It Works
      </motion.h2>

      <motion.p
        className="text-lg sm:text-xl text-center mb-12 max-w-md font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Three simple steps to brain greatness! 🚀
      </motion.p>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full px-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            className="flex-1 cartoon-border cartoon-shadow p-6 sm:p-8 text-center"
            style={{ backgroundColor: step.color }}
            initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -3 : 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: i * 0.15 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <div className="text-5xl mb-4">{step.icon}</div>
            <div className="sticker-btn px-3 py-1 bg-cartoon-white text-sm mb-3 cursor-default inline-block">
              Step {i + 1}
            </div>
            <h3
              className="text-xl font-bold mb-2 text-cartoon-black"
              style={{ fontFamily: 'var(--font-bungee)' }}
            >
              {step.title}
            </h3>
            <p className="text-sm font-medium opacity-80">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
