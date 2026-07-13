import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PhoneCall, LogOut } from 'lucide-react';
import { onClinicSuspended } from '../utils/clinicSuspension';
import { useSiteConfig } from '../context/SiteConfigContext';
import { logoutUser } from '../store/slices/authSlice';

// Mounted once near the app root. Any 403 carrying code: 'CLINIC_SUSPENDED'
// (emitted by apiClient.js) flips this on for the rest of the session - a
// full-viewport, click-blocking overlay replaces every page's own "Failed to
// load ... HTTP 403" error with one clear message, and since it sits above
// TopNav in the stacking order, it also makes every top bar tab unclickable
// without needing to thread a disabled flag through each layout/nav component.
export default function ClinicSuspendedOverlay() {
  const [isSuspended, setIsSuspended] = useState(false);
  const { t } = useTranslation();
  const siteConfig = useSiteConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return onClinicSuspended(() => setIsSuspended(true));
  }, []);

  if (!isSuspended) return null;

  const phone = siteConfig?.clinic?.phone;

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsSuspended(false);
    navigate('/login');
  };

  return (
    <div
      className="fixed inset-0 z-[500] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <PhoneCall className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
          {t('clinicSuspended.title', { defaultValue: 'Clinic Account Suspended' })}
        </h2>
        <p className="text-slate-600 font-medium leading-relaxed mb-8">
          {phone
            ? t('clinicSuspended.messageWithPhone', { phone, defaultValue: `The clinic is currently suspended, please communicate with MediGenius admin on: ${phone}` })
            : t('clinicSuspended.messageNoPhone', { defaultValue: 'The clinic is currently suspended, please communicate with MediGenius admin to resolve this.' })}
        </p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" /> {t('clinicSuspended.logOut', { defaultValue: 'Log Out' })}
        </button>
      </div>
    </div>
  );
}
