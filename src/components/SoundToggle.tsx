'use client';

import { motion } from 'framer-motion';
import { useAudioContext } from './AudioProvider';

export default function SoundToggle() {
  const { isMuted, toggleMute, playPop } = useAudioContext();

  return (
    <motion.button
      onClick={() => {
        playPop();
        toggleMute();
      }}
      className="sticker-btn px-4 py-2 text-sm"
      style={{ backgroundColor: isMuted ? '#FF6B6B' : '#2ECC71' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
    >
      {isMuted ? '🔇 OFF' : '🔊 ON'}
    </motion.button>
  );
}
