'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Shield, Sparkles, Wifi, Clock, Users } from 'lucide-react';
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
    <header className="border-b border-border-subtle bg-surface-400/90 backdrop-blur-md px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tactical Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-surface-100 border border-stark-orange/40 shadow-stark-glow-sm">
            <Shield className="w-5 h-5 text-stark-orange animate-pulse-slow" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-stark-emerald shadow-hud-emerald" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white font-mono">
                VIERNES<span className="text-stark-orange">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded bg-stark-orange/15 text-stark-orange border border-stark-orange/30">
                WebMCP v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-tight">
              AUTONOMOUS GYM ERP & VISUAL FLOOR COMMANDER
            </p>
          </div>
        </div>

        {/* Live Telemetry & AI Status Indicators */}
        <div className="flex items-center gap-4">
          {/* AI Connection Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/90 border border-border-subtle">
            <div className={`w-2 h-2 rounded-full ${isAiProcessing ? 'bg-stark-amber animate-ping' : 'bg-stark-emerald'}`} />
            <span className="text-xs font-mono text-gray-300">
              {isAiProcessing ? 'VIERNES PROCESSING...' : 'WEBMCP AGENT READY'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-stark-orange" />
          </div>

          {/* Occupancy Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/90 border border-border-subtle">
            <Users className="w-3.5 h-3.5 text-stark-cyan" />
            <span className="text-xs font-mono text-gray-300">
              FLOOR: <strong className="text-white">{telemetry.currentOccupancy}/{telemetry.maxCapacity}</strong>
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
