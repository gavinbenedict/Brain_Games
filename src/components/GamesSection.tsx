'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';
import GameModal from './GameModal';
import ReactionSpeed from '@/games/ReactionSpeed';
import MemoryMatrix from '@/games/MemoryMatrix';
import { useAudioContext } from './AudioProvider';

interface GameDef {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  playable: boolean;
}

const GAMES: GameDef[] = [
  {
    id: 'reaction',
    title: 'Reaction Speed',
    description: 'Test your reflexes! Click as fast as you can when the screen turns green.',
    color: '#2ECC71',
    icon: '⚡',
    playable: true,
  },
  {
    id: 'memory',
    title: 'Memory Matrix',
    description: 'Remember the pattern and click the right cells. How far can you go?',
    color: '#A66CFF',
    icon: '🧩',
    playable: true,
  },
  {
    id: 'typing',
    title: 'Typing Speed',
    description: 'Race against the clock! Type the words as fast and accurately as you can.',
    color: '#4ECDC4',
    icon: '⌨️',
    playable: false,
  },
  {
    id: 'stroop',
    title: 'Color Reflex',
    description: 'The Stroop test — match the color, not the word! How fast is your brain?',
    color: '#FF6B6B',
    icon: '🎨',
    playable: false,
  },
  {
    id: 'focus',
    title: 'Focus Tracker',
    description: 'Follow the moving target with your cursor. Precision meets speed!',
    color: '#FFD93D',
    icon: '🎯',
    playable: false,
  },
  {
    id: 'pattern',
    title: 'Pattern Predict',
    description: 'Spot the pattern and predict the next shape. Train your logical thinking!',
    color: '#FF61D2',
    icon: '🔮',
    playable: false,
  },
];

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { playPop } = useAudioContext();

  const activeGameDef = GAMES.find(g => g.id === activeGame);

  return (
    <section id="games" className="section-panel" style={{ background: 'linear-gradient(180deg, #FFF3CD 0%, #E8DAFF 100%)' }}>
      {/* Section Title */}
      <motion.h2
        className="text-4xl sm:text-6xl font-bold text-center mb-4 text-stroke"
        style={{ fontFamily: 'var(--font-bungee)', color: '#A66CFF' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        🎮 Mini Games
      </motion.h2>

      <motion.p
        className="text-lg sm:text-xl text-center mb-12 max-w-md font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Pick a game and challenge your brain!
      </motion.p>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        {GAMES.map((game, i) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            color={game.color}
            icon={game.icon}
            delay={i * 0.1}
            badge={game.playable ? undefined : '🔒 Coming Soon'}
            onClick={() => {
              if (game.playable) {
                setActiveGame(game.id);
              } else {
                playPop();
              }
            }}
          />
        ))}
      </div>

      {/* Game Modals */}
      <GameModal
        isOpen={activeGame === 'reaction'}
        onClose={() => setActiveGame(null)}
        title="⚡ Reaction Speed"
        color="#C8F7C5"
      >
        <ReactionSpeed />
      </GameModal>

      <GameModal
        isOpen={activeGame === 'memory'}
        onClose={() => setActiveGame(null)}
        title="🧩 Memory Matrix"
        color="#E8DAFF"
      >
        <MemoryMatrix />
      </GameModal>

      {/* Coming Soon Modal */}
      <GameModal
        isOpen={activeGame !== null && !GAMES.find(g => g.id === activeGame)?.playable}
        onClose={() => setActiveGame(null)}
        title={`${activeGameDef?.icon || '🎮'} ${activeGameDef?.title || 'Game'}`}
        color={activeGameDef?.color || '#FFD93D'}
      >
        <div className="text-center py-8">
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, type: 'tween' }}
          >
            🚧
          </motion.div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-bungee)' }}>
            Coming Soon!
          </h3>
          <p className="text-lg font-medium opacity-70">
            This game is being built. Check back later! ✨
          </p>
        </div>
      </GameModal>
    </section>
  );
}
