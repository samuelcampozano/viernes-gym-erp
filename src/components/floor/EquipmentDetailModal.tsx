'use client';

import React, { useState } from 'react';
import { X, Wrench, CheckCircle, Clock, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { GymEquipment, EquipmentStatus } from '@/lib/store/types';
import { useGymStore } from '@/lib/store/useGymStore';

interface EquipmentDetailModalProps {
  equipment: GymEquipment | null;
  onClose: () => void;
}

export function EquipmentDetailModal({ equipment, onClose }: EquipmentDetailModalProps) {
  const { updateEquipmentStatus, highlightEquipment } = useGymStore();
  const [notes, setNotes] = useState(equipment?.maintenanceNotes || '');

  if (!equipment) return null;

  const handleStatusChange = (status: EquipmentStatus) => {
    updateEquipmentStatus(equipment.id, status, notes);
    highlightEquipment(equipment.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="stark-card rounded-2xl w-full max-w-lg p-6 border-stark-orange/30 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-surface-100 text-gray-400 hover:text-white hover:bg-surface-50 border border-border-subtle transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-3 rounded-xl border ${
            equipment.status === 'maintenance'
              ? 'bg-stark-red/20 border-stark-red text-stark-red'
              : 'bg-stark-orange/15 border-stark-orange/40 text-stark-orange'
          }`}>
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-100 text-stark-orange border border-stark-orange/30">
                {equipment.id}
              </span>
              <span className="text-xs font-mono text-gray-400 uppercase">
                {equipment.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-mono mt-0.5">
              {equipment.name}
            </h3>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Current Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${
                equipment.status === 'operational' ? 'bg-stark-emerald' : equipment.status === 'maintenance' ? 'bg-stark-red' : 'bg-stark-amber'
              }`} />
              <span className="text-sm font-mono font-bold capitalize text-white">
                {equipment.status}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-100 border border-border-subtle">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Hours Logged</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-stark-cyan" />
              <span className="text-sm font-mono font-bold text-white">
                {equipment.hoursLogged} hrs
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance Notes */}
        <div className="mb-5">
          <label className="text-xs font-mono text-gray-400 uppercase block mb-1.5">
            Maintenance & Inspection Log
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add maintenance observations or repair notes..."
            rows={3}
            className="w-full rounded-xl bg-surface-100 border border-border-subtle px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-stark-orange focus:ring-1 focus:ring-stark-orange font-mono"
          />
        </div>

        {/* Status Actions */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-gray-400 uppercase block">
            Set Operational Status (Triggers WebMCP Synchronizer)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStatusChange('operational')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                equipment.status === 'operational'
                  ? 'bg-stark-emerald text-black border-stark-emerald shadow-hud-emerald'
                  : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-emerald/50'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Operational
            </button>
            <button
              onClick={() => handleStatusChange('maintenance')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                equipment.status === 'maintenance'
                  ? 'bg-stark-red text-white border-stark-red shadow-hud-red'
                  : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-red/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Maintenance
            </button>
            <button
              onClick={() => handleStatusChange('in_use')}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                equipment.status === 'in_use'
                  ? 'bg-stark-amber text-black border-stark-amber'
                  : 'bg-surface-100 text-gray-300 border-border-subtle hover:border-stark-amber/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              In Use
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
