'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioContext } from '@/components/AudioProvider';

type GamePhase = 'idle' | 'playing' | 'result';

export default function FocusTracker() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  
  // Target position 0-100%
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [targetSize, setTargetSize] = useState(60);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playPop, playSuccess } = useAudioContext();

  const moveTarget = useCallback(() => {
    setTargetPos({
      x: 10 + Math.random() * 80, // Keep away from extreme edges
      y: 10 + Math.random() * 80
    });
    // Shrink slightly as score goes up to increase difficulty
    setTargetSize(prev => Math.max(30, 60 - score * 0.5));
  }, [score]);

  const startGame = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhase('playing');
    setScore(0);
    setTimeLeft(20);
    setTargetSize(60);
    moveTarget();
    playPop();
  }, [moveTarget, playPop]);

  const endGame = useCallback(() => {
    setPhase('result');
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    
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
      
      // Move target periodically if user is too slow (speeds up as time drops)
      const moveInterval = Math.max(600, 1500 - (20 - timeLeft) * 50);
      moveIntervalRef.current = setInterval(moveTarget, moveInterval);
      
    } else if (phase === 'playing' && timeLeft === 0) {
      endGame();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    };
  }, [phase, timeLeft, endGame, moveTarget]);

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== 'playing') return;
    
    setScore(prev => prev + 1);
    playPop();
    moveTarget();
    
    // Reset the interval timer so it doesn't jump immediately after click
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    const moveInterval = Math.max(600, 1500 - (20 - timeLeft) * 50);
    moveIntervalRef.current = setInterval(moveTarget, moveInterval);
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
          Hits: {score}
        </div>
        {highScore > 0 && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-green text-sm cursor-default">
            🏆 {highScore}
          </div>
        )}
      </div>

      <motion.div
        className="relative w-full aspect-[4/3] max-w-lg min-h-[300px] cartoon-border-thick cartoon-shadow bg-cartoon-white overflow-hidden"
      >
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
              Click the moving target!
            </p>
            <p className="font-bold">It gets faster and smaller as you score.</p>
          </div>
        )}

        {phase === 'playing' && (
          <motion.div
            className="absolute rounded-full cartoon-border cursor-pointer flex items-center justify-center bg-cartoon-red text-cartoon-white text-xl"
            initial={false}
            animate={{
              left: `${targetPos.x}%`,
              top: `${targetPos.y}%`,
              width: targetSize,
              height: targetSize,
              x: '-50%',
              y: '-50%'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={handleTargetClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🎯
          </motion.div>
        )}

        {phase === 'result' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-4xl font-bold text-stroke-sm mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
              Time's Up! ⏰
            </p>
            <p className="text-2xl font-bold">You hit it {score} times!</p>
          </div>
        )}
      </motion.div>

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
