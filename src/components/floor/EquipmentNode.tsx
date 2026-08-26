'use client';

import React from 'react';
import { Dumbbell, Activity, ShieldAlert, CheckCircle2, Wrench, Flame, Zap } from 'lucide-react';
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
        return 'border-stark-emerald/60 bg-stark-emerald/10 text-stark-emerald shadow-hud-emerald';
      case 'maintenance':
        return 'border-stark-red bg-stark-red/20 text-stark-red shadow-hud-red animate-pulse';
      case 'in_use':
        return 'border-stark-amber/70 bg-stark-amber/15 text-stark-amber';
      case 'reserved':
        return 'border-stark-cyan/70 bg-stark-cyan/15 text-stark-cyan';
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
      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
        equipment.highlighted ? 'agent-radar-pulse scale-125 z-30' : ''
      }`}
    >
      {/* Node Body */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center border backdrop-blur-md transition-transform duration-200 group-hover:scale-110 ${getStatusColor()} ${
          isSelected ? 'ring-2 ring-stark-orange ring-offset-2 ring-offset-background' : ''
        }`}
      >
        {equipment.status === 'maintenance' ? (
          <Wrench className="w-4 h-4 animate-bounce" />
        ) : (
          getCategoryIcon()
        )}
      </div>

      {/* Equipment Tag Badge */}
      <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
        <div className="px-2 py-1 rounded bg-surface-400 border border-border-subtle text-[10px] font-mono text-gray-200 shadow-xl flex flex-col items-center">
          <span className="font-bold text-white">{equipment.id}</span>
          <span className="text-gray-400 max-w-[120px] truncate">{equipment.name}</span>
          <span className={`text-[9px] uppercase font-bold mt-0.5 ${
            equipment.status === 'maintenance' ? 'text-stark-red' : equipment.status === 'in_use' ? 'text-stark-amber' : 'text-stark-emerald'
          }`}>
            {equipment.status}
          </span>
        </div>
      </div>
    </div>
  );
}
