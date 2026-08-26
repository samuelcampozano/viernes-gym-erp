import { GymEquipment, GymClass, GymTrainer, GymMember, GymZoneInfo, FacilityTelemetry } from './types';

export const INITIAL_ZONES: GymZoneInfo[] = [
  {
    id: 'zone_a_racks',
    name: 'Olympic Rack Row',
    code: 'ZONE A',
    description: 'Heavy power cages, calibrated steel plates, and deadlift platforms',
    capacity: 18,
    currentOccupancy: 12,
    color: '#FF5500',
  },
  {
    id: 'zone_b_freeweights',
    name: 'Free Weights & Benches',
    code: 'ZONE B',
    description: 'Dumbbells (5-150 lbs), incline benches, and dual-adjustable cable pulleys',
    capacity: 25,
    currentOccupancy: 19,
    color: '#FFAA00',
  },
  {
    id: 'zone_c_turf',
    name: 'Functional Turf Arena',
    code: 'ZONE C',
    description: '50m sled track, kettlebell racks, plyo boxes, and Hyrox training gear',
    capacity: 30,
    currentOccupancy: 14,
    color: '#00E5FF',
  },
  {
    id: 'zone_d_cardio',
    name: 'Cardio Velocity Deck',
    code: 'ZONE D',
    description: 'Curved woodway runners, Concept2 rowers, ski ergs, and assault bikes',
    capacity: 20,
    currentOccupancy: 8,
    color: '#00E676',
  },
  {
    id: 'zone_e_recovery',
    name: 'Recovery & Cryo Lounge',
    code: 'ZONE E',
    description: 'Cold plunge baths, infrared sauna pods, and percussion therapy stations',
    capacity: 10,
    currentOccupancy: 4,
    color: '#9C27B0',
  },
];

export const INITIAL_EQUIPMENT: GymEquipment[] = [
  // Zone A: Olympic Racks (Top Left)
  { id: 'RACK-01', name: 'Rogue Monster Power Rack 1', category: 'strength', zone: 'zone_a_racks', x: 8, y: 15, status: 'operational', hoursLogged: 1420 },
  { id: 'RACK-02', name: 'Rogue Monster Power Rack 2', category: 'strength', zone: 'zone_a_racks', x: 18, y: 15, status: 'operational', hoursLogged: 1310 },
  { id: 'RACK-03', name: 'Eleiko Olympic Bench & Platform', category: 'strength', zone: 'zone_a_racks', x: 28, y: 15, status: 'maintenance', hoursLogged: 2150, maintenanceNotes: 'Left safety catch pin bent. Replacement ordered.' },
  { id: 'RACK-04', name: 'Hammer Strength Power Cage', category: 'strength', zone: 'zone_a_racks', x: 8, y: 32, status: 'operational', hoursLogged: 980 },
  { id: 'RACK-05', name: 'Deadlift Deadzone Platform', category: 'strength', zone: 'zone_a_racks', x: 18, y: 32, status: 'in_use', hoursLogged: 1740 },
  { id: 'RACK-06', name: 'Arsenal Olympic Incline Station', category: 'strength', zone: 'zone_a_racks', x: 28, y: 32, status: 'operational', hoursLogged: 1100 },

  // Zone B: Free Weights (Bottom Left)
  { id: 'BENCH-01', name: 'Adjustable Dumbbell Bench #1', category: 'strength', zone: 'zone_b_freeweights', x: 8, y: 60, status: 'operational', hoursLogged: 840 },
  { id: 'BENCH-02', name: 'Adjustable Dumbbell Bench #2', category: 'strength', zone: 'zone_b_freeweights', x: 16, y: 60, status: 'operational', hoursLogged: 920 },
  { id: 'BENCH-03', name: 'Heavy Flat Bench Press #3', category: 'strength', zone: 'zone_b_freeweights', x: 24, y: 60, status: 'operational', hoursLogged: 1890 },
  { id: 'CABLE-01', name: 'Dual Adjustable Cable Crossover #1', category: 'strength', zone: 'zone_b_freeweights', x: 8, y: 80, status: 'operational', hoursLogged: 2400 },
  { id: 'CABLE-02', name: 'Lat Pulldown & Low Row Tower', category: 'strength', zone: 'zone_b_freeweights', x: 20, y: 80, status: 'operational', hoursLogged: 2650 },
  { id: 'PRESS-01', name: '45-Degree Leg Press Machine', category: 'strength', zone: 'zone_b_freeweights', x: 30, y: 80, status: 'in_use', hoursLogged: 3100 },

  // Zone C: Functional Turf Arena (Middle Center)
  { id: 'TURF-01', name: 'Tank M4 All-Surface Sled Track', category: 'functional', zone: 'zone_c_turf', x: 44, y: 25, status: 'operational', hoursLogged: 620 },
  { id: 'TURF-02', name: 'Kettlebell Bell-Tree Matrix', category: 'functional', zone: 'zone_c_turf', x: 54, y: 25, status: 'operational', hoursLogged: 740 },
  { id: 'TURF-03', name: 'Plyometric Soft Box Stack', category: 'functional', zone: 'zone_c_turf', x: 44, y: 60, status: 'operational', hoursLogged: 450 },
  { id: 'TURF-04', name: 'Heavy Battle Rope Anchor #1', category: 'functional', zone: 'zone_c_turf', x: 54, y: 60, status: 'in_use', hoursLogged: 530 },
  { id: 'TURF-05', name: 'GHD Glute Ham Developer', category: 'functional', zone: 'zone_c_turf', x: 49, y: 82, status: 'operational', hoursLogged: 910 },

  // Zone D: Cardio Velocity Deck (Top Right)
  { id: 'CARDIO-01', name: 'Woodway Curve Treadmill #1', category: 'cardio', zone: 'zone_d_cardio', x: 70, y: 15, status: 'operational', hoursLogged: 1820 },
  { id: 'CARDIO-02', name: 'Woodway Curve Treadmill #2', category: 'cardio', zone: 'zone_d_cardio', x: 80, y: 15, status: 'operational', hoursLogged: 1650 },
  { id: 'CARDIO-03', name: 'Matrix Commercial Treadmill #3', category: 'cardio', zone: 'zone_d_cardio', x: 90, y: 15, status: 'maintenance', hoursLogged: 4120, maintenanceNotes: 'Motor belt slipping during sprint speeds above 14km/h' },
  { id: 'ROWER-01', name: 'Concept2 RowErg #1', category: 'cardio', zone: 'zone_d_cardio', x: 70, y: 35, status: 'operational', hoursLogged: 1490 },
  { id: 'ROWER-02', name: 'Concept2 SkiErg #2', category: 'cardio', zone: 'zone_d_cardio', x: 80, y: 35, status: 'operational', hoursLogged: 1220 },
  { id: 'BIKE-01', name: 'Rogue Echo Air Bike #1', category: 'cardio', zone: 'zone_d_cardio', x: 90, y: 35, status: 'in_use', hoursLogged: 1180 },

  // Zone E: Recovery Lounge (Bottom Right)
  { id: 'RECOVERY-01', name: 'Plunge XL Pro Cold Water Bath #1', category: 'recovery', zone: 'zone_e_recovery', x: 72, y: 70, status: 'operational', hoursLogged: 820 },
  { id: 'RECOVERY-02', name: 'Plunge XL Pro Cold Water Bath #2', category: 'recovery', zone: 'zone_e_recovery', x: 82, y: 70, status: 'in_use', hoursLogged: 760 },
  { id: 'RECOVERY-03', name: 'Clearlight Infrared Sauna Pod', category: 'recovery', zone: 'zone_e_recovery', x: 92, y: 70, status: 'operational', hoursLogged: 1340 },
  { id: 'RECOVERY-04', name: 'Theragun Pro Recovery Percussion Bar', category: 'recovery', zone: 'zone_e_recovery', x: 77, y: 88, status: 'operational', hoursLogged: 410 },
  { id: 'RECOVERY-05', name: 'Normatec Compression Boot Hub', category: 'recovery', zone: 'zone_e_recovery', x: 87, y: 88, status: 'operational', hoursLogged: 590 },
];

export const INITIAL_TRAINERS: GymTrainer[] = [
  { id: 'TR-01', name: 'Marcus Vance', role: 'Head Strength Coach', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', specialties: ['Powerlifting', 'Olympic Lifting', 'Hypertrophy'], hourlyRate: 95, availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'], activeHoursWeekly: 34 },
  { id: 'TR-02', name: 'Sarah Chen', role: 'Elite Conditioning Lead', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', specialties: ['Hyrox', 'HIIT', 'Metabolic Conditioning'], hourlyRate: 85, availableDays: ['mon', 'tue', 'thu', 'fri', 'sat'], activeHoursWeekly: 38 },
  { id: 'TR-03', name: 'Dave Kowalski', role: 'Mobility & Rehab Specialist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', specialties: ['Shoulder Rehab', 'Joint Mobility', 'Functional Movement'], hourlyRate: 110, availableDays: ['mon', 'wed', 'fri'], activeHoursWeekly: 22 },
  { id: 'TR-04', name: 'Elena Rostova', role: 'Speed & Athletic Performance', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', specialties: ['Sprint Mechanics', 'Plyometrics', 'Agility'], hourlyRate: 90, availableDays: ['tue', 'wed', 'thu', 'sat'], activeHoursWeekly: 30 },
  { id: 'TR-05', name: 'Jaxson Reed', role: 'Functional Fitness Coach', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', specialties: ['Kettlebells', 'Sled Conditioning', 'Bodyweight'], hourlyRate: 80, availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sun'], activeHoursWeekly: 40 },
];

export const INITIAL_CLASSES: GymClass[] = [
  { id: 'CLS-101', title: 'Heavy Hypertrophy Wave', trainerId: 'TR-01', trainerName: 'Marcus Vance', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', timeSlot: '06:30 - 07:30', dayOfWeek: 'mon', capacity: 12, bookedCount: 12, intensity: 'extreme' },
  { id: 'CLS-102', title: 'Hyrox Engine & Sled Conditioning', trainerId: 'TR-02', trainerName: 'Sarah Chen', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', timeSlot: '07:30 - 08:30', dayOfWeek: 'mon', capacity: 20, bookedCount: 19, intensity: 'high' },
  { id: 'CLS-103', title: 'Structural Mobility & Joint Care', trainerId: 'TR-03', trainerName: 'Dave Kowalski', zone: 'zone_e_recovery', zoneName: 'Recovery & Cryo Lounge', timeSlot: '12:00 - 13:00', dayOfWeek: 'mon', capacity: 10, bookedCount: 7, intensity: 'low' },
  { id: 'CLS-104', title: 'Apex Functional Strength', trainerId: 'TR-05', trainerName: 'Jaxson Reed', zone: 'zone_b_freeweights', zoneName: 'Free Weights & Benches', timeSlot: '17:30 - 18:30', dayOfWeek: 'mon', capacity: 16, bookedCount: 16, intensity: 'high' },
  { id: 'CLS-105', title: 'Sprint Velocity & Power Wave', trainerId: 'TR-04', trainerName: 'Elena Rostova', zone: 'zone_d_cardio', zoneName: 'Cardio Velocity Deck', timeSlot: '18:45 - 19:45', dayOfWeek: 'mon', capacity: 14, bookedCount: 11, intensity: 'extreme' },

  // Tuesday
  { id: 'CLS-201', title: 'Olympic Snatch & Clean Workshop', trainerId: 'TR-01', trainerName: 'Marcus Vance', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', timeSlot: '06:30 - 07:30', dayOfWeek: 'tue', capacity: 10, bookedCount: 10, intensity: 'extreme' },
  { id: 'CLS-202', title: 'Metabolic Inferno HIIT', trainerId: 'TR-02', trainerName: 'Sarah Chen', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', timeSlot: '17:30 - 18:30', dayOfWeek: 'tue', capacity: 20, bookedCount: 20, intensity: 'high' },
  { id: 'CLS-203', title: 'Tactical Agility Drills', trainerId: 'TR-04', trainerName: 'Elena Rostova', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', timeSlot: '18:30 - 19:30', dayOfWeek: 'tue', capacity: 18, bookedCount: 15, intensity: 'high' },

  // Wednesday
  { id: 'CLS-301', title: 'Deadlift Velocity & Glute Power', trainerId: 'TR-01', trainerName: 'Marcus Vance', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', timeSlot: '07:00 - 08:00', dayOfWeek: 'wed', capacity: 12, bookedCount: 11, intensity: 'extreme' },
  { id: 'CLS-302', title: 'Spine & Hip Restoration', trainerId: 'TR-03', trainerName: 'Dave Kowalski', zone: 'zone_e_recovery', zoneName: 'Recovery & Cryo Lounge', timeSlot: '12:30 - 13:30', dayOfWeek: 'wed', capacity: 8, bookedCount: 8, intensity: 'low' },
  { id: 'CLS-303', title: 'Endurance Row & Ski Intervals', trainerId: 'TR-05', trainerName: 'Jaxson Reed', zone: 'zone_d_cardio', zoneName: 'Cardio Velocity Deck', timeSlot: '18:00 - 19:00', dayOfWeek: 'wed', capacity: 16, bookedCount: 14, intensity: 'high' },

  // Thursday
  { id: 'CLS-401', title: 'Chest & Upper Body Blast', trainerId: 'TR-01', trainerName: 'Marcus Vance', zone: 'zone_b_freeweights', zoneName: 'Free Weights & Benches', timeSlot: '06:30 - 07:30', dayOfWeek: 'thu', capacity: 15, bookedCount: 15, intensity: 'high' },
  { id: 'CLS-402', title: 'Hyrox Simulation 60', trainerId: 'TR-02', trainerName: 'Sarah Chen', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', timeSlot: '17:30 - 18:30', dayOfWeek: 'thu', capacity: 22, bookedCount: 22, intensity: 'extreme' },
  { id: 'CLS-403', title: 'Speed Plyometrics', trainerId: 'TR-04', trainerName: 'Elena Rostova', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', timeSlot: '18:45 - 19:45', dayOfWeek: 'thu', capacity: 16, bookedCount: 12, intensity: 'high' },

  // Friday
  { id: 'CLS-501', title: 'Friday Heavy Squat Session', trainerId: 'TR-01', trainerName: 'Marcus Vance', zone: 'zone_a_racks', zoneName: 'Olympic Rack Row', timeSlot: '07:00 - 08:00', dayOfWeek: 'fri', capacity: 14, bookedCount: 14, intensity: 'extreme' },
  { id: 'CLS-502', title: 'Friday Community Team Throwdown', trainerId: 'TR-05', trainerName: 'Jaxson Reed', zone: 'zone_c_turf', zoneName: 'Functional Turf Arena', timeSlot: '17:00 - 18:30', dayOfWeek: 'fri', capacity: 28, bookedCount: 27, intensity: 'extreme' },
];

export const INITIAL_MEMBERS: GymMember[] = [
  // High Churn Risk Members (>70%)
  { id: 'MEM-001', name: 'Alexandrea Sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', tier: 'premium_black', churnRiskScore: 88, riskLevel: 'critical', lastVisitDaysAgo: 16, monthlySpend: 249, favoriteClass: 'Heavy Hypertrophy Wave', email: 'alex.sterling@example.com', phone: '+1 (555) 234-5678', status: 'at_risk', notes: 'VIP Black Tier. Stopped visiting after business trip.' },
  { id: 'MEM-002', name: 'Derrick Holloway', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', tier: 'executive', churnRiskScore: 82, riskLevel: 'critical', lastVisitDaysAgo: 19, monthlySpend: 399, favoriteClass: 'Structural Mobility & Joint Care', email: 'd.holloway@nexusgroup.com', phone: '+1 (555) 345-6789', status: 'at_risk', notes: 'Reported lower back strain 3 weeks ago.' },
  { id: 'MEM-003', name: 'Jordan Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', tier: 'standard', churnRiskScore: 78, riskLevel: 'high', lastVisitDaysAgo: 14, monthlySpend: 149, favoriteClass: 'Hyrox Engine & Sled', email: 'jvance99@gmail.com', phone: '+1 (555) 456-7890', status: 'at_risk' },
  { id: 'MEM-004', name: 'Samantha Wu', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', tier: 'premium_black', churnRiskScore: 74, riskLevel: 'high', lastVisitDaysAgo: 13, monthlySpend: 249, favoriteClass: 'Metabolic Inferno HIIT', email: 'swu.design@gmail.com', phone: '+1 (555) 567-8901', status: 'at_risk' },
  { id: 'MEM-005', name: 'Liam O’Connor', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', tier: 'standard', churnRiskScore: 71, riskLevel: 'high', lastVisitDaysAgo: 12, monthlySpend: 149, favoriteClass: 'Friday Heavy Squat', email: 'loconnor@gmail.com', phone: '+1 (555) 678-9012', status: 'at_risk' },

  // Medium Churn Risk (40 - 69%)
  { id: 'MEM-006', name: 'Rachel Bennett', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', tier: 'standard', churnRiskScore: 56, riskLevel: 'medium', lastVisitDaysAgo: 7, monthlySpend: 149, favoriteClass: 'Apex Functional Strength', email: 'rachel.b@techcorp.io', phone: '+1 (555) 789-0123', status: 'active' },
  { id: 'MEM-007', name: 'Carlos Mendez', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', tier: 'premium_black', churnRiskScore: 48, riskLevel: 'medium', lastVisitDaysAgo: 5, monthlySpend: 249, favoriteClass: 'Olympic Snatch Workshop', email: 'carlos.m@mendezarch.com', phone: '+1 (555) 890-1234', status: 'active' },

  // Low Churn Risk / Loyal VIPs (<40%)
  { id: 'MEM-008', name: 'Sophia Thorne', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', tier: 'executive', churnRiskScore: 8, riskLevel: 'low', lastVisitDaysAgo: 1, monthlySpend: 399, favoriteClass: 'Heavy Hypertrophy Wave', email: 'sthorne@luxuryre.com', phone: '+1 (555) 901-2345', status: 'active' },
  { id: 'MEM-009', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', tier: 'premium_black', churnRiskScore: 12, riskLevel: 'low', lastVisitDaysAgo: 0, monthlySpend: 249, favoriteClass: 'Hyrox Engine & Sled', email: 'dkim.capital@gmail.com', phone: '+1 (555) 012-3456', status: 'active' },
  { id: 'MEM-010', name: 'Natalie Brooks', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', tier: 'standard', churnRiskScore: 15, riskLevel: 'low', lastVisitDaysAgo: 1, monthlySpend: 149, favoriteClass: 'Friday Throwdown', email: 'natbrooks@outlook.com', phone: '+1 (555) 123-4567', status: 'active' },
];

export const INITIAL_TELEMETRY: FacilityTelemetry = {
  currentOccupancy: 57,
  maxCapacity: 100,
  mrr: 48250, // $48,250 / month
  equipmentUptimePct: 92.3, // %
  churnRatePct: 4.8, // %
  activeMembersCount: 420,
};
