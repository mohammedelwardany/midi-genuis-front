import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, Loader2, Calendar } from 'lucide-react';
import { selectCurrentUser } from '../../store/slices/authSlice';
import {
   fetchDoctorAppointments,
   fetchMyPatientsByDate,
   selectDoctorAppointments,
   selectPatientsByDate,
   selectAppointmentsLoading
} from '../../store/slices/appointmentSlice';
import { formatDate, formatTime } from '../../utils/dateFormatter';

export default function DoctorDashboard() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { t, i18n } = useTranslation();
   const currentUser = useSelector(selectCurrentUser);
   const patientsByDate = useSelector(selectPatientsByDate);
   const doctorAppointments = useSelector(selectDoctorAppointments);
   const loading = useSelector(selectAppointmentsLoading);

   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [viewMode, setViewMode] = useState('all'); // default is 'all'
   const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed'
   const [genderFilter, setGenderFilter] = useState('all'); // 'all', 'Male', 'Female'

   useEffect(() => {
      dispatch(fetchDoctorAppointments());
   }, [dispatch]);

   useEffect(() => {
      dispatch(fetchMyPatientsByDate(selectedDate));
   }, [dispatch, selectedDate]);

   const isRtl = i18n.language.startsWith('ar');

   const getPatientName = (appt) => {
      const nameAr = appt.name_ar || appt.patient?.name_ar || appt.patient_name_ar || appt.patient?.name || appt.patient_name || appt.name;
      const nameEn = appt.name_en || appt.patient?.name_en || appt.patient_name_en || appt.patient?.name || appt.patient_name || appt.name;
      return isRtl
         ? (nameAr || (appt.patient_id ? `مريض #${appt.patient_id}` : 'مريض'))
         : (nameEn || (appt.patient_id ? `Patient #${appt.patient_id}` : 'Patient'));
   };

   const getPatientAge = (dob) => {
      if (!dob) return '';
      const birthDate = new Date(dob);
      if (isNaN(birthDate.getTime())) return '';
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
         age--;
      }
      return `${age}y`;
   };

   const getApptDateTime = (appt) => {
      const scheduledDate = appt.scheduledAt || appt.scheduled_at || appt.date;
      if (!scheduledDate) return 'Pending';
      const datePart = formatDate(scheduledDate, isRtl, { month: 'short', day: 'numeric' });
      const timePart = formatTime(scheduledDate, isRtl);
      return `${datePart}, ${timePart}`;
   };

   const getStatusBadgeClass = (status) => {
      switch (String(status).toLowerCase()) {
         case 'confirmed':
         case 'active':
            return 'bg-emerald-50 text-emerald-600 border border-emerald-100/50';
         case 'pending':
            return 'bg-amber-50 text-amber-600 border border-amber-100/50';
         case 'completed':
            return 'bg-blue-50 text-blue-700 border border-blue-100/50';
         case 'cancelled':
            return 'bg-rose-50 text-rose-600 border border-rose-100/50';
         default:
            return 'bg-slate-50 text-slate-600 border border-slate-100/50';
      }
   };

   const activeAppointments = (() => {
      if (viewMode === 'all') {
         return doctorAppointments;
      }
      return (patientsByDate || []).filter(appt => {
         if (statusFilter !== 'all') {
            const status = String(appt.status).toLowerCase();
            if (status !== statusFilter) return false;
         }
         if (genderFilter !== 'all') {
            const gender = appt.gender || appt.patient?.gender || 'Unknown';
            if (gender.toLowerCase() !== genderFilter.toLowerCase()) return false;
         }
         return true;
      });
   })();

   return (
      <div className="animate-in fade-in duration-500 pb-20 relative">

         {/* Header Section */}
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  {t('doctorDashboard.title')}, {i18n.language.startsWith('ar') ? (currentUser?.name_ar || currentUser?.name) : (currentUser?.name_en || currentUser?.name || 'Doctor')}!
               </h2>
               <p className="text-[15px] font-medium text-slate-500">
                  {currentUser?.specialization || t('doctorDashboard.desc')}
               </p>
            </div>
         </div>

         {/* Active Queue Table */}
         <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">{t('doctorDashboard.activeQueue')}</h3>
                  {viewMode === 'date' && (
                     <>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/80 shadow-[0_1px_2px_rgb(0,0,0,0.01)] animate-in fade-in duration-200">
                           <Calendar className="w-4 h-4 text-slate-400" />
                           <input
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="bg-transparent text-xs font-bold text-slate-600 outline-none border-none cursor-pointer"
                           />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/80 shadow-[0_1px_2px_rgb(0,0,0,0.01)] animate-in fade-in duration-200">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('doctorDashboard.status', { defaultValue: 'Status' })}:</span>
                           <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="bg-transparent text-xs font-extrabold text-slate-700 outline-none border-none cursor-pointer pr-1"
                           >
                              <option value="all">{isRtl ? 'الكل' : 'All'}</option>
                              <option value="pending">{isRtl ? 'قيد الانتظار' : 'Pending'}</option>
                              <option value="confirmed">{isRtl ? 'مؤكدة' : 'Confirmed'}</option>
                           </select>
                        </div>

                        {/* Gender Filter */}
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100/80 shadow-[0_1px_2px_rgb(0,0,0,0.01)] animate-in fade-in duration-200">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('doctorDashboard.gender', { defaultValue: 'Gender' })}:</span>
                           <select
                              value={genderFilter}
                              onChange={(e) => setGenderFilter(e.target.value)}
                              className="bg-transparent text-xs font-extrabold text-slate-700 outline-none border-none cursor-pointer pr-1"
                           >
                              <option value="all">{isRtl ? 'الكل' : 'All'}</option>
                              <option value="Male">{isRtl ? 'ذكر' : 'Male'}</option>
                              <option value="Female">{isRtl ? 'أنثى' : 'Female'}</option>
                           </select>
                        </div>
                     </>
                  )}
               </div>

               <div className="flex gap-2">
                  <button
                     onClick={() => setViewMode('date')}
                     className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all ${viewMode === 'date' ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                     {t('doctorDashboard.byDate', { defaultValue: 'By Selected Date' })}
                  </button>
                  <button
                     onClick={() => setViewMode('all')}
                     className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all ${viewMode === 'all' ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                     {t('doctorDashboard.allAppts', { defaultValue: 'All Appointments' })}
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-x-auto">
               <table className="w-full text-start border-collapse min-w-[800px]">
                  <thead>
                     <tr className="border-b border-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        <th className="px-8 py-5 w-[150px]">{t('doctorDashboard.thTime')}</th>
                        <th className="px-4 py-5 w-[250px]">{t('doctorDashboard.thPatient')}</th>
                        <th className="px-4 py-5">{t('doctorDashboard.thReason')}</th>
                        <th className="px-4 py-5 w-[200px]">{t('doctorDashboard.thStatus')}</th>
                        <th className="px-4 py-5 text-center w-[100px]">{t('doctorDashboard.thActions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">

                     {loading ? (
                        <tr>
                           <td colSpan="5" className="px-8 py-16 text-center text-slate-400 font-bold">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary-500" />
                              {t('common.loading', { defaultValue: 'Loading clinical records...' })}
                           </td>
                        </tr>
                     ) : activeAppointments.length > 0 ? (
                        activeAppointments.map((appt) => {
                           const pName = getPatientName(appt);
                           const initial = pName.charAt(0).toUpperCase();
                           const gender = appt.patient_gender || appt.gender || 'Unknown';
                           const ageStr = getPatientAge(appt.date_of_birth || appt.dob || appt.patient?.date_of_birth || appt.patient?.dob);
                           return (
                              <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <div className="font-extrabold text-[15px] text-primary-600">{getApptDateTime(appt)}</div>
                                    <div className="text-[11px] font-semibold text-slate-400">Scheduled</div>
                                 </td>
                                 <td className="px-4 py-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm shadow-sm border border-slate-200/50">{initial}</div>
                                       <div>
                                          <div onClick={() => navigate(`/doctor/patients/${appt.patient_id}`)} className="font-bold text-[15px] text-slate-900 cursor-pointer hover:text-primary-600 hover:underline">{pName}</div>
                                          <div className="text-[12px] font-medium text-slate-500">
                                             {gender}{ageStr ? `, ${ageStr}` : ''}
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 py-6 font-bold text-slate-700">{appt.notes || appt.reason || 'Clinical consultation'}</td>
                                 <td className="px-4 py-6">
                                    <span className={`inline-flex items-center gap-2 font-bold text-xs px-3 py-1.5 rounded-lg ${getStatusBadgeClass(appt.status)}`}>
                                       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                       {appt.status}
                                    </span>
                                 </td>
                                 <td className="px-4 py-6 text-center">
                                    <button
                                       onClick={() => navigate(`/doctor/patients/${appt.patient_id}`)}
                                       className="text-slate-400 hover:text-primary-600 p-2 transition-colors flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-primary-50 rounded-lg border border-slate-100 hover:border-primary-100 px-3 py-1.5 font-bold text-xs"
                                       title={t('doctorDashboard.viewProfile', { defaultValue: 'View Profile' })}
                                    >
                                       <Eye className="w-3.5 h-3.5" />
                                       <span>{t('doctorDashboard.viewProfile', { defaultValue: 'View Profile' })}</span>
                                    </button>
                                 </td>
                              </tr>
                           );
                        })
                     ) : (
                        <tr>
                           <td colSpan="5" className="px-8 py-16 text-center text-slate-400 font-bold italic">
                              {t('doctorDashboard.noAppointments', { defaultValue: 'No clinical appointments scheduled.' })}
                           </td>
                        </tr>
                     )}

                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
