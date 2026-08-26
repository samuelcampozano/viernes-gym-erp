'use client';

import React from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { UserCheck, Award, Clock, DollarSign } from 'lucide-react';

export function TrainerRoster() {
  const { trainers } = useGymStore();

  return (
    <div className="stark-card rounded-2xl p-5 border-border-subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-stark-orange" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Elite Coaching Staff & Shift Capacity
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400">
          {trainers.length} COACHES ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="p-3.5 rounded-xl bg-surface-100/70 border border-border-subtle hover:border-stark-orange/30 transition-all flex items-start gap-3"
          >
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-11 h-11 rounded-lg object-cover border border-border-subtle shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-white truncate">
                  {trainer.name}
                </h4>
                <span className="text-[10px] font-mono font-bold text-stark-orange">
                  ${trainer.hourlyRate}/hr
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-400 truncate mt-0.5">
                {trainer.role}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mt-2">
                {trainer.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-200 text-gray-300 border border-border-subtle"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Workload Indicator */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Weekly Load:</span>
                <span className="font-bold text-stark-cyan">{trainer.activeHoursWeekly}h / 40h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
