import React from 'react';
import { Heart, Activity, Scale, PlusCircle, MessageSquare, Pill, ChevronRight, FileText, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        
        {/* Welcome Section */}
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('patientDashboard.welcome')}</h2>
           <p className="text-slate-600 font-medium text-[15px]">
              {t('patientDashboard.subtitle')} <span className="font-bold text-primary-600 cursor-pointer hover:underline">Dr. Sarah Chen</span> tomorrow at 10:00 AM.
           </p>
        </div>

        {/* Hero & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Stat Cards (3) */}
           <div className="md:col-span-1 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-full"><Heart className="w-5 h-5 fill-current" /></div>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">+2%</span>
                 </div>
                 <div>
                    <div className="text-xs font-bold text-slate-500 mb-1">{t('patientDashboard.heartRate')}</div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">72 <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">BPM</span></div>
                 </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-50 text-red-500 rounded-full"><Activity className="w-5 h-5" /></div>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Stable</span>
                 </div>
                 <div>
                    <div className="text-xs font-bold text-slate-500 mb-1">{t('patientDashboard.bloodPressure')}</div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">120/80 <span className="text-[10px] font-bold text-slate-400 tracking-widest disable">mmHg</span></div>
                 </div>
              </div>

              {/* Spans across 2 columns below */}
              <div className="col-span-2 bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-full"><Scale className="w-5 h-5" /></div>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">-0.5kg</span>
                 </div>
                 <div className="relative z-10">
                    <div className="text-xs font-bold text-slate-500 mb-1">{t('patientDashboard.weight')}</div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">78.4 <span className="text-[10px] font-bold text-slate-400 tracking-widest disable">kg</span></div>
                 </div>
                 {/* Decorative chart line */}
                 <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-orange-50/50 to-transparent">
                     <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full stroke-orange-200 fill-none stroke-[2px]">
                       <path d="M0,20 Q20,10 40,15 T80,5 T100,10" />
                     </svg>
                 </div>
              </div>
           </div>

           {/* Next Appointment Hero */}
           <div className="md:col-span-1 bg-primary-700 rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg shadow-primary-700/20 flex flex-col justify-between">
              {/* Decorative elements */}
              <div className="absolute top-0 end-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <Calendar className="absolute top-6 end-6 w-24 h-24 text-white/5 end-6" strokeWidth={1} />

              <div className="relative z-10">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-4 opacity-80">{t('patientDashboard.nextAppt')}</div>
                 <h3 className="text-3xl font-extrabold mb-1 tracking-tight">Dr. Sarah Chen</h3>
                 <p className="text-sm font-medium text-primary-200 mb-8 opacity-90">Senior Cardiologist • General Checkup</p>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                       <Calendar className="w-4 h-4 text-primary-300" /> Tomorrow, Oct 24, 2023
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold opacity-90">
                       <Activity className="w-4 h-4 text-primary-300" /> 10:00 AM - 10:45 AM
                    </div>
                 </div>
              </div>
              
              <button onClick={() => navigate('/patient/appointments/1')} className="w-full bg-primary-600/50 hover:bg-primary-600 backdrop-blur-sm border border-primary-500/50 transition-colors py-3.5 rounded-xl font-bold text-sm relative z-10">
                 View Details
              </button>
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
                    <tr className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-5 px-4 ps-6 flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-500 stroke-[1.5]" />
                          <span className="font-bold text-slate-800">Annual Blood Panel</span>
                       </td>
                       <td className="py-5 px-4 font-semibold text-slate-600">Oct 12, 2023</td>
                       <td className="py-5 px-4 font-medium text-slate-500">Hematology</td>
                       <td className="py-5 px-4">
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100/50">Reviewed</span>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <button className="text-primary-600 hover:text-primary-800 p-1 rounded transition-colors"><Download className="w-4 h-4" /></button>
                       </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-5 px-4 ps-6 flex items-center gap-3">
                          <Activity className="w-5 h-5 text-primary-500 stroke-[1.5]" />
                          <span className="font-bold text-slate-800">Chest X-Ray Digital</span>
                       </td>
                       <td className="py-5 px-4 font-semibold text-slate-600">Sep 28, 2023</td>
                       <td className="py-5 px-4 font-medium text-slate-500">Radiology</td>
                       <td className="py-5 px-4">
                          <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-100/50">New</span>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <button className="text-primary-600 hover:text-primary-800 p-1 rounded transition-colors"><Download className="w-4 h-4" /></button>
                       </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-5 px-4 ps-6 flex items-center gap-3">
                          <Heart className="w-5 h-5 text-primary-500 stroke-[1.5]" />
                          <span className="font-bold text-slate-800">ECG Diagnostic Summary</span>
                       </td>
                       <td className="py-5 px-4 font-semibold text-slate-600">Aug 15, 2023</td>
                       <td className="py-5 px-4 font-medium text-slate-500">Cardiology</td>
                       <td className="py-5 px-4">
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100/50">Reviewed</span>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <button className="text-primary-600 hover:text-primary-800 p-1 rounded transition-colors"><Download className="w-4 h-4" /></button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

      </div>

      {/* Left Sidebar (Quick Actions) */}
      <div className="w-full lg:w-72 space-y-8 lg:order-first order-last">
         
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

         {/* Medications (Using literal text from design for fidelity) */}
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
  )
}
