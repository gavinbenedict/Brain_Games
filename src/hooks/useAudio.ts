'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

// Musical notes frequencies (C major scale)
const NOTE_FREQUENCIES = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25];

let globalAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!globalAudioContext) {
    globalAudioContext = new AudioContext();
  }
  return globalAudioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported
  }
}

function playNoise(duration: number, volume: number = 0.08) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  } catch {
    // Audio not supported
  }
}

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playNote = useCallback((index: number) => {
    if (isMuted) return;
    const freq = NOTE_FREQUENCIES[index % NOTE_FREQUENCIES.length];
    playTone(freq, 0.6, 'sine', 0.12);
    // Add a harmonic
    playTone(freq * 2, 0.3, 'sine', 0.04);
  }, [isMuted]);

  const playPop = useCallback(() => {
    if (isMuted) return;
    playTone(800, 0.08, 'sine', 0.1);
    playNoise(0.05, 0.06);
  }, [isMuted]);

  const playTick = useCallback(() => {
    if (isMuted) return;
    playTone(1200, 0.03, 'square', 0.04);
  }, [isMuted]);

  const playChime = useCallback(() => {
    if (isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.4, 'sine', 0.08);
      }, i * 120);
    });
  }, [isMuted]);

  const playError = useCallback(() => {
    if (isMuted) return;
    playTone(200, 0.3, 'sawtooth', 0.08);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.08), 150);
  }, [isMuted]);

  const playSuccess = useCallback(() => {
    if (isMuted) return;
    const notes = [440, 554.37, 659.25];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.1), i * 100);
    });
  }, [isMuted]);

  const startAmbient = useCallback(() => {
    if (ambientIntervalRef.current) return;

    const playAmbientChord = () => {
      if (isMuted) return;
      const baseFreqs = [130.81, 164.81, 196.0, 220.0];
      const freq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
      playTone(freq, 3, 'sine', 0.02);
      playTone(freq * 1.5, 3, 'sine', 0.01);
    };

    playAmbientChord();
    ambientIntervalRef.current = setInterval(playAmbientChord, 4000);
  }, [isMuted]);

  const stopAmbient = useCallback(() => {
    if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) {
        stopAmbient();
      }
      return !prev;
    });
  }, [stopAmbient]);

  const initAudio = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      getAudioContext();
      startAmbient();
    }
  }, [hasInteracted, startAmbient]);

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    isMuted,
    hasInteracted,
    toggleMute,
    initAudio,
    playNote,
    playPop,
    playTick,
    playChime,
    playError,
    playSuccess,
    startAmbient,
    stopAmbient,
  };
}
