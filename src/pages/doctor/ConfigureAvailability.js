import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, FileText, ArrowLeft, Check } from 'lucide-react';

export default function ConfigureAvailability() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeDays, setActiveDays] = useState(['mon', 'tue', 'wed', 'thu', 'fri']);
  const [duration, setDuration] = useState('30m'); // '15m' | '30m' | '60m'
  const [location, setLocation] = useState('stmary');

  const toggleDay = (day) => {
    setActiveDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-24 font-sans">
      
      <button onClick={() => navigate('/doctor/schedule')} className="flex items-center gap-2 text-[11px] font-extrabold text-primary-600 uppercase tracking-widest hover:text-primary-800 transition-colors mb-6">
         <ArrowLeft className="w-4 h-4" strokeWidth={3} /> {t('doctorConfigureAvailability.backToSchedule', { defaultValue: 'Back to Schedule' })}
      </button>

      {/* Header */}
      <div className="mb-10">
         <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{t('doctorConfigureAvailability.title', { defaultValue: 'Configure Availability' })}</h2>
         <p className="text-[16px] font-medium text-slate-500 leading-relaxed max-w-3xl">
           {t('doctorConfigureAvailability.description', { defaultValue: 'Define your weekly clinic hours, consultation durations, and operational locations. This schedule will be visible to patients and triage coordinators.' })}
         </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
         
         {/* Main Settings Card */}
         <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 w-full min-h-[400px]">
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <Clock className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{t('doctorConfigureAvailability.weeklyClinicalHours')}</h3>
                  <p className="text-sm font-medium text-slate-500">{t('doctorConfigureAvailability.setActiveHours', { defaultValue: 'Set your active hours for the week' })}</p>
               </div>
            </div>

            <div className="mb-8">
               <div className="flex flex-wrap gap-2">
                  <button 
                     onClick={() => toggleDay('mon')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('mon') ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                     Mon
                  </button>
                  <button 
                     onClick={() => toggleDay('tue')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('tue') ? 'bg-primary-200/50 text-primary-700 shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                     Tue
                  </button>
                  <button 
                     onClick={() => toggleDay('wed')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('wed') ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                     Wed
                  </button>
                  <button 
                     onClick={() => toggleDay('thu')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('thu') ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                     Thu
                  </button>
                  <button 
                     onClick={() => toggleDay('fri')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('fri') ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                     Fri
                  </button>
                  <button 
                     onClick={() => toggleDay('sat')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('sat') ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400 opacity-60'}`}>
                     Sat
                  </button>
                  <button 
                     onClick={() => toggleDay('sun')}
                     className={`w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeDays.includes('sun') ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400 opacity-60'}`}>
                     Sun
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
               <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">{t('doctorConfigureAvailability.startTime', { defaultValue: 'Start Time' })}</label>
                  <input type="text" defaultValue="08:00 AM" className="w-full bg-slate-50/80 border-none rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500" />
               </div>
               <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">{t('doctorConfigureAvailability.endTime', { defaultValue: 'End Time' })}</label>
                  <input type="text" defaultValue="05:00 PM" className="w-full bg-slate-50/80 border-none rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500" />
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">{t('doctorConfigureAvailability.consultationDuration', { defaultValue: 'Consultation Duration' })}</label>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setDuration('15m')}
                    className={`flex-1 py-4 font-bold rounded-2xl text-[15px] border-none transition-colors ${duration === '15m' ? 'bg-blue-100/50 text-blue-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                     15 Min
                  </button>
                  <button 
                    onClick={() => setDuration('30m')}
                    className={`flex-1 py-4 font-bold rounded-2xl text-[15px] border-none transition-colors ${duration === '30m' ? 'bg-slate-50 text-slate-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                     30 Min
                  </button>
                  <button 
                    onClick={() => setDuration('60m')}
                    className={`flex-1 py-4 font-bold rounded-2xl text-[15px] border-none transition-colors ${duration === '60m' ? 'bg-blue-100/50 text-blue-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                     60 Min
                  </button>
               </div>
            </div>

         </div>

         {/* Right Sidebar Properties */}
         <div className="w-full lg:w-[360px] shrink-0 space-y-6">
            
            {/* Locations Card */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.01)]">
               <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight">{t('doctorConfigureAvailability.locations', { defaultValue: 'Locations' })}</h3>
               </div>

               <div className="space-y-4">
                  {/* Selectable Item 1 */}
                  <div 
                     onClick={() => setLocation('stmary')}
                     className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm border border-slate-100 transition-all">
                     <div className={`w-5 h-5 rounded-[6px] shrink-0 flex items-center justify-center transition-colors border-2 ${location === 'stmary' ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300'}`}>
                        {location === 'stmary' && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                     </div>
                     <div>
                        <div className="font-extrabold text-[14px] text-slate-900 leading-tight">St. Mary's Clinic</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Main Office</div>
                     </div>
                  </div>

                  {/* Selectable Item 2 */}
                  <div 
                     onClick={() => setLocation('remote')}
                     className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm border border-slate-100 transition-all opacity-80 hover:opacity-100">
                     <div className={`w-5 h-5 rounded-[6px] shrink-0 flex items-center justify-center transition-colors border-2 ${location === 'remote' ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300'}`}>
                        {location === 'remote' && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                     </div>
                     <div>
                        <div className="font-extrabold text-[14px] text-slate-900 leading-tight">Remote Consult</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital Facility</div>
                     </div>
                  </div>

                  {/* Selectable Item 3 */}
                  <div 
                     onClick={() => setLocation('annex')}
                     className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm border border-slate-100 transition-all opacity-80 hover:opacity-100">
                     <div className={`w-5 h-5 rounded-[6px] shrink-0 flex items-center justify-center transition-colors border-2 ${location === 'annex' ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300'}`}>
                        {location === 'annex' && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                     </div>
                     <div>
                        <div className="font-extrabold text-[14px] text-slate-900 leading-tight">Downtown Annex</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Surgical Center</div>
                     </div>
                  </div>

               </div>
            </div>

            {/* Preview Card */}
            <div className="bg-slate-100 border border-slate-200/50 rounded-3xl p-6 relative overflow-hidden">
               <div className="text-[11px] font-extrabold text-primary-600 uppercase tracking-widest mb-3">Availability Preview</div>
               <p className="text-[14px] font-medium text-slate-600 leading-relaxed mb-1">
                  Based on current settings, you have
               </p>
               <p className="text-[14px] font-medium text-slate-600 leading-relaxed">
                 <span className="font-extrabold text-slate-900">32 hours</span> available for <span className="font-extrabold text-slate-900">64 slots</span> per week.
               </p>
               
               <div className="absolute end-0 bottom-0 top-0 w-2 bg-primary-600 rounded-s-full opacity-60"></div>
            </div>

         </div>
      </div>

      {/* BOTTOM Operatioal Notes */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 mb-10">
         <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{t('doctorConfigureAvailability.operationalNotes', { defaultValue: 'Operational Notes' })}</h3>
         </div>
         <textarea 
            rows="5"
            placeholder="Mention any specific requirements for patients, such as 'Pre-appointment fasting required' or 'Bring current medication list'..."
            className="w-full bg-slate-50/50 border-none rounded-2xl p-5 text-[14px] font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 resize-none"
         ></textarea>
      </div>

      <div className="flex justify-end items-center gap-6 mt-8">
         <button onClick={() => navigate('/doctor/schedule')} className="font-bold text-[15px] text-slate-600 hover:text-slate-900 transition-colors">{t('doctorConfigureAvailability.discardChanges', { defaultValue: 'Discard Changes' })}</button>
         <button onClick={() => navigate('/doctor/schedule')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-[15px] px-8 py-3.5 rounded-xl shadow-md shadow-primary-600/20 transition-all hover:-translate-y-0.5">
            {t('doctorConfigureAvailability.saveAvailability', { defaultValue: 'Save Availability' })}
         </button>
      </div>

    </div>
  )
}
