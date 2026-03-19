'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioContext } from '@/components/AudioProvider';

type GamePhase = 'idle' | 'playing' | 'result';

const COLORS = [
  { name: 'RED', hex: '#FF6B6B' },
  { name: 'BLUE', hex: '#4ECDC4' },
  { name: 'YELLOW', hex: '#FFD93D' },
  { name: 'PURPLE', hex: '#A66CFF' },
  { name: 'GREEN', hex: '#2ECC71' }
];

export default function ColorReflex() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const [wordColor, setWordColor] = useState(COLORS[0]);
  const [textColor, setTextColor] = useState(COLORS[1]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { playNote, playPop, playError, playSuccess } = useAudioContext();

  const generateMismatch = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let textIdx = Math.floor(Math.random() * COLORS.length);
    
    // 70% chance of mismatch for difficulty
    if (Math.random() > 0.3) {
      while (textIdx === wordIdx) {
        textIdx = Math.floor(Math.random() * COLORS.length);
      }
    }
    
    setWordColor(COLORS[wordIdx]);
    setTextColor(COLORS[textIdx]);
  }, []);

  const startGame = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhase('playing');
    setScore(0);
    setTimeLeft(15);
    generateMismatch();
    playPop();
  }, [generateMismatch, playPop]);

  const endGame = useCallback(() => {
    setPhase('result');
    if (score > highScore) {
      setHighScore(score);
      playSuccess();
    } else {
      playPop();
    }
  }, [score, highScore, playSuccess, playPop]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (phase === 'playing' && timeLeft === 0) {
      endGame();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft, endGame]);

  const handleColorClick = (e: React.MouseEvent, clickedColorHex: string) => {
    e.stopPropagation();
    if (phase !== 'playing') return;

    // Stroop test: user must click the actual COLOR of the text, not what the word says!
    if (clickedColorHex === textColor.hex) {
      setScore(prev => prev + 1);
      playNote(score % 8);
      generateMismatch();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 2)); // Penalty
      playError();
      generateMismatch();
    }
  };

  const resetGame = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhase('idle');
    setScore(0);
    playPop();
  }, [playPop]);

  return (
    <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="sticker-btn px-4 py-2 bg-cartoon-yellow text-sm cursor-default">
          Time: {timeLeft}s
        </div>
        <div className="sticker-btn px-4 py-2 bg-cartoon-blue text-sm text-cartoon-white cursor-default">
          Score: {score}
        </div>
        {highScore > 0 && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-green text-sm cursor-default">
            🏆 {highScore}
          </div>
        )}
      </div>

      <motion.div
        className="w-full aspect-[2/1] min-h-[200px] cartoon-border-thick cartoon-shadow flex flex-col items-center justify-center p-6 bg-cartoon-white"
      >
        {phase === 'idle' && (
          <div className="text-center">
            <p className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
              Match the COLOR, not the word!
            </p>
            <p className="font-bold">Watch out for the 2-second penalty!</p>
          </div>
        )}

        {phase === 'playing' && (
          <motion.p
            key={score}
            className="text-5xl sm:text-7xl font-bold text-stroke"
            style={{ 
              fontFamily: 'var(--font-bungee)',
              color: textColor.hex,
              textShadow: '4px 4px 0px #1A1A2E'
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {wordColor.name}
          </motion.p>
        )}

        {phase === 'result' && (
          <div className="text-center">
            <p className="text-3xl font-bold text-stroke-sm mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
              Time's Up! ⏰
            </p>
            <p className="text-xl font-bold">You scored {score} points!</p>
          </div>
        )}
      </motion.div>

      {phase === 'playing' && (
        <div className="flex flex-wrap gap-3 justify-center max-w-lg w-full">
          {COLORS.map((color) => (
            <motion.button
              key={color.name}
              className="sticker-btn flex-1 min-w-[100px] py-4 text-cartoon-white text-lg"
              style={{ backgroundColor: color.hex, textShadow: '2px 2px 0px #1A1A2E' }}
              onClick={(e) => handleColorClick(e, color.hex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {color.name}
            </motion.button>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        {phase === 'idle' && (
          <motion.button
            className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
            onClick={startGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
          >
            Start! 🚀
          </motion.button>
        )}

        {phase === 'result' && (
          <>
            <motion.button
              className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
              onClick={startGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ fontFamily: 'var(--font-bungee)' }}
            >
              Play Again 🔄
            </motion.button>
            <motion.button
              className="sticker-btn px-6 py-3 bg-cartoon-yellow text-base"
              onClick={resetGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ fontFamily: 'var(--font-bungee)' }}
            >
              Menu
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
