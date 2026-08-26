'use client';

import React, { useEffect } from 'react';
import { Header } from './Header';
import { FloorCanvas } from '../floor/FloorCanvas';
import { ScheduleTimeline } from '../schedule/ScheduleTimeline';
import { MemberRadarTable } from '../members/MemberRadarTable';
import { TelemetryDashboard } from '../telemetry/TelemetryDashboard';
import { ViernesHud } from '../hud/ViernesHud';
import { useGymStore, DashboardTab } from '@/lib/store/useGymStore';
import { registerAllWebMCPTools } from '@/lib/webmcp/registerWebMCPTools';
import { Compass, Calendar, Users, Activity, Sparkles } from 'lucide-react';

export function AppShell() {
  const { activeTab, setActiveTab } = useGymStore();

  useEffect(() => {
    // Register WebMCP browser tools on document.modelContext on mount
    registerAllWebMCPTools();
  }, []);

  const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'floor', label: 'Floor Commander', icon: Compass },
    { id: 'schedule', label: 'Class Schedule', icon: Calendar },
    { id: 'members', label: 'Member Radar & Churn', icon: Users },
    { id: 'telemetry', label: 'Facility Telemetry', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background text-white flex flex-col selection:bg-stark-orange selection:text-black">
      {/* Tactical Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-36 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-stark-orange text-black shadow-stark-glow-sm scale-[1.02]'
                    : 'bg-surface-200/80 text-gray-400 hover:text-white hover:bg-surface-100 border border-border-subtle'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="animate-fadeIn">
          {activeTab === 'floor' && <FloorCanvas />}
          {activeTab === 'schedule' && <ScheduleTimeline />}
          {activeTab === 'members' && <MemberRadarTable />}
          {activeTab === 'telemetry' && <TelemetryDashboard />}
        </div>
      </main>

      {/* Floating Viernes Tactical HUD */}
      <ViernesHud />
    </div>
  );
}
