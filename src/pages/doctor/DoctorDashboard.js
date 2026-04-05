import React from 'react';
import { Users, Timer, MessageSquare, MoreVertical, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DoctorDashboard() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 pb-20 relative">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('doctorDashboard.title')}</h2>
           <p className="text-[15px] font-medium text-slate-500">
             {t('doctorDashboard.desc')}
           </p>
        </div>
        
        <div className="flex gap-4">
           {/* Stat Card 1 */}
           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)] min-w-[180px]">
              <div className="flex justify-between items-start mb-3">
                 <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                    <Users className="w-5 h-5" />
                 </div>
                 <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">+12%</span>
              </div>
              <div className="text-xs font-bold text-slate-500 mb-0.5">{t('doctorDashboard.totalPatients')}</div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">42</div>
           </div>

           {/* Stat Card 2 */}
           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)] min-w-[180px]">
              <div className="flex justify-between items-start mb-3">
                 <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                    <Timer className="w-5 h-5" />
                 </div>
                 <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">{t('doctorDashboard.normal', { defaultValue: 'Normal' })}</span>
              </div>
              <div className="text-xs font-bold text-slate-500 mb-0.5">{t('doctorDashboard.avgWait')}</div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">18 <span className="text-sm font-semibold text-slate-400">{t('doctorDashboard.min')}</span></div>
           </div>
        </div>
      </div>

      {/* Active Queue Table */}
      <div>
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">{t('doctorDashboard.activeQueue')}</h3>
            <div className="flex gap-3">
               <button className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl transition-colors">{t('doctorDashboard.exportLog')}</button>
               <button className="text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl shadow-sm transition-all shadow-primary-600/20">{t('doctorDashboard.fullSchedule')}</button>
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
                  
                  {/* Status: In Consultation */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-6">
                        <div className="font-extrabold text-[15px] text-primary-600">09:30 AM</div>
                        <div className="text-[11px] font-semibold text-slate-400">Scheduled</div>
                     </td>
                     <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-sm border border-blue-200/50">EK</div>
                           <div>
                              <div className="font-bold text-[15px] text-slate-900">Eleanor Kade</div>
                              <div className="text-[12px] font-medium text-slate-500">Female, 42y</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-6 font-bold text-slate-700">Hypertension Follow-up</td>
                     <td className="px-4 py-6">
                        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-100/50">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                           {t('doctorDashboard.inConsultation', { defaultValue: 'In Consultation' })}
                        </span>
                     </td>
                     <td className="px-4 py-6 text-center">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                     </td>
                  </tr>

                  {/* Status: Waiting */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-6">
                        <div className="font-extrabold text-[15px] text-slate-900">10:00 AM</div>
                        <div className="text-[11px] font-semibold text-slate-400">Arrived 09:52</div>
                     </td>
                     <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm shadow-sm border border-slate-200/50">RM</div>
                           <div>
                              <div className="font-bold text-[15px] text-slate-900">Robert Miller</div>
                              <div className="text-[12px] font-medium text-slate-500">Male, 68y</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-6 font-bold text-slate-700">Post-Op Review</td>
                     <td className="px-4 py-6">
                        <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-orange-100/50">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                           {t('doctorDashboard.waiting', { defaultValue: 'Waiting' })}
                        </span>
                     </td>
                     <td className="px-4 py-6 text-center">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                     </td>
                  </tr>

                  {/* Status: Completed */}
                  <tr className="bg-slate-50/30">
                     <td className="px-8 py-6 opacity-50">
                        <div className="font-extrabold text-[15px] text-slate-900">09:00 AM</div>
                        <div className="text-[11px] font-semibold text-slate-400">Finished</div>
                     </td>
                     <td className="px-4 py-6 opacity-50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm shadow-sm border border-slate-200/50">AS</div>
                           <div>
                              <div className="font-bold text-[15px] text-slate-900">Alice Smith</div>
                              <div className="text-[12px] font-medium text-slate-500">Female, 29y</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-6 font-bold text-slate-500 opacity-80">Routine Checkup</td>
                     <td className="px-4 py-6">
                        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-emerald-100/50">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                           {t('doctorDashboard.completed', { defaultValue: 'Completed' })}
                        </span>
                     </td>
                     <td className="px-4 py-6 text-center opacity-50">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><Eye className="w-5 h-5" /></button>
                     </td>
                  </tr>

               </tbody>
            </table>
         </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 end-8 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-2xl shadow-xl shadow-primary-600/30 transition-transform hover:-translate-y-1 z-50">
         <MessageSquare className="w-6 h-6" />
      </button>

    </div>
  )
}
