'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface AudioVisualizerWaveProps {
  isActive?: boolean;
}

export function AudioVisualizerWave({ isActive = false }: AudioVisualizerWaveProps) {
  const [isListening, setIsListening] = useState(false);
  const [barHeights, setBarHeights] = useState<number[]>([40, 70, 25, 90, 55, 80, 30, 95, 60, 45, 85, 35, 75, 50, 90, 65]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const toggleMicrophone = async () => {
    if (isListening) {
      stopAudio();
    } else {
      await startAudio();
    }
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateWave = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Normalize first 16 frequency bins to percentages (15-100%)
        const heights = Array.from(dataArray.slice(0, 16)).map((val) =>
          Math.max(15, Math.min(100, Math.round((val / 255) * 100)))
        );
        setBarHeights(heights);

        animFrameRef.current = requestAnimationFrame(updateWave);
      };

      updateWave();
    } catch (err) {
      console.warn('[Web Audio API] Microphone access denied or not supported:', err);
      setIsListening(false);
    }
  };

  const stopAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    setIsListening(false);
    setBarHeights([40, 70, 25, 90, 55, 80, 30, 95, 60, 45, 85, 35, 75, 50, 90, 65]);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Interactive Web Audio API Mic Toggle */}
      <button
        type="button"
        onClick={toggleMicrophone}
        title={isListening ? 'Mute Web Audio Mic' : 'Activate Web Audio Voice Input'}
        className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 ${
          isListening
            ? 'bg-stark-orange text-black border-stark-orange shadow-stark-glow-sm animate-pulse'
            : 'bg-surface-100 text-gray-400 border-border-subtle hover:text-white hover:border-stark-orange/40'
        }`}
      >
        {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
      </button>

      {/* Frequency Wave Visualizer Bars */}
      <div className="flex items-center gap-1 h-6 px-1">
        {barHeights.map((height, idx) => (
          <div
            key={idx}
            style={{
              height: isListening || isActive ? `${height}%` : '20%',
              transitionDuration: isListening ? '50ms' : '200ms',
            }}
            className={`w-0.5 rounded-full transition-all ${
              isListening
                ? 'bg-stark-cyan shadow-hud-cyan'
                : isActive
                ? 'bg-stark-orange animate-wave-bar shadow-stark-glow-sm'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
