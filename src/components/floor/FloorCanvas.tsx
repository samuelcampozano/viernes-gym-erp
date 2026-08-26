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
  LayoutGrid,
  Map,
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
  const [mobileViewMode, setMobileViewMode] = useState<'blueprint' | 'list'>('blueprint');

  // Counts for Category Badges
  const strengthCount = equipment.filter((e) => e.category === 'strength').length;
  const cardioCount = equipment.filter((e) => e.category === 'cardio').length;
  const functionalCount = equipment.filter((e) => e.category === 'functional').length;
  const recoveryCount = equipment.filter((e) => e.category === 'recovery').length;
  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const inUseCount = equipment.filter((e) => e.status === 'in_use').length;
  const operationalCount = equipment.filter((e) => e.status === 'operational').length;

  const categories = [
    { id: 'all', label: 'All', count: equipment.length, icon: Layers },
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface-100/70 p-3 sm:p-3.5 rounded-2xl border border-border-subtle backdrop-blur-md">
        {/* Left: Blueprint Telemetry */}
        <div className="flex items-center justify-between md:justify-start gap-2">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-gray-300 uppercase px-2 py-1 bg-surface-200 rounded-lg border border-border-subtle">
            <Compass className="w-3.5 h-3.5 text-stark-orange shrink-0" />
            15k SQ FT BLUEPRINT
          </span>
          <span className="text-[11px] sm:text-xs font-mono text-gray-400">
            • {filteredEquipment.length}/{equipment.length} ASSETS
          </span>
          {maintenanceCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-stark-red bg-stark-red/15 px-2 py-0.5 rounded-lg border border-stark-red/30 animate-pulse">
              <Wrench className="w-3 h-3 shrink-0" />
              {maintenanceCount} REPAIR
            </span>
          )}
        </div>

        {/* Right: Personalized Category Chips with Live Counts & Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-border-subtle shrink-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = filterCategory === cat.id && selectedZone === 'all';
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold uppercase transition-all shrink-0 ${
                    isActive
                      ? 'bg-stark-orange text-black shadow-stark-glow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-surface-100'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline sm:inline">{cat.label}</span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-mono ${
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
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold border transition-all flex items-center gap-1 shrink-0 ${
              filterStatus === 'maintenance'
                ? 'bg-stark-red text-white border-stark-red shadow-hud-red'
                : 'bg-surface-200 text-gray-400 border-border-subtle hover:border-stark-red/40 hover:text-white'
            }`}
          >
            <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stark-red shrink-0" />
            <span className="hidden sm:inline">Repair</span> ({maintenanceCount})
          </button>

          {/* Mobile View Toggle (Blueprint vs Grid List) */}
          <div className="flex md:hidden items-center bg-surface-200 p-0.5 rounded-xl border border-border-subtle shrink-0">
            <button
              onClick={() => setMobileViewMode('blueprint')}
              className={`p-1.5 rounded-lg ${mobileViewMode === 'blueprint' ? 'bg-stark-orange text-black' : 'text-gray-400'}`}
              title="Blueprint View"
            >
              <Map className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileViewMode('list')}
              className={`p-1.5 rounded-lg ${mobileViewMode === 'list' ? 'bg-stark-orange text-black' : 'text-gray-400'}`}
              title="List View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Factory Reset */}
          <button
            onClick={resetToFactoryDefaults}
            title="Reset state to default seed data"
            className="p-1.5 sm:p-2 rounded-xl bg-surface-200 text-gray-400 hover:text-stark-orange border border-border-subtle transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2D Interactive Vector Blueprint Canvas */}
      <div className={`stark-card rounded-2xl p-2 sm:p-4 relative min-h-[520px] sm:min-h-[620px] w-full overflow-x-auto border border-border-subtle bg-surface-300 ${
        mobileViewMode === 'list' ? 'hidden md:block' : 'block'
      }`}>
        <div className="min-w-[680px] md:min-w-full relative h-[500px] sm:h-[580px]">
          {/* Floor Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF5500_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Crosshairs */}
          <div className="absolute top-2 left-2 text-[9px] sm:text-[10px] font-mono text-stark-orange/50">+ NW SECTOR 001</div>
          <div className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-mono text-stark-orange/50">NE SECTOR 002 +</div>
          <div className="absolute bottom-2 left-2 text-[9px] sm:text-[10px] font-mono text-stark-orange/50">+ SW SECTOR 003</div>
          <div className="absolute bottom-2 right-2 text-[9px] sm:text-[10px] font-mono text-stark-orange/50">SE SECTOR 004 +</div>

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
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 bg-surface-400/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border-subtle flex items-center gap-2.5 sm:gap-4 text-[9px] sm:text-[10px] font-mono text-gray-300 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-stark-emerald shadow-hud-emerald" />
              <span>Operational ({operationalCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-stark-amber" />
              <span>In Use ({inUseCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-stark-red shadow-hud-red" />
              <span>Maintenance ({maintenanceCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Grid List Fallback Mode */}
      {mobileViewMode === 'list' && (
        <div className="md:hidden space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedEquipment(item)}
                className="stark-card rounded-xl p-3 border border-border-subtle flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-stark-orange">{item.id}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      item.status === 'maintenance' ? 'bg-stark-red/20 text-stark-red' : item.status === 'in_use' ? 'bg-stark-amber/20 text-stark-amber' : 'bg-stark-emerald/20 text-stark-emerald'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-mono text-white mt-0.5 truncate">{item.name}</h4>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Sector Detail & Quick Asset Control Panel */}
      {(filterCategory !== 'all' || selectedZone !== 'all') && (
        <div className="stark-card rounded-2xl p-4 sm:p-5 border-stark-orange/40 bg-surface-200/90 animate-slideUp">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-border-subtle mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-stark-orange/20 text-stark-orange border border-stark-orange/30 shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5 sm:gap-2">
                  <span>Sector Focus:</span>
                  <span className="text-stark-orange truncate max-w-[200px]">
                    {activeZoneObj ? `${activeZoneObj.code} — ${activeZoneObj.name}` : `${filterCategory.toUpperCase()} ASSETS`}
                  </span>
                </h3>
                <p className="text-[10px] sm:text-[11px] font-mono text-gray-400">
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
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono text-gray-400 hover:text-white bg-surface-100 border border-border-subtle hover:border-stark-orange/40 transition-colors"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Reset Focus
            </button>
          </div>

          {/* Quick Equipment Control Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border bg-surface-100 transition-all ${
                  item.status === 'maintenance'
                    ? 'border-stark-red/60 bg-stark-red/10 shadow-hud-red'
                    : 'border-border-subtle hover:border-stark-orange/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-black text-xs text-stark-orange">{item.id}</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-gray-400">{item.hoursLogged} hrs</span>
                </div>
                <h4 className="text-xs font-bold text-white font-mono truncate mb-2">{item.name}</h4>

                {/* 1-Click Status Pills */}
                <div className="flex items-center gap-1 pt-2 border-t border-border-subtle/60">
                  <button
                    onClick={() => handleQuickStatusToggle(item, 'operational')}
                    className={`flex-1 py-1 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase transition-all ${
                      item.status === 'operational'
                        ? 'bg-stark-emerald text-black shadow-hud-emerald'
                        : 'bg-surface-200 text-gray-400 hover:text-stark-emerald'
                    }`}
                  >
                    Operational
                  </button>
                  <button
                    onClick={() => handleQuickStatusToggle(item, 'maintenance')}
                    className={`flex-1 py-1 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase transition-all ${
                      item.status === 'maintenance'
                        ? 'bg-stark-red text-white shadow-hud-red'
                        : 'bg-surface-200 text-gray-400 hover:text-stark-red'
                    }`}
                  >
                    Repair
                  </button>
                  <button
                    onClick={() => handleQuickStatusToggle(item, 'in_use')}
                    className={`flex-1 py-1 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase transition-all ${
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
