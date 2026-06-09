import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, MapPin, History, FileText, ChevronDown, Loader2 } from 'lucide-react';
import { fetchAppointments, selectAppointments, selectAppointmentsLoading } from '../store/slices/appointmentSlice';
import { cn } from '../utils/cn';

export default function BookingsDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const getApptDoctorName = (appt) => {
    return isRtl
      ? (appt.doctor?.name_ar || appt.doctor_name_ar || appt.doctor?.name || appt.doctor_name || 'طبيب متخصص')
      : (appt.doctor?.name_en || appt.doctor_name_en || appt.doctor?.name || appt.doctor_name || 'Medical Specialist');
  };

  const getApptService = (appt) => {
    if (appt.service) return appt.service;
    const specFallback = appt.doctor?.specialization || appt.doctor_specialization || appt.specialization;
    const specKey = String(specFallback || '').toLowerCase().trim().replace(/[._]/g, '').replace(/\s+/g, '_');
    const finalSpecKey = specKey === 'psych' ? 'psychiatry' : specKey;
    return isRtl
      ? (appt.doctor?.specialization_ar || appt.doctor_specialization_ar || t('specializations.' + finalSpecKey, { defaultValue: specFallback || 'استشارة ' }))
      : (appt.doctor?.specialization_en || appt.doctor_specialization_en || t('specializations.' + finalSpecKey, { defaultValue: specFallback || 'Clinical Session' }));
  };

  const getApptDate = (appt) => {
    const scheduledDate = appt.scheduledAt || appt.scheduled_at || appt.date;
    if (!scheduledDate) return t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' });
    return new Date(scheduledDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getApptTime = (appt) => {
    const scheduledDate = appt.scheduledAt || appt.scheduled_at || appt.date;
    if (!scheduledDate) return t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' });
    return new Date(scheduledDate).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const appointments = useSelector(selectAppointments);
  const loading = useSelector(selectAppointmentsLoading);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const now = new Date();
  const upcoming = appointments.filter(a => {
    const scheduledDate = a.scheduledAt || a.scheduled_at || a.date;
    const isPast = scheduledDate ? new Date(scheduledDate) < now : false;

    if (isPast) return false;
    return a.status === 'confirmed' || a.status === 'pending';
  });

  const history = appointments.filter(a => {
    const scheduledDate = a.scheduledAt || a.scheduled_at || a.date;
    const isPast = scheduledDate ? new Date(scheduledDate) < now : false;

    return (
      a.status === 'completed' ||
      a.status === 'cancelled' ||
      isPast
    );
  });

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
            {t('bookings.activeCount', { defaultValue: `${upcoming.length} Active` })}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="py-40 text-center bg-white rounded-[24px] border border-slate-100 w-full">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Synchronizing your schedule...</p>
            </div>
          ) : upcoming.length > 0 ? upcoming.map(appt => (
            <div 
              key={appt.id || appt.appointment_id} 
              onClick={() => navigate(`/patient/appointments/${appt.id || appt.appointment_id}`)}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow w-full cursor-pointer"
            >
              <div className={cn("absolute top-0 start-0 w-1.5 h-full rounded-s-full", appt.status === 'confirmed' ? "bg-primary-600" : "bg-orange-500")}></div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${getApptDoctorName(appt)}&background=dbeafe&color=1d4ed8&size=100`} alt="Dr" className="w-14 h-14 rounded-full border-2 border-slate-50 shadow-sm" />
                  <div>
                    <div className="font-bold text-lg text-slate-800 tracking-tight">{getApptDoctorName(appt)}</div>
                    <div className="text-sm font-medium text-slate-500">{getApptService(appt)}</div>
                  </div>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest",
                  appt.status === 'confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                )}>
                  {appt.status}
                </span>
              </div>

              <div className="bg-slate-50/50 rounded-xl p-4 flex gap-8 border border-slate-100/50">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Date & Time</div>
                  <div className="text-sm font-bold text-slate-800">{getApptDate(appt)}, {getApptTime(appt)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Clinic</div>
                  <div className="text-sm font-bold text-slate-800">{appt.location || 'Main Center'}</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center bg-white rounded-[24px] border border-slate-100 border-dashed w-full">
              <p className="text-slate-400 font-bold">No upcoming appointments scheduled.</p>
              <button onClick={() => navigate('/patient/book/doctors')} className="mt-4 text-primary-600 font-bold hover:underline">Book your first visit</button>
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
          <button className="text-sm font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800">
            {t('bookings.allSpecialties', { defaultValue: 'All Specialties' })} <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden pt-2">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="p-4 ps-6 w-[250px] text-start">{t('bookings.table.practitioner', { defaultValue: 'Practitioner' })}</th>
                <th className="p-4 text-start">{t('bookings.table.service', { defaultValue: 'Service' })}</th>
                <th className="p-4 text-start">{t('bookings.table.date', { defaultValue: 'Date' })}</th>
                <th className="p-4 text-start">{t('bookings.table.status', { defaultValue: 'Status' })}</th>
                <th className="p-4 text-end pe-8">{t('bookings.table.records', { defaultValue: 'Records' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-400" /></td></tr>
              ) : history.length > 0 ? history.map(appt => (
                <tr 
                  key={appt.id || appt.appointment_id} 
                  onClick={() => navigate(`/patient/appointments/${appt.id || appt.appointment_id}`)}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <td className="p-4 ps-6 text-start">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${getApptDoctorName(appt)}&size=80&background=f1f5f9`} className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                      <span className="font-bold text-slate-800">{getApptDoctorName(appt)}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-500 text-start">{getApptService(appt)}</td>
                  <td className="p-4 font-bold text-slate-800 text-start">{getApptDate(appt)}</td>
                  <td className="p-4 text-start">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border",
                      appt.status === 'completed' ? "bg-slate-100 text-slate-600 border-slate-200/60" :
                        appt.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100/60" :
                          "bg-red-50 text-red-600 border-red-100/60"
                    )}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-4 text-end pe-8">
                    {appt.status === 'completed' ? (
                      <button 
                        onClick={(e) => e.stopPropagation()} 
                        className="inline-flex items-center text-primary-600 font-bold text-sm hover:text-primary-700"
                      >
                        <FileText className="w-4 h-4 me-1.5" /> Report
                      </button>
                    ) : (
                      <span className="text-slate-400 italic text-xs">No records</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic">No historical visits found.</td></tr>
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
