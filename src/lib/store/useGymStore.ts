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

interface GymState {
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

  // Actions
  setActiveTab: (tab: DashboardTab) => void;
  setSelectedEquipment: (equipment: GymEquipment | null) => void;
  setIsAiProcessing: (processing: boolean) => void;
  resetToFactoryDefaults: () => void;

  // Equipment Actions
  updateEquipmentStatus: (
    id: string,
    status: EquipmentStatus,
    notes?: string,
    targetZone?: GymZoneId
  ) => GymEquipment | null;
  highlightEquipment: (id: string, durationMs?: number) => void;
  moveEquipmentCoordinates: (id: string, x: number, y: number) => void;

  // Class Schedule Actions
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
  ) => { success: boolean; message: string; affectedClass?: GymClass };

  // Member & Retention Actions
  filterMembersByCohort: (riskLevel?: string, inactiveDaysMin?: number, tier?: string) => GymMember[];
  launchRetentionCampaign: (
    memberIds: string[],
    offerType: RetentionOfferType,
    discountPercent?: number,
    customMessage?: string
  ) => RetentionCampaignQueue;
  dismissCampaignQueue: () => void;

  // Telemetry & Simulation Actions
  simulateRevenueForecast: (
    priceAdjustmentPercent?: number,
    classCapacityDelta?: number,
    churnReductionTargetPct?: number
  ) => RevenueSimulationState;

  // Logger
  logToolExecution: (log: Omit<WebMCPToolExecutionLog, 'id' | 'timestamp'>) => void;
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

      updateEquipmentStatus: (id, status, notes, targetZone) => {
        let updatedItem: GymEquipment | null = null;
        set((state) => {
          const equipment = state.equipment.map((item) => {
            if (item.id === id || item.name.toLowerCase().includes(id.toLowerCase())) {
              updatedItem = {
                ...item,
                status,
                maintenanceNotes: notes !== undefined ? notes : item.maintenanceNotes,
                zone: targetZone || item.zone,
                highlighted: true,
              };
              return updatedItem;
            }
            return item;
          });

          // Recalculate equipment uptime %
          const operationalCount = equipment.filter(
            (e) => e.status === 'operational' || e.status === 'in_use'
          ).length;
          const uptimePct = Number(((operationalCount / equipment.length) * 100).toFixed(1));

          return {
            equipment,
            telemetry: { ...state.telemetry, equipmentUptimePct: uptimePct },
          };
        });

        // Auto-remove highlight after 4 seconds
        if (updatedItem) {
          setTimeout(() => {
            set((state) => ({
              equipment: state.equipment.map((e) =>
                e.id === (updatedItem as GymEquipment).id ? { ...e, highlighted: false } : e
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

      manageClassSchedule: (action, payload) => {
        const { classes, trainers, zones } = get();

        if (action === 'reschedule' && payload.classId) {
          const targetClass = classes.find((c) => c.id === payload.classId);
          if (!targetClass) return { success: false, message: `Class ${payload.classId} not found.` };

          const updatedZone = payload.zone ? zones.find((z) => z.id === payload.zone) : undefined;
          const updatedClasses = classes.map((c) => {
            if (c.id === payload.classId) {
              return {
                ...c,
                timeSlot: payload.timeSlot || c.timeSlot,
                zone: payload.zone || c.zone,
                zoneName: updatedZone ? updatedZone.name : c.zoneName,
                capacity: payload.capacity || c.capacity,
              };
            }
            return c;
          });

          set({ classes: updatedClasses });
          return {
            success: true,
            message: `Rescheduled ${targetClass.title} to ${payload.timeSlot || targetClass.timeSlot}`,
            affectedClass: updatedClasses.find((c) => c.id === payload.classId),
          };
        }

        if (action === 'reassign_trainer' && payload.classId && payload.trainerId) {
          const trainer = trainers.find(
            (t) => t.id === payload.trainerId || t.name.toLowerCase().includes(payload.trainerId!.toLowerCase())
          );
          if (!trainer) return { success: false, message: `Trainer ${payload.trainerId} not found.` };

          const updatedClasses = classes.map((c) => {
            if (c.id === payload.classId) {
              return {
                ...c,
                trainerId: trainer.id,
                trainerName: trainer.name,
                trainerAvatar: trainer.avatar,
              };
            }
            return c;
          });

          set({ classes: updatedClasses });
          return {
            success: true,
            message: `Reassigned Coach ${trainer.name} to class.`,
            affectedClass: updatedClasses.find((c) => c.id === payload.classId),
          };
        }

        if (action === 'create' && payload.title) {
          const trainer = trainers.find((t) => t.id === payload.trainerId) || trainers[0];
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
          return { success: true, message: `Created new class: ${newClass.title}`, affectedClass: newClass };
        }

        return { success: false, message: `Action ${action} could not be completed.` };
      },

      filterMembersByCohort: (riskLevel, inactiveDaysMin, tier) => {
        const { members } = get();
        return members.filter((m) => {
          if (riskLevel && riskLevel !== 'all' && m.riskLevel !== riskLevel) return false;
          if (inactiveDaysMin && m.lastVisitDaysAgo < inactiveDaysMin) return false;
          if (tier && tier !== 'all' && m.tier !== tier) return false;
          return true;
        });
      },

      launchRetentionCampaign: (memberIds, offerType, discountPercent = 20, customMessage) => {
        const { members } = get();
        const targeted = members.filter((m) => memberIds.includes(m.id));
        const targetNames = targeted.map((m) => m.name);
        const firstMember = targeted[0];
        const firstName = targeted.length === 1 && firstMember ? firstMember.name.split(' ')[0] : 'there';
        const favoriteClassText = targeted.length === 1 && firstMember?.favoriteClass ? ` around your ${firstMember.favoriteClass} schedule` : '';

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

      dismissCampaignQueue: () => set({ campaignQueue: null }),

      simulateRevenueForecast: (
        priceAdjustmentPercent = 0,
        classCapacityDelta = 0,
        churnReductionTargetPct = 0
      ) => {
        const { telemetry } = get();
        const baseMRR = telemetry.mrr;

        // Financial sensitivity calculation
        const priceFactor = 1 + priceAdjustmentPercent / 100;
        const capacityRevenueBoost = classCapacityDelta * 149 * 4;
        const churnSavedRevenue = (baseMRR * (churnReductionTargetPct / 100)) * 0.8;

        const projectedMRR = Math.round(baseMRR * priceFactor + capacityRevenueBoost + churnSavedRevenue);

        const simulation: RevenueSimulationState = {
          baseMRR,
          projectedMRR,
          priceAdjustmentPercent,
          classCapacityDelta,
          churnReductionTargetPct,
        };

        set({ simulation });
        return simulation;
      },

      logToolExecution: (log) => {
        const newEntry: WebMCPToolExecutionLog = {
          ...log,
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
        set((state) => ({
          toolExecutionLogs: [newEntry, ...state.toolExecutionLogs.slice(0, 19)],
        }));
      },
    }),
    {
      name: 'viernes-gym-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        equipment: state.equipment,
        classes: state.classes,
        members: state.members,
        telemetry: state.telemetry,
        simulation: state.simulation,
      }),
    }
  )
);
