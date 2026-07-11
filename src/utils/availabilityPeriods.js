import { Sun, Sunset, Moon } from 'lucide-react';

// Shared AM/PM/Evening period presets used by both availability-creation
// screens (doctor self-service and admin-on-behalf-of-doctor), so a doctor's
// "Morning" always means the same default hours regardless of who set it.
export const PERIODS = [
  { id: 'morning', icon: Sun, defaultStart: '09:00', defaultEnd: '12:00' },
  { id: 'afternoon', icon: Sunset, defaultStart: '13:00', defaultEnd: '17:00' },
  { id: 'evening', icon: Moon, defaultStart: '17:00', defaultEnd: '20:00' },
];

export const defaultPeriodTimes = () =>
  PERIODS.reduce((acc, p) => ({ ...acc, [p.id]: { start: p.defaultStart, end: p.defaultEnd } }), {});
