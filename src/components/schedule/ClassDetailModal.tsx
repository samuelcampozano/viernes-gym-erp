'use client';

import React, { useState } from 'react';
import { GymClass, GymZoneId } from '@/lib/store/types';
import { useGymStore } from '@/lib/store/useGymStore';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Users,
  Sparkles,
  CheckCircle2,
  Trash2,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassDetailModalProps {
  gymClass: GymClass | null;
  onClose: () => void;
}

export function ClassDetailModal({ gymClass, onClose }: ClassDetailModalProps) {
  const { zones, trainers, manageClassSchedule } = useGymStore();

  const [timeSlot, setTimeSlot] = useState(gymClass?.timeSlot || '07:00 - 08:00');
  const [zoneId, setZoneId] = useState<GymZoneId>(gymClass?.zone || 'zone_a_racks');
  const [trainerId, setTrainerId] = useState(gymClass?.trainerId || 'TR-01');
  const [capacity, setCapacity] = useState(gymClass?.capacity || 16);
  const [bookedCount, setBookedCount] = useState(gymClass?.bookedCount || 8);
  const [isSaved, setIsSaved] = useState(false);

  if (!gymClass) return null;

  const handleSave = () => {
    // Reschedule or update in store
    manageClassSchedule('reschedule', {
      classId: gymClass.id,
      timeSlot,
      zone: zoneId,
      capacity,
    });

    manageClassSchedule('reassign_trainer', {
      classId: gymClass.id,
      trainerId,
    });

    setIsSaved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5500', '#00E5FF', '#00E676'],
    });

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="stark-card rounded-2xl w-full max-w-lg p-6 border-stark-orange shadow-2xl relative bg-surface-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-surface-100 text-gray-400 hover:text-white hover:bg-surface-50 border border-border-subtle transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border-subtle mb-5">
          <div className="p-2.5 rounded-xl bg-stark-orange/20 text-stark-orange border border-stark-orange/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-100 text-stark-orange border border-stark-orange/30 font-bold">
                {gymClass.id}
              </span>
              <span className="text-xs font-mono text-gray-400 uppercase">
                {gymClass.dayOfWeek.toUpperCase()} CLASS SESSION
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono mt-0.5">
              {gymClass.title}
            </h3>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 mb-6">
          {/* Time Slot */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-stark-cyan" />
              Time Slot:
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-surface-100 border border-border-subtle rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-stark-orange"
            >
              <option value="06:30 - 07:30">06:30 - 07:30 (Morning Dawn)</option>
              <option value="07:30 - 08:30">07:30 - 08:30 (Morning Surge)</option>
              <option value="12:00 - 13:00">12:00 - 13:00 (Lunch Express)</option>
              <option value="12:30 - 13:30">12:30 - 13:30 (Midday Power)</option>
              <option value="17:30 - 18:30">17:30 - 18:30 (Peak Evening A)</option>
              <option value="18:45 - 19:45">18:45 - 19:45 (Peak Evening B)</option>
            </select>
          </div>

          {/* Studio Zone */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-stark-orange" />
              Assigned Floor Zone:
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value as GymZoneId)}
              className="w-full bg-surface-100 border border-border-subtle rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-stark-orange"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.code}: {z.name} (Max {z.capacity} cap)
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Coach */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1.5">
              <UserCheck className="w-3.5 h-3.5 text-stark-emerald" />
              Lead Coach:
            </label>
            <select
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              className="w-full bg-surface-100 border border-border-subtle rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-stark-orange"
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.role} (${t.hourlyRate}/hr)
                </option>
              ))}
            </select>
          </div>

          {/* Capacity & Booking Quick Counter */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-100 border border-border-subtle">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
                Class Max Capacity
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={40}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-surface-200 border border-border-subtle rounded-lg px-2 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-xs font-mono text-gray-400">spots</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
                Simulate Bookings
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setBookedCount(Math.max(0, bookedCount - 1))}
                  className="px-2 py-1 rounded bg-surface-200 text-gray-300 hover:text-white font-mono text-xs font-bold"
                >
                  -1
                </button>
                <span className="text-xs font-mono font-black text-stark-cyan px-2">
                  {bookedCount}/{capacity}
                </span>
                <button
                  type="button"
                  onClick={() => setBookedCount(Math.min(capacity, bookedCount + 1))}
                  className="px-2 py-1 rounded bg-surface-200 text-gray-300 hover:text-white font-mono text-xs font-bold"
                >
                  +1
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-stark-emerald text-black shadow-hud-emerald'
                : 'bg-stark-orange hover:bg-stark-orange/90 text-black shadow-stark-glow-sm hover:scale-[1.02]'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Updated Class Schedule!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Save & Update Schedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
