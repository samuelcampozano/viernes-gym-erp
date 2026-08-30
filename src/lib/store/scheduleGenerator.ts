import { GymClass, DayOfWeek, GymZoneId } from './types';
import { INITIAL_TRAINERS, INITIAL_ZONES } from './seedData';

// Class templates across different disciplines & zones
const CLASS_TEMPLATES: Array<{
  title: string;
  zone: GymZoneId;
  zoneName: string;
  trainerId: string;
  trainerName: string;
  timeSlot: string;
  capacity: number;
  baseBookings: number;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
}> = [
  // Morning slots
  { title: 'Heavy Hypertrophy Wave', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', trainerId: 'TR-01', trainerName: 'Marcus Vance', timeSlot: '06:30 - 07:30', capacity: 12, baseBookings: 11, intensity: 'extreme' },
  { title: 'Hyrox Engine & Sled Conditioning', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', trainerId: 'TR-02', trainerName: 'Sarah Chen', timeSlot: '07:00 - 08:00', capacity: 20, baseBookings: 18, intensity: 'high' },
  { title: 'Olympic Snatch & Clean Workshop', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', trainerId: 'TR-01', trainerName: 'Marcus Vance', timeSlot: '07:30 - 08:30', capacity: 10, baseBookings: 9, intensity: 'extreme' },
  { title: 'Morning Cardio Velocity Intervals', zone: 'zone_d_cardio', zoneName: 'Cardio Velocity Deck', trainerId: 'TR-04', trainerName: 'Elena Rostova', timeSlot: '08:00 - 09:00', capacity: 14, baseBookings: 12, intensity: 'high' },

  // Midday / Lunch slots
  { title: 'Structural Mobility & Joint Care', zone: 'zone_e_recovery', zoneName: 'Recovery & Cryo Lounge', trainerId: 'TR-03', trainerName: 'Dave Kowalski', timeSlot: '12:00 - 13:00', capacity: 10, baseBookings: 8, intensity: 'low' },
  { title: 'Spine & Hip Restoration Protocol', zone: 'zone_e_recovery', zoneName: 'Recovery & Cryo Lounge', trainerId: 'TR-03', trainerName: 'Dave Kowalski', timeSlot: '12:30 - 13:30', capacity: 8, baseBookings: 8, intensity: 'low' },
  { title: 'Express Kettlebell Conditioning', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', trainerId: 'TR-05', trainerName: 'Jaxson Reed', timeSlot: '13:00 - 13:45', capacity: 16, baseBookings: 14, intensity: 'high' },

  // Evening peak slots
  { title: 'Apex Functional Strength', zone: 'zone_b_freeweights', zoneName: 'Free Weights & Benches', trainerId: 'TR-05', trainerName: 'Jaxson Reed', timeSlot: '17:30 - 18:30', capacity: 16, baseBookings: 16, intensity: 'high' },
  { title: 'Metabolic Inferno HIIT', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', trainerId: 'TR-02', trainerName: 'Sarah Chen', timeSlot: '17:30 - 18:30', capacity: 20, baseBookings: 20, intensity: 'high' },
  { title: 'Deadlift Velocity & Glute Power', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', trainerId: 'TR-01', trainerName: 'Marcus Vance', timeSlot: '18:00 - 19:00', capacity: 12, baseBookings: 11, intensity: 'extreme' },
  { title: 'Sprint Velocity & Power Wave', zone: 'zone_d_cardio', zoneName: 'Cardio Velocity Deck', trainerId: 'TR-04', trainerName: 'Elena Rostova', timeSlot: '18:45 - 19:45', capacity: 14, baseBookings: 13, intensity: 'extreme' },
  { title: 'Friday Community Team Throwdown', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', trainerId: 'TR-05', trainerName: 'Jaxson Reed', timeSlot: '18:00 - 19:30', capacity: 28, baseBookings: 27, intensity: 'extreme' },

  // Weekend slots
  { title: 'Weekend Heavy Barbell Club', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', trainerId: 'TR-01', trainerName: 'Marcus Vance', timeSlot: '09:00 - 10:30', capacity: 16, baseBookings: 15, intensity: 'extreme' },
  { title: 'Saturday Hyrox Endurance 90', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', trainerId: 'TR-02', trainerName: 'Sarah Chen', timeSlot: '10:30 - 12:00', capacity: 24, baseBookings: 24, intensity: 'extreme' },
  { title: 'Sunday Deep Fascial Stretch & Plunge', zone: 'zone_e_recovery', zoneName: 'Recovery & Cryo Lounge', trainerId: 'TR-03', trainerName: 'Dave Kowalski', timeSlot: '11:00 - 12:30', capacity: 12, baseBookings: 11, intensity: 'low' },
];

/**
 * Deterministically generates rich, error-free class schedules for any Year, Month, and Week.
 */
export function generateClassesForWeek(year: number, monthIndex: number, weekIndex: number): GymClass[] {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const generated: GymClass[] = [];

  // Seed variation factor based on year, month, week
  const seed = year * 100 + monthIndex * 10 + weekIndex;

  days.forEach((day, dayIdx) => {
    // Pick 4-5 classes per weekday, 2-3 on weekends
    const count = day === 'sat' || day === 'sun' ? 3 : 5;

    for (let i = 0; i < count; i++) {
      const templateIdx = (seed + dayIdx * 3 + i * 2) % CLASS_TEMPLATES.length;
      const t = CLASS_TEMPLATES[templateIdx];

      // Dynamic booked count variation
      const bookingVariance = ((seed + dayIdx + i) % 5) - 2;
      const bookedCount = Math.max(1, Math.min(t.capacity, t.baseBookings + bookingVariance));

      generated.push({
        id: `CLS-${(dayIdx + 1) * 100 + (i + 1)}`,
        title: t.title,
        zone: t.zone,
        zoneName: t.zoneName,
        trainerId: t.trainerId,
        trainerName: t.trainerName,
        timeSlot: t.timeSlot,
        dayOfWeek: day,
        capacity: t.capacity,
        bookedCount,
        intensity: t.intensity,
      });
    }
  });

  return generated;
}

/**
 * Helper to compute days and calendar dates for a given Year, Month, and Week of that month.
 */
export function getWeekDates(year: number, monthIndex: number, weekNumber: number) {
  // Find the first Monday or first day of the week
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startDay = (weekNumber - 1) * 7 + 1;

  const daysInfo: Array<{ day: DayOfWeek; label: string; dateNumber: number; dateStr: string; isToday: boolean }> = [];
  const dayNames: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const current = new Date(year, monthIndex, startDay + i);
    const dayOfWeekStr = dayNames[i];
    const isToday =
      current.getFullYear() === now.getFullYear() &&
      current.getMonth() === now.getMonth() &&
      current.getDate() === now.getDate();

    daysInfo.push({
      day: dayOfWeekStr,
      label: dayOfWeekStr.toUpperCase(),
      dateNumber: current.getDate(),
      dateStr: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday,
    });
  }

  return daysInfo;
}
