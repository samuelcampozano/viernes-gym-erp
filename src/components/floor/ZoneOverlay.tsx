'use client';

import React from 'react';
import { GymZoneInfo, GymZoneId } from '@/lib/store/types';
import { useGymStore } from '@/lib/store/useGymStore';
import { Users, Wrench, Shield, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';

interface ZoneOverlayProps {
  zones: GymZoneInfo[];
  selectedZone: string;
  onSelectZone: (zoneId: string) => void;
  filterCategory: string;
}

export function ZoneOverlay({ zones, selectedZone, onSelectZone, filterCategory }: ZoneOverlayProps) {
  const { equipment } = useGymStore();

  const zoneStyles: Record<string, { left: string; top: string; width: string; height: string }> = {
    zone_a_racks: { left: '1.5%', top: '3%', width: '35%', height: '45%' },
    zone_b_freeweights: { left: '1.5%', top: '51%', width: '35%', height: '46%' },
    zone_c_turf: { left: '38%', top: '3%', width: '26%', height: '94%' },
    zone_d_cardio: { left: '65.5%', top: '3%', width: '33%', height: '45%' },
    zone_e_recovery: { left: '65.5%', top: '51%', width: '33%', height: '46%' },
  };

  const isZoneHighlighted = (zoneId: GymZoneId) => {
    if (selectedZone !== 'all') return selectedZone === zoneId;
    if (filterCategory === 'all') return true;
    if (filterCategory === 'strength') return zoneId === 'zone_a_racks' || zoneId === 'zone_b_freeweights';
    if (filterCategory === 'cardio') return zoneId === 'zone_d_cardio';
    if (filterCategory === 'functional') return zoneId === 'zone_c_turf';
    if (filterCategory === 'recovery') return zoneId === 'zone_e_recovery';
    return true;
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {zones.map((zone) => {
        const bounds = zoneStyles[zone.id] || { left: '0%', top: '0%', width: '100%', height: '100%' };
        const zoneEquipment = equipment.filter((e) => e.zone === zone.id);
        const maintenanceAssets = zoneEquipment.filter((e) => e.status === 'maintenance');
        const highlighted = isZoneHighlighted(zone.id);
        const isExactSelected = selectedZone === zone.id;

        return (
          <div
            key={zone.id}
            style={{
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
            }}
            className={`absolute rounded-2xl border transition-all duration-300 p-3.5 flex flex-col justify-between ${
              highlighted
                ? isExactSelected
                  ? 'border-stark-orange bg-stark-orange/10 shadow-stark-glow-sm pointer-events-auto'
                  : 'border-border-subtle/80 bg-surface-100/20 hover:border-stark-orange/50 pointer-events-auto cursor-pointer'
                : 'border-border-subtle/30 bg-surface-400/50 opacity-30 pointer-events-none'
            }`}
            onClick={() => onSelectZone(zone.id === selectedZone ? 'all' : zone.id)}
          >
            {/* Zone Header & Dual Telemetry Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Zone Title */}
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: zone.color }}
                  className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
                />
                <span className="text-xs font-mono font-black tracking-wider text-white uppercase flex items-center gap-1">
                  {zone.code}: {zone.name}
                  {isExactSelected && <ChevronRight className="w-3 h-3 text-stark-orange" />}
                </span>
              </div>

              {/* Headcount vs Asset Telemetry */}
              <div className="flex items-center gap-1.5">
                {/* Live Athlete Headcount */}
                <span className="text-[10px] font-mono text-gray-300 bg-surface-300/90 px-2 py-0.5 rounded border border-border-subtle flex items-center gap-1">
                  <Users className="w-3 h-3 text-stark-cyan" />
                  <span>{zone.currentOccupancy}/{zone.capacity} Athletes</span>
                </span>

                {/* Physical Asset Count & Alert Badge */}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 font-bold ${
                  maintenanceAssets.length > 0
                    ? 'bg-stark-red/20 text-stark-red border-stark-red/50 animate-pulse'
                    : 'bg-surface-300/90 text-gray-400 border-border-subtle'
                }`}>
                  {maintenanceAssets.length > 0 ? (
                    <>
                      <Wrench className="w-3 h-3 text-stark-red" />
                      <span>{zoneEquipment.length} Assets ({maintenanceAssets.length} Repair)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-stark-emerald" />
                      <span>{zoneEquipment.length} Assets</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
