'use client';

import React, { useState } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { AudioVisualizerWave } from './AudioVisualizerWave';
import { ToolExecutionLogger } from './ToolExecutionLogger';
import { Sparkles, Terminal, Send, Play, ChevronUp, ChevronDown } from 'lucide-react';

export function ViernesHud() {
  const {
    isAiProcessing,
    setIsAiProcessing,
    updateEquipmentStatus,
    highlightEquipment,
    manageClassSchedule,
    filterMembersByCohort,
    launchRetentionCampaign,
    simulateRevenueForecast,
    setActiveTab,
    logToolExecution,
    toolExecutionLogs,
  } = useGymStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Preset Scenario 1: Equipment Breakdown & Class Reschedule
  const runScenario1 = async () => {
    setActivePreset('scenario1');
    setIsAiProcessing(true);
    setActiveTab('floor');

    const start = performance.now();

    const updated = updateEquipmentStatus('BENCH-03', 'maintenance', 'Snapped cable pulley reported by Coach Marcus');
    highlightEquipment('BENCH-03', 5000);
    logToolExecution({
      toolName: 'update_gym_floor_equipment',
      parameters: { equipmentId: 'BENCH-03', status: 'maintenance', notes: 'Snapped cable pulley reported by Coach Marcus' },
      result: { success: true, updated },
      status: 'success',
      latencyMs: Math.round(performance.now() - start),
    });

    setTimeout(() => {
      const res = manageClassSchedule('reschedule', {
        classId: 'CLS-104',
        timeSlot: '17:30 - 18:30',
        zone: 'zone_c_turf',
      });
      logToolExecution({
        toolName: 'manage_class_schedule',
        parameters: { action: 'reschedule', classId: 'CLS-104', targetZone: 'zone_c_turf' },
        result: res,
        status: 'success',
        latencyMs: 140,
      });
      setIsAiProcessing(false);
      setActivePreset(null);
    }, 1200);
  };

  // Preset Scenario 2: Churn Detection & Campaign Dispatch
  const runScenario2 = async () => {
    setActivePreset('scenario2');
    setIsAiProcessing(true);
    setActiveTab('members');

    const start = performance.now();

    const atRisk = filterMembersByCohort('critical', 10);
    logToolExecution({
      toolName: 'query_member_cohorts',
      parameters: { riskLevel: 'critical', inactiveDaysMin: 10 },
      result: { matchedCount: atRisk.length, memberIds: atRisk.map((m) => m.id) },
      status: 'success',
      latencyMs: Math.round(performance.now() - start),
    });

    setTimeout(() => {
      const campaign = launchRetentionCampaign(
        atRisk.map((m) => m.id),
        'smoothie_voucher',
        25,
        'Hey [Name]! We noticed you have not visited Viernes in over 10 days. We loaded a free post-workout recovery smoothie to your account!'
      );
      logToolExecution({
        toolName: 'launch_retention_campaign',
        parameters: { memberIds: campaign.targetMemberIds, offerType: 'smoothie_voucher', discountPercent: 25 },
        result: { campaignId: campaign.id, queueStatus: 'draft' },
        status: 'success',
        latencyMs: 160,
      });
      setIsAiProcessing(false);
      setActivePreset(null);
    }, 1000);
  };

  // Preset Scenario 3: Revenue Simulation
  const runScenario3 = async () => {
    setActivePreset('scenario3');
    setIsAiProcessing(true);
    setActiveTab('telemetry');

    const start = performance.now();

    setTimeout(() => {
      const result = simulateRevenueForecast(5, 8, 20);
      logToolExecution({
        toolName: 'simulate_revenue_forecast',
        parameters: { priceAdjustmentPercent: 5, classCapacityDelta: 8, churnReductionTargetPct: 20 },
        result,
        status: 'success',
        latencyMs: Math.round(performance.now() - start),
      });
      setIsAiProcessing(false);
      setActivePreset(null);
    }, 800);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;

    const lower = inputPrompt.toLowerCase();
    if (lower.includes('bench') || lower.includes('broken') || lower.includes('cable') || lower.includes('repair')) {
      runScenario1();
    } else if (lower.includes('churn') || lower.includes('member') || lower.includes('retention') || lower.includes('smoothie')) {
      runScenario2();
    } else if (lower.includes('revenue') || lower.includes('mrr') || lower.includes('simulate') || lower.includes('financial')) {
      runScenario3();
    } else {
      runScenario1();
    }
    setInputPrompt('');
  };

  return (
    <>
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl">
        <div className="stark-card rounded-2xl p-2.5 sm:p-3 border-stark-orange/50 shadow-stark-glow bg-surface-400/95 backdrop-blur-xl">
          {/* Top Collapse / Presets Bar */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-[85%] sm:max-w-none">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-stark-orange shrink-0" />
                <span className="hidden sm:inline">AI Co-Pilot</span> Scenarios:
              </span>
              <button
                onClick={runScenario1}
                disabled={isAiProcessing}
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-lg border font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activePreset === 'scenario1'
                    ? 'bg-stark-orange text-black border-stark-orange'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-orange/50'
                }`}
              >
                <Play className="w-2.5 h-2.5 shrink-0" />
                1. Broken Cable & Move Class
              </button>
              <button
                onClick={runScenario2}
                disabled={isAiProcessing}
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-lg border font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activePreset === 'scenario2'
                    ? 'bg-stark-orange text-black border-stark-orange'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-orange/50'
                }`}
              >
                <Play className="w-2.5 h-2.5 shrink-0" />
                2. Churn Radar & Retention
              </button>
              <button
                onClick={runScenario3}
                disabled={isAiProcessing}
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-lg border font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activePreset === 'scenario3'
                    ? 'bg-stark-orange text-black border-stark-orange'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-orange/50'
                }`}
              >
                <Play className="w-2.5 h-2.5 shrink-0" />
                3. +$6k MRR Boost
              </button>
            </div>

            {/* Collapse toggle for mobile screen conservation */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg bg-surface-100 text-gray-400 hover:text-white shrink-0 sm:hidden"
            >
              {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Input Form */}
          {!isCollapsed && (
            <form onSubmit={handleCustomPromptSubmit} className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative flex-1 flex items-center">
                <div className="hidden sm:flex">
                  <AudioVisualizerWave isActive={isAiProcessing} />
                </div>
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={
                    isAiProcessing
                      ? 'Executing WebMCP tools...'
                      : "Ask Viernes (e.g. 'Mark Rack 3 for maintenance and move 6 PM class')..."
                  }
                  disabled={isAiProcessing}
                  className="w-full pl-2 sm:pl-2 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-xl bg-surface-100 border border-border-subtle text-[11px] sm:text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-stark-orange"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAiProcessing}
                className="p-2 sm:p-2.5 rounded-xl bg-stark-orange hover:bg-stark-orange/90 text-black font-bold shadow-stark-glow-sm transition-all disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Telemetry Logger Toggle */}
              <button
                type="button"
                onClick={() => setShowLogs(!showLogs)}
                className={`p-2 sm:p-2.5 rounded-xl border font-mono text-xs flex items-center gap-1 transition-all shrink-0 ${
                  showLogs
                    ? 'bg-stark-cyan text-black border-stark-cyan shadow-hud-cyan'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-cyan/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline font-bold">Logs ({toolExecutionLogs.length})</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Live Tool Execution Telemetry Popover */}
      {showLogs && <ToolExecutionLogger onClose={() => setShowLogs(false)} />}
    </>
  );
}
