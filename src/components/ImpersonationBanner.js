import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { returnFromImpersonation } from '../store/slices/authSlice';

// Shown whenever a platform admin is impersonating a clinic admin (i.e. a
// "return" session is stashed in sessionStorage). Lets them jump back to
// their own platform-admin session without logging in again.
export default function ImpersonationBanner() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');
  const [returning, setReturning] = useState(false);

  const clinicName = sessionStorage.getItem('platform_return_clinic_name');
  const hasReturnSession = !!sessionStorage.getItem('platform_return_token');

  if (!hasReturnSession) return null;

  const handleReturn = async () => {
    setReturning(true);
    try {
      await dispatch(returnFromImpersonation()).unwrap();
      navigate('/platform/dashboard');
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'تعذرت العودة' : 'Failed to return to platform session'));
    } finally {
      setReturning(false);
    }
  };

  return (
    <div className="sticky top-0 z-[90] bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm font-bold shadow">
      <ShieldAlert className="w-4 h-4 shrink-0" />
      <span>
        {isRtl
          ? `تسجيل دخول بالنيابة كمسؤول ${clinicName || 'العيادة'}`
          : `Viewing as ${clinicName || 'clinic'} admin (support session)`}
      </span>
      <button
        onClick={handleReturn}
        disabled={returning}
        className="bg-white/20 hover:bg-white/30 disabled:opacity-60 rounded-lg px-3 py-1 flex items-center gap-1.5 transition"
      >
        {returning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
        {isRtl ? 'العودة لوحدة المنصة' : 'Return to Platform Console'}
      </button>
    </div>
  );
}
