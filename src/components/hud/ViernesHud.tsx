'use client';

import React, { useState } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { AudioVisualizerWave } from './AudioVisualizerWave';
import { ToolExecutionLogger } from './ToolExecutionLogger';
import {
  handleUpdateGymFloorEquipment,
  handleManageClassSchedule,
  handleQueryMemberCohorts,
  handleLaunchRetentionCampaign,
  handleSimulateRevenueForecast,
} from '@/lib/webmcp/toolHandlers';
import { Sparkles, Terminal, Send, Play, ChevronUp, ChevronDown, Cpu } from 'lucide-react';

export function ViernesHud() {
  const {
    isAiProcessing,
    setIsAiProcessing,
    setActiveTab,
    toolExecutionLogs,
    highlightEquipment,
  } = useGymStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Scenario 1: Report broken cable on Bench 3 & move 5:30 PM class
   * Calls WebMCP tools: update_gym_floor_equipment and manage_class_schedule
   */
  const runScenario1 = async () => {
    setActivePreset('scenario1');
    setIsAiProcessing(true);
    setActiveTab('floor');

    // 1. WebMCP Tool: update_gym_floor_equipment
    await handleUpdateGymFloorEquipment({
      equipmentId: 'BENCH-03',
      status: 'maintenance',
      notes: 'Snapped cable pulley reported on Bench 3 during peak evening session.',
    });

    highlightEquipment('BENCH-03', 5000);

    // 2. WebMCP Tool: manage_class_schedule after brief delay
    setTimeout(async () => {
      setActiveTab('schedule');
      await handleManageClassSchedule({
        action: 'reschedule',
        classId: 'CLS-104',
        timeSlot: '17:30 - 18:30',
        zone: 'zone_c_turf',
      });

      setIsAiProcessing(false);
      setActivePreset(null);
    }, 1200);
  };

  /**
   * Scenario 2: Filter high-risk churn members & draft smoothie perks
   * Calls WebMCP tools: query_member_cohorts and launch_retention_campaign
   */
  const runScenario2 = async () => {
    setActivePreset('scenario2');
    setIsAiProcessing(true);
    setActiveTab('members');

    // 1. WebMCP Tool: query_member_cohorts
    const queryResult = await handleQueryMemberCohorts({
      riskLevel: 'critical',
      inactiveDaysMin: 10,
    });

    let targetMemberIds = ['MEM-001', 'MEM-002', 'MEM-005'];
    if (!queryResult.isError && queryResult.content[0]?.text) {
      try {
        const parsed = JSON.parse(queryResult.content[0].text);
        if (parsed.members && parsed.members.length > 0) {
          targetMemberIds = parsed.members.map((m: { id: string }) => m.id);
        }
      } catch (err) {
        console.warn('Failed parsing query_member_cohorts output', err);
      }
    }

    // 2. WebMCP Tool: launch_retention_campaign
    setTimeout(async () => {
      await handleLaunchRetentionCampaign({
        memberIds: targetMemberIds,
        offerType: 'smoothie_voucher',
        discountPercent: 25,
        customMessage:
          'Hey! We miss seeing you at Viernes. Your next post-workout protein smoothie at the Fuel Bar is 100% on us!',
      });

      setIsAiProcessing(false);
      setActivePreset(null);
    }, 1000);
  };

  /**
   * Scenario 3: Simulate $5,000 MRR boost with 4 new Hyrox classes
   * Calls WebMCP tool: simulate_revenue_forecast
   */
  const runScenario3 = async () => {
    setActivePreset('scenario3');
    setIsAiProcessing(true);
    setActiveTab('telemetry');

    setTimeout(async () => {
      await handleSimulateRevenueForecast({
        priceAdjustmentPercent: 5,
        classCapacityDelta: 8,
        churnReductionTargetPct: 20,
      });

      setIsAiProcessing(false);
      setActivePreset(null);
    }, 800);
  };

  /**
   * Handles user-submitted text prompts
   */
  const handleCustomPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAiProcessing) return;

    const query = inputPrompt.trim();
    const lower = query.toLowerCase();
    setInputPrompt('');

    if (
      lower.includes('bench') ||
      lower.includes('broken') ||
      lower.includes('cable') ||
      lower.includes('repair') ||
      lower.includes('maintenance')
    ) {
      await runScenario1();
    } else if (
      lower.includes('churn') ||
      lower.includes('member') ||
      lower.includes('retention') ||
      lower.includes('smoothie') ||
      lower.includes('campaign')
    ) {
      await runScenario2();
    } else if (
      lower.includes('revenue') ||
      lower.includes('mrr') ||
      lower.includes('simulate') ||
      lower.includes('forecast') ||
      lower.includes('boost')
    ) {
      await runScenario3();
    } else {
      // Default to Scenario 1 execution
      await runScenario1();
    }
  };

  return (
    <>
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl">
        <div className="stark-card rounded-2xl p-2.5 sm:p-3 border-stark-orange/50 shadow-stark-glow bg-surface-400/95 backdrop-blur-xl">
          {/* Top Bar: Quick Demo Presets & AI Indicator */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-[85%] sm:max-w-none">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-stark-orange shrink-0 animate-pulse" />
                <span className="hidden sm:inline">Viernes WebMCP</span> Scenarios:
              </span>

              {/* Demo Button 1 */}
              <button
                onClick={runScenario1}
                disabled={isAiProcessing}
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-lg border font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activePreset === 'scenario1'
                    ? 'bg-stark-orange text-black border-stark-orange shadow-stark-glow-sm'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-orange/50 hover:text-white'
                }`}
              >
                <Play className="w-2.5 h-2.5 shrink-0" />
                1. Broken Cable & Move Class
              </button>

              {/* Demo Button 2 */}
              <button
                onClick={runScenario2}
                disabled={isAiProcessing}
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-lg border font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activePreset === 'scenario2'
                    ? 'bg-stark-orange text-black border-stark-orange shadow-stark-glow-sm'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-orange/50 hover:text-white'
                }`}
              >
                <Play className="w-2.5 h-2.5 shrink-0" />
                2. Churn Radar & Retention
              </button>

              {/* Demo Button 3 */}
              <button
                onClick={runScenario3}
                disabled={isAiProcessing}
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-lg border font-bold shrink-0 transition-all flex items-center gap-1 ${
                  activePreset === 'scenario3'
                    ? 'bg-stark-orange text-black border-stark-orange shadow-stark-glow-sm'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-orange/50 hover:text-white'
                }`}
              >
                <Play className="w-2.5 h-2.5 shrink-0" />
                3. +$6k MRR Boost
              </button>
            </div>

            {/* Mobile collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg bg-surface-100 text-gray-400 hover:text-white shrink-0 sm:hidden"
            >
              {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Command Input & Web Audio API Visualizer Form */}
          {!isCollapsed && (
            <form onSubmit={handleCustomPromptSubmit} className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative flex-1 flex items-center gap-2 bg-surface-100 border border-border-subtle focus-within:border-stark-orange rounded-xl px-2 py-1 transition-all">
                {/* Audio Wave Visualizer with Web Audio API Mic toggle */}
                <AudioVisualizerWave isActive={isAiProcessing} />

                {/* Command Input Field */}
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder={
                    isAiProcessing
                      ? 'Executing WebMCP tool sequence...'
                      : "Command Viernes AI (e.g. 'Report broken cable on Bench 3 & move class')..."
                  }
                  disabled={isAiProcessing}
                  className="w-full py-1 bg-transparent text-[11px] sm:text-xs font-mono text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Submit Execution Button */}
              <button
                type="submit"
                disabled={isAiProcessing}
                className="p-2 sm:p-2.5 rounded-xl bg-stark-orange hover:bg-stark-orange/90 text-black font-bold shadow-stark-glow-sm transition-all disabled:opacity-50 shrink-0 flex items-center justify-center"
              >
                {isAiProcessing ? (
                  <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>

              {/* Telemetry Logger Toggle Button */}
              <button
                type="button"
                onClick={() => setShowLogs(!showLogs)}
                className={`p-2 sm:p-2.5 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                  showLogs
                    ? 'bg-stark-cyan text-black border-stark-cyan shadow-hud-cyan font-bold'
                    : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-cyan/50 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline font-bold">Logs ({toolExecutionLogs.length})</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Live Tool Execution Telemetry Popover Drawer */}
      {showLogs && <ToolExecutionLogger onClose={() => setShowLogs(false)} />}
    </>
  );
}
