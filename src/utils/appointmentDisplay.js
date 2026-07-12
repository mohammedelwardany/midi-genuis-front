// Shared appointment presentation helpers used by every page that lists a
// patient's appointments (BookingsDashboard, VisitHistory). Keeping this in
// one place guarantees those pages never disagree on what counts as
// "upcoming" vs "history", or on how a doctor/clinic name is derived from the
// (patient-scoped) getPatientAppointments API response.

export const getApptScheduledDate = (appt) => appt.scheduledAt || appt.scheduled_at || appt.date || null;

export const isAppointmentPast = (appt, now = new Date()) => {
  const scheduledDate = getApptScheduledDate(appt);
  return scheduledDate ? new Date(scheduledDate) < now : false;
};

export const isHistoryAppointment = (appt, now = new Date()) =>
  appt.status === 'cancelled' || isAppointmentPast(appt, now);

export const isUpcomingAppointment = (appt, now = new Date()) =>
  !isHistoryAppointment(appt, now) && (appt.status === 'confirmed' || appt.status === 'pending');

// The DB only ever stores 'pending' | 'confirmed' | 'cancelled' - 'completed'
// is a derived, display-only concept for a confirmed appointment whose date
// has passed.
export const getDisplayStatus = (appt, now = new Date()) => {
  if (appt.status === 'cancelled') return 'cancelled';
  if (appt.status === 'confirmed' && isAppointmentPast(appt, now)) return 'completed';
  return appt.status || 'pending';
};

export const getApptDoctorName = (appt, isRtl) => {
  return isRtl
    ? (appt.doctor_name_ar || appt.doctor_name || 'طبيب متخصص')
    : (appt.doctor_name || 'Medical Specialist');
};

export const getApptSpecialization = (appt, isRtl, t) => {
  const specFallback = appt.specialization;
  const specKey = String(specFallback || '').toLowerCase().trim().replace(/[._]/g, '').replace(/\s+/g, '_');
  const finalSpecKey = specKey === 'psych' ? 'psychiatry' : specKey;
  return t('specializations.' + finalSpecKey, {
    defaultValue: specFallback || (isRtl ? 'استشارة' : 'Clinical Session')
  });
};

export const getApptClinicName = (appt, t) => appt.clinic_name || t('bookings.mainCenter', { defaultValue: 'Main Center' });

// appointment_type is stored as 'consultation' | 'followup'; older rows booked
// before this column existed default to 'consultation' at the DB level.
export const getApptTypeLabel = (appt, t) => {
  const type = appt.appointment_type === 'followup' ? 'followup' : 'consultation';
  return t(`pickSchedule.${type}En`, { defaultValue: type === 'followup' ? 'Follow-up' : 'Consultation' });
};

export const isFollowUpAppointment = (appt) => appt.appointment_type === 'followup';
