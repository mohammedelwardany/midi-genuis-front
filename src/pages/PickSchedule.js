import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft, Sun, Sunset, Moon, Info, ArrowLeft } from 'lucide-react';

export default function PickSchedule() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Static calendar for Oct 2023 for demo
  const days = [
    { text: '25', inactive: true }, { text: '26', inactive: true }, { text: '27', inactive: true }, { text: '28', inactive: true }, { text: '29', inactive: true }, { text: '30', inactive: true }, { text: '1' },
    { text: '2' }, { text: '3' }, { text: '4' }, { text: '5' }, { text: '6', selected: true }, { text: '7', dot: true }, { text: '8' },
    { text: '9', dot: true }, { text: '10' }, { text: '11' }, { text: '12', dot: true }, { text: '13' }, { text: '14' }, { text: '15' },
    { text: '16' }, { text: '17' }, { text: '18', dot: true }, { text: '19' }, { text: '20' }, { text: '21' }, { text: '22' },
    { text: '23' }, { text: '24' }, { text: '25' }, { text: '26' }, { text: '27' }, { text: '28' }, { text: '29' },
    { text: '30' }, { text: '31' }
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto flex flex-col h-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('pickSchedule.title', { defaultValue: 'Pick Schedule' })}</h2>
          <p className="text-slate-500 max-w-xl text-[15px] font-medium leading-relaxed">
            {t('pickSchedule.descriptionPrefix', { defaultValue: 'Select an available date and time slot for' })} <span className="text-slate-700 font-bold">Dr. Julianna Vance</span>. {t('pickSchedule.timezone', { defaultValue: 'Current timezone: GMT -5 (EST).' })}
          </p>
        </div>
        <div className="bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 border border-primary-100/50 hover:bg-primary-100 transition-colors cursor-pointer">
           <span className="w-2 h-2 rounded-full bg-primary-500"></span> {t('pickSchedule.availableNow', { defaultValue: 'Available Now' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 pb-24">
        {/* Left Col: Calendar */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">October 2023</h3>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                 <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"><ChevronRight className="w-5 h-5"/></button>
              </div>
           </div>
           
           <div className="grid grid-cols-7 gap-y-6 text-center text-sm font-bold text-slate-700 mb-6 uppercase text-[11px] tracking-widest">
              <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
           </div>

           <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm font-semibold text-slate-700">
              {days.map((day, idx) => (
                <div key={idx} className="relative aspect-square flex items-center justify-center">
                   <button 
                     className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${day.inactive ? 'text-slate-300 pointer-events-none' : ''} ${day.selected ? 'bg-primary-700 text-white shadow-md shadow-primary-700/30' : 'hover:bg-slate-100'}`}
                   >
                     {day.text}
                   </button>
                   {day.dot && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-500"></span>}
                </div>
              ))}
           </div>
        </div>

        {/* Right Col: Slots */}
        <div className="space-y-6">
           <div className="bg-primary-700 rounded-2xl p-6 text-white shadow-md shadow-primary-700/20 relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-2">{t('pickSchedule.selectedDate', { defaultValue: 'Selected Date' })}</div>
              <div className="text-2xl font-extrabold tracking-tight mb-4">Friday, Oct 6, 2023</div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold backdrop-blur-sm border border-white/10">
                 <Info className="w-3.5 h-3.5" /> {t('pickSchedule.availableBlocks', { defaultValue: '3 available blocks found' })}
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4"><Sun className="w-4 h-4 text-orange-500" /> {t('pickSchedule.morningSlots', { defaultValue: 'Morning Slots' })}</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white border-2 border-slate-100 hover:border-primary-500 rounded-xl p-4 text-start transition-colors">
                       <div className="font-bold text-slate-800 text-sm mb-1">08:30 AM</div>
                       <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                    </button>
                    <button className="bg-primary-600 border-2 border-primary-600 rounded-xl p-4 text-start shadow-md shadow-primary-600/20 relative overflow-hidden">
                       <div className="font-bold text-white text-sm mb-1">09:15 AM</div>
                       <div className="text-[10px] font-bold text-primary-200 uppercase tracking-widest">{t('pickSchedule.selected', { defaultValue: 'Selected' })}</div>
                    </button>
                    <button className="bg-white border-2 border-slate-100 hover:border-primary-500 rounded-xl p-4 text-start transition-colors">
                       <div className="font-bold text-slate-800 text-sm mb-1">10:00 AM</div>
                       <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                    </button>
                    <button className="bg-slate-50 border-2 border-slate-50 rounded-xl p-4 text-start opacity-50 cursor-not-allowed">
                       <div className="font-bold text-slate-400 text-sm mb-1">11:30 AM</div>
                       <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t('pickSchedule.booked', { defaultValue: 'Booked' })}</div>
                    </button>
                 </div>
              </div>

              <div>
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 text-slate-500"><Sun className="w-4 h-4 text-primary-500" /> {t('pickSchedule.afternoonSlots', { defaultValue: 'Afternoon Slots' })}</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white border-2 border-slate-100 hover:border-primary-500 rounded-xl p-4 text-start transition-colors">
                       <div className="font-bold text-slate-800 text-sm mb-1">01:45 PM</div>
                       <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                    </button>
                    <button className="bg-white border-2 border-slate-100 hover:border-primary-500 rounded-xl p-4 text-start transition-colors">
                       <div className="font-bold text-slate-800 text-sm mb-1">02:30 PM</div>
                       <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                    </button>
                    <button className="bg-slate-50 border-2 border-slate-50 rounded-xl p-4 text-start opacity-50 cursor-not-allowed">
                       <div className="font-bold text-red-400 line-through text-sm mb-1 opacity-60">04:00 PM</div>
                       <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t('pickSchedule.booked', { defaultValue: 'Booked' })}</div>
                    </button>
                 </div>
              </div>

              <div>
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 text-slate-500"><Moon className="w-4 h-4 text-slate-400" /> {t('pickSchedule.eveningSlots', { defaultValue: 'Evening Slots' })}</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white border-2 border-slate-100 hover:border-primary-500 rounded-xl p-4 text-start transition-colors">
                       <div className="font-bold text-slate-800 text-sm mb-1">05:15 PM</div>
                       <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                    </button>
                    <button className="bg-white border-2 border-slate-100 hover:border-primary-500 rounded-xl p-4 text-start transition-colors">
                       <div className="font-bold text-slate-800 text-sm mb-1">06:00 PM</div>
                       <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Action Bar overlay */}
      <div className="fixed bottom-8 start-[17.5rem] end-8 bg-slate-100/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center shadow-lg shadow-slate-200/50 border border-slate-200/60 max-w-5xl">
         <button onClick={() => navigate('/patient/book/doctors')} className="font-bold text-slate-700 flex items-center hover:text-slate-900 transition-colors px-4 py-2">
            <ArrowLeft className="w-4 h-4 me-2" /> {t('pickSchedule.backToDoctors', { defaultValue: 'Back to Doctors' })}
         </button>
         <div className="flex items-center gap-6">
            <div className="text-end hidden sm:block">
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('pickSchedule.selectedSession', { defaultValue: 'Selected Session' })}</div>
               <div className="font-bold text-sm text-slate-900">Oct 6 at 09:15 AM (45 min)</div>
            </div>
            <button onClick={() => navigate('/patient/book/patient')} className="bg-primary-700 hover:bg-primary-800 shadow-md text-white font-bold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto text-sm">
               {t('pickSchedule.continueToPatientInfo', { defaultValue: 'Continue to Patient Info' })}
            </button>
         </div>
      </div>
    </div>
  )
}
