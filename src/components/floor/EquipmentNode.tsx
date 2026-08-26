'use client';

import React from 'react';
import { Dumbbell, Activity, Wrench, Flame, Zap, ShieldCheck } from 'lucide-react';
import { GymEquipment } from '@/lib/store/types';

interface EquipmentNodeProps {
  equipment: GymEquipment;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EquipmentNode({ equipment, isSelected, onClick }: EquipmentNodeProps) {
  const getStatusColor = () => {
    switch (equipment.status) {
      case 'operational':
        return 'border-stark-emerald/70 bg-stark-emerald/10 text-stark-emerald shadow-hud-emerald';
      case 'maintenance':
        return 'border-stark-red bg-stark-red/25 text-stark-red shadow-hud-red ring-2 ring-stark-red/50 animate-pulse';
      case 'in_use':
        return 'border-stark-amber/80 bg-stark-amber/20 text-stark-amber';
      case 'reserved':
        return 'border-stark-cyan/80 bg-stark-cyan/20 text-stark-cyan';
      default:
        return 'border-border-subtle bg-surface-100 text-gray-400';
    }
  };

  const getCategoryIcon = () => {
    switch (equipment.category) {
      case 'strength':
        return <Dumbbell className="w-4 h-4" />;
      case 'cardio':
        return <Flame className="w-4 h-4" />;
      case 'functional':
        return <Zap className="w-4 h-4" />;
      case 'recovery':
        return <Activity className="w-4 h-4" />;
      default:
        return <Dumbbell className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={onClick}
      style={{ left: `${equipment.x}%`, top: `${equipment.y}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 flex flex-col items-center ${
        equipment.highlighted ? 'agent-radar-pulse scale-125 z-30' : ''
      }`}
    >
      {/* Node Body / Square Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center border backdrop-blur-md transition-all duration-200 group-hover:scale-110 group-hover:border-stark-orange ${getStatusColor()} ${
          isSelected ? 'ring-2 ring-stark-orange ring-offset-2 ring-offset-background scale-110' : ''
        }`}
      >
        {equipment.status === 'maintenance' ? (
          <Wrench className="w-5 h-5 text-stark-red animate-bounce" />
        ) : (
          getCategoryIcon()
        )}
      </div>

      {/* Visible Node Label on Canvas */}
      <div className="mt-1.5 px-1.5 py-0.5 rounded bg-surface-400/90 border border-border-subtle/80 text-[9px] font-mono font-bold text-gray-300 text-center tracking-tight shadow-md max-w-[85px] truncate pointer-events-none group-hover:border-stark-orange group-hover:text-white transition-colors">
        <span className="block font-black">{equipment.id}</span>
      </div>

      {/* Rich Hover Telemetry Popover */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-40">
        <div className="px-2.5 py-1.5 rounded-xl bg-surface-400 border border-stark-orange/50 text-[10px] font-mono text-gray-200 shadow-2xl flex flex-col items-center min-w-[140px]">
          <span className="font-black text-stark-orange text-xs">{equipment.id}</span>
          <span className="text-white font-semibold truncate max-w-[150px]">{equipment.name}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              equipment.status === 'operational' ? 'bg-stark-emerald' : equipment.status === 'maintenance' ? 'bg-stark-red' : 'bg-stark-amber'
            }`} />
            <span className={`text-[9px] uppercase font-bold ${
              equipment.status === 'maintenance' ? 'text-stark-red' : equipment.status === 'in_use' ? 'text-stark-amber' : 'text-stark-emerald'
            }`}>
              {equipment.status} ({equipment.hoursLogged} hrs)
            </span>
          </div>
          {equipment.maintenanceNotes && (
            <span className="text-[9px] text-gray-400 italic mt-0.5 text-center max-w-[150px] line-clamp-2">
              "{equipment.maintenanceNotes}"
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
