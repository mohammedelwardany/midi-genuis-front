import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings, Plus, LayoutGrid, List as ListIcon, Clock, MapPin, ChevronDown } from 'lucide-react';

export default function DoctorSchedule() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  return (
    <div className="animate-in fade-in duration-500 pb-20 relative font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
             {view === 'grid' ? t('doctorSchedule.clinicalWorkHours') : t('doctorSchedule.weeklyWorkHours')}
           </h2>
           <p className="text-[15px] font-medium text-slate-500 max-w-xl">
             {t('doctorSchedule.description', { defaultValue: 'Configure your standard clinical availability for patient consultations.' })}
           </p>
        </div>
        
        <div className="flex gap-4">
           {/* View Toggle */}
           <div className="flex bg-slate-100 p-1.5 rounded-[16px] shadow-sm">
              <button 
                onClick={() => setView('grid')}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-[12px] transition-all ${view === 'grid' ? 'bg-white text-primary-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)]' : 'text-slate-500 hover:text-slate-800'}`}>
                <LayoutGrid className="w-4 h-4" /> {t('doctorSchedule.weeklyGrid', { defaultValue: 'Weekly Grid' })}
              </button>
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-[12px] transition-all ${view === 'list' ? 'bg-white text-primary-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)]' : 'text-slate-500 hover:text-slate-800'}`}>
                <ListIcon className="w-4 h-4" /> {t('doctorSchedule.listView', { defaultValue: 'List View' })}
              </button>
           </div>
           
           <button onClick={() => navigate('/doctor/schedule/configure')} className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-[16px] font-bold shadow-[0_2px_12px_rgb(0,0,0,0.1)] transition-all flex items-center gap-2 text-[15px]">
              <Settings className="w-4 h-4" /> {t('doctorSchedule.updateChanges', { defaultValue: 'Update Changes' })}
           </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
         
         {/* Main Content Area */}
         <div className="w-full xl:flex-1 bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] min-h-[600px] overflow-hidden">
            
            {view === 'grid' ? (
               /* Grid View Content */
               <div className="p-4 overflow-x-auto">
                 <div className="min-w-[700px]">
                    {/* Grid Headers */}
                    <div className="grid grid-cols-8 border-b border-slate-100 pb-4 mb-4 text-center">
                       <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-start ps-4 pt-2">Time</div>
                       
                       <div className="py-2">
                          <div className="font-extrabold text-slate-900 text-sm">Mon</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">12 Oct</div>
                       </div>
                       <div className="py-2">
                          <div className="font-extrabold text-slate-900 text-sm">Tue</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">13 Oct</div>
                       </div>
                       <div className="py-2">
                          <div className="font-extrabold text-primary-600 text-sm">Wed</div>
                          <div className="text-[10px] font-semibold text-primary-400 mt-1 uppercase tracking-widest text-blue-400">14 Oct</div>
                       </div>
                       <div className="py-2">
                          <div className="font-extrabold text-slate-900 text-sm">Thu</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">15 Oct</div>
                       </div>
                       <div className="py-2 border-r border-slate-50 border-dashed">
                          <div className="font-extrabold text-slate-900 text-sm">Fri</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">16 Oct</div>
                       </div>
                       <div className="py-2 opacity-50">
                          <div className="font-bold text-slate-500 text-sm">Sat</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">17 Oct</div>
                       </div>
                       <div className="py-2 opacity-50">
                          <div className="font-bold text-slate-500 text-sm">Sun</div>
                          <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">18 Oct</div>
                       </div>
                    </div>

                    {/* Grid Body - Simplified visual representation */}
                    <div className="relative h-[600px] grid grid-cols-8 px-4 gap-0 divide-x divide-slate-50/50">
                       
                       {/* Time column */}
                       <div className="flex flex-col justify-between pe-4 pb-4">
                          {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((time) => (
                             <div key={time} className="text-[11px] font-bold text-slate-400 h-16 border-t border-transparent">{time}</div>
                          ))}
                       </div>

                       {/* Mon */}
                       <div className="relative h-full flex flex-col border-l border-slate-100/50 group">
                          <div className="h-16 border-t border-slate-100/50"></div>
                          {/* Block: Consultations */}
                          <div className="absolute top-[3%] start-2 end-2 h-[45%] bg-blue-50/80 rounded-xl border-s-[3px] border-s-blue-600 p-3 pt-4 hover:shadow-md transition-shadow cursor-pointer">
                             <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">Consultations</div>
                             <div className="text-xs font-bold text-slate-800">08:00 - 12:00</div>
                          </div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-slate-100/50"></div>)}
                       </div>

                       {/* Tue */}
                       <div className="relative h-full flex flex-col border-l border-slate-100/50 group">
                          <div className="h-16 border-t border-slate-100/50"></div>
                          {/* Block: Patient Reviews */}
                          <div className="absolute top-[3%] start-2 end-2 h-[35%] bg-slate-50/80 rounded-xl border-s-[3px] border-s-blue-600 p-3 pt-4 hover:shadow-md transition-shadow cursor-pointer">
                             <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">Patient Reviews</div>
                             <div className="text-xs font-bold text-slate-800">08:00 - 11:00</div>
                          </div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-slate-100/50"></div>)}
                       </div>

                       {/* Wed */}
                       <div className="relative h-full flex flex-col border-l border-primary-100 bg-primary-50/10 group">
                          <div className="h-16 border-t border-slate-100/50"></div>
                          {/* Block: OR Hours */}
                          <div className="absolute top-[3%] start-2 end-2 h-[45%] bg-orange-50/50 rounded-xl border-s-[3px] border-s-orange-700 p-3 pt-4 hover:shadow-md transition-shadow cursor-pointer">
                             <div className="text-[9px] font-extrabold text-orange-700 uppercase tracking-widest mb-1">OR Hours</div>
                             <div className="text-xs font-bold text-slate-800">08:00 - 12:00</div>
                          </div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-primary-100/50"></div>)}
                       </div>

                       {/* Thu */}
                       <div className="relative h-full flex flex-col border-l border-slate-100/50 group">
                          <div className="h-16 border-t border-slate-100/50"></div>
                          {/* Block: Consultations */}
                          <div className="absolute top-[16%] start-2 end-2 h-[35%] bg-blue-50/80 rounded-xl border-s-[3px] border-s-blue-600 p-3 pt-4 hover:shadow-md transition-shadow cursor-pointer">
                             <div className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">Consultations</div>
                             <div className="text-xs font-bold text-slate-800">09:00 - 12:00</div>
                          </div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-slate-100/50"></div>)}
                       </div>

                       {/* Fri */}
                       <div className="relative h-full flex flex-col border-l border-slate-100/50 border-r border-dashed">
                          {/* Empty Day */}
                          <div className="h-16 border-t border-transparent"></div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-slate-100/50"></div>)}
                       </div>

                       {/* Weekend */}
                       <div className="relative h-full flex flex-col border-r border-slate-50/50 bg-slate-50/30">
                          <div className="h-16 border-t border-transparent"></div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-slate-100/50"></div>)}
                       </div>
                       <div className="relative h-full flex flex-col bg-slate-50/30">
                          <div className="h-16 border-t border-transparent"></div>
                          {[...Array(6)].map((_, i) => <div key={i} className="h-16 border-t border-slate-100/50"></div>)}
                       </div>

                    </div>
                 </div>
               </div>
            ) : (
               /* List View Content */
               <div className="p-8 pb-12">
                  <div className="grid grid-cols-12 mb-6 border-b border-slate-100 pb-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ps-4">
                     <div className="col-span-3">Day</div>
                     <div className="col-span-4">Clinical Hours</div>
                     <div className="col-span-3">Location</div>
                     <div className="col-span-2 text-end">Duration</div>
                  </div>

                  <div className="space-y-[18px]">
                     {/* List Row 1 */}
                     <div className="grid grid-cols-12 items-center bg-white border border-slate-100 hover:border-slate-200 transition-colors p-[18px] rounded-[16px] shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                        <div className="col-span-3 flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-extrabold opacity-80">M</div>
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 leading-tight">Monday</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Oct 12, 2023</div>
                           </div>
                        </div>
                        <div className="col-span-4 font-bold text-[15px] text-primary-700 flex items-center gap-2">
                           <Clock className="w-[18px] h-[18px]" strokeWidth={2.5}/> 08:00 AM - 12:00 PM
                        </div>
                        <div className="col-span-3 font-semibold text-[13px] text-slate-500 flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-slate-400" /> Main Office
                        </div>
                        <div className="col-span-2 text-end">
                           <span className="bg-slate-50 font-bold text-[11px] text-slate-600 px-[14px] py-[6px] rounded-[8px] border border-slate-100">30m slots</span>
                        </div>
                     </div>

                     {/* List Row 2 */}
                     <div className="grid grid-cols-12 items-center bg-white border border-slate-100 hover:border-slate-200 transition-colors p-[18px] rounded-[16px] shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                        <div className="col-span-3 flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-extrabold opacity-80">T</div>
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 leading-tight">Tuesday</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Oct 13, 2023</div>
                           </div>
                        </div>
                        <div className="col-span-4 font-bold text-[15px] text-primary-700 flex items-center gap-2">
                           <Clock className="w-[18px] h-[18px]" strokeWidth={2.5}/> 09:00 AM - 01:00 PM
                        </div>
                        <div className="col-span-3 font-semibold text-[13px] text-slate-500 flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-slate-400" /> Remote (Telehealth)
                        </div>
                        <div className="col-span-2 text-end">
                           <span className="bg-slate-50 font-bold text-[11px] text-slate-600 px-[14px] py-[6px] rounded-[8px] border border-slate-100">15m slots</span>
                        </div>
                     </div>

                     {/* List Row 3 */}
                     <div className="grid grid-cols-12 items-center bg-primary-50/30 border border-primary-100 hover:border-primary-200 transition-colors p-[18px] rounded-[16px] shadow-[0_2px_8px_rgb(0,0,0,0.02)] relative overflow-hidden">
                        <div className="absolute start-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                        <div className="col-span-3 flex items-center gap-4">
                           <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-extrabold shadow-sm">W</div>
                           <div>
                              <div className="font-extrabold text-[15px] text-slate-900 leading-tight">Wednesday</div>
                              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-1">TODAY</div>
                           </div>
                        </div>
                        <div className="col-span-4 font-bold text-[15px] text-primary-700 flex items-center gap-2">
                           <Clock className="w-[18px] h-[18px]" strokeWidth={2.5}/> 08:00 AM - 12:00 PM
                        </div>
                        <div className="col-span-3 font-semibold text-[13px] text-slate-500 flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-slate-400" /> Surgical Wing B
                        </div>
                        <div className="col-span-2 text-end">
                           <span className="bg-white font-bold text-[11px] text-primary-600 px-[14px] py-[6px] rounded-[8px] border border-primary-100/50 shadow-[0_2px_4px_rgb(0,0,0,0.02)]">60m slots</span>
                        </div>
                     </div>
                     
                     {/* Weekend Disabled Items */}
                     <div className="mt-8 border-t border-dashed border-slate-200 pt-8 space-y-[18px]">
                        <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100/50 border-dashed p-[18px] rounded-[16px]">
                           <div className="flex items-center gap-4 opacity-50">
                              <div className="font-extrabold text-[15px] text-slate-600 w-10 text-center">S</div>
                              <div>
                                 <div className="font-bold text-[15px] text-slate-600">Saturday</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Oct 17, 2023</div>
                              </div>
                           </div>
                           <div className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center flex-1">
                              No clinical hours scheduled
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Sidebar Area */}
         <div className="w-full xl:w-[320px] shrink-0 space-y-6">
            
            {/* Quick Add Blocks */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-6">
               <h3 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{t('doctorSchedule.quickAddBlocks', { defaultValue: 'Quick Add Blocks' })}</h3>
               
               <div className="flex justify-between items-center bg-white border border-slate-200 p-3 px-4 rounded-2xl hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                     <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                     <span className="font-semibold text-sm text-slate-800">{t('doctorSchedule.clinicalHours', { defaultValue: 'Clinical Hours' })}</span>
                  </div>
                  <div className="text-slate-300 group-hover:text-primary-600 transition-colors"><Plus className="w-5 h-5" /></div>
               </div>
            </div>

            {/* Clinical Settings */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] xl:p-6 lg:p-4 px-6 py-6 pb-2">
               <h3 className="text-lg font-extrabold text-slate-900 mb-6 tracking-tight">{t('doctorSchedule.clinicalSettings', { defaultValue: 'Clinical Settings' })}</h3>
               
               <div className="space-y-5">
                  <div>
                     <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">{t('doctorSchedule.consultationDuration', { defaultValue: 'Consultation Duration' })}</label>
                     <div className="relative">
                        <select className="appearance-none w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 pe-10 focus:ring-2 focus:ring-primary-500 cursor-pointer">
                           <option>30 Minutes</option>
                           <option>15 Minutes</option>
                           <option>60 Minutes</option>
                        </select>
                        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">{t('doctorSchedule.notePrepBuffer', { defaultValue: 'Note Prep Buffer' })}</label>
                     <div className="relative">
                        <select className="appearance-none w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 pe-10 focus:ring-2 focus:ring-primary-500 cursor-pointer">
                           <option>5 Minutes</option>
                           <option>10 Minutes</option>
                           <option>0 Minutes</option>
                        </select>
                        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 pb-2 mt-2">
                     <div className="flex items-center justify-between">
                        <div>
                           <div className="font-bold text-[14px] text-slate-800 mb-0.5">{t('doctorSchedule.autoConfirmClinical', { defaultValue: 'Auto-Confirm Clinical' })}</div>
                           <div className="text-xs font-medium text-slate-500 pe-4">Auto-accept consultation requests</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                     </div>
                  </div>
               </div>
            </div>

            {/* Capacity Card */}
            <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.1)]">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/80 to-slate-900/20 z-10"></div>
               {/* Decorative generic image for hospital bed/corridor feel (using a colorful shape pattern as fallback) */}
               <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop')" }}></div>
               </div>
               
               <div className="relative z-20 flex flex-col justify-end h-[140px]">
                  <div className="text-[10px] font-extrabold text-primary-200 uppercase tracking-widest mb-1 shadow-sm">{t('doctorSchedule.clinicalCapacity', { defaultValue: 'Clinical Capacity' })}</div>
                  <div className="text-4xl font-extrabold tracking-tight mb-2">34.0 hrs</div>
                  <div className="text-xs font-semibold text-slate-300/80">Exclusive of admin & prep</div>
               </div>
            </div>

         </div>

      </div>
    </div>
  )
}
