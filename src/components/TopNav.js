import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, Settings, User, LogOut, CheckCircle, AlertTriangle, XCircle, FileText, Clock, Menu, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '../utils/cn';
import { useSiteConfig } from '../context/SiteConfigContext';
import { selectCurrentUser, logoutUser } from '../store/slices/authSlice';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
} from '../store/slices/notificationSlice';

// Poll on a ~50s cadence with a little jitter so many open tabs don't all hit the
// server on the same tick; only while the tab is actually visible.
const POLL_BASE_MS = 50000;
const POLL_JITTER_MS = 10000;

const NOTIFICATION_ICONS = {
  appointment_booked: { Icon: Clock, bg: 'bg-blue-50', color: 'text-blue-500' },
  payment_awaiting_review: { Icon: FileText, bg: 'bg-amber-50', color: 'text-amber-500' },
  payment_approved: { Icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  appointment_confirmed: { Icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  payment_rejected: { Icon: AlertTriangle, bg: 'bg-red-50', color: 'text-red-500' },
  appointment_cancelled: { Icon: XCircle, bg: 'bg-red-50', color: 'text-red-500' },
};
const DEFAULT_ICON = { Icon: AlertTriangle, bg: 'bg-orange-50', color: 'text-orange-500' };

function formatRelativeTime(dateString, locale) {
  const date = new Date(dateString);
  let duration = (date.getTime() - Date.now()) / 1000;
  const divisions = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Infinity, unit: 'year' },
  ];
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
}

export default function TopNav({ title = "MediGenius Patient Portal", tabs = [], onMenuClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const siteConfig = useSiteConfig();
  const user = useSelector(selectCurrentUser);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const notificationsLoading = useSelector(selectNotificationsLoading);
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

  useEffect(() => {
    if (!user) return;

    dispatch(fetchUnreadCount());

    let timeoutId;
    const scheduleNext = () => {
      const delay = POLL_BASE_MS + Math.random() * POLL_JITTER_MS;
      timeoutId = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          dispatch(fetchUnreadCount());
        }
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchUnreadCount());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, dispatch]);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((prev) => {
      const next = !prev;
      if (next) dispatch(fetchNotifications({ page: 1, pageSize: 10 }));
      return next;
    });
  }, [dispatch]);

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.is_read) dispatch(markNotificationRead(notification.id));
    setShowNotifications(false);
    if (notification.link) navigate(notification.link);
  }, [dispatch, navigate]);

  const handleMarkAllRead = useCallback((e) => {
    e.stopPropagation();
    dispatch(markAllNotificationsRead());
  }, [dispatch]);

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
            onClick={toggleNotifications}
            className="text-slate-400 hover:text-slate-600 relative p-1"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 min-w-[16px] h-4 px-1 bg-red-500 rounded-full border border-white text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed md:absolute inset-x-4 md:inset-auto md:end-0 mt-3 md:w-80 bg-white border border-slate-100 shadow-xl md:shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 top-16 md:top-auto">
              <div className="flex justify-between items-center p-4 border-b border-slate-50 bg-slate-50/50">
                <span className="font-bold text-slate-800 text-sm">{t('topNav.notifications')}</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[11px] font-bold text-primary-600 hover:text-primary-800">
                    {t('topNav.markAllRead')}
                  </button>
                )}
              </div>
              <div className="max-h-[calc(100vh-200px)] md:max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notificationsLoading && notifications.length === 0 && (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                  </div>
                )}
                {!notificationsLoading && notifications.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400">{t('topNav.noNotifications')}</div>
                )}
                {notifications.map((n) => {
                  const { Icon, bg, color } = NOTIFICATION_ICONS[n.type] || DEFAULT_ICON;
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        "p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3",
                        !n.is_read && "bg-primary-50/40"
                      )}
                    >
                      <div className={cn("mt-0.5 p-1.5 rounded-full shrink-0", bg, color)}><Icon className="w-4 h-4" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight truncate">{n.title}</div>
                        <div className="text-xs text-slate-500 leading-snug">{n.message}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                          {formatRelativeTime(n.created_at, i18n.language.startsWith('ar') ? 'ar' : 'en')}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
