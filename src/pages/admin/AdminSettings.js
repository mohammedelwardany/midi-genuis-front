import React, { useState } from 'react';
import { User, Shield, Building2, Bell, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminSettings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'platform':
        return (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">{t('adminSettings.platformIdentity')}</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">{t('adminSettings.platformIdentityDesc')}</p>
              
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.platformName')}</label>
                  <input type="text" defaultValue="MediGenius Health" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.supportEmail')}</label>
                  <input type="email" defaultValue="support@medigenius.org" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-end">
               <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-indigo-700 transition-all">{t('adminSettings.saveChanges')}</button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="animate-in fade-in duration-300 space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{t('adminSettings.securityStandards')}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">{t('adminSettings.securityStandardsDesc')}</p>
            
            <div className="space-y-4 max-w-2xl">
               <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{t('adminSettings.force2FA')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('adminSettings.force2FADesc')}</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute end-1 top-1"></div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{t('adminSettings.sessionTimeout')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('adminSettings.sessionTimeoutDesc')}</p>
                  </div>
                  <select className="bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-lg py-1 px-3">
                     <option>{t('adminSettings.timeout15')}</option>
                     <option>{t('adminSettings.timeout30')}</option>
                  </select>
               </div>
            </div>
          </div>
        );
      case 'profile':
      default:
        return (
          <div className="animate-in fade-in duration-300 space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{t('adminSettings.adminProfile')}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">{t('adminSettings.adminProfileDesc')}</p>
            
            <div className="space-y-4 max-w-2xl">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.fullName')}</label>
                   <input type="text" defaultValue="System Administrator" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
                 </div>
                 <div>
                   <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.email')}</label>
                   <input type="email" defaultValue="admin@medigenius.org" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
                 </div>
               </div>
               
               <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-indigo-700 transition-all">{t('adminSettings.updateProfile')}</button>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 font-sans">
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
         <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('adminSettings.title')}</h2>
         <p className="text-[15px] font-medium text-slate-500 max-w-2xl leading-relaxed">
            {t('adminSettings.desc')}
         </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
            <button onClick={() => setActiveTab('profile')} className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
               <User className="w-4 h-4" /> {t('adminSettings.myProfile')}
            </button>
            <button onClick={() => setActiveTab('platform')} className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'platform' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
               <Building2 className="w-4 h-4" /> {t('adminSettings.globalPlatform')}
            </button>
            <button onClick={() => setActiveTab('security')} className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
               <Shield className="w-4 h-4" /> {t('adminSettings.securityStandards')}
            </button>
         </div>

         <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 min-w-0 w-full">
            {renderContent()}
         </div>
      </div>
    </div>
  );
}
