'use client';

import React from 'react';
import { ChurnRiskLevel } from '@/lib/store/types';
import { HelpCircle } from 'lucide-react';

interface ChurnRiskBadgeProps {
  score: number; // 0 - 100
  riskLevel: ChurnRiskLevel;
  onClick?: () => void;
}

export function ChurnRiskBadge({ score, riskLevel, onClick }: ChurnRiskBadgeProps) {
  const getColor = () => {
    switch (riskLevel) {
      case 'critical':
        return 'text-stark-red border-stark-red bg-stark-red/15 hover:bg-stark-red/25';
      case 'high':
        return 'text-stark-orange border-stark-orange bg-stark-orange/15 hover:bg-stark-orange/25';
      case 'medium':
        return 'text-stark-amber border-stark-amber bg-stark-amber/15 hover:bg-stark-amber/25';
      default:
        return 'text-stark-emerald border-stark-emerald bg-stark-emerald/15 hover:bg-stark-emerald/25';
    }
  };

  return (
    <button
      onClick={onClick}
      title="Click to view AI Churn Explainability & Diagnostics"
      className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer group ${getColor()}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          riskLevel === 'critical'
            ? 'bg-stark-red animate-ping'
            : riskLevel === 'high'
            ? 'bg-stark-orange'
            : 'bg-stark-emerald'
        }`}
      />
      <span>{score}% RISK</span>
      <HelpCircle className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
    </button>
  );
}
