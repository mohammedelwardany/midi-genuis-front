import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { loginUser, selectAuthLoading, selectAuthError, selectIsLoggedIn, selectUserRole } from '../../store/slices/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const siteConfig = useSiteConfig();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (isLoggedIn && userRole) {
      if (userRole === 'platform_admin') navigate('/platform/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [isLoggedIn, userRole, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">

      {/* Background Graphic Elements */}
      <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] end-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20 rotate-3 overflow-hidden">
              <img
                src={siteConfig.clinic.logoUrl}
                alt={siteConfig.clinic.name}
                className="w-full h-full object-contain p-2 -rotate-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white -rotate-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
                }}
              />
            </div>
            <span className="text-sm font-bold text-primary-600 tracking-widest uppercase">
              {siteConfig.clinic.name}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{t('auth.welcomeBack')}</h1>
          <p className="text-sm font-medium text-slate-500">{t('auth.loginDesc')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('auth.emailLabel')}</label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-900"
                placeholder="e.g., patient, doctor, admin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('auth.passwordLabel')}</label>
            </div>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-900"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {apiError && (
            <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-center">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 text-white font-bold text-[15px] py-4 rounded-xl shadow-md shadow-primary-600/20 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.signingIn', { defaultValue: 'Signing in...' }) : (
              <>
                {t('auth.signIn')} <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            {t('auth.noAccount')} <button onClick={() => navigate('/register')} className="text-primary-600 font-bold hover:underline">{t('auth.registerHere')}</button>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
        © 2026 MediGenius Intelligence Systems
      </div>
    </div>
  );
}
