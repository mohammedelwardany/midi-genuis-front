import React from 'react';
import { Phone, AlertCircle, Clock, MapPin, Ambulance } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmergencyContact() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20 rotate-3">
             <AlertCircle className="w-10 h-10 -rotate-3" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{t('emergency.title', { defaultValue: 'Emergency Contact' })}</h1>
          <p className="text-lg font-medium text-slate-500 max-w-xl mx-auto">
             {t('emergency.description', { defaultValue: 'If you are experiencing a life-threatening medical emergency, please immediately call 911 or go to the nearest emergency room.' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-red-600 rounded-3xl p-8 text-white shadow-xl shadow-red-600/20 relative overflow-hidden group">
              <div className="absolute end-[-10%] top-[-10%] w-48 h-48 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Phone className="w-12 h-12 mb-6 text-red-200" />
              <h2 className="text-2xl font-black mb-2">{t('emergency.hotline', { defaultValue: 'Emergency Hotline' })}</h2>
              <p className="text-red-100 font-medium mb-8 text-sm">{t('emergency.hotlineDescription', { defaultValue: 'Available 24/7 for severe symptoms and urgent hospital admissions.' })}</p>
              <div className="bg-white text-red-700 text-3xl font-black py-4 px-6 rounded-2xl inline-block shadow-lg">
                911
              </div>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
              <Clock className="w-10 h-10 text-primary-600 mb-6" />
              <h2 className="text-2xl font-black text-slate-900 mb-2">{t('emergency.triageNurse', { defaultValue: '24/7 Triage Nurse' })}</h2>
              <p className="text-slate-500 font-medium mb-8 text-sm">{t('emergency.triageDescription', { defaultValue: "Not sure if it's an emergency? Speak with our registered nurses for clinical advice." })}</p>
              <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                1-800-MED-URGE
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('emergency.waitTime', { defaultValue: 'Wait time: ~2 mins' })}</p>
           </div>
        </div>

        <div className="bg-white rounded-3xl mt-6 p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
           <div className="flex items-start gap-4">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl shrink-0"><MapPin className="w-6 h-6" /></div>
              <div>
                 <h3 className="text-xl font-extrabold text-slate-900 mb-2">{t('emergency.nearestEr', { defaultValue: 'Nearest Affiliated ER' })}</h3>
                 <p className="text-sm font-medium text-slate-600 mb-4">MediGenius Central Hospital<br/>124 Healthcare Ave, Metropolis, NY 10001</p>
                 <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-lg">
                   {t('emergency.getDirections', { defaultValue: 'Get Directions' })}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
