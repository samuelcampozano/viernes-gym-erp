'use client';

import React from 'react';
import { Users, Clock, MapPin, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { GymClass } from '@/lib/store/types';

interface ClassCardProps {
  gymClass: GymClass;
  onReschedule?: () => void;
}

export function ClassCard({ gymClass, onReschedule }: ClassCardProps) {
  const isFull = gymClass.bookedCount >= gymClass.capacity;
  const isNearFull = gymClass.bookedCount / gymClass.capacity >= 0.85;

  const getIntensityBadge = () => {
    switch (gymClass.intensity) {
      case 'extreme':
        return 'text-stark-red bg-stark-red/15 border-stark-red/30';
      case 'high':
        return 'text-stark-orange bg-stark-orange/15 border-stark-orange/30';
      case 'medium':
        return 'text-stark-amber bg-stark-amber/15 border-stark-amber/30';
      default:
        return 'text-stark-emerald bg-stark-emerald/15 border-stark-emerald/30';
    }
  };

  return (
    <div className="stark-card rounded-2xl p-4 flex flex-col justify-between border-border-subtle hover:border-stark-orange/40 transition-all duration-200 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-100 text-gray-300 border border-border-subtle">
            {gymClass.id}
          </span>
          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getIntensityBadge()}`}>
            {gymClass.intensity} INTENSITY
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-white font-mono group-hover:text-stark-orange transition-colors">
          {gymClass.title}
        </h4>

        {/* Time and Zone */}
        <div className="space-y-1.5 mt-2.5 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stark-cyan" />
            <span>{gymClass.timeSlot}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stark-orange" />
            <span className="text-gray-300">{gymClass.zoneName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-stark-emerald" />
            <span className="text-gray-200 font-semibold">{gymClass.trainerName}</span>
          </div>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mt-4 pt-3 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-gray-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Bookings
          </span>
          <span className={`font-bold ${isFull ? 'text-stark-red' : isNearFull ? 'text-stark-amber' : 'text-stark-emerald'}`}>
            {gymClass.bookedCount} / {gymClass.capacity} {isFull && '(WAITLISTED)'}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-100 overflow-hidden">
          <div
            style={{ width: `${Math.min(100, (gymClass.bookedCount / gymClass.capacity) * 100)}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              isFull ? 'bg-stark-red shadow-hud-red' : isNearFull ? 'bg-stark-amber' : 'bg-stark-emerald shadow-hud-emerald'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
