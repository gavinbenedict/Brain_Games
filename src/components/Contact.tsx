'use client';

import { motion } from 'framer-motion';
import { useAudioContext } from './AudioProvider';

export default function Contact() {
  const { playPop } = useAudioContext();

  return (
    <section id="contact" className="section-panel" style={{ background: 'linear-gradient(180deg, #E8DAFF 0%, #FFD93D 100%)' }}>
      <motion.h2
        className="text-4xl sm:text-6xl font-bold text-center mb-4 text-stroke"
        style={{ fontFamily: 'var(--font-bungee)', color: '#FFD93D' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        ✉️ Get in Touch
      </motion.h2>

      <motion.p
        className="text-lg sm:text-xl text-center mb-8 max-w-md font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Got feedback, ideas, or just wanna say hi? 👋
      </motion.p>

      <motion.div
        className="cartoon-border-thick cartoon-shadow p-8 max-w-md w-full text-center"
        style={{ backgroundColor: '#FFFDF7' }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 150 }}
      >
        <div className="flex flex-col gap-4">
          <motion.a
            href="mailto:hello@braingames.fun"
            className="sticker-btn px-6 py-3 bg-cartoon-blue text-base w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playPop()}
          >
            📧 hello@braingames.fun
          </motion.a>

          <motion.a
            href="#"
            className="sticker-btn px-6 py-3 bg-cartoon-purple text-cartoon-white text-base w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playPop()}
          >
            🐦 Follow on Twitter
          </motion.a>

          <motion.a
            href="#"
            className="sticker-btn px-6 py-3 bg-cartoon-pink text-base w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playPop()}
          >
            ⭐ Star on GitHub
          </motion.a>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="mt-12 text-sm font-medium opacity-60 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
      >
        Made with 🧠 & ❤️ — Brain Games Hub © 2026
      </motion.p>
    </section>
  );
}
