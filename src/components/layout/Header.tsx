'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Clock, Users } from 'lucide-react';
import { useGymStore } from '@/lib/store/useGymStore';

export function Header() {
  const [time, setTime] = useState<string>('');
  const { telemetry, isAiProcessing } = useGymStore();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-border-subtle bg-surface-400/90 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-surface-100 border border-stark-orange/40 shadow-stark-glow-sm shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-stark-orange animate-pulse-slow" />
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-stark-emerald shadow-hud-emerald" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-black tracking-wider text-white font-mono">
                VIERNES<span className="text-stark-orange">.AI</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase rounded bg-stark-orange/15 text-stark-orange border border-stark-orange/30">
                WebMCP
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-gray-400 font-mono tracking-tight">
              AUTONOMOUS GYM ERP & VISUAL FLOOR COMMANDER
            </p>
          </div>
        </div>

        {/* Live Telemetry & AI Status Indicators */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* AI Connection Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-surface-100/90 border border-border-subtle shrink-0">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isAiProcessing ? 'bg-stark-amber animate-ping' : 'bg-stark-emerald'}`} />
            <span className="text-[10px] sm:text-xs font-mono text-gray-300">
              {isAiProcessing ? 'PROCESSING...' : 'AI READY'}
            </span>
            <Sparkles className="w-3 h-3 text-stark-orange hidden sm:inline" />
          </div>

          {/* Occupancy Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-surface-100/90 border border-border-subtle shrink-0">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stark-cyan" />
            <span className="text-[10px] sm:text-xs font-mono text-gray-300">
              <strong className="text-white">{telemetry.currentOccupancy}/{telemetry.maxCapacity}</strong>
            </span>
          </div>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-100/90 border border-border-subtle text-xs font-mono text-gray-400">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{time || '00:00:00'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
