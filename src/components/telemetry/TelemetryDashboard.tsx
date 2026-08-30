'use client';

import React from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { StatCard } from '@/components/layout/StatCard';
import { RevenueSimulator } from './RevenueSimulator';
import {
  DollarSign,
  Users,
  Wrench,
  ShieldAlert,
  Activity,
  Flame,
  ShieldCheck,
  Wind,
  Thermometer,
  Zap,
  Volume2,
  Download,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export function TelemetryDashboard() {
  const { telemetry, zones, equipment, members } = useGymStore();

  const atRiskCount = members.filter((m) => m.riskLevel === 'high' || m.riskLevel === 'critical').length;

  // 24h Hourly Traffic Curve (6 AM - 10 PM)
  const hourlyTrafficData = [
    { time: '06:00', athletes: 32, loadPct: 32, isPeak: false },
    { time: '07:00', athletes: 68, loadPct: 68, isPeak: true },
    { time: '08:00', athletes: 54, loadPct: 54, isPeak: false },
    { time: '10:00', athletes: 38, loadPct: 38, isPeak: false },
    { time: '12:00', athletes: 62, loadPct: 62, isPeak: true },
    { time: '14:00', athletes: 35, loadPct: 35, isPeak: false },
    { time: '16:00', athletes: 48, loadPct: 48, isPeak: false },
    { time: '17:30', athletes: 88, loadPct: 88, isPeak: true },
    { time: '18:30', athletes: 94, loadPct: 94, isPeak: true },
    { time: '19:30', athletes: 72, loadPct: 72, isPeak: false },
    { time: '21:00', athletes: 30, loadPct: 30, isPeak: false },
  ];

  const handleExportTelemetry = () => {
    const report = {
      facility: 'Viernes Autonomous Gym ERP',
      timestamp: new Date().toISOString(),
      mrr: telemetry.mrr,
      currentHeadcount: `${telemetry.currentOccupancy}/${telemetry.maxCapacity}`,
      equipmentUptime: `${telemetry.equipmentUptimePct}%`,
      zones: zones.map((z) => ({
        name: z.name,
        code: z.code,
        occupancy: `${z.currentOccupancy}/${z.capacity}`,
      })),
      atRiskMembersCount: atRiskCount,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viernes-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

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

      {/* Hourly Floor Traffic & Zone Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Traffic Chart (2 cols) */}
        <div className="lg:col-span-2 stark-card rounded-2xl p-5 sm:p-6 border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-stark-cyan/15 text-stark-cyan border border-stark-cyan/30">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-mono font-bold text-white uppercase">
                  Hourly Floor Traffic & Surge Forecast
                </h4>
                <p className="text-[11px] font-mono text-gray-400">
                  Peak hour load: 17:30 – 19:30 (Max 94 athletes)
                </p>
              </div>
            </div>

            <button
              onClick={handleExportTelemetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-gray-300 hover:text-white border border-border-subtle text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stark-orange" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#6B7280" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111726', borderColor: '#00E5FF', borderRadius: '12px', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(val: any) => [`${val} Athletes`, 'Floor Headcount']}
                />
                <Bar dataKey="athletes" radius={[6, 6, 0, 0]}>
                  {hourlyTrafficData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.athletes >= 80 ? '#FF5500' : entry.athletes >= 60 ? '#00E5FF' : '#00E676'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Environmental & IoT Health Pods (1 col) */}
        <div className="stark-card rounded-2xl p-5 sm:p-6 border-border-subtle space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
            <Zap className="w-4 h-4 text-stark-orange" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              IoT Facility Environmental Telemetry
            </h4>
          </div>

          <div className="space-y-3">
            {/* Climate */}
            <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-stark-cyan" />
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Smart HVAC</span>
                  <span className="text-xs font-mono font-bold text-white">68.4°F • Optimal</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stark-emerald font-bold">14 ACH Flow</span>
            </div>

            {/* Air Quality */}
            <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-stark-emerald" />
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Air Quality Index</span>
                  <span className="text-xs font-mono font-bold text-stark-emerald">AQI 14 • Pristine</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400">HEPA-13 Active</span>
            </div>

            {/* Acoustics */}
            <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-stark-amber" />
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Acoustic Load</span>
                  <span className="text-xs font-mono font-bold text-white">64 dB (Ambient)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stark-orange">Turf: 82 dB</span>
            </div>

            {/* Energy */}
            <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-stark-orange" />
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">Microgrid Load</span>
                  <span className="text-xs font-mono font-bold text-white">18.4 kW/h</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stark-emerald font-bold">42% Solar Offset</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Simulation Engine */}
      <RevenueSimulator />

      {/* Zone Occupancy Matrix */}
      <div className="stark-card rounded-2xl p-5 sm:p-6 border-border-subtle">
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
