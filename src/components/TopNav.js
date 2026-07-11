import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, Settings, User, LogOut, CheckCircle, AlertTriangle, FileText, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../utils/cn';
import { useSiteConfig } from '../context/SiteConfigContext';
import { selectCurrentUser, logoutUser } from '../store/slices/authSlice';

export default function TopNav({ title = "MediGenius Patient Portal", tabs = [], onMenuClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const siteConfig = useSiteConfig();
  const user = useSelector(selectCurrentUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  // TopNav is mounted by every authenticated layout, so this is the one
  // place a forced password reset can be enforced regardless of which page
  // the user navigates to directly (Login.js only catches it right after
  // signing in).
  useEffect(() => {
    if (user?.must_reset_password && location.pathname !== '/reset-required') {
      navigate('/reset-required');
    }
  }, [user, location.pathname, navigate]);

  const getSettingsPath = () => {
    if (location.pathname.startsWith('/doctor')) return '/doctor/settings';
    if (location.pathname.startsWith('/platform')) return '/platform/settings';
    if (location.pathname.startsWith('/admin')) return '/admin/settings';
    return '/patient/settings';
  };

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 h-16 w-full sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-8">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ms-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo + Clinic Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img
            src={siteConfig.clinic.logoUrl}
            alt={siteConfig.clinic.name}
            className="h-7 md:h-8 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-sm md:text-[17px] font-bold text-primary-600 tracking-tight hidden xs:block">
            {siteConfig.clinic.name}
          </span>
        </div>
        {tabs.length > 0 && (
          <nav className="hidden md:flex gap-6">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium py-5 border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "text-primary-600 border-primary-600"
                      : "text-slate-500 border-transparent hover:text-slate-800"
                  )
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center space-x-5">
        <button
          onClick={toggleLanguage}
          className="text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg border border-primary-200 transition-colors mx-2"
        >
          {i18n.language.startsWith('en') ? 'العربية' : 'English'}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-slate-400 hover:text-slate-600 relative p-1"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0.5 end-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="fixed md:absolute inset-x-4 md:inset-auto md:end-0 mt-3 md:w-80 bg-white border border-slate-100 shadow-xl md:shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 top-16 md:top-auto">
              <div className="flex justify-between items-center p-4 border-b border-slate-50 bg-slate-50/50">
                <span className="font-bold text-slate-800 text-sm">{t('topNav.notifications')}</span>
                <button className="text-[11px] font-bold text-primary-600 hover:text-primary-800">{t('topNav.markAllRead')}</button>
              </div>
              <div className="max-h-[calc(100vh-200px)] md:max-h-80 overflow-y-auto divide-y divide-slate-50">
                <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                  <div className="mt-0.5 bg-blue-50 text-blue-500 p-1.5 rounded-full shrink-0"><CheckCircle className="w-4 h-4" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight">{t('topNav.notificationsList.appointmentConfirmedTitle', { defaultValue: 'Appointment Confirmed' })}</div>
                    <div className="text-xs text-slate-500 leading-snug">{t('topNav.notificationsList.appointmentConfirmedBody', { defaultValue: 'Your appointment with Dr. Chen is confirmed for tomorrow at 10:00 AM.' })}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{t('topNav.notificationsList.tenMinutesAgo', { defaultValue: '10 mins ago' })}</div>
                  </div>
                </div>
                <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                  <div className="mt-0.5 bg-emerald-50 text-emerald-500 p-1.5 rounded-full shrink-0"><FileText className="w-4 h-4" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight">{t('topNav.notificationsList.newLabResultsTitle', { defaultValue: 'New Lab Results' })}</div>
                    <div className="text-xs text-slate-500 leading-snug">{t('topNav.notificationsList.newLabResultsBody', { defaultValue: 'Your recent comprehensive metabolic panel results are available.' })}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{t('topNav.notificationsList.twoHoursAgo', { defaultValue: '2 hours ago' })}</div>
                  </div>
                </div>
                <div className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                  <div className="mt-0.5 bg-orange-50 text-orange-500 p-1.5 rounded-full shrink-0"><AlertTriangle className="w-4 h-4" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight">{t('topNav.notificationsList.actionRequiredTitle', { defaultValue: 'Action Required' })}</div>
                    <div className="text-xs text-slate-500 leading-snug">{t('topNav.notificationsList.actionRequiredBody', { defaultValue: 'Please complete your pre-visit intake forms.' })}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{t('topNav.notificationsList.yesterday', { defaultValue: 'Yesterday' })}</div>
                  </div>
                </div>
              </div>
              <div className="p-3 text-center border-t border-slate-50 bg-slate-50/50">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">{t('topNav.viewAll')}</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white overflow-hidden border border-slate-200 transition-transform active:scale-95 font-bold text-xs"
          >
            {i18n.language.startsWith('ar')
              ? (user?.name_ar?.charAt(0) || user?.name?.charAt(0))
              : (user?.name_en?.charAt(0) || user?.name?.charAt(0)) || <User className="w-4 h-4" />}
          </button>

          {showProfileMenu && (
            <div className="fixed md:absolute inset-x-4 md:inset-auto md:end-0 mt-3 md:w-56 bg-white border border-slate-100 shadow-xl md:shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 top-16 md:top-auto">
              <div className="p-4 border-b border-slate-50">
                <div className="font-bold text-sm text-slate-900 truncate tracking-tight">
                  {i18n.language.startsWith('ar')
                    ? (user?.name_ar || user?.name || (user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'))
                    : (user?.name_en || user?.name || (user?.role === 'admin' ? 'System Administrator' : 'User'))}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">{user?.email || 'user@example.com'}</div>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate(getSettingsPath());
                  }}
                  className="w-full text-start px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> {t('topNav.accountSettings')}
                </button>
              </div>
              <div className="p-2 border-t border-slate-50">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    dispatch(logoutUser());
                    navigate('/login');
                  }}
                  className="w-full text-start px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> {t('topNav.logOut')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
