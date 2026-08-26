'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: 'orange' | 'cyan' | 'emerald' | 'amber' | 'red';
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  accentColor = 'orange',
}: StatCardProps) {
  const colorMap = {
    orange: 'text-stark-orange border-stark-orange/30 bg-stark-orange/10',
    cyan: 'text-stark-cyan border-stark-cyan/30 bg-stark-cyan/10',
    emerald: 'text-stark-emerald border-stark-emerald/30 bg-stark-emerald/10',
    amber: 'text-stark-amber border-stark-amber/30 bg-stark-amber/10',
    red: 'text-stark-red border-stark-red/30 bg-stark-red/10',
  };

  return (
    <div className="stark-card rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-[11px] font-mono tracking-wider uppercase text-gray-400 font-semibold mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-mono text-gray-400">
              {subValue}
            </span>
          )}
        </div>
      </div>
      <div className={`p-3 rounded-lg border ${colorMap[accentColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
