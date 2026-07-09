import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronDown, CheckCircle2, XCircle, MapPin, Loader2, Search } from 'lucide-react';
import { fetchAppointments, selectAppointments, selectAppointmentsLoading } from '../store/slices/appointmentSlice';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { getAppointmentStatusColor } from '../utils/statusColors';
import { cn } from '../utils/cn';
import {
  getApptScheduledDate,
  isHistoryAppointment,
  getDisplayStatus,
  getApptDoctorName,
  getApptSpecialization,
  getApptClinicName
} from '../utils/appointmentDisplay';

export default function VisitHistory() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const appointments = useSelector(selectAppointments);
  const loading = useSelector(selectAppointmentsLoading);

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const history = useMemo(() => appointments.filter((a) => isHistoryAppointment(a)), [appointments]);

  const years = useMemo(() => {
    const set = new Set();
    history.forEach((a) => {
      const d = getApptScheduledDate(a);
      if (d) set.add(new Date(d).getFullYear());
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [history]);

  const specialties = useMemo(() => {
    const set = new Set();
    history.forEach((a) => { if (a.specialization) set.add(a.specialization); });
    return Array.from(set);
  }, [history]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return history.filter((a) => {
      if (yearFilter !== 'all') {
        const d = getApptScheduledDate(a);
        if (!d || new Date(d).getFullYear() !== Number(yearFilter)) return false;
      }
      if (specialtyFilter !== 'all' && a.specialization !== specialtyFilter) return false;
      if (term) {
        const haystack = `${a.doctor_name || ''} ${a.doctor_name_ar || ''} ${a.specialization || ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [history, search, yearFilter, specialtyFilter]);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('visitHistory.title', { defaultValue: 'Visit History' })}</h2>
          <p className="text-[15px] font-medium text-slate-500 max-w-xl leading-relaxed">
            {t('visitHistory.description', { defaultValue: 'Review your past appointments, including cancelled and completed visits.' })}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('visitHistory.searchPlaceholder', { defaultValue: 'Search doctor or specialty...' })}
              className="ps-9 pe-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-shadow w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-slate-100 items-center">
        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest me-2">{t('visitHistory.filterBy', { defaultValue: 'Filter By:' })}</div>

        <div className="relative">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-10"
          >
            <option value="all">{t('visitHistory.allYears', { defaultValue: 'All Years' })}</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-10"
          >
            <option value="all">{t('bookings.allSpecialties', { defaultValue: 'All Specialties' })}</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="py-40 text-center bg-white rounded-[24px] border border-slate-100 w-full">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold">{t('bookings.synchronizingSchedule', { defaultValue: 'Synchronizing your schedule...' })}</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((appt) => {
            const displayStatus = getDisplayStatus(appt);
            const scheduledDate = getApptScheduledDate(appt);
            return (
              <div
                key={appt.id || appt.appointment_id}
                onClick={() => navigate(`/patient/appointments/${appt.id || appt.appointment_id}`)}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
              >
                <div className={cn("absolute top-0 bottom-0 start-0 w-[5px]", displayStatus === 'cancelled' ? "bg-rose-400" : "bg-primary-500")}></div>

                <div className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pe-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-[13px] font-extrabold uppercase tracking-widest text-slate-400">
                      {scheduledDate ? formatDate(scheduledDate, isRtl, { month: 'short', day: 'numeric', year: 'numeric' }) : t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' })}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-4">
                    {scheduledDate ? formatTime(scheduledDate, isRtl) : t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' })}
                  </h3>

                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 w-max", getAppointmentStatusColor(displayStatus))}>
                      {displayStatus === 'cancelled' ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {t(`bookings.${displayStatus}`, { defaultValue: displayStatus })}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-900 mb-1">{getApptSpecialization(appt, isRtl, t)}</h4>
                      <div className="text-sm font-bold text-primary-600 mb-3">{getApptDoctorName(appt, isRtl)}</div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" /> {getApptClinicName(appt, t)}
                      </span>
                    </div>
                  </div>

                  {appt.notes && (
                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                      <div className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-2">
                        {t('appointmentDetails.reasonForVisit', { defaultValue: 'Reason / Patient Notes' })}
                      </div>
                      <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{appt.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[24px] border border-slate-100 border-dashed w-full">
          <p className="text-slate-400 font-bold">
            {history.length === 0
              ? t('visitHistory.noHistory', { defaultValue: "You don't have any past visits yet." })
              : t('visitHistory.noResults', { defaultValue: 'No visits match your filters.' })}
          </p>
        </div>
      )}

    </div>
  )
}
