'use client';

import React, { useState } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { ClassCard } from './ClassCard';
import { TrainerRoster } from './TrainerRoster';
import { DayOfWeek } from '@/lib/store/types';
import { Calendar, Filter, Sparkles, Plus, AlertTriangle, Users } from 'lucide-react';

export function ScheduleTimeline() {
  const { classes, zones } = useGymStore();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('mon');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const days: { key: DayOfWeek; label: string }[] = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
  ];

  const dayClasses = classes.filter((c) => {
    if (c.dayOfWeek !== selectedDay) return false;
    if (selectedZone !== 'all' && c.zone !== selectedZone) return false;
    return true;
  });

  const totalBookings = dayClasses.reduce((acc, c) => acc + c.bookedCount, 0);
  const totalCapacity = dayClasses.reduce((acc, c) => acc + c.capacity, 0);
  const occupancyPct = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Schedule Controls & Day Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-100/60 p-3.5 rounded-2xl border border-border-subtle backdrop-blur-md">
        {/* Day Tabs */}
        <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-border-subtle">
          {days.map((day) => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                selectedDay === day.key
                  ? 'bg-stark-orange text-black shadow-stark-glow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 hidden sm:inline">Filter Zone:</span>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-surface-200 border border-border-subtle rounded-xl px-3 py-1.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-stark-orange"
          >
            <option value="all">All Studio Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Daily Capacity Status */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Users className="w-4 h-4 text-stark-cyan" />
          <span className="text-gray-300">
            Day Utilization: <strong className="text-white">{occupancyPct}%</strong> ({totalBookings}/{totalCapacity} booked)
          </span>
        </div>
      </div>

      {/* Class Cards Grid */}
      {dayClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dayClasses.map((cls) => (
            <ClassCard key={cls.id} gymClass={cls} />
          ))}
        </div>
      ) : (
        <div className="stark-card rounded-2xl p-12 text-center border-dashed border-border-subtle">
          <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm font-mono text-gray-400">
            No classes scheduled for this zone on {selectedDay.toUpperCase()}.
          </p>
          <p className="text-xs font-mono text-stark-orange mt-1">
            Tip: Ask Viernes to create or reschedule a class into this slot via WebMCP!
          </p>
        </div>
      )}

      {/* Coaching Staff Drawer */}
      <TrainerRoster />
    </div>
  );
}
