import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Heart, Activity, Scale, PlusCircle, MessageSquare, Pill, ChevronRight, FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { fetchAppointments, selectAppointments, selectAppointmentsLoading } from '../store/slices/appointmentSlice';
import { selectCurrentUser } from '../store/slices/authSlice';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const user = useSelector(selectCurrentUser);
  const appointments = useSelector(selectAppointments);
  const loading = useSelector(selectAppointmentsLoading);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const nextAppt = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        
        {/* Welcome Section */}
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
             {t('patientDashboard.welcome')}, {i18n.language.startsWith('ar') ? (user?.name_ar || user?.name) : (user?.name_en || user?.name || 'User')}!
           </h2>
           <p className="text-slate-600 font-medium text-[15px]">
              {nextAppt ? (
                <>
                  {t('patientDashboard.subtitle')} <span className="font-bold text-primary-600 cursor-pointer hover:underline">{nextAppt.doctor_name || 'Your Doctor'}</span> on {nextAppt.date} at {nextAppt.time}.
                </>
              ) : (
                "You have no upcoming appointments. Stay on top of your health by booking a checkup."
              )}
           </p>
        </div>

        {/* Hero & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Next Appointment Hero */}
           <div className="md:col-span-1 bg-primary-700 rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg shadow-primary-700/20 flex flex-col justify-between">
              {/* Decorative elements */}
              <div className="absolute top-0 end-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <Calendar className="absolute top-6 end-6 w-24 h-24 text-white/5 end-6" strokeWidth={1} />

              <div className="relative z-10">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-4 opacity-80">{t('patientDashboard.nextAppt')}</div>
                 {nextAppt ? (
                    <>
                      <h3 className="text-3xl font-extrabold mb-1 tracking-tight">{nextAppt.doctor_name || 'Physician Appt'}</h3>
                      <p className="text-sm font-medium text-primary-200 mb-8 opacity-90">{nextAppt.specialization || 'Clinical Consult'}</p>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                            <Calendar className="w-4 h-4 text-primary-300" /> {nextAppt.date}
                         </div>
                         <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                            <Activity className="w-4 h-4 text-primary-300" /> {nextAppt.time}
                         </div>
                      </div>
                    </>
                 ) : (
                    <div className="py-12">
                      <p className="text-primary-100 font-medium opacity-80 italic">No upcoming sessions scheduled.</p>
                    </div>
                 )}
              </div>
              
              <button 
                onClick={() => nextAppt ? navigate(`/patient/appointments/${nextAppt.id}`) : navigate('/patient/book/doctors')} 
                className="w-full bg-primary-600/50 hover:bg-primary-600 backdrop-blur-sm border border-primary-500/50 transition-colors py-3.5 rounded-xl font-bold text-sm relative z-10"
              >
                 {nextAppt ? 'View Details' : 'Book Appointment'}
              </button>
           </div>

           {/* Health Stats */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
                 <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Heart className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">72</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BPM • RESTING</div>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
                 <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Activity className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">118/75</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Pressure</div>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
                 <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Scale className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">68.5 <span className="text-xs font-medium text-slate-400">kg</span></div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weights</div>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-primary-200 transition-colors">
                 <div className="bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"><PlusCircle className="w-5 h-5" /></div>
                 <div className="text-[11px] font-bold text-slate-500 group-hover:text-primary-600 transition-colors underline-offset-4 decoration-primary-600 underline uppercase tracking-widest">Add Metric</div>
              </div>
           </div>
        </div>

        {/* Recent Health Reports */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
           <div className="flex justify-between items-end mb-6">
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-1">Recent Health Reports</h3>
                 <p className="text-[13px] font-medium text-slate-500">Manage and download your clinical documents</p>
              </div>
              <button onClick={() => navigate('/patient/records')} className="text-[13px] font-bold text-primary-600 hover:text-primary-700 transition-colors">View All Records</button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse min-w-[600px]">
                 <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                       <th className="py-4 px-4 ps-6 rounded-s-lg">Report Name</th>
                       <th className="py-4 px-4">Date Issued</th>
                       <th className="py-4 px-4">Department</th>
                       <th className="py-4 px-4">Status</th>
                       <th className="py-4 px-4 text-center rounded-e-lg">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                    {loading ? (
                      <tr><td colSpan="5" className="py-10 text-center text-slate-400 font-bold"><Loader2 className="w-5 h-5 animate-spin mx-auto me-2 inline" /> Loading clinical records...</td></tr>
                    ) : appointments.filter(a => a.status === 'completed').length > 0 ? (
                      appointments.filter(a => a.status === 'completed').slice(0, 3).map(appt => (
                        <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="py-5 px-4 ps-6 flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary-500 stroke-[1.5]" />
                              <span className="font-bold text-slate-800">{appt.service || 'Clinical Consultation'}</span>
                           </td>
                           <td className="py-5 px-4 font-semibold text-slate-600">{appt.date}</td>
                           <td className="py-5 px-4 font-medium text-slate-500">{appt.specialization || 'General'}</td>
                           <td className="py-5 px-4">
                              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100/50">Reviewed</span>
                           </td>
                           <td className="py-5 px-4 text-center">
                              <button className="text-primary-600 hover:text-primary-800 p-1 rounded transition-colors"><Download className="w-4 h-4" /></button>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="py-10 text-center text-slate-400 font-bold italic">No medical records available at this time.</td></tr>
                    )}
                 </tbody>
              </table>
            </div>
        </div>

      </div>

      {/* Left Sidebar (Quick Actions) */}
      <div className="w-full lg:w-72 space-y-8 lg:order-first order-last text-start">

         {/* Quick Actions */}
         <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-4 px-2 tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
               <button onClick={() => navigate('/patient/book/doctors')} className="w-full bg-white border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] p-4 rounded-[16px] flex items-center gap-4 hover:border-primary-100 hover:shadow-sm transition-all group">
                  <div className="bg-primary-50 text-primary-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                     <PlusCircle className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-[13px]">{t('patientDashboard.bookAppt')}</span>
               </button>
               <button onClick={() => navigate('/patient/messages')} className="w-full bg-white border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] p-4 rounded-[16px] flex items-center gap-4 hover:border-primary-100 hover:shadow-sm transition-all group">
                  <div className="bg-primary-50 text-primary-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                     <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-[13px]">{t('patientDashboard.messageClinic')}</span>
               </button>
               <button className="w-full bg-white border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] p-4 rounded-[16px] flex items-center gap-4 hover:border-primary-100 hover:shadow-sm transition-all group">
                  <div className="bg-primary-50 text-primary-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                     <Pill className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-[13px]">{t('patientDashboard.refill')}</span>
               </button>
            </div>
         </div>

         {/* Medications */}
         <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-end mb-6">
               <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">{t('patientDashboard.medications')}</h3>
               <span className="text-[10px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">3 Today</span>
            </div>

            <div className="space-y-3">
               <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="bg-slate-100 text-slate-400 p-2 rounded-lg"><Pill className="w-4 h-4" /></div>
                  <div>
                     <div className="font-bold text-slate-900 text-xs mb-0.5">Lisinopril 10mg</div>
                     <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">08:00 AM</div>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="bg-slate-100 text-slate-400 p-2 rounded-lg"><Pill className="w-4 h-4" /></div>
                  <div>
                     <div className="font-bold text-slate-900 text-xs mb-0.5">Atorvastatin 20mg</div>
                     <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">08:00 AM</div>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="bg-slate-100 text-slate-400 p-2 rounded-lg"><Pill className="w-4 h-4" /></div>
                  <div>
                     <div className="font-bold text-slate-900 text-xs mb-0.5">Aspirin 81mg</div>
                     <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">08:00 PM</div>
                  </div>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}
