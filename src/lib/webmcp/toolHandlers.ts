import { useGymStore } from '../store/useGymStore';
import {
  UpdateGymFloorEquipmentSchema,
  ManageClassScheduleSchema,
  QueryMemberCohortsSchema,
  LaunchRetentionCampaignSchema,
  SimulateRevenueForecastSchema,
  GetFacilityTelemetrySchema,
} from './schemas';

export interface WebMCPResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * 1. update_gym_floor_equipment Handler
 */
export async function handleUpdateGymFloorEquipment(rawInput: unknown): Promise<WebMCPResult> {
  const startTime = performance.now();
  const parsed = UpdateGymFloorEquipmentSchema.safeParse(rawInput);

  if (!parsed.success) {
    const errorMsg = `Zod Validation Error: ${parsed.error.issues.map((i) => i.message).join(', ')}`;
    useGymStore.getState().appendToolLog({
      toolName: 'update_gym_floor_equipment',
      parameters: rawInput,
      result: { error: errorMsg },
      status: 'error',
      latencyMs: Math.round(performance.now() - startTime),
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const { equipmentId, status, notes, targetZone } = parsed.data;
  const updatedItem = useGymStore.getState().updateEquipmentStatus(equipmentId, status, notes, targetZone);
  const latencyMs = Math.round(performance.now() - startTime);

  if (!updatedItem) {
    const errorMsg = `Equipment "${equipmentId}" not found on gym floor canvas.`;
    useGymStore.getState().appendToolLog({
      toolName: 'update_gym_floor_equipment',
      parameters: parsed.data,
      result: { error: errorMsg },
      status: 'error',
      latencyMs,
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const resultPayload = {
    success: true,
    message: `Equipment ${updatedItem.id} (${updatedItem.name}) status changed to "${updatedItem.status}".`,
    equipment: updatedItem,
  };

  useGymStore.getState().appendToolLog({
    toolName: 'update_gym_floor_equipment',
    parameters: parsed.data,
    result: resultPayload,
    status: 'success',
    latencyMs,
  });

  return {
    content: [{ type: 'text', text: JSON.stringify(resultPayload) }],
  };
}

/**
 * 2. manage_class_schedule Handler
 */
export async function handleManageClassSchedule(rawInput: unknown): Promise<WebMCPResult> {
  const startTime = performance.now();
  const parsed = ManageClassScheduleSchema.safeParse(rawInput);

  if (!parsed.success) {
    const errorMsg = `Zod Validation Error: ${parsed.error.issues.map((i) => i.message).join(', ')}`;
    useGymStore.getState().appendToolLog({
      toolName: 'manage_class_schedule',
      parameters: rawInput,
      result: { error: errorMsg },
      status: 'error',
      latencyMs: Math.round(performance.now() - startTime),
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const { action, classId, trainerId, timeSlot, zone, capacity, title } = parsed.data;
  let scheduleResult: { success: boolean; message: string; affectedClass?: any };

  if (action === 'reschedule' || action === 'reassign_trainer') {
    scheduleResult = useGymStore.getState().rescheduleClass(
      classId || '',
      trainerId,
      timeSlot,
      zone,
      capacity
    );
  } else {
    scheduleResult = useGymStore.getState().manageClassSchedule(action, {
      classId,
      title,
      trainerId,
      timeSlot,
      zone,
      capacity,
    });
  }

  const latencyMs = Math.round(performance.now() - startTime);

  useGymStore.getState().appendToolLog({
    toolName: 'manage_class_schedule',
    parameters: parsed.data,
    result: scheduleResult,
    status: scheduleResult.success ? 'success' : 'error',
    latencyMs,
  });

  return {
    isError: !scheduleResult.success,
    content: [{ type: 'text', text: JSON.stringify(scheduleResult) }],
  };
}

/**
 * 3. query_member_cohorts Handler
 */
export async function handleQueryMemberCohorts(rawInput: unknown): Promise<WebMCPResult> {
  const startTime = performance.now();
  const parsed = QueryMemberCohortsSchema.safeParse(rawInput || {});

  if (!parsed.success) {
    const errorMsg = `Zod Validation Error: ${parsed.error.issues.map((i) => i.message).join(', ')}`;
    useGymStore.getState().appendToolLog({
      toolName: 'query_member_cohorts',
      parameters: rawInput,
      result: { error: errorMsg },
      status: 'error',
      latencyMs: Math.round(performance.now() - startTime),
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const { riskLevel, inactiveDaysMin, tier } = parsed.data;
  const members = useGymStore.getState().filterMembersByCohort(riskLevel, inactiveDaysMin, tier);
  const latencyMs = Math.round(performance.now() - startTime);

  const resultPayload = {
    totalCount: members.length,
    members: members.map((m) => ({
      id: m.id,
      name: m.name,
      tier: m.tier,
      churnRiskScore: `${m.churnRiskScore}%`,
      riskLevel: m.riskLevel,
      lastVisitDaysAgo: m.lastVisitDaysAgo,
      monthlySpend: `$${m.monthlySpend}`,
      favoriteClass: m.favoriteClass,
      email: m.email,
    })),
  };

  useGymStore.getState().appendToolLog({
    toolName: 'query_member_cohorts',
    parameters: parsed.data,
    result: { count: members.length, memberIds: members.map((m) => m.id) },
    status: 'success',
    latencyMs,
  });

  return {
    content: [{ type: 'text', text: JSON.stringify(resultPayload) }],
  };
}

/**
 * 4. launch_retention_campaign Handler
 */
export async function handleLaunchRetentionCampaign(rawInput: unknown): Promise<WebMCPResult> {
  const startTime = performance.now();
  const parsed = LaunchRetentionCampaignSchema.safeParse(rawInput);

  if (!parsed.success) {
    const errorMsg = `Zod Validation Error: ${parsed.error.issues.map((i) => i.message).join(', ')}`;
    useGymStore.getState().appendToolLog({
      toolName: 'launch_retention_campaign',
      parameters: rawInput,
      result: { error: errorMsg },
      status: 'error',
      latencyMs: Math.round(performance.now() - startTime),
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const { memberIds, offerType, discountPercent, customMessage } = parsed.data;
  const campaign = useGymStore.getState().queueRetentionCampaign(
    memberIds,
    offerType,
    discountPercent,
    customMessage
  );

  const latencyMs = Math.round(performance.now() - startTime);

  const resultPayload = {
    success: true,
    campaignId: campaign.id,
    targetedMembersCount: campaign.targetMemberIds.length,
    offerType: campaign.offerType,
    discountPercent: campaign.discountPercent,
    generatedMessagePreview: campaign.generatedMessage,
    status: campaign.status,
  };

  useGymStore.getState().appendToolLog({
    toolName: 'launch_retention_campaign',
    parameters: parsed.data,
    result: resultPayload,
    status: 'success',
    latencyMs,
  });

  return {
    content: [{ type: 'text', text: JSON.stringify(resultPayload) }],
  };
}

/**
 * 5. simulate_revenue_forecast Handler
 */
export async function handleSimulateRevenueForecast(rawInput: unknown): Promise<WebMCPResult> {
  const startTime = performance.now();
  const parsed = SimulateRevenueForecastSchema.safeParse(rawInput || {});

  if (!parsed.success) {
    const errorMsg = `Zod Validation Error: ${parsed.error.issues.map((i) => i.message).join(', ')}`;
    useGymStore.getState().appendToolLog({
      toolName: 'simulate_revenue_forecast',
      parameters: rawInput,
      result: { error: errorMsg },
      status: 'error',
      latencyMs: Math.round(performance.now() - startTime),
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const { priceAdjustmentPercent, classCapacityDelta, churnReductionTargetPct } = parsed.data;
  const simulation = useGymStore.getState().simulateRevenue(
    priceAdjustmentPercent,
    classCapacityDelta,
    churnReductionTargetPct
  );

  const latencyMs = Math.round(performance.now() - startTime);

  const resultPayload = {
    baseMRR: `$${simulation.baseMRR.toLocaleString()}`,
    projectedMRR: `$${simulation.projectedMRR.toLocaleString()}`,
    monthlyRevenueDelta: `$${(simulation.projectedMRR - simulation.baseMRR).toLocaleString()}`,
    parameters: {
      priceAdjustmentPercent: `${simulation.priceAdjustmentPercent}%`,
      classCapacityDelta: simulation.classCapacityDelta,
      churnReductionTargetPct: `${simulation.churnReductionTargetPct}%`,
    },
  };

  useGymStore.getState().appendToolLog({
    toolName: 'simulate_revenue_forecast',
    parameters: parsed.data,
    result: resultPayload,
    status: 'success',
    latencyMs,
  });

  return {
    content: [{ type: 'text', text: JSON.stringify(resultPayload) }],
  };
}

/**
 * 6. get_facility_telemetry Handler
 */
export async function handleGetFacilityTelemetry(rawInput: unknown): Promise<WebMCPResult> {
  const startTime = performance.now();
  const parsed = GetFacilityTelemetrySchema.safeParse(rawInput || {});

  if (!parsed.success) {
    const errorMsg = `Zod Validation Error: ${parsed.error.issues.map((i) => i.message).join(', ')}`;
    useGymStore.getState().appendToolLog({
      toolName: 'get_facility_telemetry',
      parameters: rawInput,
      result: { error: errorMsg },
      status: 'error',
      latencyMs: Math.round(performance.now() - startTime),
    });
    return {
      isError: true,
      content: [{ type: 'text', text: errorMsg }],
    };
  }

  const { telemetry, zones } = useGymStore.getState();
  const selectedZoneId = parsed.data?.zoneId;

  const resultPayload = {
    telemetry,
    activeZones: selectedZoneId ? zones.filter((z) => z.id === selectedZoneId) : zones,
  };

  const latencyMs = Math.round(performance.now() - startTime);

  useGymStore.getState().appendToolLog({
    toolName: 'get_facility_telemetry',
    parameters: parsed.data,
    result: resultPayload,
    status: 'success',
    latencyMs,
  });

  return {
    content: [{ type: 'text', text: JSON.stringify(resultPayload) }],
  };
}
