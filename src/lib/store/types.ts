// ==============================================================================
// 🏛️ VIERNES TYPE DEFINITIONS & PROTOCOL INTERFACES
// ==============================================================================

// 1. Spatial & Floor Plan Types
export type EquipmentStatus = 'operational' | 'maintenance' | 'reserved' | 'in_use';
export type GymZoneId = 'zone_a_racks' | 'zone_b_freeweights' | 'zone_c_turf' | 'zone_d_cardio' | 'zone_e_recovery';

export interface GymEquipment {
  id: string; // e.g., "RACK-01", "CABLE-02", "TREADMILL-03"
  name: string;
  category: 'strength' | 'cardio' | 'functional' | 'recovery';
  zone: GymZoneId;
  x: number; // Percent on 2D canvas (0 - 100)
  y: number; // Percent on 2D canvas (0 - 100)
  status: EquipmentStatus;
  hoursLogged: number;
  maintenanceNotes?: string;
  highlighted?: boolean; // Set true when AI agent is interacting
  lastInspected?: string;
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
  timeSlot: string; // e.g. "07:00 - 08:00", "17:30 - 18:30"
  dayOfWeek: DayOfWeek;
  capacity: number;
  bookedCount: number;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  hasConflict?: boolean;
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
  phone: string;
  status: 'active' | 'at_risk' | 'churned';
  notes?: string;
}

// 4. Retention Campaign Types
export type RetentionOfferType = 'smoothie_voucher' | 'pt_session' | 'membership_discount' | 'guest_pass';

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
  mrr: number; // Monthly Recurring Revenue ($)
  equipmentUptimePct: number;
  churnRatePct: number;
  activeMembersCount: number;
}

export interface RevenueSimulationState {
  baseMRR: number;
  projectedMRR: number;
  priceAdjustmentPercent: number;
  classCapacityDelta: number;
  churnReductionTargetPct: number;
}

// 6. WebMCP Tool Telemetry Logs
export interface WebMCPToolExecutionLog {
  id: string;
  timestamp: string;
  toolName: string;
  parameters: Record<string, any>;
  result: Record<string, any>;
  status: 'success' | 'error';
  latencyMs: number;
}
