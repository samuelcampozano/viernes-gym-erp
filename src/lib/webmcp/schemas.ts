import { z } from 'zod';

// ============================================================================
// 1. ZOD SCHEMAS FOR RUNTIME VALIDATION
// ============================================================================

export const EquipmentStatusEnum = z.enum([
  'operational',
  'maintenance',
  'in_use',
  'reserved',
]);

export const GymZoneIdEnum = z.enum([
  'zone_a_racks',
  'zone_b_freeweights',
  'zone_c_turf',
  'zone_d_cardio',
  'zone_e_recovery',
]);

export const ScheduleActionEnum = z.enum([
  'create',
  'reschedule',
  'cancel',
  'reassign_trainer',
]);

export const CohortRiskLevelEnum = z.enum([
  'all',
  'low',
  'medium',
  'high',
  'critical',
]);

export const MembershipTierEnum = z.enum([
  'all',
  'standard',
  'premium_black',
  'executive',
]);

export const RetentionOfferTypeEnum = z.enum([
  'smoothie_voucher',
  'pt_session',
  'membership_discount',
  'guest_pass',
]);

/** 1. update_gym_floor_equipment */
export const UpdateGymFloorEquipmentSchema = z.object({
  equipmentId: z.string().min(1, 'equipmentId is required (e.g. BENCH-03, RACK-01)'),
  status: EquipmentStatusEnum,
  notes: z.string().optional(),
  targetZone: GymZoneIdEnum.optional(),
});
export type UpdateGymFloorEquipmentInput = z.infer<typeof UpdateGymFloorEquipmentSchema>;

/** 2. manage_class_schedule */
export const ManageClassScheduleSchema = z.object({
  action: ScheduleActionEnum,
  classId: z.string().optional(),
  title: z.string().optional(),
  trainerId: z.string().optional(),
  timeSlot: z.string().optional(),
  zone: GymZoneIdEnum.optional(),
  capacity: z.number().int().positive().optional(),
});
export type ManageClassScheduleInput = z.infer<typeof ManageClassScheduleSchema>;

/** 3. query_member_cohorts */
export const QueryMemberCohortsSchema = z.object({
  riskLevel: CohortRiskLevelEnum.optional().default('all'),
  inactiveDaysMin: z.number().nonnegative().optional(),
  tier: MembershipTierEnum.optional().default('all'),
});
export type QueryMemberCohortsInput = z.infer<typeof QueryMemberCohortsSchema>;

/** 4. launch_retention_campaign */
export const LaunchRetentionCampaignSchema = z.object({
  memberIds: z.array(z.string()).min(1, 'At least one member ID is required'),
  offerType: RetentionOfferTypeEnum,
  discountPercent: z.number().min(0).max(100).optional().default(20),
  customMessage: z.string().optional(),
});
export type LaunchRetentionCampaignInput = z.infer<typeof LaunchRetentionCampaignSchema>;

/** 5. simulate_revenue_forecast */
export const SimulateRevenueForecastSchema = z.object({
  priceAdjustmentPercent: z.number().optional().default(0),
  classCapacityDelta: z.number().optional().default(0),
  churnReductionTargetPct: z.number().min(0).max(100).optional().default(0),
});
export type SimulateRevenueForecastInput = z.infer<typeof SimulateRevenueForecastSchema>;

/** 6. get_facility_telemetry */
export const GetFacilityTelemetrySchema = z.object({
  zoneId: GymZoneIdEnum.optional(),
});
export type GetFacilityTelemetryInput = z.infer<typeof GetFacilityTelemetrySchema>;


// ============================================================================
// 2. WEBMCP JSON SCHEMAS (STANDARDIZED FOR REGISTERTOOL)
// ============================================================================

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const UPDATE_GYM_FLOOR_EQUIPMENT_TOOL: WebMCPToolDefinition = {
  name: 'update_gym_floor_equipment',
  description:
    'Updates the operational status, repair notes, or spatial zone of equipment on the interactive 2D gym floor canvas.',
  inputSchema: {
    type: 'object',
    properties: {
      equipmentId: {
        type: 'string',
        description:
          'Unique equipment identifier or search name, e.g. "BENCH-03", "RACK-01", "CABLE-02", "CARDIO-03", "RECOVERY-01"',
      },
      status: {
        type: 'string',
        enum: ['operational', 'maintenance', 'in_use', 'reserved'],
        description: 'The new operational status of the machine.',
      },
      notes: {
        type: 'string',
        description: 'Maintenance observation or repair reason.',
      },
      targetZone: {
        type: 'string',
        enum: ['zone_a_racks', 'zone_b_freeweights', 'zone_c_turf', 'zone_d_cardio', 'zone_e_recovery'],
        description: 'Optional target zone to move the equipment to.',
      },
    },
    required: ['equipmentId', 'status'],
  },
};

export const MANAGE_CLASS_SCHEDULE_TOOL: WebMCPToolDefinition = {
  name: 'manage_class_schedule',
  description:
    'Reschedules, reassigns instructors to, creates, or adjusts room capacity for gym classes in the weekly timetable.',
  inputSchema: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['create', 'reschedule', 'cancel', 'reassign_trainer'],
        description: 'The scheduling action to perform.',
      },
      classId: {
        type: 'string',
        description: 'The class identifier (e.g. "CLS-101", "CLS-104", "CLS-202").',
      },
      title: {
        type: 'string',
        description: 'Class title (required when action is "create").',
      },
      timeSlot: {
        type: 'string',
        description: 'Time slot, e.g. "17:30 - 18:30" or "06:30 - 07:30".',
      },
      trainerId: {
        type: 'string',
        description: 'Coach identifier (e.g. "TR-01", "TR-02") or coach name.',
      },
      zone: {
        type: 'string',
        enum: ['zone_a_racks', 'zone_b_freeweights', 'zone_c_turf', 'zone_d_cardio', 'zone_e_recovery'],
        description: 'The studio zone to host the class in.',
      },
      capacity: {
        type: 'number',
        description: 'Maximum attendee capacity for the class.',
      },
    },
    required: ['action'],
  },
};

export const QUERY_MEMBER_COHORTS_TOOL: WebMCPToolDefinition = {
  name: 'query_member_cohorts',
  description:
    'Filters the active gym member database by churn risk level, days inactive, or membership tier.',
  inputSchema: {
    type: 'object',
    properties: {
      riskLevel: {
        type: 'string',
        enum: ['all', 'low', 'medium', 'high', 'critical'],
        description: 'Filter by algorithmic churn risk score.',
      },
      inactiveDaysMin: {
        type: 'number',
        description: 'Minimum days since the member last checked into the facility.',
      },
      tier: {
        type: 'string',
        enum: ['all', 'standard', 'premium_black', 'executive'],
        description: 'Filter by membership tier.',
      },
    },
  },
};

export const LAUNCH_RETENTION_CAMPAIGN_TOOL: WebMCPToolDefinition = {
  name: 'launch_retention_campaign',
  description:
    'Triggers a targeted personalized retention SMS/voucher campaign for high-risk churn members.',
  inputSchema: {
    type: 'object',
    properties: {
      memberIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of target member IDs (e.g. ["MEM-001", "MEM-002"]).',
      },
      offerType: {
        type: 'string',
        enum: ['smoothie_voucher', 'pt_session', 'membership_discount', 'guest_pass'],
        description: 'The incentive perk to offer.',
      },
      discountPercent: {
        type: 'number',
        description: 'Percentage discount if offerType is membership_discount (e.g. 20 or 25).',
      },
      customMessage: {
        type: 'string',
        description: 'Optional custom message copy.',
      },
    },
    required: ['memberIds', 'offerType'],
  },
};

export const SIMULATE_REVENUE_FORECAST_TOOL: WebMCPToolDefinition = {
  name: 'simulate_revenue_forecast',
  description:
    'Runs financial sensitivity models forecasting the impact of price adjustments, class expansions, and churn reduction on Monthly Recurring Revenue (MRR).',
  inputSchema: {
    type: 'object',
    properties: {
      priceAdjustmentPercent: {
        type: 'number',
        description: 'Percentage adjustment to membership rates (-15 to +25%).',
      },
      classCapacityDelta: {
        type: 'number',
        description: 'Number of extra weekly class spots added.',
      },
      churnReductionTargetPct: {
        type: 'number',
        description: 'Target percentage reduction in member churn (e.g. 10, 20, 30%).',
      },
    },
  },
};

export const GET_FACILITY_TELEMETRY_TOOL: WebMCPToolDefinition = {
  name: 'get_facility_telemetry',
  description:
    'Returns real-time facility metrics including current floor occupancy, equipment uptime percentage, MRR, and churn rates.',
  inputSchema: {
    type: 'object',
    properties: {
      zoneId: {
        type: 'string',
        enum: ['zone_a_racks', 'zone_b_freeweights', 'zone_c_turf', 'zone_d_cardio', 'zone_e_recovery'],
        description: 'Optional specific zone ID to inspect.',
      },
    },
  },
};

export const ALL_WEBMCP_TOOLS = [
  UPDATE_GYM_FLOOR_EQUIPMENT_TOOL,
  MANAGE_CLASS_SCHEDULE_TOOL,
  QUERY_MEMBER_COHORTS_TOOL,
  LAUNCH_RETENTION_CAMPAIGN_TOOL,
  SIMULATE_REVENUE_FORECAST_TOOL,
  GET_FACILITY_TELEMETRY_TOOL,
];
