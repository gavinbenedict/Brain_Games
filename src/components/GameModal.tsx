'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAudioContext } from './AudioProvider';
import { ReactNode } from 'react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  color: string;
  children: ReactNode;
}

export default function GameModal({ isOpen, onClose, title, color, children }: GameModalProps) {
  const { playPop } = useAudioContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              playPop();
              onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative cartoon-border-thick cartoon-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: color }}
            initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b-4 border-cartoon-black">
              <h2
                className="text-2xl sm:text-3xl font-bold text-cartoon-black text-stroke-sm"
                style={{ fontFamily: 'var(--font-bungee)' }}
              >
                {title}
              </h2>
              <motion.button
                className="sticker-btn px-3 py-1 bg-cartoon-red text-cartoon-white text-lg"
                onClick={() => {
                  playPop();
                  onClose();
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
