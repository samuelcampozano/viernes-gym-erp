'use client';

import React, { useState, useEffect } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { TrendingUp, DollarSign, Sparkles, Sliders, ShieldCheck, Zap, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function RevenueSimulator() {
  const { simulation, simulateRevenueForecast } = useGymStore();
  const [priceAdj, setPriceAdj] = useState(simulation.priceAdjustmentPercent);
  const [capacityDelta, setCapacityDelta] = useState(simulation.classCapacityDelta);
  const [churnRed, setChurnRed] = useState(simulation.churnReductionTargetPct);

  useEffect(() => {
    simulateRevenueForecast(priceAdj, capacityDelta, churnRed);
  }, [priceAdj, capacityDelta, churnRed, simulateRevenueForecast]);

  // Generate 6-month projected curve
  const base = simulation.baseMRR;
  const target = simulation.projectedMRR;
  const delta = target - base;

  const chartData = [
    { month: 'Month 0 (Now)', baseline: base, projected: base },
    { month: 'Month 1', baseline: base, projected: Math.round(base + delta * 0.22) },
    { month: 'Month 2', baseline: base, projected: Math.round(base + delta * 0.48) },
    { month: 'Month 3', baseline: base, projected: Math.round(base + delta * 0.72) },
    { month: 'Month 4', baseline: base, projected: Math.round(base + delta * 0.86) },
    { month: 'Month 5', baseline: base, projected: Math.round(base + delta * 0.94) },
    { month: 'Month 6', baseline: base, projected: target },
  ];

  const applyPreset = (price: number, cap: number, churn: number) => {
    setPriceAdj(price);
    setCapacityDelta(cap);
    setChurnRed(churn);
  };

  return (
    <div className="stark-card rounded-2xl p-5 sm:p-6 border-border-subtle space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-stark-orange/15 border border-stark-orange/40 text-stark-orange shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-mono font-bold text-white uppercase">
              Financial Sensitivity & MRR Simulator
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Interactive revenue modeling powered by WebMCP parameter tuning
            </p>
          </div>
        </div>

        {/* Projected MRR Badge */}
        <div className="flex items-baseline gap-2 bg-surface-100 px-4 py-2 rounded-xl border border-stark-orange/30">
          <span className="text-xs font-mono text-gray-400">Projected MRR:</span>
          <span className="text-xl font-mono font-black text-stark-orange">
            ${simulation.projectedMRR.toLocaleString()}
          </span>
          <span className="text-xs font-mono font-bold text-stark-emerald">
            (+${(simulation.projectedMRR - simulation.baseMRR).toLocaleString()}/mo)
          </span>
        </div>
      </div>

      {/* Strategic Scenario Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1">
          <Zap className="w-3 h-3 text-stark-orange" />
          Quick Financial Presets:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => applyPreset(0, 4, 10)}
            className="px-2.5 py-1 rounded-lg bg-surface-100 text-gray-300 hover:text-white hover:border-stark-cyan/50 border border-border-subtle text-[10px] font-mono font-bold uppercase transition-all"
          >
            1. Standard (+4 Spots, 10% Churn)
          </button>
          <button
            onClick={() => applyPreset(5, 8, 20)}
            className="px-2.5 py-1 rounded-lg bg-surface-100 text-stark-orange hover:bg-stark-orange/10 border border-stark-orange/40 text-[10px] font-mono font-bold uppercase transition-all"
          >
            2. Hyrox Expansion (+5% Price, +8 Spots)
          </button>
          <button
            onClick={() => applyPreset(15, 12, 30)}
            className="px-2.5 py-1 rounded-lg bg-surface-100 text-stark-emerald hover:bg-stark-emerald/10 border border-stark-emerald/40 text-[10px] font-mono font-bold uppercase transition-all"
          >
            3. Obsidian Maximizer (+15% Price, -30% Churn)
          </button>
          <button
            onClick={() => applyPreset(0, 0, 0)}
            className="p-1 rounded-lg bg-surface-100 text-gray-400 hover:text-white border border-border-subtle"
            title="Reset Simulator"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Price Adjustment */}
        <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-400">Membership Price Shift:</span>
            <span className="font-bold text-stark-orange">{priceAdj > 0 ? `+${priceAdj}%` : `${priceAdj}%`}</span>
          </div>
          <input
            type="range"
            min="-15"
            max="25"
            step="1"
            value={priceAdj}
            onChange={(e) => setPriceAdj(Number(e.target.value))}
            className="w-full accent-[#FF5500] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-gray-500">
            <span>-15%</span>
            <span>0%</span>
            <span>+25%</span>
          </div>
        </div>

        {/* Slider 2: Class Capacity Expansion */}
        <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-400">Weekly Class Cap Delta:</span>
            <span className="font-bold text-stark-cyan">{capacityDelta > 0 ? `+${capacityDelta} spots` : `${capacityDelta} spots`}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={capacityDelta}
            onChange={(e) => setCapacityDelta(Number(e.target.value))}
            className="w-full accent-[#00E5FF] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-gray-500">
            <span>0 spots</span>
            <span>+10 spots</span>
            <span>+20 spots</span>
          </div>
        </div>

        {/* Slider 3: Churn Reduction */}
        <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-400">Churn Reduction Target:</span>
            <span className="font-bold text-stark-emerald">{churnRed}% saved</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="5"
            value={churnRed}
            onChange={(e) => setChurnRed(Number(e.target.value))}
            className="w-full accent-[#00E676] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-gray-500">
            <span>0%</span>
            <span>-20%</span>
            <span>-40%</span>
          </div>
        </div>
      </div>

      {/* Recharts Glowing Revenue Curve */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5500" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF5500" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={11} fontFamily="monospace" />
            <YAxis stroke="#6B7280" fontSize={11} fontFamily="monospace" tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111726', borderColor: '#FF5500', borderRadius: '12px', fontFamily: 'monospace' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Projected MRR']}
            />
            <Area type="monotone" dataKey="projected" stroke="#FF5500" strokeWidth={3} fillOpacity={1} fill="url(#projectedGrad)" name="Projected MRR ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
