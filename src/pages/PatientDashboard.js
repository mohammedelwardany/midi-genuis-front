import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Activity, PlusCircle, FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { fetchNextAppointment, selectNextAppointment } from '../store/slices/appointmentSlice';
import { selectCurrentUser } from '../store/slices/authSlice';
import { fetchMyReports, selectMyReports, selectPatientsLoading } from '../store/slices/patientSlice';
import { BASE_URL } from '../api/endpoints';

export default function PatientDashboard() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { t, i18n } = useTranslation();

   const user = useSelector(selectCurrentUser);
   const nextAppt = useSelector(selectNextAppointment);
   const reports = useSelector(selectMyReports) || [];
   const reportsLoading = useSelector(selectPatientsLoading);

   useEffect(() => {
      dispatch(fetchNextAppointment());
      dispatch(fetchMyReports());
   }, [dispatch]);

   const isRtl = i18n.language.startsWith('ar');

   const getFullUrl = (path) => {
      if (!path) return '#';
      if (path.startsWith('http')) return path;
      const origin = BASE_URL.split('/backend/api')[0];
      return `${origin}${path}`;
   };

   const nextApptDoctorName = nextAppt
      ? (isRtl 
         ? (nextAppt.doctor?.name_ar || nextAppt.doctor_name_ar || nextAppt.doctor?.name || nextAppt.doctor_name || 'طبيب متخصص')
         : (nextAppt.doctor?.name_en || nextAppt.doctor_name_en || nextAppt.doctor?.name || nextAppt.doctor_name || 'Medical Specialist'))
      : '';

   const nextApptSpecialization = nextAppt
      ? (isRtl
         ? (nextAppt.doctor?.specialization_ar || nextAppt.doctor_specialization_ar || t('specializations.' + String(nextAppt.doctor?.specialization || '').toLowerCase().replace(' ', '_'), { defaultValue: nextAppt.doctor?.specialization || 'طبيب استشاري' }))
         : (nextAppt.doctor?.specialization_en || nextAppt.doctor_specialization_en || t('specializations.' + String(nextAppt.doctor?.specialization || '').toLowerCase().replace(' ', '_'), { defaultValue: nextAppt.doctor?.specialization || 'Clinical Specialist' })))
      : '';

   const scheduledDate = nextAppt?.scheduledAt || nextAppt?.scheduled_at || nextAppt?.date;
   const nextApptDate = scheduledDate
      ? new Date(scheduledDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : '';

   const nextApptTime = scheduledDate
      ? new Date(scheduledDate).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      : '';

   return (
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

         {/* Main Content */}
         <div className="flex-1 space-y-6 md:space-y-8">

            {/* Welcome Section */}
            <div className="px-1 md:px-0">
               <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  {t('patientDashboard.welcome')} {i18n.language.startsWith('ar') ? (user?.name_ar || user?.name) : (user?.name_en || user?.name || 'User')}!
               </h2>
               <p className="text-slate-600 font-medium text-sm md:text-[15px]">
                  {nextAppt ? (
                     <>
                        {t('patientDashboard.subtitle')} <span onClick={() => navigate(`/patient/appointments/${nextAppt.id}`)} className="font-bold text-primary-600 cursor-pointer hover:underline">{nextApptDoctorName}</span> on {nextApptDate} at {nextApptTime}.
                     </>
                  ) : (
                     t('patientDashboard.noUpcoming')
                  )}
               </p>
            </div>

            {/* Hero & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Next Appointment Hero */}
               <div className="md:col-span-2 bg-primary-700 rounded-[24px] p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-primary-700/20 flex flex-col justify-between min-h-[300px]">
                  {/* Decorative elements */}
                  <div className="absolute top-0 end-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  <Calendar className="absolute top-6 end-6 w-16 h-16 md:w-24 md:h-24 text-white/5" strokeWidth={1} />

                  <div className="relative z-10">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-3 md:mb-4 opacity-80">{t('patientDashboard.nextAppt')}</div>
                     {nextAppt ? (
                        <>
                           <h3 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">{nextApptDoctorName}</h3>
                           <p className="text-xs md:text-sm font-medium text-primary-200 mb-6 md:mb-8 opacity-90">{nextApptSpecialization}</p>

                           <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                              <div className="flex items-center gap-3 text-xs md:text-sm font-semibold opacity-90">
                                 <Calendar className="w-4 h-4 text-primary-300" /> {nextApptDate}
                              </div>
                              <div className="flex items-center gap-3 text-xs md:text-sm font-semibold opacity-90">
                                 <Activity className="w-4 h-4 text-primary-300" /> {nextApptTime}
                              </div>
                           </div>
                        </>
                     ) : (
                        <div className="py-8 md:py-12">
                           <p className="text-primary-100 font-medium opacity-80 italic">{t('patientDashboard.noUpcoming')}</p>
                        </div>
                      )}
                  </div>
 
                  <button
                     onClick={() => nextAppt ? navigate(`/patient/appointments/${nextAppt.id}`) : navigate('/patient/book/doctors')}
                     className="w-full bg-primary-600/50 hover:bg-primary-600 backdrop-blur-sm border border-primary-500/50 transition-colors py-3 md:py-3.5 rounded-xl font-bold text-sm relative z-10"
                  >
                     {nextAppt ? t('patientDashboard.viewDetails') : t('patientDashboard.bookAppt')}
                  </button>
               </div>
            </div>

            {/* Recent Health Reports */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100 overflow-hidden">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                  <div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">{t('patientDashboard.reportsTitle')}</h3>
                     <p className="text-[13px] font-medium text-slate-500">{t('patientDashboard.reportsDesc')}</p>
                  </div>
                  <button onClick={() => navigate('/patient/records')} className="text-[13px] font-bold text-primary-600 hover:text-primary-700 transition-colors">{t('patientDashboard.viewAllRecords')}</button>
               </div>

               <div className="overflow-x-auto -mx-6 md:mx-0">
                  <div className="inline-block min-w-full align-middle px-6 md:px-0">
                     <table className="min-w-full text-start border-collapse">
                        <thead>
                           <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                              <th className="py-4 px-4 ps-6 rounded-s-lg text-start">{t('patientDashboard.thReportName')}</th>
                              <th className="py-4 px-4 text-start">{t('patientDashboard.thDate')}</th>
                              <th className="py-4 px-4 text-start hidden sm:table-cell">{t('patientDashboard.thDept')}</th>
                              <th className="py-4 px-4 text-start hidden md:table-cell">{t('patientDashboard.thStatus')}</th>
                              <th className="py-4 px-4 text-center rounded-e-lg">{t('patientDashboard.thAction')}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                           {reportsLoading ? (
                              <tr>
                                 <td colSpan="5" className="py-10 text-slate-400 font-bold">
                                    <div className="flex items-center justify-center gap-2">
                                       <Loader2 className="w-5 h-5 animate-spin text-primary-600 shrink-0" />
                                       <span>{t('patientDashboard.loadingRecords')}</span>
                                    </div>
                                 </td>
                              </tr>
                           ) : reports && reports.length > 0 ? (
                              reports.slice(0, 3).map(report => {
                                 const formattedDate = report.created_at
                                    ? new Date(report.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'N/A';
                                 
                                 const department = report.type || (isRtl ? 'عام' : 'General');

                                 return (
                                    <tr key={report.id || report.report_id} className="hover:bg-slate-50/50 transition-colors">
                                       <td className="py-4 md:py-5 px-4 ps-6 text-start">
                                          <div className="flex items-center gap-3">
                                             <FileText className="w-5 h-5 text-primary-500 stroke-[1.5] shrink-0" />
                                             <span className="font-bold text-slate-800 truncate max-w-[120px] md:max-w-none">
                                                {report.file_name || report.file_url?.split('/').pop() || (isRtl ? 'تقرير طبي' : 'Untitled Document')}
                                             </span>
                                          </div>
                                       </td>
                                       <td className="py-4 md:py-5 px-4 font-semibold text-slate-600 whitespace-nowrap text-start">{formattedDate}</td>
                                       <td className="py-4 md:py-5 px-4 font-medium text-slate-500 hidden sm:table-cell text-start">{department}</td>
                                       <td className="py-4 md:py-5 px-4 hidden md:table-cell text-start">
                                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100/50">
                                             {isRtl ? 'تمت مراجعته' : 'Reviewed'}
                                          </span>
                                       </td>
                                       <td className="py-4 md:py-5 px-4 text-center">
                                          <a 
                                             href={getFullUrl(report.file_url)}
                                             target="_blank" 
                                             rel="noopener noreferrer" 
                                             className="text-primary-600 hover:text-primary-800 p-2 rounded-full hover:bg-primary-50 transition-colors inline-block"
                                          >
                                             <Download className="w-4 h-4" />
                                          </a>
                                       </td>
                                    </tr>
                                 );
                              })
                           ) : (
                              <tr><td colSpan="5" className="py-10 text-center text-slate-400 font-bold italic">{t('patientDashboard.noRecords')}</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

         </div>

         {/* Right Sidebar (Quick Actions) */}
         <div className="w-full lg:w-72 space-y-6 md:space-y-8 lg:order-first order-last text-start">

            {/* Quick Actions */}
            <div>
               <h3 className="text-[15px] font-bold text-slate-900 mb-4 px-2 tracking-tight">{t('patientDashboard.quickActions')}</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <button onClick={() => navigate('/patient/book/doctors')} className="w-full bg-white border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] p-4 rounded-[16px] flex items-center gap-4 hover:border-primary-100 hover:shadow-sm transition-all group">
                     <div className="bg-primary-50 text-primary-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                        <PlusCircle className="w-5 h-5" />
                     </div>
                     <span className="font-bold text-slate-800 text-[13px]">{t('patientDashboard.bookAppt')}</span>
                  </button>
               </div>
            </div>

         </div>

      </div>
   );
}
