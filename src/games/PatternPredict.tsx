'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioContext } from '@/components/AudioProvider';

type GamePhase = 'idle' | 'showing' | 'guessing' | 'result';

const SHAPES = ['circle', 'square', 'triangle', 'star'] as const;
type Shape = typeof SHAPES[number];

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A66CFF'] as const;

interface PatternItem {
  shape: Shape;
  color: string;
}

export default function PatternPredict() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const [sequence, setSequence] = useState<PatternItem[]>([]);
  const [options, setOptions] = useState<PatternItem[]>([]);
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);
  
  const { playNote, playPop, playError, playSuccess, playChime } = useAudioContext();

  const generatePattern = useCallback((currentLevel: number) => {
    // Generate a simple repeating pattern based on level
    const seqType = currentLevel % 3; // 0: alternating shape, 1: alternating color, 2: both
    
    let baseSequence: PatternItem[] = [];
    const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shape1 = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const shape2 = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    const seqLength = Math.min(6, 3 + Math.floor(currentLevel / 2));
    
    for (let i = 0; i < seqLength; i++) {
      if (seqType === 0) {
        baseSequence.push({ shape: i % 2 === 0 ? shape1 : shape2, color: color1 });
      } else if (seqType === 1) {
        baseSequence.push({ shape: shape1, color: i % 2 === 0 ? color1 : color2 });
      } else {
        baseSequence.push({ shape: i % 2 === 0 ? shape1 : shape2, color: i % 2 === 0 ? color1 : color2 });
      }
    }

    // Determine what the NEXT item should be
    const lastItemIdx = seqLength - 1;
    const nextItem: PatternItem = {
      shape: (seqType === 0 || seqType === 2) ? (lastItemIdx % 2 === 1 ? shape1 : shape2) : shape1,
      color: (seqType === 1 || seqType === 2) ? (lastItemIdx % 2 === 1 ? color1 : color2) : color1,
    };

    setSequence(baseSequence);

    // Generate options containing the correct answer and 3 random ones
    let opts: PatternItem[] = [nextItem];
    while (opts.length < 4) {
      const randomItem = {
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
      
      // Ensure no duplicates in options
      if (!opts.some(o => o.shape === randomItem.shape && o.color === randomItem.color)) {
        opts.push(randomItem);
      }
    }
    
    // Shuffle options
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }

    setOptions(opts);
    setCorrectOptionIdx(opts.findIndex(o => o.shape === nextItem.shape && o.color === nextItem.color));
    
  }, []);

  const startGame = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLevel(1);
    setScore(0);
    generatePattern(1);
    setPhase('guessing');
    playPop();
  }, [generatePattern, playPop]);

  const nextLevel = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextLvl = level + 1;
    setLevel(nextLvl);
    generatePattern(nextLvl);
    setPhase('guessing');
    playChime();
  }, [level, generatePattern, playChime]);

  const handleOptionClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (phase !== 'guessing') return;

    if (idx === correctOptionIdx) {
      // Correct!
      const levelScore = 10 * level;
      setScore(prev => {
        const newScore = prev + levelScore;
        setHighScore(prevHigh => newScore > prevHigh ? newScore : prevHigh);
        return newScore;
      });
      playSuccess();
      setPhase('result');
    } else {
      // Wrong!
      playError();
      setPhase('result');
      // Set level to 0 flag to indicate game over
      setLevel(0); 
    }
  };

  const resetGame = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhase('idle');
    setScore(0);
    setLevel(1);
    playPop();
  }, [playPop]);

  const renderShape = (item: PatternItem, size: string = 'w-12 h-12') => {
    switch(item.shape) {
      case 'circle': return <div className={`rounded-full cartoon-border ${size}`} style={{ backgroundColor: item.color }} />;
      case 'square': return <div className={`rounded-md cartoon-border ${size}`} style={{ backgroundColor: item.color }} />;
      case 'triangle': return <div className={size} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', backgroundColor: item.color, border: '4px solid #1A1A2E' }} />;
      case 'star': return <div className={size} style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', backgroundColor: item.color }} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="sticker-btn px-4 py-2 bg-cartoon-purple text-sm text-cartoon-white cursor-default">
          Level {level > 0 ? level : '---'}
        </div>
        <div className="sticker-btn px-4 py-2 bg-cartoon-yellow text-sm cursor-default">
          Score: {score}
        </div>
        {highScore > 0 && (
          <div className="sticker-btn px-4 py-2 bg-cartoon-green text-sm cursor-default">
            🏆 {highScore}
          </div>
        )}
      </div>

      <motion.div
        className="w-full cartoon-border-thick cartoon-shadow flex flex-col items-center p-6 bg-cartoon-white"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {phase === 'idle' && (
          <div className="text-center py-8">
            <p className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-bungee)' }}>
              Find the next shape!
            </p>
            <p className="font-bold text-lg">Observe the pattern closely.</p>
          </div>
        )}

        {phase !== 'idle' && (
          <>
            <p className="font-bold text-xl mb-4 text-center">What comes next?</p>
            
            {/* The Sequence */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-8 bg-gray-100 p-4 rounded-xl cartoon-border w-full">
              {sequence.map((item, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <span className="mx-1 sm:mx-2 font-bold opacity-50">→</span>}
                  {renderShape(item, 'w-8 h-8 sm:w-12 sm:h-12')}
                </div>
              ))}
              <span className="mx-2 font-bold opacity-50">→</span>
              <div className="w-12 h-12 rounded-xl border-4 border-dashed border-gray-400 flex items-center justify-center font-bold text-gray-400 text-2xl">
                ?
              </div>
            </div>

            {/* Answer Options */}
            {(phase === 'guessing' || phase === 'result') && (
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                {options.map((opt, i) => {
                  let btnBg = '#FFFDF7';
                  if (phase === 'result') {
                    if (i === correctOptionIdx) btnBg = '#C8F7C5'; // Highlight correct answer
                    else btnBg = '#FFD5D5'; // Dim incorrect answers
                  }

                  return (
                    <motion.button
                      key={i}
                      className="aspect-square cartoon-border flex items-center justify-center cartoon-shadow"
                      style={{ backgroundColor: btnBg }}
                      onClick={(e) => handleOptionClick(e, i)}
                      disabled={phase !== 'guessing'}
                      whileHover={phase === 'guessing' ? { scale: 1.05 } : {}}
                      whileTap={phase === 'guessing' ? { scale: 0.95 } : {}}
                    >
                      {renderShape(opt, 'w-16 h-16 sm:w-20 sm:h-20')}
                    </motion.button>
                  );
                })}
              </div>
            )}
            
            {phase === 'result' && (
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-stroke-sm mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
                  {level > 0 ? 'Correct! 🎉' : 'Game Over! 💥'}
                </p>
              </div>
            )}
          </>
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

        {phase === 'result' && level > 0 && (
          <motion.button
            className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
            onClick={nextLevel}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
          >
            Next Level! →
          </motion.button>
        )}
        
        {phase === 'result' && level === 0 && (
          <motion.button
            className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
            onClick={startGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
          >
            Play Again 🔄
          </motion.button>
        )}

        {phase === 'result' && (
          <motion.button
            className="sticker-btn px-6 py-3 bg-cartoon-yellow text-base"
            onClick={resetGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
          >
            Menu
          </motion.button>
        )}
      </div>
    </div>
  );
}
