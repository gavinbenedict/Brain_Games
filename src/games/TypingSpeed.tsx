'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAudioContext } from '@/components/AudioProvider';

const WORDS = [
  'brain', 'focus', 'speed', 'memory', 'reflex', 'smart', 'think', 'quick',
  'logic', 'matrix', 'pattern', 'puzzle', 'solve', 'train', 'mind', 'sharp'
];

type GamePhase = 'idle' | 'playing' | 'result';

export default function TypingSpeed() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { playNote, playPop, playError, playSuccess } = useAudioContext();

  const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  const startGame = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhase('playing');
    setScore(0);
    setTimeLeft(30);
    setCurrentWord(getRandomWord());
    setInput('');
    playPop();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [playPop]);

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setInput(val);

    if (val === currentWord) {
      setScore(prev => prev + 1);
      playNote(score % 8);
      setCurrentWord(getRandomWord());
      setInput('');
    } else if (currentWord.startsWith(val)) {
      // Typing correctly so far
    } else {
      // Made a mistake
      playError();
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
      {/* Stats Bar */}
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="sticker-btn px-4 py-2 bg-cartoon-yellow text-sm cursor-default">
          Time: {timeLeft}s
        </div>
        <div className="sticker-btn px-4 py-2 bg-cartoon-blue text-sm text-cartoon-white cursor-default">
          Words: {score}
        </div>
        {highScore > 0 && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-green text-sm cursor-default">
            🏆 {highScore}
          </div>
        )}
      </div>

      {/* Game Area */}
      <motion.div
        className="w-full aspect-[2/1] min-h-[200px] cartoon-border-thick cartoon-shadow flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: phase === 'playing' ? '#4ECDC4' : '#FFFDF7' }}
        animate={{ backgroundColor: phase === 'playing' ? '#4ECDC4' : '#FFFDF7' }}
      >
        {phase === 'idle' && (
          <p className="text-2xl font-bold text-center" style={{ fontFamily: 'var(--font-bungee)' }}>
            Type words as fast as you can in 30 seconds!
          </p>
        )}

        {phase === 'playing' && (
          <>
            <motion.p
              key={currentWord}
              className="text-4xl sm:text-6xl font-bold text-cartoon-black text-stroke-sm mb-6"
              style={{ fontFamily: 'var(--font-bungee)' }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {currentWord}
            </motion.p>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="cartoon-border w-full max-w-sm px-4 py-3 text-2xl text-center font-bold bg-cartoon-white focus:outline-none focus:ring-4 focus:ring-cartoon-black"
              style={{ fontFamily: 'var(--font-body)' }}
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}

        {phase === 'result' && (
          <div className="text-center">
            <p className="text-3xl font-bold text-stroke-sm mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
              Time's Up! ⏰
            </p>
            <p className="text-xl font-bold">You typed {score} words!</p>
            <p className="text-lg opacity-80 mt-1">
              ({Math.round(score * (60 / 30))} WPM Approx)
            </p>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
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
