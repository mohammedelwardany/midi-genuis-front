import React, { useState, useEffect } from 'react';
import { User, CreditCard, HeartPulse, Users, Calendar, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { fetchSubscriptionInfo, selectSubscriptionInfo, selectAdminLoading } from '../../store/slices/adminSlice';

function daysRemaining(renewsAt) {
  if (!renewsAt) return null;
  const diffMs = new Date(renewsAt).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function AdminSettings() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');
  const currentUser = useSelector(selectCurrentUser);
  const subscriptionInfo = useSelector(selectSubscriptionInfo);
  const loading = useSelector(selectAdminLoading);
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    name_en: currentUser?.name_en || (currentUser?.role === 'admin' ? 'System Administrator' : ''),
    name_ar: currentUser?.name_ar || (currentUser?.role === 'admin' ? 'مدير النظام' : ''),
    email: currentUser?.email || ''
  });

  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name_en: currentUser.name_en || (currentUser.role === 'admin' ? 'System Administrator' : ''),
        name_ar: currentUser.name_ar || (currentUser.role === 'admin' ? 'مدير النظام' : ''),
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'subscription' && !subscriptionInfo) {
      dispatch(fetchSubscriptionInfo());
    }
  }, [activeTab, subscriptionInfo, dispatch]);

  const renderContent = () => {
    switch (activeTab) {
      case 'subscription': {
        if (loading && !subscriptionInfo) {
          return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
        }
        if (!subscriptionInfo) {
          return <p className="text-sm text-slate-500">{t('adminSettings.subscriptionUnavailable', { defaultValue: 'Subscription information is unavailable right now.' })}</p>;
        }

        const remaining = daysRemaining(subscriptionInfo.renews_at);
        const usageRows = [
          {
            icon: HeartPulse,
            label: t('adminSettings.doctorAccounts', { defaultValue: 'Doctor Accounts' }),
            used: subscriptionInfo.doctor_count,
            max: subscriptionInfo.max_doctors,
          },
          {
            icon: Users,
            label: t('adminSettings.patientAccounts', { defaultValue: 'Patient Accounts' }),
            used: subscriptionInfo.patient_count,
            max: subscriptionInfo.max_patients,
          },
          {
            icon: Calendar,
            label: t('adminSettings.monthlyAppointments', { defaultValue: 'Appointments This Month' }),
            used: subscriptionInfo.monthly_appointment_count,
            max: subscriptionInfo.max_monthly_appointments,
          },
        ];

        const statusColor = subscriptionInfo.subscription_status === 'active'
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          : 'bg-rose-50 text-rose-600 border border-rose-100';

        return (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">{t('adminSettings.subscription', { defaultValue: 'Subscription' })}</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">{t('adminSettings.subscriptionDesc', { defaultValue: "Your clinic's plan and usage against its limits." })}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('adminSettings.plan', { defaultValue: 'Plan' })}</div>
                <div className="font-extrabold text-slate-900 capitalize">{subscriptionInfo.plan_catalog_name || subscriptionInfo.plan_name}</div>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('adminSettings.status', { defaultValue: 'Status' })}</div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${statusColor}`}>
                  {subscriptionInfo.subscription_status}
                </span>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('adminSettings.renewal', { defaultValue: 'Renewal' })}</div>
                <div className="font-extrabold text-slate-900">
                  {remaining !== null
                    ? t('adminSettings.daysRemaining', { defaultValue: '{{count}} days remaining', count: remaining })
                    : t('adminSettings.noRenewalDate', { defaultValue: 'No renewal date set' })}
                </div>
              </div>
            </div>

            {subscriptionInfo.plan_description && (
              <p className="max-w-3xl text-sm font-medium text-slate-500 -mt-2">{subscriptionInfo.plan_description}</p>
            )}

            <div className="max-w-3xl space-y-3 pt-2">
              {usageRows.map((row) => {
                const unlimited = row.max === null || row.max === undefined;
                const pct = unlimited ? 0 : Math.min(100, (Number(row.used) / Number(row.max)) * 100);
                return (
                  <div key={row.label} className="p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <row.icon className="w-4 h-4 text-indigo-500" /> {row.label}
                      </div>
                      <div className="text-sm font-extrabold text-slate-700">
                        {row.used} {unlimited
                          ? t('adminSettings.unlimited', { defaultValue: '(unlimited)' })
                          : `/ ${row.max}`}
                      </div>
                    </div>
                    {!unlimited && (
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case 'profile':
      default:
        return (
          <div className="animate-in fade-in duration-300 space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{t('adminSettings.adminProfile')}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">{t('adminSettings.adminProfileDesc')}</p>

            <div className="space-y-4 max-w-2xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.fullName')} (EN)</label>
                   <input
                     type="text"
                     value={formData.name_en}
                     onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                   />
                 </div>
                 <div>
                   <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.fullName')} (AR)</label>
                   <input
                     type="text"
                     value={formData.name_ar}
                     onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-right"
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('adminSettings.email')}</label>
                   <input
                     type="email"
                     value={formData.email}
                     readOnly
                     className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-semibold focus:outline-none cursor-not-allowed text-sm"
                   />
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
            <button onClick={() => setActiveTab('subscription')} className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'subscription' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 border-transparent'}`}>
               <CreditCard className="w-4 h-4" /> {t('adminSettings.subscription', { defaultValue: 'Subscription' })}
            </button>
         </div>

         <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 min-w-0 w-full">
            {renderContent()}
         </div>
      </div>
    </div>
  );
}
