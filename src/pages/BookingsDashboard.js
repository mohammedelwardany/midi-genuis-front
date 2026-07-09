import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CalendarDays, Clock, MapPin, History, Loader2, X } from 'lucide-react';
import { fetchAppointments, cancelAppointment, selectAppointments, selectAppointmentsLoading } from '../store/slices/appointmentSlice';
import { cn } from '../utils/cn';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { getAppointmentStatusColor } from '../utils/statusColors';
import {
  getApptScheduledDate,
  isUpcomingAppointment,
  isHistoryAppointment,
  getDisplayStatus,
  getApptDoctorName,
  getApptSpecialization,
  getApptClinicName
} from '../utils/appointmentDisplay';

export default function BookingsDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const getApptDate = (appt) => {
    const scheduledDate = getApptScheduledDate(appt);
    if (!scheduledDate) return t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' });
    return formatDate(scheduledDate, isRtl, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getApptTime = (appt) => {
    const scheduledDate = getApptScheduledDate(appt);
    if (!scheduledDate) return t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' });
    return formatTime(scheduledDate, isRtl);
  };

  const appointments = useSelector(selectAppointments);
  const loading = useSelector(selectAppointmentsLoading);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const upcoming = appointments.filter((a) => isUpcomingAppointment(a));
  const history = appointments.filter((a) => isHistoryAppointment(a));

  const handleCancel = async (e, appt) => {
    e.stopPropagation();
    if (!window.confirm(t('bookings.cancelConfirm', { defaultValue: 'Are you sure you want to cancel this appointment?' }))) return;
    try {
      await dispatch(cancelAppointment(appt.id ?? appt.appointment_id)).unwrap();
      toast.success(t('bookings.cancelSuccess', { defaultValue: 'Appointment cancelled successfully' }));
    } catch (err) {
      toast.error(err?.message || t('bookings.cancelError', { defaultValue: 'Failed to cancel appointment' }));
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('bookings.title', { defaultValue: 'My Bookings' })}</h2>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
            {t('bookings.description', { defaultValue: 'Manage your clinical sessions, view history, and keep track of your healthcare journey.' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/patient/book/doctors')}
          className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-6 py-2.5 rounded-lg flex items-center font-bold transition-colors text-sm border border-primary-100/50"
        >
          {t('nav.bookVisit')}
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary-600" />
            {t('bookings.upcomingAppointments', { defaultValue: 'Upcoming Appointments' })}
          </h3>
          <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-tight uppercase">
            {t('bookings.activeCount', { count: upcoming.length, defaultValue: `${upcoming.length} Active` })}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="py-40 text-center bg-white rounded-[24px] border border-slate-100 w-full">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold">{t('bookings.synchronizingSchedule', { defaultValue: 'Synchronizing your schedule...' })}</p>
            </div>
          ) : upcoming.length > 0 ? upcoming.map(appt => {
            const displayStatus = getDisplayStatus(appt);
            return (
              <div
                key={appt.id || appt.appointment_id}
                onClick={() => navigate(`/patient/appointments/${appt.id || appt.appointment_id}`)}
                className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow w-full cursor-pointer"
              >
                <div className={cn("absolute top-0 start-0 w-1.5 h-full rounded-s-full", displayStatus === 'confirmed' ? "bg-primary-600" : "bg-orange-500")}></div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${getApptDoctorName(appt, isRtl)}&background=dbeafe&color=1d4ed8&size=100`} alt="Dr" className="w-14 h-14 rounded-full border-2 border-slate-50 shadow-sm" />
                    <div>
                      <div className="font-bold text-lg text-slate-800 tracking-tight">{getApptDoctorName(appt, isRtl)}</div>
                      <div className="text-sm font-medium text-slate-500">{getApptSpecialization(appt, isRtl, t)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest", getAppointmentStatusColor(displayStatus))}>
                      {t(`bookings.${displayStatus}`, { defaultValue: displayStatus })}
                    </span>
                    <button
                      onClick={(e) => handleCancel(e, appt)}
                      title={t('bookings.cancel', { defaultValue: 'Cancel' })}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-xl p-4 flex gap-8 border border-slate-100/50">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t('bookings.dateTime', { defaultValue: 'Date & Time' })}</div>
                    <div className="text-sm font-bold text-slate-800">{getApptDate(appt)}, {getApptTime(appt)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t('bookings.clinic', { defaultValue: 'Clinic' })}</div>
                    <div className="text-sm font-bold text-slate-800">{getApptClinicName(appt, t)}</div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="py-20 text-center bg-white rounded-[24px] border border-slate-100 border-dashed w-full">
              <p className="text-slate-400 font-bold">{t('bookings.noUpcoming', { defaultValue: 'No upcoming appointments scheduled.' })}</p>
              <button onClick={() => navigate('/patient/book/doctors')} className="mt-4 text-primary-600 font-bold hover:underline">{t('bookings.bookNextVisit', { defaultValue: 'Book your next visit' })}</button>
            </div>
          )}
        </div>
      </div>

      {/* Visit History Table */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" />
            {t('bookings.visitHistory', { defaultValue: 'Visit History' })}
          </h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden pt-2">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="p-4 ps-6 w-[250px] text-start">{t('bookings.table.practitioner', { defaultValue: 'Practitioner' })}</th>
                <th className="p-4 text-start">{t('bookings.table.service', { defaultValue: 'Service' })}</th>
                <th className="p-4 text-start">{t('bookings.table.date', { defaultValue: 'Date' })}</th>
                <th className="p-4 text-end pe-8">{t('bookings.table.status', { defaultValue: 'Status' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-400" /></td></tr>
              ) : history.length > 0 ? history.map(appt => {
                const displayStatus = getDisplayStatus(appt);
                return (
                  <tr
                    key={appt.id || appt.appointment_id}
                    onClick={() => navigate(`/patient/appointments/${appt.id || appt.appointment_id}`)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 ps-6 text-start">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${getApptDoctorName(appt, isRtl)}&size=80&background=f1f5f9`} className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                        <span className="font-bold text-slate-800">{getApptDoctorName(appt, isRtl)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-500 text-start">{getApptSpecialization(appt, isRtl, t)}</td>
                    <td className="p-4 font-bold text-slate-800 text-start">{getApptDate(appt)}</td>
                    <td className="p-4 text-end pe-8">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border", getAppointmentStatusColor(displayStatus))}>
                        {t(`bookings.${displayStatus}`, { defaultValue: displayStatus })}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400 italic">{t('bookings.noHistoricalVisits', { defaultValue: 'No historical visits found.' })}</td></tr>
              )}
            </tbody>
          </table>

          <div className="p-4 text-center border-t border-slate-100">
            <button onClick={() => navigate('/patient/history')} className="font-bold text-sm text-primary-600 hover:text-primary-800 py-1 transition-colors tracking-wide">
              {t('bookings.viewAllHistory', { defaultValue: 'View All History' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
