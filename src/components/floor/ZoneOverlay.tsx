'use client';

import React from 'react';
import { GymZoneInfo } from '@/lib/store/types';

interface ZoneOverlayProps {
  zones: GymZoneInfo[];
}

export function ZoneOverlay({ zones }: ZoneOverlayProps) {
  // Visual bounding boxes for the 5 zones on our 2D canvas
  const zoneStyles: Record<string, { left: string; top: string; width: string; height: string }> = {
    zone_a_racks: { left: '2%', top: '4%', width: '34%', height: '44%' },
    zone_b_freeweights: { left: '2%', top: '50%', width: '34%', height: '46%' },
    zone_c_turf: { left: '38%', top: '4%', width: '26%', height: '92%' },
    zone_d_cardio: { left: '66%', top: '4%', width: '32%', height: '44%' },
    zone_e_recovery: { left: '66%', top: '50%', width: '32%', height: '46%' },
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {zones.map((zone) => {
        const bounds = zoneStyles[zone.id] || { left: '0%', top: '0%', width: '100%', height: '100%' };
        return (
          <div
            key={zone.id}
            style={{
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
            }}
            className="absolute rounded-xl border border-dashed border-border-subtle/70 bg-surface-100/20 p-3 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: zone.color }}
                  className="w-2 h-2 rounded-full shadow-sm"
                />
                <span className="text-[11px] font-mono font-bold tracking-wider text-gray-300 uppercase">
                  {zone.code}: {zone.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-surface-300/80 px-1.5 py-0.5 rounded border border-border-subtle">
                {zone.currentOccupancy}/{zone.capacity} OCCUPIED
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
