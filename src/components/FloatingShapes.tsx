'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useParallax } from '@/hooks/useParallax';
import { useEffect, useState } from 'react';

interface FloatingShape {
  id: number;
  type: 'star' | 'circle' | 'blob' | 'ring' | 'diamond' | 'triangle';
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  layer: number; // 1-3 for parallax depth
}

const COLORS = ['#FFD93D', '#FF6B6B', '#4ECDC4', '#A66CFF', '#FF61D2', '#FF9F43', '#2ECC71'];

function generateShapes(count: number): FloatingShape[] {
  const types: FloatingShape['type'][] = ['star', 'circle', 'blob', 'ring', 'diamond', 'triangle'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    type: types[i % types.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 50,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 3,
    duration: 5 + Math.random() * 5,
    rotation: Math.random() * 360,
    layer: (i % 3) + 1,
  }));
}

function ShapeSVG({ type, color, size }: { type: FloatingShape['type']; color: string; size: number }) {
  const stroke = '#1A1A2E';
  const sw = 3;

  switch (type) {
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <polygon
            points="25,2 31,18 49,18 35,29 39,46 25,36 11,46 15,29 1,18 19,18"
            fill={color}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill={color} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'blob':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <path
            d="M25,5 C35,5 45,15 45,25 C45,38 35,45 25,45 C12,45 5,35 5,25 C5,12 15,5 25,5Z"
            fill={color}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
    case 'ring':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke={color} strokeWidth={6} />
          <circle cx="25" cy="25" r="20" fill="none" stroke={stroke} strokeWidth={2} />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <polygon points="25,2 48,25 25,48 2,25" fill={color} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <polygon points="25,3 47,45 3,45" fill={color} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
  }
}

export default function FloatingShapes() {
  const parallax = useParallax(0.015);
  const { scrollYProgress } = useScroll();
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    setShapes(generateShapes(14));
  }, []);

  if (shapes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape) => {
        const layerMultiplier = shape.layer * 0.5;
        return (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              x: parallax.x * layerMultiplier,
              y: scrollY,
              opacity: 0.6 + (shape.layer * 0.1),
            }}
            animate={{
              y: [0, -20 * layerMultiplier, 0],
              rotate: [shape.rotation, shape.rotation + 15, shape.rotation],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              type: 'tween',
            }}
          >
            <ShapeSVG type={shape.type} color={shape.color} size={shape.size} />
          </motion.div>
        );
      })}
    </div>
  );
}
