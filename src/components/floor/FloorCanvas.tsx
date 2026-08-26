'use client';

import React, { useState } from 'react';
import { useGymStore } from '@/lib/store/useGymStore';
import { EquipmentNode } from './EquipmentNode';
import { ZoneOverlay } from './ZoneOverlay';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import {
  Compass,
  Wrench,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Dumbbell,
  Flame,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { GymEquipment, EquipmentStatus } from '@/lib/store/types';

export function FloorCanvas() {
  const {
    equipment,
    zones,
    selectedEquipment,
    setSelectedEquipment,
    resetToFactoryDefaults,
    updateEquipmentStatus,
    highlightEquipment,
  } = useGymStore();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  // Counts for Category Badges
  const strengthCount = equipment.filter((e) => e.category === 'strength').length;
  const cardioCount = equipment.filter((e) => e.category === 'cardio').length;
  const functionalCount = equipment.filter((e) => e.category === 'functional').length;
  const recoveryCount = equipment.filter((e) => e.category === 'recovery').length;
  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const inUseCount = equipment.filter((e) => e.status === 'in_use').length;
  const operationalCount = equipment.filter((e) => e.status === 'operational').length;

  const categories = [
    { id: 'all', label: 'All Sectors', count: equipment.length, icon: Layers },
    { id: 'strength', label: 'Strength', count: strengthCount, icon: Dumbbell },
    { id: 'cardio', label: 'Cardio', count: cardioCount, icon: Flame },
    { id: 'functional', label: 'Functional', count: functionalCount, icon: Zap },
    { id: 'recovery', label: 'Recovery', count: recoveryCount, icon: Activity },
  ];

  const filteredEquipment = equipment.filter((item) => {
    if (selectedZone !== 'all' && item.zone !== selectedZone) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const activeZoneObj = zones.find((z) => z.id === selectedZone);

  const handleCategoryClick = (catId: string) => {
    setFilterCategory(catId);
    setSelectedZone('all');
  };

  const handleQuickStatusToggle = (item: GymEquipment, newStatus: EquipmentStatus) => {
    updateEquipmentStatus(item.id, newStatus);
    highlightEquipment(item.id, 2500);
  };

  return (
    <div className="space-y-4">
      {/* Tactical Filter & Sector Focus Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-100/70 p-3.5 rounded-2xl border border-border-subtle backdrop-blur-md">
        {/* Left: Blueprint Telemetry */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-300 uppercase px-2.5 py-1 bg-surface-200 rounded-lg border border-border-subtle">
            <Compass className="w-3.5 h-3.5 text-stark-orange" />
            15,000 SQ FT FLOOR BLUEPRINT
          </span>
          <span className="text-xs font-mono text-gray-400">
            • {filteredEquipment.length} of {equipment.length} ASSETS
          </span>
          {maintenanceCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-stark-red bg-stark-red/15 px-2 py-0.5 rounded-lg border border-stark-red/30 animate-pulse">
              <Wrench className="w-3 h-3" />
              {maintenanceCount} IN REPAIR
            </span>
          )}
        </div>

        {/* Right: Personalized Category Chips with Live Counts & Icons */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-border-subtle">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = filterCategory === cat.id && selectedZone === 'all';
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-stark-orange text-black shadow-stark-glow-sm scale-[1.02]'
                      : 'text-gray-400 hover:text-white hover:bg-surface-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-black/30 text-black' : 'bg-surface-100 text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Maintenance Quick Focus Button */}
          <button
            onClick={() => setFilterStatus(filterStatus === 'maintenance' ? 'all' : 'maintenance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              filterStatus === 'maintenance'
                ? 'bg-stark-red text-white border-stark-red shadow-hud-red scale-[1.02]'
                : 'bg-surface-200 text-gray-400 border-border-subtle hover:border-stark-red/40 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-stark-red" />
            <span>Repair ({maintenanceCount})</span>
          </button>

          {/* Factory Reset */}
          <button
            onClick={resetToFactoryDefaults}
            title="Reset state to default seed data"
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

        {/* Zone Overlays with Sector Selection and Highlighting */}
        <ZoneOverlay
          zones={zones}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          filterCategory={filterCategory}
        />

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

      {/* Personalized Sector Detail & Quick Asset Control Panel */}
      {(filterCategory !== 'all' || selectedZone !== 'all') && (
        <div className="stark-card rounded-2xl p-5 border-stark-orange/40 bg-surface-200/90 animate-slideUp">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-stark-orange/20 text-stark-orange border border-stark-orange/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                  <span>Sector Focus:</span>
                  <span className="text-stark-orange">
                    {activeZoneObj ? `${activeZoneObj.code} — ${activeZoneObj.name}` : `${filterCategory.toUpperCase()} ASSETS`}
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-gray-400">
                  {filteredEquipment.length} machines in active sector view • Instant 1-click status control
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFilterCategory('all');
                setSelectedZone('all');
                setFilterStatus('all');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-gray-400 hover:text-white bg-surface-100 border border-border-subtle hover:border-stark-orange/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Focus View
            </button>
          </div>

          {/* Quick Equipment Control Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border bg-surface-100 transition-all ${
                  item.status === 'maintenance'
                    ? 'border-stark-red/60 bg-stark-red/10 shadow-hud-red'
                    : 'border-border-subtle hover:border-stark-orange/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-black text-xs text-stark-orange">{item.id}</span>
                  <span className="text-[10px] font-mono text-gray-400">{item.hoursLogged} hrs</span>
                </div>
                <h4 className="text-xs font-bold text-white font-mono truncate mb-2">{item.name}</h4>

                {/* 1-Click Status Pills */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border-subtle/60">
                  <button
                    onClick={() => handleQuickStatusToggle(item, 'operational')}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                      item.status === 'operational'
                        ? 'bg-stark-emerald text-black shadow-hud-emerald'
                        : 'bg-surface-200 text-gray-400 hover:text-stark-emerald'
                    }`}
                  >
                    Operational
                  </button>
                  <button
                    onClick={() => handleQuickStatusToggle(item, 'maintenance')}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                      item.status === 'maintenance'
                        ? 'bg-stark-red text-white shadow-hud-red'
                        : 'bg-surface-200 text-gray-400 hover:text-stark-red'
                    }`}
                  >
                    Repair
                  </button>
                  <button
                    onClick={() => handleQuickStatusToggle(item, 'in_use')}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                      item.status === 'in_use'
                        ? 'bg-stark-amber text-black'
                        : 'bg-surface-200 text-gray-400 hover:text-stark-amber'
                    }`}
                  >
                    In Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
