import { GymMember, ChurnRiskLevel } from './types';

export interface ChurnDiagnostics {
  overallScore: number;
  riskLevel: ChurnRiskLevel;
  recencyScore: number; // 0 - 100
  frequencyScore: number; // 0 - 100
  tierFactorScore: number; // 0 - 100
  incidentScore: number; // 0 - 100
  primaryRiskDriver: string;
  recommendedAction: string;
}

/**
 * Enterprise Explainable Churn Prediction Algorithm (XAI)
 *
 * Formula:
 * RiskScore = (RecencyDecay * 0.45) + (FrequencyDrop * 0.25) + (TierFactor * 0.15) + (IncidentFactor * 0.15)
 */
export function calculateMemberChurnDiagnostics(member: GymMember): ChurnDiagnostics {
  const days = member.lastVisitDaysAgo;

  // 1. Recency Decay (45% weight) — The 14-Day Inactivity Cliff
  let recencyScore = 0;
  if (days === 0) recencyScore = 5;
  else if (days <= 3) recencyScore = 10;
  else if (days <= 7) recencyScore = 35;
  else if (days <= 10) recencyScore = 60;
  else if (days <= 14) recencyScore = 80;
  else recencyScore = Math.min(100, 80 + (days - 14) * 4);

  // 2. Frequency Drop (25% weight)
  let frequencyScore = 0;
  if (days > 10) frequencyScore = 90;
  else if (days > 5) frequencyScore = 55;
  else frequencyScore = 15;

  // 3. Tier Commitment Factor (15% weight)
  let tierFactorScore = 20;
  if (member.tier === 'standard') tierFactorScore = 40;
  else if (member.tier === 'premium_black') tierFactorScore = 25;
  else if (member.tier === 'executive') tierFactorScore = 15;

  // 4. Incident / Injury Flag (15% weight)
  let incidentScore = 0;
  if (member.notes && (member.notes.toLowerCase().includes('strain') || member.notes.toLowerCase().includes('injury') || member.notes.toLowerCase().includes('stopped'))) {
    incidentScore = 85;
  } else if (days > 12) {
    incidentScore = 50;
  }

  // Weighted Total
  const calculatedScore = Math.round(
    recencyScore * 0.45 + frequencyScore * 0.25 + tierFactorScore * 0.15 + incidentScore * 0.15
  );

  const overallScore = Math.min(100, Math.max(member.churnRiskScore, calculatedScore));

  let riskLevel: ChurnRiskLevel = 'low';
  if (overallScore >= 75) riskLevel = 'critical';
  else if (overallScore >= 60) riskLevel = 'high';
  else if (overallScore >= 35) riskLevel = 'medium';

  // Determine Primary Risk Driver
  let primaryRiskDriver = 'Normal healthy workout frequency';
  if (incidentScore >= 70) primaryRiskDriver = 'Reported physical strain / injury in notes';
  else if (days >= 14) primaryRiskDriver = 'Crossed the 14-day consecutive inactivity cliff';
  else if (days >= 7) primaryRiskDriver = 'Weekly visit cadence decayed by >50%';
  else if (member.tier === 'standard' && days > 4) primaryRiskDriver = 'Low contract commitment tier with attendance dip';

  // Recommended Action
  let recommendedAction = 'Maintain current cadence. Send standard weekly challenge.';
  if (riskLevel === 'critical') {
    recommendedAction = 'Immediate VIP Outreach: Dispatch 1-on-1 Coach Check-in or Free Fuel Bar Voucher.';
  } else if (riskLevel === 'high') {
    recommendedAction = 'Send automated re-engagement SMS with a 20% Pro-Shop / Renewal discount.';
  } else if (riskLevel === 'medium') {
    recommendedAction = 'Recommend friend guest pass to restore group workout motivation.';
  }

  return {
    overallScore,
    riskLevel,
    recencyScore,
    frequencyScore,
    tierFactorScore,
    incidentScore,
    primaryRiskDriver,
    recommendedAction,
  };
}
