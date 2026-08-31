import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GymEquipment,
  GymZoneInfo,
  GymTrainer,
  GymClass,
  GymMember,
  FacilityTelemetry,
  RevenueSimulationState,
  RetentionCampaignQueue,
  WebMCPToolExecutionLog,
  EquipmentStatus,
  GymZoneId,
  RetentionOfferType,
} from './types';
import {
  INITIAL_EQUIPMENT,
  INITIAL_ZONES,
  INITIAL_TRAINERS,
  INITIAL_CLASSES,
  INITIAL_MEMBERS,
  INITIAL_TELEMETRY,
} from './seedData';

export type DashboardTab = 'floor' | 'schedule' | 'members' | 'telemetry';

export interface RescheduleClassResult {
  success: boolean;
  message: string;
  affectedClass?: GymClass;
}

export interface GymState {
  // Data Collections
  equipment: GymEquipment[];
  zones: GymZoneInfo[];
  trainers: GymTrainer[];
  classes: GymClass[];
  members: GymMember[];
  telemetry: FacilityTelemetry;
  simulation: RevenueSimulationState;

  // Active UI Navigation & Selection
  activeTab: DashboardTab;
  selectedEquipment: GymEquipment | null;
  campaignQueue: RetentionCampaignQueue | null;
  toolExecutionLogs: WebMCPToolExecutionLog[];
  isAiProcessing: boolean;

  // UI Actions
  setActiveTab: (tab: DashboardTab) => void;
  setSelectedEquipment: (equipment: GymEquipment | null) => void;
  setIsAiProcessing: (processing: boolean) => void;
  resetToFactoryDefaults: () => void;

  // Equipment Actions
  updateEquipmentStatus: (
    equipmentId: string,
    status: EquipmentStatus,
    notes?: string,
    zone?: GymZoneId
  ) => GymEquipment | null;
  highlightEquipment: (id: string, durationMs?: number) => void;
  moveEquipmentCoordinates: (id: string, x: number, y: number) => void;

  // Class & Schedule Actions
  rescheduleClass: (
    classId: string,
    trainerId?: string,
    timeSlot?: string,
    room?: GymZoneId,
    capacity?: number
  ) => RescheduleClassResult;

  autoResolveConflict: (classId: string) => RescheduleClassResult;

  manageClassSchedule: (
    action: 'create' | 'reschedule' | 'cancel' | 'reassign_trainer',
    payload: {
      classId?: string;
      title?: string;
      trainerId?: string;
      timeSlot?: string;
      zone?: GymZoneId;
      capacity?: number;
    }
  ) => RescheduleClassResult;

  // Member & Retention Actions
  filterMembersByCohort: (
    riskLevel?: string,
    inactiveDaysMin?: number,
    tier?: string
  ) => GymMember[];

  queueRetentionCampaign: (
    memberIds: string[],
    offerType: RetentionOfferType,
    discountPercent?: number,
    customMessage?: string
  ) => RetentionCampaignQueue;

  launchRetentionCampaign: (
    memberIds: string[],
    offerType: RetentionOfferType,
    discountPercent?: number,
    customMessage?: string
  ) => RetentionCampaignQueue;

  dismissCampaignQueue: () => void;

  // Revenue Simulation Actions
  simulateRevenue: (
    priceAdjustment?: number,
    capacityDelta?: number,
    churnReductionPct?: number
  ) => RevenueSimulationState;

  simulateRevenueForecast: (
    priceAdjustmentPercent?: number,
    classCapacityDelta?: number,
    churnReductionTargetPct?: number
  ) => RevenueSimulationState;

  // Telemetry Logger
  appendToolLog: (
    log: Omit<WebMCPToolExecutionLog, 'id' | 'timestamp'> | WebMCPToolExecutionLog
  ) => void;

  logToolExecution: (
    log: Omit<WebMCPToolExecutionLog, 'id' | 'timestamp'> | WebMCPToolExecutionLog
  ) => void;
}

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      equipment: INITIAL_EQUIPMENT,
      zones: INITIAL_ZONES,
      trainers: INITIAL_TRAINERS,
      classes: INITIAL_CLASSES,
      members: INITIAL_MEMBERS,
      telemetry: INITIAL_TELEMETRY,
      simulation: {
        baseMRR: INITIAL_TELEMETRY.mrr,
        projectedMRR: INITIAL_TELEMETRY.mrr,
        priceAdjustmentPercent: 0,
        classCapacityDelta: 0,
        churnReductionTargetPct: 0,
      },

      activeTab: 'floor',
      selectedEquipment: null,
      campaignQueue: null,
      toolExecutionLogs: [],
      isAiProcessing: false,

      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedEquipment: (selectedEquipment) => set({ selectedEquipment }),
      setIsAiProcessing: (isAiProcessing) => set({ isAiProcessing }),

      resetToFactoryDefaults: () =>
        set({
          equipment: INITIAL_EQUIPMENT,
          zones: INITIAL_ZONES,
          trainers: INITIAL_TRAINERS,
          classes: INITIAL_CLASSES,
          members: INITIAL_MEMBERS,
          telemetry: INITIAL_TELEMETRY,
          toolExecutionLogs: [],
          campaignQueue: null,
          simulation: {
            baseMRR: INITIAL_TELEMETRY.mrr,
            projectedMRR: INITIAL_TELEMETRY.mrr,
            priceAdjustmentPercent: 0,
            classCapacityDelta: 0,
            churnReductionTargetPct: 0,
          },
        }),

      // 1. updateEquipmentStatus(equipmentId, status, notes, zone)
      // Automatically sets highlighted: true and clears it after 4 seconds (4000ms)
      updateEquipmentStatus: (equipmentId, status, notes, zone) => {
        let updatedItem: GymEquipment | null = null;
        set((state) => {
          const equipment = state.equipment.map((item) => {
            if (
              item.id === equipmentId ||
              item.name.toLowerCase().includes(equipmentId.toLowerCase()) ||
              item.id.toLowerCase() === equipmentId.toLowerCase()
            ) {
              updatedItem = {
                ...item,
                status,
                maintenanceNotes: notes !== undefined ? notes : item.maintenanceNotes,
                zone: zone || item.zone,
                highlighted: true,
              };
              return updatedItem;
            }
            return item;
          });

          // Recalculate facility equipment uptime %
          const operationalCount = equipment.filter(
            (e) => e.status === 'operational' || e.status === 'in_use'
          ).length;
          const uptimePct = Number(((operationalCount / equipment.length) * 100).toFixed(1));

          return {
            equipment,
            telemetry: { ...state.telemetry, equipmentUptimePct: uptimePct },
          };
        });

        // Async setTimeout: Auto-turn off orange pulse radar highlight after 4 seconds (4000ms)
        if (updatedItem) {
          const targetId = (updatedItem as GymEquipment).id;
          setTimeout(() => {
            set((state) => ({
              equipment: state.equipment.map((e) =>
                e.id === targetId ? { ...e, highlighted: false } : e
              ),
            }));
          }, 4000);
        }

        return updatedItem;
      },

      highlightEquipment: (id, durationMs = 4000) => {
        set((state) => ({
          equipment: state.equipment.map((e) =>
            e.id === id || e.name.toLowerCase().includes(id.toLowerCase())
              ? { ...e, highlighted: true }
              : e
          ),
        }));
        setTimeout(() => {
          set((state) => ({
            equipment: state.equipment.map((e) =>
              e.id === id || e.name.toLowerCase().includes(id.toLowerCase())
                ? { ...e, highlighted: false }
                : e
            ),
          }));
        }, durationMs);
      },

      moveEquipmentCoordinates: (id, x, y) => {
        set((state) => ({
          equipment: state.equipment.map((e) => (e.id === id ? { ...e, x, y } : e)),
        }));
      },

      // 2. rescheduleClass(classId, trainerId, timeSlot, room, capacity)
      rescheduleClass: (classId, trainerId, timeSlot, room, capacity) => {
        const { classes, trainers, zones } = get();

        const targetClass = classes.find(
          (c) => c.id === classId || c.title.toLowerCase().includes(classId.toLowerCase())
        );

        if (!targetClass) {
          return {
            success: false,
            message: `Validation Error: Class "${classId}" not found in current timetable.`,
          };
        }

        const newTimeSlot = timeSlot || targetClass.timeSlot;
        const newZoneId = room || targetClass.zone;
        const newTrainerId = trainerId || targetClass.trainerId;
        const newCapacity = capacity !== undefined ? capacity : targetClass.capacity;

        // Validation A: Room Capacity Check
        const targetZone = zones.find((z) => z.id === newZoneId);
        if (targetZone && newCapacity > targetZone.capacity) {
          return {
            success: false,
            message: `Validation Error: Requested capacity (${newCapacity}) exceeds maximum room capacity for ${targetZone.name} (${targetZone.capacity}).`,
          };
        }

        // Validation B: Trainer Double-Booking Check
        const targetTrainer = trainers.find(
          (t) =>
            t.id === newTrainerId ||
            t.name.toLowerCase().includes(newTrainerId.toLowerCase())
        );

        if (targetTrainer) {
          const conflictingClass = classes.find(
            (c) =>
              c.id !== targetClass.id &&
              c.trainerId === targetTrainer.id &&
              c.timeSlot === newTimeSlot &&
              c.dayOfWeek === targetClass.dayOfWeek
          );

          if (conflictingClass) {
            return {
              success: false,
              message: `Validation Error: Coach ${targetTrainer.name} is already booked for class "${conflictingClass.title}" (${conflictingClass.id}) during time slot ${newTimeSlot}.`,
            };
          }
        }

        // Apply mutation & clear conflict flag
        let updatedClass: GymClass | undefined;
        const updatedClasses = classes.map((c) => {
          if (c.id === targetClass.id) {
            updatedClass = {
              ...c,
              timeSlot: newTimeSlot,
              zone: newZoneId,
              zoneName: targetZone ? targetZone.name : c.zoneName,
              trainerId: targetTrainer ? targetTrainer.id : c.trainerId,
              trainerName: targetTrainer ? targetTrainer.name : c.trainerName,
              trainerAvatar: targetTrainer ? targetTrainer.avatar : c.trainerAvatar,
              capacity: newCapacity,
              hasConflict: false,
              conflictReason: undefined,
            };
            return updatedClass;
          }
          return c;
        });

        set({ classes: updatedClasses });

        return {
          success: true,
          message: `Class ${targetClass.title} (${targetClass.id}) successfully rescheduled to ${newTimeSlot} in ${
            targetZone?.name || newZoneId
          } led by Coach ${targetTrainer?.name || targetClass.trainerName}.`,
          affectedClass: updatedClass,
        };
      },

      // 3. autoResolveConflict(classId: string)
      autoResolveConflict: (classId: string) => {
        const { classes, trainers, zones } = get();

        const targetClass = classes.find(
          (c) => c.id === classId || c.title.toLowerCase().includes(classId.toLowerCase())
        );

        if (!targetClass) {
          return {
            success: false,
            message: `Auto-Resolve Error: Class "${classId}" not found.`,
          };
        }

        // Step A: Search for substitute trainer available at this time slot & day
        const substituteTrainer = trainers.find((t) => {
          // Must be available on this day
          if (!t.availableDays.includes(targetClass.dayOfWeek)) return false;
          // Must NOT have another class at the same timeSlot & dayOfWeek
          const busy = classes.some(
            (c) =>
              c.id !== targetClass.id &&
              c.trainerId === t.id &&
              c.timeSlot === targetClass.timeSlot &&
              c.dayOfWeek === targetClass.dayOfWeek
          );
          return !busy;
        });

        if (substituteTrainer) {
          let updatedClass: GymClass | undefined;
          const updatedClasses = classes.map((c) => {
            if (c.id === targetClass.id) {
              updatedClass = {
                ...c,
                trainerId: substituteTrainer.id,
                trainerName: substituteTrainer.name,
                trainerAvatar: substituteTrainer.avatar,
                hasConflict: false,
                conflictReason: undefined,
              };
              return updatedClass;
            }
            return c;
          });

          set({ classes: updatedClasses });
          return {
            success: true,
            message: `Auto-Resolved Conflict for ${targetClass.title}: Reassigned lead coach to ${substituteTrainer.name} (${substituteTrainer.role}).`,
            affectedClass: updatedClass,
          };
        }

        // Step B: Search for alternative room / zone with sufficient capacity
        const substituteZone = zones.find((z) => {
          if (z.id === targetClass.zone) return false;
          return z.capacity >= targetClass.capacity;
        });

        if (substituteZone) {
          let updatedClass: GymClass | undefined;
          const updatedClasses = classes.map((c) => {
            if (c.id === targetClass.id) {
              updatedClass = {
                ...c,
                zone: substituteZone.id,
                zoneName: substituteZone.name,
                hasConflict: false,
                conflictReason: undefined,
              };
              return updatedClass;
            }
            return c;
          });

          set({ classes: updatedClasses });
          return {
            success: true,
            message: `Auto-Resolved Conflict for ${targetClass.title}: Reallocated to ${substituteZone.name} (Max ${substituteZone.capacity} spots).`,
            affectedClass: updatedClass,
          };
        }

        return {
          success: false,
          message: `Auto-Resolve Failed for ${targetClass.title}: No available substitute trainer or alternative room matching required capacity.`,
        };
      },

      manageClassSchedule: (action, payload) => {
        const { classes, trainers, zones } = get();

        if (action === 'reschedule' || action === 'reassign_trainer') {
          if (payload.classId) {
            return get().rescheduleClass(
              payload.classId,
              payload.trainerId,
              payload.timeSlot,
              payload.zone,
              payload.capacity
            );
          }
        }

        if (action === 'create' && payload.title) {
          const trainer =
            trainers.find(
              (t) =>
                t.id === payload.trainerId ||
                t.name.toLowerCase().includes((payload.trainerId || '').toLowerCase())
            ) || trainers[0];
          const zone = zones.find((z) => z.id === payload.zone) || zones[0];
          const newClass: GymClass = {
            id: `CLS-${Math.floor(100 + Math.random() * 900)}`,
            title: payload.title,
            trainerId: trainer.id,
            trainerName: trainer.name,
            trainerAvatar: trainer.avatar,
            zone: zone.id,
            zoneName: zone.name,
            timeSlot: payload.timeSlot || '17:30 - 18:30',
            dayOfWeek: 'thu',
            capacity: payload.capacity || 16,
            bookedCount: 1,
            intensity: 'high',
          };

          set({ classes: [newClass, ...classes] });
          return {
            success: true,
            message: `Created new class: ${newClass.title} (${newClass.id})`,
            affectedClass: newClass,
          };
        }

        return { success: false, message: `Action "${action}" could not be completed.` };
      },

      filterMembersByCohort: (riskLevel, inactiveDaysMin, tier) => {
        const { members } = get();
        return members.filter((m) => {
          if (riskLevel && riskLevel !== 'all' && m.riskLevel !== riskLevel) return false;
          if (inactiveDaysMin !== undefined && m.lastVisitDaysAgo < inactiveDaysMin) return false;
          if (tier && tier !== 'all' && m.tier !== tier) return false;
          return true;
        });
      },

      // 4. queueRetentionCampaign(memberIds, offerType, discountPercent)
      queueRetentionCampaign: (memberIds, offerType, discountPercent = 20, customMessage) => {
        const { members } = get();
        const targeted = members.filter((m) => memberIds.includes(m.id));
        const targetNames = targeted.map((m) => m.name);
        const firstMember = targeted[0];
        const firstName =
          targeted.length === 1 && firstMember ? firstMember.name.split(' ')[0] : 'there';
        const favoriteClassText =
          targeted.length === 1 && firstMember?.favoriteClass
            ? ` around your ${firstMember.favoriteClass} schedule`
            : '';

        let defaultMsg = '';
        switch (offerType) {
          case 'smoothie_voucher':
            defaultMsg = `Hey ${firstName}! We miss seeing you at Viernes. Your next post-workout protein smoothie at the Fuel Bar is 100% on us! Claim your voucher in the app.`;
            break;
          case 'pt_session':
            defaultMsg = `Hi ${firstName}, let's get you back on track! You've unlocked a complimentary 1-on-1 technique & recovery check-in with Coach Marcus this week${favoriteClassText}.`;
            break;
          case 'membership_discount':
            defaultMsg = `Special VIP renewal offer for ${firstName}: Enjoy ${discountPercent}% off your next 3 months of unlimited training at Viernes. Valid until Sunday!`;
            break;
          case 'guest_pass':
            defaultMsg = `Hey ${firstName}! Bring your workout partner—you have 2 free VIP Weekend Guest Passes loaded to your member account.`;
            break;
        }

        const campaign: RetentionCampaignQueue = {
          id: `CMP-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          targetMemberIds: memberIds,
          targetMemberNames: targetNames,
          offerType,
          discountPercent,
          generatedMessage: customMessage || defaultMsg,
          status: 'draft',
        };

        set({ campaignQueue: campaign, activeTab: 'members' });
        return campaign;
      },

      launchRetentionCampaign: (memberIds, offerType, discountPercent, customMessage) => {
        return get().queueRetentionCampaign(memberIds, offerType, discountPercent, customMessage);
      },

      dismissCampaignQueue: () => set({ campaignQueue: null }),

      // 5. simulateRevenue(priceAdjustment, capacityDelta, churnReductionPct)
      simulateRevenue: (
        priceAdjustment = 0,
        capacityDelta = 0,
        churnReductionPct = 0
      ) => {
        const { telemetry } = get();
        const baseMRR = telemetry.mrr;

        // Financial sensitivity model calculations
        const priceFactor = 1 + priceAdjustment / 100;
        const capacityRevenueBoost = capacityDelta * 149 * 4;
        const churnSavedRevenue = baseMRR * (churnReductionPct / 100) * 0.8;

        const projectedMRR = Math.round(
          baseMRR * priceFactor + capacityRevenueBoost + churnSavedRevenue
        );

        const simulation: RevenueSimulationState = {
          baseMRR,
          projectedMRR,
          priceAdjustmentPercent: priceAdjustment,
          classCapacityDelta: capacityDelta,
          churnReductionTargetPct: churnReductionPct,
        };

        set({ simulation });
        return simulation;
      },

      simulateRevenueForecast: (priceAdjustmentPercent, classCapacityDelta, churnReductionTargetPct) => {
        return get().simulateRevenue(
          priceAdjustmentPercent,
          classCapacityDelta,
          churnReductionTargetPct
        );
      },

      // 6. appendToolLog(log: ToolExecutionLog)
      appendToolLog: (log) => {
        const newEntry: WebMCPToolExecutionLog = {
          id: 'id' in log && log.id ? log.id : `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp:
            'timestamp' in log && log.timestamp
              ? log.timestamp
              : new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
          toolName: log.toolName,
          parameters: log.parameters,
          result: log.result,
          status: log.status,
          latencyMs: log.latencyMs,
        };
        set((state) => ({
          toolExecutionLogs: [newEntry, ...state.toolExecutionLogs.slice(0, 19)],
        }));
      },

      logToolExecution: (log) => {
        get().appendToolLog(log);
      },
    }),
    {
      name: 'viernes-gym-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        equipment: state.equipment,
        classes: state.classes,
        members: state.members,
        telemetry: state.telemetry,
        simulation: state.simulation,
        toolExecutionLogs: state.toolExecutionLogs,
      }),
    }
  )
);
