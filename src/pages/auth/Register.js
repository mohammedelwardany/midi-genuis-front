import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, User, Phone, Calendar, ChevronDown, ArrowRight, UserCircle2 } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

// Common country codes with flags
const COUNTRY_CODES = [
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+90',  flag: '🇹🇷', name: 'Turkey' },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
];

const inputBase =
  'w-full py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400';

const labelBase = 'block text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1.5';

export default function Register() {
  const navigate   = useNavigate();
  const { t }      = useTranslation();
  const siteConfig = useSiteConfig();

  const [form, setForm] = useState({
    name_en:       '',
    name_ar:       '',
    email:         '',
    password:      '',
    phone:         '',
    date_of_birth: '',
    gender:        '',
  });
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name_en.trim()) errs.name_en = 'English name is required';
    if (!form.name_ar.trim()) errs.name_ar = 'Arabic name is required';
    if (!form.email.trim())   errs.email   = 'Email is required';
    if (!form.password)       errs.password = 'Password is required';
    if (!form.gender)         errs.gender   = 'Please select a gender';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      ...form,
      phone: form.phone ? `${countryCode.code}${form.phone}` : '',
    };
    console.log('Register payload:', payload);
    // dispatch(registerUser(payload))  ← hook up to Redux thunk when ready
    navigate('/login');
  };

  const selectedCountry = countryCode;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans py-12">

      {/* Background blobs */}
      <div className="absolute top-[-10%] end-[-10%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] start-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20 rotate-3 overflow-hidden">
              <img
                src={siteConfig.clinic.logoUrl}
                alt={siteConfig.clinic.name}
                className="w-full h-full object-contain p-2 -rotate-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white -rotate-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
                }}
              />
            </div>
            <span className="text-sm font-bold text-primary-600 tracking-widest uppercase">
              {siteConfig.clinic.name}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {t('auth.register.title', { defaultValue: 'Create Account' })}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {t('auth.register.description', { defaultValue: 'Join the MediGenius clinical ecosystem.' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Name Row ─────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* English Name */}
            <div>
              <label className={labelBase}>Full Name (EN)</label>
              <div className="relative">
                <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.name_en}
                  onChange={set('name_en')}
                  placeholder="e.g. John Smith"
                  className={`${inputBase} ps-10 pe-3 ${errors.name_en ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.name_en && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name_en}</p>}
            </div>

            {/* Arabic Name */}
            <div>
              <label className={labelBase}>الاسم (AR)</label>
              <div className="relative">
                <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  dir="rtl"
                  value={form.name_ar}
                  onChange={set('name_ar')}
                  placeholder="مثال: جون سميث"
                  className={`${inputBase} ps-10 pe-3 ${errors.name_ar ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.name_ar && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name_ar}</p>}
            </div>
          </div>

          {/* ── Email ────────────────────────────────────── */}
          <div>
            <label className={labelBase}>{t('auth.emailLabel', { defaultValue: 'Email Address' })}</label>
            <div className="relative">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className={`${inputBase} ps-10 pe-3 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email}</p>}
          </div>

          {/* ── Password ─────────────────────────────────── */}
          <div>
            <label className={labelBase}>{t('auth.passwordLabel', { defaultValue: 'Password' })}</label>
            <div className="relative">
              <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Create a strong password"
                className={`${inputBase} ps-10 pe-3 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                required
              />
            </div>
            {errors.password && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.password}</p>}
          </div>

          {/* ── Phone with Country Code ───────────────────── */}
          <div>
            <label className={labelBase}>Phone Number</label>
            <div className="flex gap-2 relative">

              {/* Country code picker */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCountryList((v) => !v)}
                  className="flex items-center gap-1.5 h-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 whitespace-nowrap"
                >
                  <span className="text-base">{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showCountryList ? 'rotate-180' : ''}`} />
                </button>

                {showCountryList && (
                  <div className="absolute start-0 top-full mt-1 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {COUNTRY_CODES.map((c) => (
                      <button
                        key={c.code + c.name}
                        type="button"
                        onClick={() => { setCountryCode(c); setShowCountryList(false); }}
                        className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-primary-50 transition-colors ${
                          countryCode.code === c.code && countryCode.name === c.name ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        <span className="text-base">{c.flag}</span>
                        <span>{c.name}</span>
                        <span className="ms-auto text-slate-400 text-xs">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone number input */}
              <div className="relative flex-1">
                <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="10 1234 5678"
                  className={`${inputBase} ps-10 pe-3`}
                />
              </div>
            </div>
          </div>

          {/* ── Date of Birth & Gender Row ────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Date of Birth */}
            <div>
              <label className={labelBase}>Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={set('date_of_birth')}
                  max={new Date().toISOString().split('T')[0]}
                  className={`${inputBase} ps-10 pe-3 [color-scheme:light]`}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className={labelBase}>Gender</label>
              <div className="flex gap-2 h-[46px]">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, gender: g }))}
                    className={`flex-1 rounded-xl text-sm font-bold border transition-all ${
                      form.gender === g
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-600/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                    }`}
                  >
                    {g === 'Male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.gender}</p>}
            </div>
          </div>

          {/* ── Submit ───────────────────────────────────── */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full hover:-translate-y-0.5 text-white font-bold text-[15px] py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 group bg-primary-600 hover:bg-primary-700 shadow-primary-600/20"
            >
              {t('auth.register.createAccountButton', { defaultValue: 'Create Account' })}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center pt-6 border-t border-slate-50">
          <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold transition-colors"
            >
              {t('auth.register.backToLogin', { defaultValue: 'Back to Login' })}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
