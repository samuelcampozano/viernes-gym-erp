'use client';

import React from 'react';
import { GymMember } from '@/lib/store/types';
import { calculateMemberChurnDiagnostics } from '@/lib/store/churnEngine';
import { useGymStore } from '@/lib/store/useGymStore';
import {
  X,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  Send,
  Zap,
} from 'lucide-react';

interface ScoreBreakdownModalProps {
  member: GymMember | null;
  onClose: () => void;
}

export function ScoreBreakdownModal({ member, onClose }: ScoreBreakdownModalProps) {
  const { launchRetentionCampaign } = useGymStore();

  if (!member) return null;

  const diag = calculateMemberChurnDiagnostics(member);

  const getRiskColor = (level: string) => {
    switch (level) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="stark-card rounded-2xl w-full max-w-lg p-6 border-stark-orange shadow-2xl relative bg-surface-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-surface-100 text-gray-400 hover:text-white hover:bg-surface-50 border border-border-subtle transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with AI Explainability Tag */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-border-subtle">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-stark-orange/50 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">{member.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-100 text-gray-300 border border-border-subtle uppercase">
                {member.tier.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Brain className="w-3.5 h-3.5 text-stark-cyan" />
              <span className="text-[11px] font-mono text-stark-cyan font-bold">
                EXPLAINABLE CHURN DIAGNOSTICS (XAI)
              </span>
            </div>
          </div>
        </div>

        {/* Overall Score Meter */}
        <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
              Algorithmic Churn Probability
            </span>
            <span className={`text-2xl font-black font-mono tracking-tight ${
              diag.riskLevel === 'critical' ? 'text-stark-red' : diag.riskLevel === 'high' ? 'text-stark-orange' : 'text-stark-emerald'
            }`}>
              {diag.overallScore}% ({diag.riskLevel.toUpperCase()} RISK)
            </span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold uppercase ${getRiskColor(diag.riskLevel)}`}>
            {member.lastVisitDaysAgo === 0 ? 'Active Today' : `${member.lastVisitDaysAgo}d Inactive`}
          </div>
        </div>

        {/* The 4 Mathematical Weighted Components */}
        <div className="space-y-3 mb-5">
          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">
            Mathematical Factor Breakdown (Weighted Model):
          </span>

          {/* 1. Recency Decay (45% weight) */}
          <div className="p-2.5 rounded-lg bg-surface-200 border border-border-subtle text-xs font-mono">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">1. Recency Decay (45% Weight):</span>
              <span className="font-bold text-white">{diag.recencyScore}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-100 overflow-hidden">
              <div
                style={{ width: `${diag.recencyScore}%` }}
                className={`h-full rounded-full ${diag.recencyScore > 70 ? 'bg-stark-red' : 'bg-stark-emerald'}`}
              />
            </div>
          </div>

          {/* 2. Frequency Drop (25% weight) */}
          <div className="p-2.5 rounded-lg bg-surface-200 border border-border-subtle text-xs font-mono">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">2. Attendance Frequency Drop (25% Weight):</span>
              <span className="font-bold text-white">{diag.frequencyScore}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-100 overflow-hidden">
              <div
                style={{ width: `${diag.frequencyScore}%` }}
                className={`h-full rounded-full ${diag.frequencyScore > 70 ? 'bg-stark-red' : 'bg-stark-amber'}`}
              />
            </div>
          </div>

          {/* 3. Tier Commitment Factor (15% weight) */}
          <div className="p-2.5 rounded-lg bg-surface-200 border border-border-subtle text-xs font-mono">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">3. Contract Tier Volatility (15% Weight):</span>
              <span className="font-bold text-white">{diag.tierFactorScore}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-100 overflow-hidden">
              <div
                style={{ width: `${diag.tierFactorScore}%` }}
                className="h-full rounded-full bg-stark-cyan"
              />
            </div>
          </div>

          {/* 4. Incident / Strain Flag (15% weight) */}
          <div className="p-2.5 rounded-lg bg-surface-200 border border-border-subtle text-xs font-mono">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">4. Physical Strain / Injury Flag (15% Weight):</span>
              <span className="font-bold text-white">{diag.incidentScore}/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-100 overflow-hidden">
              <div
                style={{ width: `${diag.incidentScore}%` }}
                className={`h-full rounded-full ${diag.incidentScore > 50 ? 'bg-stark-red' : 'bg-gray-500'}`}
              />
            </div>
          </div>
        </div>

        {/* Primary Driver & Recommended Action */}
        <div className="p-3.5 rounded-xl bg-stark-orange/10 border border-stark-orange/30 mb-5 space-y-2 text-xs font-mono">
          <div>
            <span className="text-[10px] text-stark-orange uppercase font-bold block">
              Primary Churn Driver:
            </span>
            <p className="text-white font-semibold">{diag.primaryRiskDriver}</p>
          </div>
          <div>
            <span className="text-[10px] text-stark-cyan uppercase font-bold block">
              AI Recommended Retention Action:
            </span>
            <p className="text-gray-200">{diag.recommendedAction}</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            launchRetentionCampaign([member.id], 'smoothie_voucher', 25);
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-stark-orange hover:bg-stark-orange/90 text-black font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-stark-glow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Draft Personalized Retention Offer
        </button>
      </div>
    </div>
  );
}
