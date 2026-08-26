'use client';

import React from 'react';

interface AudioVisualizerWaveProps {
  isActive?: boolean;
}

export function AudioVisualizerWave({ isActive = false }: AudioVisualizerWaveProps) {
  const bars = [40, 70, 25, 90, 55, 80, 30, 95, 60, 45, 85, 35, 75, 50, 90, 65];

  return (
    <div className="flex items-center gap-1 h-6 px-2">
      {bars.map((height, idx) => (
        <div
          key={idx}
          style={{
            height: isActive ? `${height}%` : '20%',
            animationDelay: `${idx * 0.08}s`,
          }}
          className={`w-0.5 rounded-full transition-all duration-200 ${
            isActive ? 'bg-stark-orange animate-wave-bar shadow-stark-glow-sm' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  );
}
