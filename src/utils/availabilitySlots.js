// Splits raw doctor_availability windows (each a single start_time-end_time
// block on a date) into individual appointment_duration-sized bookable
// slots. Without this, the UI was treating an entire window - which could
// span the whole day - as one giant clickable "slot", instead of showing the
// real, individually-bookable times within it.

const toMinutes = (timeStr) => {
  const [h, m] = String(timeStr).split(':').map(Number);
  return h * 60 + (m || 0);
};

const toTimeString = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const normalizeDate = (value) => {
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch (e) {
    return value;
  }
};

// A window's `booked_times` (exact 'HH:MM:SS' strings the backend reports as
// already taken for that window) marks the matching generated slot as taken,
// rather than blocking the whole window once anyone books into it.
export const generateSlotsFromWindow = (window, durationMinutes) => {
  const duration = durationMinutes > 0 ? durationMinutes : 15;
  const startMin = toMinutes(window.start_time);
  const endMin = toMinutes(window.end_time);
  const bookedTimes = new Set((window.booked_times || []).map((t) => String(t).substring(0, 5)));

  const slots = [];
  for (let t = startMin; t + duration <= endMin; t += duration) {
    const start = toTimeString(t);
    slots.push({
      id: window.id,
      start_time: start,
      end_time: toTimeString(t + duration),
      available_date: window.available_date,
      taken: bookedTimes.has(start),
    });
  }
  return slots;
};

export const generateSlotsForDate = (windows, dateStr, durationMinutes) => {
  return (windows || [])
    .filter((w) => normalizeDate(w.available_date) === dateStr)
    .flatMap((w) => generateSlotsFromWindow(w, durationMinutes));
};

// Dates that have at least one still-bookable (non-taken) slot - used to
// decide which calendar days should render as selectable.
export const getDatesWithOpenSlots = (windows, durationMinutes) => {
  const dates = new Set();
  (windows || []).forEach((w) => {
    const slots = generateSlotsFromWindow(w, durationMinutes);
    if (slots.some((s) => !s.taken)) {
      dates.add(normalizeDate(w.available_date));
    }
  });
  return [...dates];
};

export const isSameSlot = (a, b) =>
  !!a && !!b && a.id === b.id && a.start_time === b.start_time;
