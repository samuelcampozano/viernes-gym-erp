'use client';

import React from 'react';
import { ChurnRiskLevel } from '@/lib/store/types';

interface ChurnRiskBadgeProps {
  score: number; // 0 - 100
  riskLevel: ChurnRiskLevel;
}

export function ChurnRiskBadge({ score, riskLevel }: ChurnRiskBadgeProps) {
  const getColor = () => {
    switch (riskLevel) {
      case 'critical':
        return 'text-stark-red border-stark-red bg-stark-red/15';
      case 'high':
        return 'text-stark-orange border-stark-orange bg-stark-orange/15';
      case 'medium':
        return 'text-stark-amber border-stark-amber bg-stark-amber/15';
      default:
        return 'text-stark-emerald border-stark-emerald bg-stark-emerald/15';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 ${getColor()}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          riskLevel === 'critical' ? 'bg-stark-red animate-ping' : riskLevel === 'high' ? 'bg-stark-orange' : 'bg-stark-emerald'
        }`} />
        <span>{score}% RISK</span>
      </div>
    </div>
  );
}
