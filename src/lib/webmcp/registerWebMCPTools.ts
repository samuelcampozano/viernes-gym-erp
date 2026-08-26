import { useGymStore } from '../store/useGymStore';
import { EquipmentStatus, GymZoneId, RetentionOfferType } from '../store/types';

// Declaring the standard WebMCP document extension
declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: {
        name: string;
        description: string;
        inputSchema: Record<string, any>;
        execute: (input: any) => Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }>;
      }) => void;
    };
  }
}

export function registerAllWebMCPTools() {
  if (typeof window === 'undefined') return;

  const store = useGymStore.getState();

  // Helper to register either on document.modelContext or window mock
  const register = (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, any>;
    execute: (input: any) => Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }>;
  }) => {
    if (typeof document !== 'undefined' && 'modelContext' in document && document.modelContext?.registerTool) {
      document.modelContext.registerTool(tool);
    }
  };

  // 1. Tool: update_gym_floor_equipment
  register({
    name: 'update_gym_floor_equipment',
    description: 'Updates the operational status, repair notes, or spatial zone of equipment on the interactive 2D gym floor canvas.',
    inputSchema: {
      type: 'object',
      properties: {
        equipmentId: {
          type: 'string',
          description: 'Unique equipment identifier, e.g. "RACK-01", "BENCH-03", "CABLE-02", "CARDIO-03", "RECOVERY-01"',
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
    execute: async (input: { equipmentId: string; status: EquipmentStatus; notes?: string; targetZone?: GymZoneId }) => {
      const start = performance.now();
      const updated = useGymStore.getState().updateEquipmentStatus(input.equipmentId, input.status, input.notes, input.targetZone);

      useGymStore.getState().logToolExecution({
        toolName: 'update_gym_floor_equipment',
        parameters: input,
        result: { success: !!updated, updatedEquipment: updated },
        status: updated ? 'success' : 'error',
        latencyMs: Math.round(performance.now() - start),
      });

      if (!updated) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Equipment with ID "${input.equipmentId}" was not found on the gym floor.` }],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Equipment ${updated.id} (${updated.name}) updated to ${updated.status}.`,
              equipment: updated,
            }),
          },
        ],
      };
    },
  });

  // 2. Tool: manage_class_schedule
  register({
    name: 'manage_class_schedule',
    description: 'Reschedules, reassigns instructors to, creates, or adjusts room capacity for gym classes in the weekly timetable.',
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
        timeSlot: {
          type: 'string',
          description: 'New time slot, e.g. "17:30 - 18:30" or "06:30 - 07:30".',
        },
        trainerId: {
          type: 'string',
          description: 'Coach identifier (e.g. "TR-01", "TR-02", "TR-03", "TR-04", "TR-05") or coach name.',
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
    execute: async (input: { action: 'create' | 'reschedule' | 'cancel' | 'reassign_trainer'; classId?: string; timeSlot?: string; trainerId?: string; zone?: GymZoneId; capacity?: number }) => {
      const start = performance.now();
      const result = useGymStore.getState().manageClassSchedule(input.action, input);

      useGymStore.getState().logToolExecution({
        toolName: 'manage_class_schedule',
        parameters: input,
        result,
        status: result.success ? 'success' : 'error',
        latencyMs: Math.round(performance.now() - start),
      });

      return {
        isError: !result.success,
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    },
  });

  // 3. Tool: query_member_cohorts
  register({
    name: 'query_member_cohorts',
    description: 'Filters the active gym member database by churn risk level, days inactive, or membership tier.',
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
    execute: async (input: { riskLevel?: string; inactiveDaysMin?: number; tier?: string }) => {
      const start = performance.now();
      const matched = useGymStore.getState().filterMembersByCohort(input.riskLevel, input.inactiveDaysMin, input.tier);

      useGymStore.getState().logToolExecution({
        toolName: 'query_member_cohorts',
        parameters: input,
        result: { count: matched.length, members: matched.map((m) => ({ id: m.id, name: m.name, risk: m.churnRiskScore })) },
        status: 'success',
        latencyMs: Math.round(performance.now() - start),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              totalCount: matched.length,
              members: matched.map((m) => ({
                id: m.id,
                name: m.name,
                tier: m.tier,
                churnRisk: `${m.churnRiskScore}%`,
                lastVisitDaysAgo: m.lastVisitDaysAgo,
                monthlySpend: `$${m.monthlySpend}`,
                favoriteClass: m.favoriteClass,
              })),
            }),
          },
        ],
      };
    },
  });

  // 4. Tool: launch_retention_campaign
  register({
    name: 'launch_retention_campaign',
    description: 'Triggers a targeted personalized retention SMS/voucher campaign for high-risk churn members.',
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
    execute: async (input: { memberIds: string[]; offerType: RetentionOfferType; discountPercent?: number; customMessage?: string }) => {
      const start = performance.now();
      const campaign = useGymStore.getState().launchRetentionCampaign(input.memberIds, input.offerType, input.discountPercent, input.customMessage);

      useGymStore.getState().logToolExecution({
        toolName: 'launch_retention_campaign',
        parameters: input,
        result: campaign,
        status: 'success',
        latencyMs: Math.round(performance.now() - start),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              campaignId: campaign.id,
              targetedCount: campaign.targetMemberIds.length,
              messagePreview: campaign.generatedMessage,
            }),
          },
        ],
      };
    },
  });

  // 5. Tool: simulate_revenue_forecast
  register({
    name: 'simulate_revenue_forecast',
    description: 'Runs financial sensitivity models forecasting the impact of price adjustments, class expansions, and churn reduction on Monthly Recurring Revenue (MRR).',
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
    execute: async (input: { priceAdjustmentPercent?: number; classCapacityDelta?: number; churnReductionTargetPct?: number }) => {
      const start = performance.now();
      const sim = useGymStore.getState().simulateRevenueForecast(input.priceAdjustmentPercent, input.classCapacityDelta, input.churnReductionTargetPct);

      useGymStore.getState().logToolExecution({
        toolName: 'simulate_revenue_forecast',
        parameters: input,
        result: sim,
        status: 'success',
        latencyMs: Math.round(performance.now() - start),
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              baseMRR: `$${sim.baseMRR.toLocaleString()}`,
              projectedMRR: `$${sim.projectedMRR.toLocaleString()}`,
              monthlyRevenueDelta: `+$${(sim.projectedMRR - sim.baseMRR).toLocaleString()}`,
            }),
          },
        ],
      };
    },
  });

  // 6. Tool: get_facility_telemetry
  register({
    name: 'get_facility_telemetry',
    description: 'Returns real-time facility metrics including current floor occupancy, equipment uptime percentage, MRR, and churn rates.',
    inputSchema: {
      type: 'object',
      properties: {
        zoneId: {
          type: 'string',
          description: 'Optional specific zone ID to inspect.',
        },
      },
    },
    execute: async (input: { zoneId?: string }) => {
      const start = performance.now();
      const { telemetry, zones } = useGymStore.getState();

      const payload = {
        telemetry,
        zones: input.zoneId ? zones.filter((z) => z.id === input.zoneId) : zones,
      };

      useGymStore.getState().logToolExecution({
        toolName: 'get_facility_telemetry',
        parameters: input,
        result: payload,
        status: 'success',
        latencyMs: Math.round(performance.now() - start),
      });

      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
      };
    },
  });
}
