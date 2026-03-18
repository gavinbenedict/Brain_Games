'use client';

import { motion } from 'framer-motion';
import { useAudioContext } from './AudioProvider';
import { ReactNode } from 'react';

interface GameCardProps {
  title: string;
  description: string;
  color: string;
  icon: string;
  onClick: () => void;
  delay?: number;
  badge?: string;
}

export default function GameCard({ title, description, color, icon, onClick, delay = 0, badge }: GameCardProps) {
  const { playPop, playTick } = useAudioContext();

  return (
    <motion.div
      className="cartoon-border cartoon-shadow cursor-pointer relative overflow-hidden"
      style={{ backgroundColor: color }}
      onClick={() => {
        playPop();
        onClick();
      }}
      onMouseEnter={() => playTick()}
      whileHover={{
        scale: 1.06,
        rotate: 2,
        boxShadow: '8px 8px 0px #1A1A2E',
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay,
      }}
    >
      <div className="p-6 sm:p-8">
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3 sticker-btn px-3 py-1 text-xs bg-cartoon-yellow">
            {badge}
          </div>
        )}

        {/* Icon */}
        <div className="text-5xl sm:text-6xl mb-4">{icon}</div>

        {/* Title */}
        <h3
          className="text-xl sm:text-2xl font-bold mb-2 text-cartoon-black text-stroke-sm"
          style={{ fontFamily: 'var(--font-bungee)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-cartoon-black font-medium opacity-80">
          {description}
        </p>

        {/* Play button */}
        <motion.div
          className="mt-4 sticker-btn px-5 py-2 bg-cartoon-white text-sm inline-block"
          whileHover={{ scale: 1.1 }}
        >
          {badge === '🔒 Coming Soon' ? 'Coming Soon' : 'Play Now →'}
        </motion.div>
      </div>
    </motion.div>
  );
}
