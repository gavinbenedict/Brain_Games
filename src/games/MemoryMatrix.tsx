'use client';

import { motion } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudioContext } from '@/components/AudioProvider';

type GamePhase = 'idle' | 'showing' | 'playing' | 'result';

interface Cell {
  active: boolean;
  revealed: boolean;
  correct: boolean | null;
}

export default function MemoryMatrix() {
  const GRID_SIZE = 4;
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [activeCells, setActiveCells] = useState<Set<number>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [cellsToFind, setCellsToFind] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { playNote, playPop, playError, playSuccess, playChime } = useAudioContext();

  const getCellCount = (lvl: number) => Math.min(3 + lvl, 10);

  const initGrid = useCallback(() => {
    const cells = GRID_SIZE * GRID_SIZE;
    const newGrid: Cell[] = Array(cells).fill(null).map(() => ({
      active: false,
      revealed: false,
      correct: null,
    }));

    const count = getCellCount(level);
    const indices = new Set<number>();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * cells));
    }

    indices.forEach(i => {
      newGrid[i].active = true;
    });

    setGrid(newGrid);
    setActiveCells(indices);
    setSelectedCells(new Set());
    setCellsToFind(count);

    return { newGrid, indices };
  }, [level]);

  const startGame = useCallback(() => {
    const { newGrid } = initGrid();
    setPhase('showing');
    playPop();

    // Show active cells
    const revealedGrid = newGrid.map(cell => ({
      ...cell,
      revealed: cell.active,
    }));
    setGrid(revealedGrid);

    // Hide after delay based on level
    const showTime = Math.max(1000, 2500 - (level * 200));
    timerRef.current = setTimeout(() => {
      setGrid(prev => prev.map(cell => ({ ...cell, revealed: false })));
      setPhase('playing');
    }, showTime);
  }, [initGrid, level, playPop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCellClick = useCallback((index: number) => {
    if (phase !== 'playing') return;
    if (selectedCells.has(index)) return;

    const newSelected = new Set(selectedCells);
    newSelected.add(index);
    setSelectedCells(newSelected);

    const isCorrect = activeCells.has(index);

    setGrid(prev => prev.map((cell, i) => {
      if (i === index) {
        return { ...cell, revealed: true, correct: isCorrect };
      }
      return cell;
    }));

    if (isCorrect) {
      playNote(index % 8);

      // Check if all found
      const correctCount = [...newSelected].filter(i => activeCells.has(i)).length;
      if (correctCount === cellsToFind) {
        // Level complete!
        const levelScore = cellsToFind * 10 * level;
        const newScore = score + levelScore;
        setScore(newScore);
        if (newScore > highScore) setHighScore(newScore);

        playSuccess();
        setPhase('result');

        // Show all cells
        setGrid(prev => prev.map(cell => ({
          ...cell,
          revealed: true,
          correct: cell.active ? true : cell.correct,
        })));
      }
    } else {
      playError();
      // Wrong cell - game over
      setPhase('result');
      setGrid(prev => prev.map(cell => ({
        ...cell,
        revealed: true,
        correct: cell.active ? true : (newSelected.has(prev.indexOf(cell)) ? false : null),
      })));

      // Re-apply correct statuses
      setGrid(prev => prev.map((cell, i) => ({
        ...cell,
        revealed: true,
        correct: cell.active ? true : (newSelected.has(i) && !activeCells.has(i) ? false : null),
      })));
    }
  }, [phase, selectedCells, activeCells, cellsToFind, score, highScore, level, playNote, playError, playSuccess]);

  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    playChime();
  }, [playChime]);

  // Start next level automatically when level changes (after initial)
  useEffect(() => {
    if (level > 1 && phase === 'result') {
      // Wait a beat, then start
    }
  }, [level, phase]);

  const resetGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    setPhase('idle');
    playPop();
  }, [playPop]);

  const getCellColor = (cell: Cell, index: number) => {
    if (cell.revealed && cell.correct === true) return '#2ECC71';
    if (cell.revealed && cell.correct === false) return '#FF6B6B';
    if (cell.revealed && cell.active) return '#A66CFF';
    if (phase === 'showing' && cell.revealed) return '#A66CFF';
    return '#FFFDF7';
  };

  const didWinLevel = phase === 'result' && [...selectedCells].filter(i => activeCells.has(i)).length === cellsToFind;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats Bar */}
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="sticker-btn px-4 py-2 bg-cartoon-purple text-sm text-cartoon-white cursor-default">
          Level {level}
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

      {/* Instructions / Status */}
      <motion.p
        className="text-lg font-bold text-center"
        style={{ fontFamily: 'var(--font-bungee)' }}
        key={phase}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {phase === 'idle' && 'Click Start to begin!'}
        {phase === 'showing' && '👀 Remember the pattern!'}
        {phase === 'playing' && `Click ${cellsToFind - [...selectedCells].filter(i => activeCells.has(i)).length} more cells!`}
        {phase === 'result' && didWinLevel && '✨ Level Complete!'}
        {phase === 'result' && !didWinLevel && '💥 Wrong cell! Game Over'}
      </motion.p>

      {/* Grid */}
      {phase !== 'idle' && (
        <motion.div
          className="grid gap-2 w-full max-w-xs mx-auto"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {grid.map((cell, i) => (
            <motion.button
              key={i}
              className="aspect-square cartoon-border cursor-pointer"
              style={{ backgroundColor: getCellColor(cell, i) }}
              onClick={() => handleCellClick(i)}
              whileHover={phase === 'playing' ? { scale: 1.1 } : {}}
              whileTap={phase === 'playing' ? { scale: 0.9 } : {}}
              animate={{
                backgroundColor: getCellColor(cell, i),
                scale: cell.revealed && cell.correct === true ? [1, 1.1, 1] : 1,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              disabled={phase !== 'playing' || selectedCells.has(i)}
            />
          ))}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {phase === 'idle' && (
          <motion.button
            className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
            onClick={startGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            Start! 🚀
          </motion.button>
        )}

        {phase === 'result' && didWinLevel && (
          <motion.button
            className="sticker-btn px-8 py-3 bg-cartoon-green text-lg"
            onClick={() => {
              nextLevel();
              setTimeout(startGame, 100);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            Next Level! →
          </motion.button>
        )}

        {phase === 'result' && (
          <motion.button
            className="sticker-btn px-6 py-3 bg-cartoon-yellow text-base"
            onClick={resetGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ fontFamily: 'var(--font-bungee)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            Restart 🔄
          </motion.button>
        )}
      </div>
    </div>
  );
}
