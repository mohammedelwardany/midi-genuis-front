import React from 'react';
import { Calendar, Stethoscope, UserPlus, AlertCircle, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PatientDirectory() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 pb-20 relative">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('doctorPatientDirectory.title', { defaultValue: 'Patient Directory' })}</h2>
           <p className="text-[15px] font-medium text-slate-500 max-w-xl leading-relaxed">
             {t('doctorPatientDirectory.description', { defaultValue: 'Manage and monitor patient records with clinical precision. Access histories, conditions, and sessions instantaneously.' })}
           </p>
        </div>
        
        <div className="flex flex-wrap gap-2 lg:gap-3 bg-slate-50 p-1 rounded-2xl border border-slate-100 shrink-0">
           <button className="px-5 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 transition-all">{t('doctorPatientDirectory.allPatients', { defaultValue: 'All Patients' })}</button>
           <button className="px-5 py-2.5 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200/50 hover:text-slate-900 transition-colors">{t('doctorPatientDirectory.myPatients', { defaultValue: 'My Patients' })}</button>
           <button className="px-5 py-2.5 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200/50 hover:text-slate-900 transition-colors">{t('doctorPatientDirectory.recentVisits', { defaultValue: 'Recent Visits' })}</button>
           <button className="px-5 py-2.5 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200/50 hover:text-slate-900 transition-colors">{t('doctorPatientDirectory.flagged', { defaultValue: 'Flagged' })}</button>
        </div>
      </div>

      {/* Main Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] mb-10">
         <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse min-w-[900px]">
               <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                     <th className="px-8 py-5 w-[250px] rounded-ts-3xl">{t('doctorPatientDirectory.table.patientName', { defaultValue: 'Patient Name' })}</th>
                     <th className="px-4 py-5 w-[150px]">{t('doctorPatientDirectory.table.genderAge', { defaultValue: 'Gender/Age' })}</th>
                     <th className="px-4 py-5 w-[200px]">{t('doctorPatientDirectory.table.chronicConditions', { defaultValue: 'Chronic Conditions' })}</th>
                     <th className="px-4 py-5 w-[150px]">{t('doctorPatientDirectory.table.lastVisit', { defaultValue: 'Last Visit' })}</th>
                     <th className="px-4 py-5 w-[150px]">{t('doctorPatientDirectory.table.allergies', { defaultValue: 'Allergies' })}</th>
                     <th className="px-4 py-5 text-center w-[100px] rounded-te-3xl">{t('doctorPatientDirectory.table.actions', { defaultValue: 'Actions' })}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50/80 text-sm">
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <img src="https://ui-avatars.com/api/?name=Eleanor+Rigby&background=f1f5f9" className="w-12 h-12 rounded-full border border-slate-200" alt="avatar" />
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 tracking-tight">Eleanor Rigby</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #MG-88219</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-5 font-bold text-slate-700">F, 72y</td>
                     <td className="px-4 py-5">
                        <div className="flex flex-col gap-1.5 items-start">
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-blue-100/50">Type 2 Diabetes</span>
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-blue-100/50">Hypertension</span>
                        </div>
                     </td>
                     <td className="px-4 py-5">
                        <div className="font-bold text-slate-900 text-[13px] mb-0.5">Oct 12, 2023</div>
                        <div className="text-[11px] font-medium text-slate-500">Follow-up Consultation</div>
                     </td>
                     <td className="px-4 py-5">
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-red-100/50">Penicillin</span>
                     </td>
                     <td className="px-4 py-5 text-center">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                     </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <img src="https://ui-avatars.com/api/?name=Arthur+Dent&background=f1f5f9" className="w-12 h-12 rounded-full border border-slate-200" alt="avatar" />
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 tracking-tight">Arthur Dent</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #MG-44012</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-5 font-bold text-slate-700">M, 42y</td>
                     <td className="px-4 py-5">
                        <div className="flex flex-col gap-1.5 items-start">
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-blue-100/50">Asthma</span>
                        </div>
                     </td>
                     <td className="px-4 py-5">
                        <div className="font-bold text-slate-900 text-[13px] mb-0.5">Oct 18, 2023</div>
                        <div className="text-[11px] font-medium text-slate-500">Emergency Visit</div>
                     </td>
                     <td className="px-4 py-5">
                        <span className="text-slate-400 font-bold">—</span>
                     </td>
                     <td className="px-4 py-5 text-center">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                     </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <img src="https://ui-avatars.com/api/?name=Jasmine+Miller&background=f1f5f9" className="w-12 h-12 rounded-full border border-slate-200" alt="avatar" />
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 tracking-tight">Jasmine Miller</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #MG-92110</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-5 font-bold text-slate-700">F, 29y</td>
                     <td className="px-4 py-5">
                        <span className="text-slate-400 font-bold">—</span>
                     </td>
                     <td className="px-4 py-5">
                        <div className="font-bold text-slate-900 text-[13px] mb-0.5">Oct 24, 2023</div>
                        <div className="text-[11px] font-medium text-slate-500">Annual Physical</div>
                     </td>
                     <td className="px-4 py-5">
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-red-100/50">Sulfa Drugs</span>
                     </td>
                     <td className="px-4 py-5 text-center">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                     </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/50 transition-colors border-b border-transparent">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <img src="https://ui-avatars.com/api/?name=Marcus+Aurelius&background=f1f5f9" className="w-12 h-12 rounded-full border border-slate-200" alt="avatar" />
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 tracking-tight">Marcus Aurelius</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #MG-11022</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-5 font-bold text-slate-700">M, 55y</td>
                     <td className="px-4 py-5">
                        <div className="flex flex-col gap-1.5 items-start">
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-blue-100/50">Hyperlipidemia</span>
                           <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-blue-100/50">GERD</span>
                        </div>
                     </td>
                     <td className="px-4 py-5">
                        <div className="font-bold text-slate-900 text-[13px] mb-0.5">Oct 25, 2023</div>
                        <div className="text-[11px] font-medium text-slate-500">Lab Review</div>
                     </td>
                     <td className="px-4 py-5">
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest border border-red-100/50">Aspirin</span>
                     </td>
                     <td className="px-4 py-5 text-center">
                        <button className="text-slate-400 hover:text-slate-800 p-2 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                     </td>
                  </tr>

               </tbody>
            </table>
         </div>

         {/* Pagination Footer */}
         <div className="bg-white border-t border-slate-100 p-6 rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[13px] font-medium text-slate-500">
               Showing <span className="font-bold text-slate-900">1-4</span> of <span className="font-bold text-slate-900">1,248</span> patients
            </div>
            
            <div className="flex items-center gap-2">
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><ChevronLeft className="w-4 h-4 rtl:rotate-180" /></button>
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm shadow-sm shadow-primary-600/20">1</button>
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">2</button>
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">3</button>
               <span className="w-9 h-9 flex items-center justify-center text-slate-400 font-bold">...</span>
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">312</button>
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><ChevronRight className="w-4 h-4 rtl:rotate-180" /></button>
            </div>
         </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Card 1: Primary Metric */}
         <div className="bg-primary-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-primary-700/20 group">
            <div className="absolute -end-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm"><Calendar className="w-6 h-6 text-white" /></div>
               <span className="bg-primary-600/50 text-primary-100 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-primary-500/50">Today</span>
            </div>
            
            <div className="relative z-10">
               <div className="text-xs font-bold text-primary-200 mb-1 opacity-90 tracking-wide">Scheduled Appointments</div>
               <div className="text-5xl font-extrabold mb-8 tracking-tight">18</div>
               
               <div className="text-xs font-medium text-primary-100 opacity-80 flex items-center gap-1.5"><span className="text-white font-bold">↗</span> 12% increase from yesterday</div>
            </div>
         </div>

         {/* Card 2: High Priority */}
         <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)] flex flex-col justify-between">
            <div>
               <div className="flex justify-between items-start mb-8">
                  <div className="bg-red-50 p-3 rounded-2xl text-red-600"><AlertCircle className="w-6 h-6" /></div>
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">High Priority</span>
               </div>
               
               <div className="text-xs font-bold text-slate-500 mb-1 tracking-wide">Pending Lab Reviews</div>
               <div className="text-5xl font-extrabold text-slate-900 tracking-tight">06</div>
            </div>
            
            <div className="mt-8">
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-red-500 rounded-full"></div>
               </div>
            </div>
         </div>

         {/* Card 3: Neutral Metric */}
         <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)] flex flex-col justify-between">
            <div>
               <div className="flex justify-between items-start mb-8">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><UserPlus className="w-6 h-6" /></div>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">New</span>
               </div>
               
               <div className="text-xs font-bold text-slate-500 mb-1 tracking-wide">New Patient Registrations</div>
               <div className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">24</div>
               <p className="text-xs font-medium text-slate-400 mt-2">This week's clinic throughput</p>
            </div>
         </div>

      </div>

    </div>
  )
}
