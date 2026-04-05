import React from 'react';
import { Calendar as CalendarIcon, FileText, ChevronDown, Download, CheckCircle2, Video, MapPin, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VisitHistory() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
         <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('visitHistory.title', { defaultValue: 'Visit History' })}</h2>
            <p className="text-[15px] font-medium text-slate-500 max-w-xl leading-relaxed">
               {t('visitHistory.description', { defaultValue: 'Review your historical appointments, clinical notes, and download comprehensive visit summaries for your records.' })}
            </p>
         </div>
         <div className="flex gap-3 shrink-0">
            <div className="relative">
               <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder={t('visitHistory.searchPlaceholder', { defaultValue: 'Search doctor or note...' })} className="ps-9 pe-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-shadow w-full md:w-64" />
            </div>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.02)] border border-slate-100 items-center">
         <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest me-2">{t('visitHistory.filterBy', { defaultValue: 'Filter By:' })}</div>
         
         <div className="relative">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-10">
               <option>All Years</option>
               <option>2023</option>
               <option>2022</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
         </div>

         <div className="relative">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-10">
               <option>All Specialties</option>
               <option>Cardiology</option>
               <option>Primary Care</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
         </div>

         <div className="relative">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-10">
               <option>Any Visit Type</option>
               <option>In-Person</option>
               <option>Virtual</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
         </div>

      </div>

      <div className="space-y-6">
         
         {/* Visit Card 1 */}
         <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 bottom-0 start-0 w-[5px] bg-primary-500"></div>
            
            <div className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pe-8 flex flex-col justify-center">
               <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-[13px] font-extrabold uppercase tracking-widest text-slate-400">Oct 05, 2023</span>
               </div>
               <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-4">10:00 AM</h3>
               
               <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Completed</span>
               </div>
            </div>

            <div className="flex-1">
               <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div>
                     <h4 className="font-extrabold text-lg text-slate-900 mb-1">Routine Cardiology Follow-up</h4>
                     <div className="text-sm font-bold text-primary-600 mb-3">Dr. Sarah Chen <span className="text-slate-400 font-medium ms-1">• Senior Cardiologist</span></div>
                     <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Video className="w-3.5 h-3.5 text-blue-500" /> Virtual Telehealth Visit
                     </span>
                  </div>
                  <button className="bg-white border-2 border-slate-100 hover:border-primary-200 text-primary-600 font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-primary-50 transition-colors flex items-center gap-2 shrink-0 text-[13px]">
                     <Download className="w-4 h-4" /> Visit Summary
                  </button>
               </div>
               
               <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <FileText className="w-4 h-4 text-primary-400" /> Clinical Notes
                  </div>
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                     Patient reported overall stable condition. Reviewed recent Holter monitor data which showed no significant arrhythmias. Instructed patient to maintain current dosage of Lisinopril. Recommended increasing weekly cardiovascular exercise. Follow up in 6 months or sooner if symptoms occur.
                  </p>
               </div>
            </div>
         </div>

         {/* Visit Card 2 */}
         <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 bottom-0 start-0 w-[5px] bg-slate-300"></div>
            
            <div className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pe-8 flex flex-col justify-center">
               <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-[13px] font-extrabold uppercase tracking-widest text-slate-400">Apr 12, 2023</span>
               </div>
               <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-4">02:30 PM</h3>
               
               <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Completed</span>
               </div>
            </div>

            <div className="flex-1">
               <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div>
                     <h4 className="font-extrabold text-lg text-slate-900 mb-1">Annual Wellness Exam</h4>
                     <div className="text-sm font-bold text-primary-600 mb-3">Dr. Marcus Vance <span className="text-slate-400 font-medium ms-1">• Primary Care</span></div>
                     <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" /> Downtown Clinic
                     </span>
                  </div>
                  <button className="bg-white border-2 border-slate-100 hover:border-primary-200 text-primary-600 font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-primary-50 transition-colors flex items-center gap-2 shrink-0 text-[13px]">
                     <Download className="w-4 h-4" /> Visit Summary
                  </button>
               </div>
               
               <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <FileText className="w-4 h-4 text-primary-400" /> Clinical Notes
                  </div>
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                     Routine physical examination. Vital signs normal. Ordered comprehensive metabolic panel and fasting lipid profile. Discussed dietary modifications to manage borderline elevated LDL cholesterol. Administered seasonal influenza vaccine.
                  </p>
               </div>
            </div>
         </div>

      </div>

      <div className="mt-8 text-center">
         <button className="bg-white border border-slate-200 shadow-sm text-slate-700 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
            {t('visitHistory.loadOlderVisits', { defaultValue: 'Load Older Visits' })} <ChevronDown className="w-4 h-4" />
         </button>
      </div>

    </div>
  )
}
