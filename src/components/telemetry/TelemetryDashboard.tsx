'use client';

import React from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { StatCard } from '@/components/layout/StatCard';
import { RevenueSimulator } from './RevenueSimulator';
import { DollarSign, Users, Wrench, ShieldAlert, Activity, Flame, ShieldCheck } from 'lucide-react';

export function TelemetryDashboard() {
  const { telemetry, zones, equipment, members } = useGymStore();

  const atRiskCount = members.filter((m) => m.riskLevel === 'high' || m.riskLevel === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Top Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Recurring Revenue"
          value={`$${telemetry.mrr.toLocaleString()}`}
          subValue="+8.4% vs last mo"
          icon={DollarSign}
          accentColor="orange"
        />
        <StatCard
          label="Live Floor Headcount"
          value={`${telemetry.currentOccupancy} / ${telemetry.maxCapacity}`}
          subValue="57% Peak Load"
          icon={Users}
          accentColor="cyan"
        />
        <StatCard
          label="Equipment Health Score"
          value={`${telemetry.equipmentUptimePct}%`}
          subValue={`${equipment.filter((e) => e.status === 'maintenance').length} in repair`}
          icon={Wrench}
          accentColor={telemetry.equipmentUptimePct > 90 ? 'emerald' : 'amber'}
        />
        <StatCard
          label="At-Risk Churn Alerts"
          value={atRiskCount}
          subValue="Action Required"
          icon={ShieldAlert}
          accentColor="red"
        />
      </div>

      {/* Financial Simulation Engine */}
      <RevenueSimulator />

      {/* Zone Occupancy Matrix */}
      <div className="stark-card rounded-2xl p-6 border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-stark-cyan" />
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Real-Time Zone Telemetry & Heatmap
            </h4>
          </div>
          <span className="text-xs font-mono text-gray-400">
            5 ZONES MONITORED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {zones.map((zone) => {
            const occupancyPct = Math.round((zone.currentOccupancy / zone.capacity) * 100);
            return (
              <div key={zone.id} className="p-3.5 rounded-xl bg-surface-100 border border-border-subtle">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-white">{zone.code}</span>
                  <span style={{ color: zone.color }} className="font-bold">{occupancyPct}%</span>
                </div>
                <p className="text-[11px] font-mono text-gray-400 truncate mb-2">
                  {zone.name}
                </p>
                <div className="w-full h-1.5 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    style={{ width: `${occupancyPct}%`, backgroundColor: zone.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
