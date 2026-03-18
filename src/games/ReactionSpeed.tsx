'use client';

import { motion } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioContext } from '@/components/AudioProvider';

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'too-early';

export default function ReactionSpeed() {
  const [state, setState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const { playChime, playError, playPop, playSuccess } = useAudioContext();

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startGame = useCallback(() => {
    cleanup();
    setState('waiting');
    playPop();

    const delay = 1000 + Math.random() * 4000;
    timerRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = performance.now();
      playChime();
    }, delay);
  }, [cleanup, playPop, playChime]);

  const handleClick = useCallback(() => {
    if (state === 'waiting') {
      cleanup();
      setState('too-early');
      playError();
      return;
    }

    if (state === 'ready') {
      const time = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(time);
      setAttempts(prev => [...prev, time]);

      if (!bestTime || time < bestTime) {
        setBestTime(time);
        playSuccess();
      } else {
        playPop();
      }

      setState('clicked');
      return;
    }

    startGame();
  }, [state, startGame, cleanup, bestTime, playError, playPop, playSuccess]);

  const getColor = () => {
    switch (state) {
      case 'idle': return '#4ECDC4';
      case 'waiting': return '#FF6B6B';
      case 'ready': return '#2ECC71';
      case 'clicked': return '#4ECDC4';
      case 'too-early': return '#FFD93D';
    }
  };

  const getMessage = () => {
    switch (state) {
      case 'idle': return 'Click to Start!';
      case 'waiting': return 'Wait for green...';
      case 'ready': return 'CLICK NOW!';
      case 'clicked': return `${reactionTime}ms!`;
      case 'too-early': return 'Too early! Click to retry';
    }
  };

  const getRating = (time: number) => {
    if (time < 200) return '⚡ Lightning!';
    if (time < 300) return '🔥 Amazing!';
    if (time < 400) return '👍 Good!';
    if (time < 500) return '🐢 Keep trying!';
    return '😴 Sleepy...';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Game Area */}
      <motion.div
        className="w-full aspect-[2/1] min-h-[200px] cartoon-border-thick cartoon-shadow flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: getColor() }}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{ backgroundColor: getColor() }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <motion.p
          className="text-3xl sm:text-5xl font-bold text-cartoon-black text-stroke-sm text-center px-4"
          style={{ fontFamily: 'var(--font-bungee)' }}
          key={state}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {getMessage()}
        </motion.p>
      </motion.div>

      {/* Result */}
      {state === 'clicked' && reactionTime && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-bungee)' }}>
            {getRating(reactionTime)}
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="flex gap-4 flex-wrap justify-center">
        {bestTime && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-yellow text-sm cursor-default">
            🏆 Best: {bestTime}ms
          </div>
        )}
        {attempts.length > 0 && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-blue text-sm cursor-default">
            📊 Avg: {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms
          </div>
        )}
        {attempts.length > 0 && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-purple text-sm text-cartoon-white cursor-default">
            🎯 Tries: {attempts.length}
          </div>
        )}
      </div>

      {/* Play Again */}
      {(state === 'clicked' || state === 'too-early') && (
        <motion.button
          className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
          onClick={(e) => {
            e.stopPropagation();
            startGame();
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ fontFamily: 'var(--font-bungee)' }}
        >
          Play Again! 🔄
        </motion.button>
      )}
    </div>
  );
}
