'use client';

import React from 'react';
import { GymZoneInfo, GymZoneId } from '@/lib/store/types';
import { useGymStore } from '@/lib/store/useGymStore';
import { Users, Wrench, Shield, CheckCircle2, ChevronRight } from 'lucide-react';

interface ZoneOverlayProps {
  zones: GymZoneInfo[];
  selectedZone: string;
  onSelectZone: (zoneId: string) => void;
  filterCategory: string;
  filterStatus?: string;
}

export function ZoneOverlay({ zones, selectedZone, onSelectZone, filterCategory, filterStatus = 'all' }: ZoneOverlayProps) {
  const { equipment } = useGymStore();

  const zoneStyles: Record<string, { left: string; top: string; width: string; height: string }> = {
    zone_a_racks: { left: '1.5%', top: '2%', width: '35%', height: '46%' },
    zone_b_freeweights: { left: '1.5%', top: '50.5%', width: '35%', height: '47.5%' },
    zone_c_turf: { left: '38%', top: '2%', width: '26%', height: '96%' },
    zone_d_cardio: { left: '65.5%', top: '2%', width: '33%', height: '46%' },
    zone_e_recovery: { left: '65.5%', top: '50.5%', width: '33%', height: '47.5%' },
  };

  const isZoneHighlighted = (zoneId: GymZoneId, maintenanceCount: number) => {
    if (filterStatus === 'maintenance') return maintenanceCount > 0;
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
        const highlighted = isZoneHighlighted(zone.id, maintenanceAssets.length);
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
            className={`absolute rounded-2xl border transition-all duration-300 p-3 flex flex-col justify-between ${
              highlighted
                ? isExactSelected
                  ? 'border-stark-orange bg-stark-orange/10 shadow-stark-glow-sm pointer-events-auto'
                  : maintenanceAssets.length > 0 && filterStatus === 'maintenance'
                  ? 'border-stark-red/70 bg-stark-red/10 shadow-hud-red pointer-events-auto cursor-pointer'
                  : 'border-border-subtle/80 bg-surface-100/15 hover:border-stark-orange/50 pointer-events-auto cursor-pointer'
                : 'border-border-subtle/30 bg-surface-400/50 opacity-20 pointer-events-none'
            }`}
            onClick={() => onSelectZone(zone.id === selectedZone ? 'all' : zone.id)}
          >
            {/* Zone Header Bar */}
            <div className="bg-surface-300/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-border-subtle/80 flex flex-wrap items-center justify-between gap-1.5 shadow-sm">
              {/* Zone Title */}
              <div className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: zone.color }}
                  className="w-2 h-2 rounded-full shadow-sm shrink-0"
                />
                <span className="text-[11px] font-mono font-black tracking-wider text-white uppercase flex items-center gap-1">
                  {zone.code}: {zone.name}
                  {isExactSelected && <ChevronRight className="w-3 h-3 text-stark-orange" />}
                </span>
              </div>

              {/* Dual Telemetry Badges */}
              <div className="flex items-center gap-1">
                {/* Live Athlete Headcount */}
                <span className="text-[9px] font-mono text-gray-300 bg-surface-100 px-1.5 py-0.5 rounded border border-border-subtle flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-stark-cyan shrink-0" />
                  <span>{zone.currentOccupancy}/{zone.capacity}</span>
                </span>

                {/* Physical Asset Count & Alert Badge */}
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 font-bold ${
                  maintenanceAssets.length > 0
                    ? 'bg-stark-red/20 text-stark-red border-stark-red/50 animate-pulse'
                    : 'bg-surface-100 text-gray-400 border-border-subtle'
                }`}>
                  {maintenanceAssets.length > 0 ? (
                    <>
                      <Wrench className="w-2.5 h-2.5 text-stark-red shrink-0" />
                      <span>{zoneEquipment.length} ({maintenanceAssets.length} Repair)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-2.5 h-2.5 text-stark-emerald shrink-0" />
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
