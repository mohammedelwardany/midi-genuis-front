import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { KeyRound, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSiteConfig } from '../../context/SiteConfigContext';
import {
  completePasswordReset,
  logoutUser,
  selectCurrentUser,
  selectIsLoggedIn,
  selectUserRole,
} from '../../store/slices/authSlice';

export default function ResetRequired() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const siteConfig = useSiteConfig();
  const isRtl = i18n.language.startsWith('ar');

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (currentUser && !currentUser.must_reset_password) {
      // Already completed (or never required) - nothing to do here
      if (userRole === 'platform_admin') navigate('/platform/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [isLoggedIn, currentUser, userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(isRtl ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(isRtl ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(completePasswordReset(newPassword)).unwrap();
      toast.success(isRtl ? 'تم تعيين كلمة المرور الجديدة' : 'New password set');
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else if (userRole === 'platform_admin') navigate('/platform/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تعيين كلمة المرور' : 'Failed to set new password'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] bg-amber-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] end-[-10%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-6">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            {isRtl ? 'مطلوب تعيين كلمة مرور جديدة' : 'New Password Required'}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {isRtl
              ? 'قام مسؤول المنصة بإعادة تعيين حسابك. الرجاء تعيين كلمة مرور جديدة قبل المتابعة.'
              : 'A platform admin reset your account. Please set a new password before continuing.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
              {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
            </label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-900"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
              {isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-900"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 text-white font-bold text-[15px] py-4 rounded-xl shadow-md shadow-primary-600/20 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (
              <>
                {isRtl ? 'حفظ كلمة المرور والمتابعة' : 'Set Password & Continue'} <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => dispatch(logoutUser()).then(() => navigate('/login'))}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isRtl ? 'تسجيل الخروج' : 'Log out instead'}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
        {siteConfig.clinic.name}
      </div>
    </div>
  );
}
