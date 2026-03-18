'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAudio } from '@/hooks/useAudio';

type AudioContextType = ReturnType<typeof useAudio>;

const AudioCtx = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudio();

  return (
    <AudioCtx.Provider value={audio}>
      <div onClick={audio.initAudio}>
        {children}
      </div>
    </AudioCtx.Provider>
  );
}

export function useAudioContext(): AudioContextType {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider');
  return ctx;
}
