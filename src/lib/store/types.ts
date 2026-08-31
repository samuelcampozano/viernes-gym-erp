export type GymZoneId =
  | 'zone_a_racks'
  | 'zone_b_freeweights'
  | 'zone_c_turf'
  | 'zone_d_cardio'
  | 'zone_e_recovery';

export type EquipmentStatus = 'operational' | 'maintenance' | 'in_use' | 'reserved';
export type EquipmentCategory = 'strength' | 'cardio' | 'functional' | 'recovery';

export interface GymEquipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  zone: GymZoneId;
  x: number; // Percentage relative to floor canvas (0-100)
  y: number; // Percentage relative to floor canvas (0-100)
  status: EquipmentStatus;
  hoursLogged: number;
  maintenanceNotes?: string;
  highlighted?: boolean;
}

export interface GymZoneInfo {
  id: GymZoneId;
  name: string;
  code: string;
  description: string;
  capacity: number;
  currentOccupancy: number;
  color: string;
}

// 2. Class & Schedule Types
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface GymClass {
  id: string;
  title: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  zone: GymZoneId;
  zoneName: string;
  timeSlot: string; // e.g. "06:30 - 07:30"
  dayOfWeek: DayOfWeek;
  capacity: number;
  bookedCount: number;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  hasConflict?: boolean;
  conflictReason?: string;
}

export interface GymTrainer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
  hourlyRate: number;
  availableDays: DayOfWeek[];
  activeHoursWeekly: number;
}

// 3. Member & Churn Intelligence Types
export type MembershipTier = 'standard' | 'premium_black' | 'executive';
export type ChurnRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface XAIDiagnosticInfo {
  overallScore: number;
  riskLevel: ChurnRiskLevel;
  primaryRiskDriver: string;
  recencyDropPercent: number; // e.g. 70%
  inactiveDays: number; // e.g. 16 days
  attendanceDropPct: number; // e.g. 65%
  riskFactors: string[];
  recommendedIntervention: string;
  confidenceScore: number; // e.g. 94.2%
}

export interface GymMember {
  id: string;
  name: string;
  avatar: string;
  tier: MembershipTier;
  churnRiskScore: number; // 0 - 100%
  riskLevel: ChurnRiskLevel;
  lastVisitDaysAgo: number;
  monthlySpend: number;
  favoriteClass: string;
  email: string;
  phone?: string;
  status?: 'active' | 'at_risk' | 'churned';
  notes?: string;
  xaiDiagnostics?: XAIDiagnosticInfo;
}

// 4. Retention Campaign Types
export type RetentionOfferType =
  | 'smoothie_voucher'
  | 'pt_session'
  | 'membership_discount'
  | 'guest_pass';

export interface RetentionCampaignQueue {
  id: string;
  createdAt: string;
  targetMemberIds: string[];
  targetMemberNames: string[];
  offerType: RetentionOfferType;
  discountPercent?: number;
  generatedMessage: string;
  status: 'draft' | 'dispatched';
}

// 5. Telemetry & Financial Sandbox Types
export interface FacilityTelemetry {
  currentOccupancy: number;
  maxCapacity: number;
  activeMembersCount: number;
  mrr: number; // Monthly Recurring Revenue ($)
  equipmentUptimePct: number; // Percentage (e.g. 96.5%)
  highRiskChurnCount: number;
  peakHourForecast: string;
  hvacStatus: 'optimal_68f' | 'cooling_surge' | 'eco_mode';
  lightingStatus: 'tactical_obsidian' | 'competition_pulse' | 'standard';
}

export interface RevenueSimulationState {
  baseMRR: number;
  projectedMRR: number;
  priceAdjustmentPercent: number; // e.g. +5%
  classCapacityDelta: number; // e.g. +4 spots
  churnReductionTargetPct: number; // e.g. -20% churn
}

// 6. WebMCP Tool Telemetry Logger
export interface WebMCPToolExecutionLog {
  id: string;
  timestamp: string;
  toolName: string;
  parameters: any;
  result: any;
  status: 'success' | 'error';
  latencyMs: number;
}
