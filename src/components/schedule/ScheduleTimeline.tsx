'use client';

import React, { useState, useMemo } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { ClassCard } from './ClassCard';
import { TrainerRoster } from './TrainerRoster';
import { DayOfWeek, GymClass } from '@/lib/store/types';
import { generateClassesForWeek, getWeekDates } from '@/lib/store/scheduleGenerator';
import {
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function ScheduleTimeline() {
  const { classes: customClasses, zones } = useGymStore();

  // Current Hackathon Baseline Date: August 2026, Week 4
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // 0-indexed (7 = August)
  const [selectedWeek, setSelectedWeek] = useState<number>(4); // Week 4 (Aug 24 - 30, 2026)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('wed');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  // Compute exact calendar dates for the active week
  const weekDaysInfo = useMemo(() => {
    return getWeekDates(selectedYear, selectedMonth, selectedWeek);
  }, [selectedYear, selectedMonth, selectedWeek]);

  // Generate deterministic baseline classes for this week and merge with custom in-store classes
  const activeWeekClasses = useMemo(() => {
    const baseline = generateClassesForWeek(selectedYear, selectedMonth, selectedWeek);

    // Merge with any custom classes created/modified in store
    const mergedMap = new Map<string, GymClass>();
    baseline.forEach((c) => mergedMap.set(c.id, c));

    // If viewing default hackathon week (August 2026, Week 4), include custom store classes
    if (selectedYear === 2026 && selectedMonth === 7 && selectedWeek === 4) {
      customClasses.forEach((c) => mergedMap.set(c.id, c));
    }

    return Array.from(mergedMap.values());
  }, [selectedYear, selectedMonth, selectedWeek, customClasses]);

  // Filter for active day and zone
  const dayClasses = activeWeekClasses.filter((c) => {
    if (c.dayOfWeek !== selectedDay) return false;
    if (selectedZone !== 'all' && c.zone !== selectedZone) return false;
    return true;
  });

  const totalBookings = dayClasses.reduce((acc, c) => acc + c.bookedCount, 0);
  const totalCapacity = dayClasses.reduce((acc, c) => acc + c.capacity, 0);
  const occupancyPct = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
    setSelectedWeek(1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
    setSelectedWeek(1);
  };

  const handleResetToToday = () => {
    setSelectedYear(2026);
    setSelectedMonth(7); // August
    setSelectedWeek(4);
    setSelectedDay('wed');
    setSelectedZone('all');
  };

  return (
    <div className="space-y-5">
      {/* Calendar Master Navigation Header */}
      <div className="stark-card rounded-2xl p-4 border-border-subtle bg-surface-200/90 space-y-4">
        {/* Row 1: Month / Year Controls & Jump to Today */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          {/* Month & Year Stepper */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-surface-100 border border-border-subtle text-gray-300 hover:text-stark-orange hover:border-stark-orange/50 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Month Dropdown */}
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(Number(e.target.value));
                setSelectedWeek(1);
              }}
              className="bg-surface-100 border border-border-subtle rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-stark-orange"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setSelectedWeek(1);
              }}
              className="bg-surface-100 border border-border-subtle rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-stark-orange focus:outline-none focus:border-stark-orange"
            >
              {[2025, 2026, 2027, 2028].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-surface-100 border border-border-subtle text-gray-300 hover:text-stark-orange hover:border-stark-orange/50 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Week Selector Chips */}
          <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-border-subtle overflow-x-auto">
            <span className="text-[10px] font-mono text-gray-400 px-2 uppercase font-bold hidden sm:inline">
              Week:
            </span>
            {[1, 2, 3, 4, 5].map((wk) => (
              <button
                key={wk}
                onClick={() => setSelectedWeek(wk)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all shrink-0 ${
                  selectedWeek === wk
                    ? 'bg-stark-orange text-black shadow-stark-glow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                W{wk}
              </button>
            ))}
          </div>

          {/* Jump to Current Hackathon Timeline Button */}
          <button
            onClick={handleResetToToday}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-surface-100 hover:bg-surface-50 text-gray-300 hover:text-stark-orange border border-border-subtle hover:border-stark-orange/40 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-stark-orange" />
            <span>Today (Aug 2026)</span>
          </button>
        </div>

        {/* Row 2: 7-Day Selector with Exact Dates & Zone Filter */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Day of Week Buttons with Dates */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {weekDaysInfo.map((info) => {
              const isSelected = selectedDay === info.day;
              return (
                <button
                  key={info.day}
                  onClick={() => setSelectedDay(info.day)}
                  className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[76px] py-2 px-2.5 rounded-xl font-mono transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-stark-orange text-black border-stark-orange shadow-stark-glow-sm scale-[1.03]'
                      : info.isToday
                      ? 'bg-surface-100 text-white border-stark-orange/50 hover:border-stark-orange'
                      : 'bg-surface-100 text-gray-400 border-border-subtle hover:text-white hover:bg-surface-50'
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {info.label}
                  </span>
                  <span className={`text-base font-black ${isSelected ? 'text-black' : 'text-white'}`}>
                    {info.dateNumber}
                  </span>
                  <span className={`text-[9px] uppercase ${isSelected ? 'text-black/80 font-bold' : 'text-gray-400'}`}>
                    {MONTH_NAMES[selectedMonth].slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Zone Filter & Utilization Telemetry */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 hidden sm:inline">Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-surface-100 border border-border-subtle rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-stark-orange"
              >
                <option value="all">All Studio Zones ({activeWeekClasses.length} total)</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Capacity Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 border border-border-subtle text-xs font-mono">
              <Users className="w-4 h-4 text-stark-cyan" />
              <span className="text-gray-300">
                Utilization: <strong className="text-white">{occupancyPct}%</strong> ({totalBookings}/{totalCapacity})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Cards Grid for Selected Day */}
      {dayClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {dayClasses.map((cls) => (
            <ClassCard key={cls.id} gymClass={cls} />
          ))}
        </div>
      ) : (
        <div className="stark-card rounded-2xl p-12 text-center border-dashed border-border-subtle">
          <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm font-mono text-gray-400">
            No classes scheduled for {selectedZone === 'all' ? 'any zone' : selectedZone} on this day.
          </p>
          <p className="text-xs font-mono text-stark-orange mt-1">
            Tip: Ask Viernes to create or reschedule a class into this slot via WebMCP!
          </p>
        </div>
      )}

      {/* Coaching Staff Availability & Workload Drawer */}
      <TrainerRoster />
    </div>
  );
}
