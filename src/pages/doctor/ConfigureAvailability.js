import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, MapPin, FileText, ArrowLeft, Check, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { addAvailability, selectDoctorsLoading } from '../../store/slices/doctorSlice';

export default function ConfigureAvailability() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { t, i18n } = useTranslation();
   const loading = useSelector(selectDoctorsLoading);

   const [activeDays, setActiveDays] = useState(['mon', 'tue', 'wed', 'thu', 'fri']);
   const [excludedDates, setExcludedDates] = useState([]);
   const [isSaving, setIsSaving] = useState(false);

   const toggleExcludeDate = (dateStr) => {
      setExcludedDates(prev => 
         prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
      );
   };

   const [formData, setFormData] = useState({
      start_time: '08:00',
      end_time: '11:00'
   });

   const [previewSlots, setPreviewSlots] = useState([]);

   useEffect(() => {
      if (formData.start_time && formData.end_time) {
         setPreviewSlots([{ start: formData.start_time, end: formData.end_time }]);
      }
   }, [formData.start_time, formData.end_time]);

   const toggleDay = (day) => {
      setActiveDays(prev =>
         prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      );
   };

   const calculateTotalSlots = () => {
      let total = 0;
      const startDate = new Date();
      const dayMapping = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun' };
      for (let i = 0; i < 30; i++) {
         const d = new Date(startDate);
         d.setDate(startDate.getDate() + i);
         const ds = d.toISOString().split('T')[0];
         const dn = dayMapping[d.getDay()];
         if (activeDays.includes(dn) && !excludedDates.includes(ds)) {
            total += 1;
         }
      }
      return total;
   };

   const handleSave = async () => {
      if (activeDays.length === 0) {
         toast.error('Please select at least one active day');
         return;
      }

      setIsSaving(true);
      const dayMapping = {
         1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun'
      };

      try {
         // Apply for the next 30 days
         const startDate = new Date();
         const allSlotsToCreate = [];

         for (let i = 0; i < 30; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayName = dayMapping[currentDate.getDay()];
            const dateStr = currentDate.toISOString().split('T')[0];
            
            if (activeDays.includes(dayName) && !excludedDates.includes(dateStr)) {
               allSlotsToCreate.push({
                  available_date: dateStr,
                  start_time: formData.start_time,
                  end_time: formData.end_time
               });
            }
         }

         if (allSlotsToCreate.length === 0) {
            toast.error('No availability blocks generated for the selected days');
            setIsSaving(false);
            return;
         }

         toast.loading(`Generating ${allSlotsToCreate.length} availability blocks for the next month...`, { id: 'bulk-add' });

         await Promise.all(allSlotsToCreate.map(slotData => 
            dispatch(addAvailability(slotData)).unwrap()
         ));

         toast.success(`Successfully configured ${allSlotsToCreate.length} availability blocks for the month`, { id: 'bulk-add' });
         navigate('/doctor/schedule');
      } catch (err) {
         toast.error(err?.message || 'Failed to save availability', { id: 'bulk-add' });
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-24 font-sans">

         <button onClick={() => navigate('/doctor/schedule')} className="flex items-center gap-2 text-[11px] font-extrabold text-primary-600 uppercase tracking-widest hover:text-primary-800 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={3} /> {t('doctorConfigureAvailability.backToSchedule', { defaultValue: 'Back to Schedule' })}
         </button>

         {/* Header */}
         <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{t('doctorConfigureAvailability.title', { defaultValue: 'Configure Availability' })}</h2>
            <p className="text-[16px] font-medium text-slate-500 leading-relaxed max-w-3xl">
               {t('doctorConfigureAvailability.description', { defaultValue: 'Define your weekly clinic hours and operational locations. This schedule will be visible to patients and triage coordinators.' })}
            </p>
         </div>

         <div className="flex flex-col gap-8 mb-8">
            {/* Top Section: Standard Settings & Sidebar Preview */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
               {/* Main Settings Card */}
               <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 w-full">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                     <div className="w-12 h-12 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <Clock className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{t('doctorConfigureAvailability.weeklyClinicalHours')}</h3>
                        <p className="text-sm font-medium text-slate-500">{t('doctorConfigureAvailability.setActiveHours', { defaultValue: 'Set your active hours for the week' })}</p>
                     </div>
                  </div>

                  <div className="space-y-10">
                     {/* Weekdays Selection */}
                     <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('doctorSchedule.weeklyWorkHours', { defaultValue: 'Weekly Work Days' })}</label>
                        <div className="flex flex-wrap gap-2.5">
                           {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                              <button
                                 key={day}
                                 onClick={() => toggleDay(day)}
                                 className={`flex-1 min-w-[70px] py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${activeDays.includes(day) ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 ring-2 ring-primary-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                 {t(`days.${day}`, { defaultValue: day.charAt(0).toUpperCase() + day.slice(1) })}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Times Selection */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">{t('doctorConfigureAvailability.startTime', { defaultValue: 'Start Time' })}</label>
                           <div className="relative">
                              <input
                                 type="time"
                                 value={formData.start_time}
                                 onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                 className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl px-6 py-4 text-[15px] font-bold text-slate-800 transition-all outline-none"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">{t('doctorConfigureAvailability.endTime', { defaultValue: 'End Time' })}</label>
                           <div className="relative">
                              <input
                                 type="time"
                                 value={formData.end_time}
                                 onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                 className="w-full bg-slate-50/50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl px-6 py-4 text-[15px] font-bold text-slate-800 transition-all outline-none"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Duration Selection */}
                  </div>
               </div>

               {/* Preview Sidebar */}
               <div className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-6">
                  {/* Slots Summary Card */}
                  <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-600/20 relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="text-[11px] font-bold text-primary-100 uppercase tracking-widest mb-4">{t('doctorConfigureAvailability.availabilityPreview')}</div>
                        <div className="flex items-end gap-2 mb-6">
                           <span className="text-5xl font-black">{calculateTotalSlots()}</span>
                           <span className="text-xs font-bold text-primary-100 mb-2 uppercase tracking-wide">Total Slots</span>
                        </div>
                        <button
                           onClick={handleSave}
                           disabled={isSaving || loading || activeDays.length === 0 || calculateTotalSlots() === 0}
                           className="w-full bg-white text-primary-600 hover:bg-primary-50 font-black text-[15px] py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                           {(isSaving || loading) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                           {t('doctorConfigureAvailability.saveAvailability')}
                        </button>
                     </div>
                     <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                  </div>

                  {/* Individual Day Pattern Preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
                     <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">Daily Pattern</div>
                     <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {previewSlots.map((slot, i) => (
                           <div key={i} className="bg-white border border-slate-200/60 p-3 rounded-xl flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700">{slot.start} - {slot.end}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                           </div>
                        ))}
                        {previewSlots.length === 0 && (
                           <div className="text-center py-8 text-xs font-bold text-slate-400">{t('doctorConfigureAvailability.selectRangeHint')}</div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom Section: Monthly Planned Dates (The "Editing" Area) */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('doctorConfigureAvailability.plannedDates')}</h3>
                        <p className="text-sm font-medium text-slate-500">Plan for the next 30 days. Click any date to remove it from generation.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Included
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Excluded
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 30 }).map((_, i) => {
                     const date = new Date();
                     date.setDate(date.getDate() + i);
                     const dateStr = date.toISOString().split('T')[0];
                     const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

                     if (activeDays.includes(dayName)) {
                        const isExcluded = excludedDates.includes(dateStr);
                        const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';

                        return (
                           <button
                              key={i}
                              onClick={() => toggleExcludeDate(dateStr)}
                              className={`group relative text-start transition-all duration-300 border rounded-2xl p-4 overflow-hidden ${isExcluded
                                    ? 'bg-slate-50 border-slate-200 opacity-60'
                                    : 'bg-white border-slate-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-1'
                                 }`}>
                              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${isExcluded ? 'text-slate-400' : 'text-primary-600'}`}>
                                 {date.toLocaleDateString(locale, { weekday: 'short' })}
                              </div>
                              <div className={`text-xl font-black tracking-tight ${isExcluded ? 'text-slate-400 font-bold' : 'text-slate-900 group-hover:text-primary-600'}`}>
                                 {date.toLocaleDateString(locale, { month: 'numeric', day: 'numeric' })}
                              </div>

                              {isExcluded ? (
                                 <div className="mt-3 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Day Off</span>
                                 </div>
                              ) : (
                                 <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                       Included
                                    </span>
                                 </div>
                              )}
                           </button>
                        );
                     }
                     return null;
                  })}
               </div>
            </div>

            {/* Editing Modal */}

            {/* BOTTOM Operational Notes */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{t('doctorConfigureAvailability.operationalNotes', { defaultValue: 'Operational Notes' })}</h3>
               </div>
               <textarea
                  rows="4"
                  placeholder={t('doctorConfigureAvailability.notesPlaceholder')}
                  className="w-full bg-slate-50/50 border-none rounded-2xl p-5 text-[14px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 resize-none transition-all"
               ></textarea>
            </div>
         </div>

      </div>
   )
}
