'use client';

import React, { useState } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { EquipmentNode } from './EquipmentNode';
import { ZoneOverlay } from './ZoneOverlay';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { Compass, Wrench, RotateCcw, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export function FloorCanvas() {
  const { equipment, zones, selectedEquipment, setSelectedEquipment, resetToFactoryDefaults } = useGymStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEquipment = equipment.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const inUseCount = equipment.filter((e) => e.status === 'in_use').length;
  const operationalCount = equipment.filter((e) => e.status === 'operational').length;

  return (
    <div className="space-y-4">
      {/* Tactical Canvas Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-100/60 p-3.5 rounded-2xl border border-border-subtle backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-300 uppercase px-2.5 py-1 bg-surface-200 rounded border border-border-subtle">
            <Compass className="w-3.5 h-3.5 text-stark-orange" />
            15,000 SQ FT FLOOR BLUEPRINT
          </span>
          <span className="text-xs font-mono text-gray-400">
            • {equipment.length} TOTAL ASSETS
          </span>
          {maintenanceCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-stark-red bg-stark-red/15 px-2 py-0.5 rounded border border-stark-red/30 animate-pulse">
              <Wrench className="w-3 h-3" />
              {maintenanceCount} IN REPAIR
            </span>
          )}
        </div>

        {/* Filter Chips & Reset Action */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-border-subtle">
            {['all', 'strength', 'cardio', 'functional', 'recovery'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                  filterCategory === cat
                    ? 'bg-stark-orange text-black shadow-stark-glow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFilterStatus(filterStatus === 'maintenance' ? 'all' : 'maintenance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              filterStatus === 'maintenance'
                ? 'bg-stark-red text-white border-stark-red shadow-hud-red'
                : 'bg-surface-200 text-gray-400 border-border-subtle hover:border-stark-red/40'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Repair ({maintenanceCount})
          </button>

          <button
            onClick={resetToFactoryDefaults}
            title="Reset canvas and state to factory defaults"
            className="p-2 rounded-xl bg-surface-200 text-gray-400 hover:text-stark-orange border border-border-subtle transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2D Interactive Vector / SVG Floor Canvas */}
      <div className="stark-card rounded-2xl p-4 relative min-h-[620px] w-full overflow-hidden border border-border-subtle bg-surface-300">
        {/* Floor Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF5500_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Crosshair accents on canvas corners */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-stark-orange/50">+ NW SECTOR 001</div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-stark-orange/50">NE SECTOR 002 +</div>
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-stark-orange/50">+ SW SECTOR 003</div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-stark-orange/50">SE SECTOR 004 +</div>

        {/* Zone Overlays */}
        <ZoneOverlay zones={zones} />

        {/* Equipment Nodes */}
        {filteredEquipment.map((item) => (
          <EquipmentNode
            key={item.id}
            equipment={item}
            isSelected={selectedEquipment?.id === item.id}
            onClick={() => setSelectedEquipment(item)}
          />
        ))}

        {/* Canvas Bottom Legend */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-surface-400/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-border-subtle flex items-center gap-4 text-[10px] font-mono text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stark-emerald shadow-hud-emerald" />
            <span>Operational ({operationalCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stark-amber" />
            <span>In Use ({inUseCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stark-red shadow-hud-red" />
            <span>Maintenance ({maintenanceCount})</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  );
}
