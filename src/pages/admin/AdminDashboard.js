import React, { useEffect } from 'react';
import { Users, Activity, DollarSign, HeartPulse, Star, RefreshCw, AlertCircle, Award, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import {
  fetchAdminDashboardMetrics,
  fetchDoctorRevenues,
  fetchMonthlyRevenues,
  selectAdminDashboardMetrics,
  selectDoctorRevenues,
  selectMonthlyRevenues,
  selectAdminLoading,
  selectAdminError
} from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');
  const currentUser = useSelector(selectCurrentUser);

  const metrics = useSelector(selectAdminDashboardMetrics);
  const doctorRevenues = useSelector(selectDoctorRevenues);
  const monthlyRevenues = useSelector(selectMonthlyRevenues);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);

  useEffect(() => {
    const loadData = () => {
      dispatch(fetchAdminDashboardMetrics());
      dispatch(fetchDoctorRevenues());
      dispatch(fetchMonthlyRevenues());
    };
    loadData();
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAdminDashboardMetrics());
    dispatch(fetchDoctorRevenues());
    dispatch(fetchMonthlyRevenues());
    toast.success(isRtl ? 'تم تحديث لوحة التحكم' : 'Dashboard updated successfully');
  };

  // Helper to format currency
  const formatCurrency = (val) => {
    const num = parseFloat(val || 0);
    return isRtl 
      ? `${num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`
      : `EGP ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper to format month strings e.g. "2026-05"
  const formatMonth = (yearMonthStr) => {
    if (!yearMonthStr) return '';
    try {
      const [year, month] = yearMonthStr.split('-');
      const date = new Date(year, parseInt(month) - 1, 1);
      return date.toLocaleDateString(i18n.language, { month: 'short', year: 'numeric' });
    } catch (e) {
      return yearMonthStr;
    }
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto space-y-4 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <AlertCircle className="w-16 h-16 text-rose-500 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800">{isRtl ? 'فشل تحميل البيانات' : 'Failed to load dashboard data'}</h3>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <RefreshCw className="w-4 h-4" /> {isRtl ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    );
  }

  if (loading && !metrics) {
    return <DashboardSkeleton isRtl={isRtl} t={t} />;
  }

  // Calculate max revenue for monthly chart scaling
  const maxRevenue = monthlyRevenues && monthlyRevenues.length > 0
    ? Math.max(...monthlyRevenues.map(r => parseFloat(r.total_revenues || 0)), 1)
    : 1;

  // Sorted Doctor Revenues (descending)
  const sortedDoctors = doctorRevenues 
    ? [...doctorRevenues].sort((a, b) => parseFloat(b.total_revenues || 0) - parseFloat(a.total_revenues || 0))
    : [];

  const stats = [
    { label: t('adminDashboard.totalPatients', 'Total Patients'), value: metrics?.total_patients || '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('adminDashboard.activeDoctors', 'Active Doctors'), value: metrics?.total_doctors || '0', icon: HeartPulse, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('adminDashboard.totalAppointments', 'Total Appointments'), value: metrics?.total_appointments || '0', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('adminDashboard.platformRevenue', 'Platform Revenue'), value: formatCurrency(metrics?.total_revenues), icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50' },
    { 
      label: t('adminDashboard.patientSatisfaction', 'Patient Satisfaction'), 
      value: `${parseFloat(metrics?.patient_satisfaction || 0).toFixed(1)} / 5.0`, 
      icon: Star, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      extra: (
        <div className="flex gap-0.5 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star 
              key={s} 
              className={`w-3.5 h-3.5 ${
                s <= Math.round(parseFloat(metrics?.patient_satisfaction || 0)) 
                  ? 'text-amber-500 fill-amber-500' 
                  : 'text-slate-200'
              }`} 
            />
          ))}
        </div>
      )
    },
  ];

  return (
    <div 
      className={`space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-10 ${isRtl ? 'rtl' : 'ltr'}`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('adminDashboard.title')}, {isRtl 
              ? (currentUser?.name_ar || currentUser?.name || 'مدير النظام') 
              : (currentUser?.name_en || currentUser?.name || 'System Administrator')}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">{t('adminDashboard.desc')}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl transition flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
          title={isRtl ? 'تحديث البيانات' : 'Refresh Data'}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRtl ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.01)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              {stat.extra}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenues Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                {t('adminDashboard.monthlyRevenueOverview', 'Monthly Revenue Overview')}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {isRtl ? 'إيرادات العيادة والمنصة الشهرية' : 'Monthly platform and clinic billings'}
              </p>
            </div>
          </div>

          {monthlyRevenues && monthlyRevenues.length > 0 ? (
            <div className="h-64 flex items-end justify-around gap-6 border-b border-slate-100 pb-2 pt-6 relative px-4">
              {/* Background grid indicators */}
              <div className="absolute top-0 w-full border-t border-dashed border-slate-100"></div>
              <div className="absolute top-1/3 w-full border-t border-dashed border-slate-100"></div>
              <div className="absolute top-2/3 w-full border-t border-dashed border-slate-100"></div>

              {monthlyRevenues.map((item, idx) => (
                <div className="flex flex-col items-center gap-2 flex-1 group max-w-[120px] relative z-10" key={idx}>
                  {/* Dynamic Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-primary-500 to-indigo-600 rounded-t-xl group-hover:from-primary-600 group-hover:to-indigo-700 transition-all duration-500 relative cursor-pointer shadow-sm hover:shadow"
                    style={{ height: `${(parseFloat(item.total_revenues || 0) / maxRevenue) * 180 || 10}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full start-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-20">
                      {formatCurrency(item.total_revenues)}
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mt-2">{formatMonth(item.year_month)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BarChart3 className="w-12 h-12 text-slate-350 mb-2" />
              <p className="text-sm font-bold text-slate-400">{t('adminDashboard.noMonthlyData', 'No revenue data reported yet.')}</p>
            </div>
          )}
        </div>

        {/* Doctor Leaderboard */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 animate-pulse" />
                {t('adminDashboard.doctorLeaderboard', 'Top Performing Clinicians')}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {isRtl ? 'الأطباء الأكثر تحقيقاً للإيرادات والمبيعات' : 'Clinicians generating highest revenue'}
              </p>
            </div>
          </div>

          {sortedDoctors.length > 0 ? (
            <div className="flex-1 divide-y divide-slate-50 overflow-y-auto max-h-[300px] pr-1">
              {sortedDoctors.map((doc, idx) => {
                const docName = isRtl 
                  ? (doc.name_ar || doc.name_en || doc.name || 'طبيب النظام') 
                  : (doc.name_en || doc.name_ar || doc.name || 'System Clinician');
                
                const specKey = String(doc.specialization || '').toLowerCase().replace(' ', '_');
                const translatedSpec = t(`specializations.${specKey}`, doc.specialization || 'N/A');

                const initials = doc.name_en 
                  ? doc.name_en.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                  : 'DR';

                // Color palette array for avatar initials backgrounds
                const colors = ['bg-indigo-50 text-indigo-600', 'bg-emerald-50 text-emerald-600', 'bg-pink-50 text-pink-600', 'bg-blue-50 text-blue-600', 'bg-amber-50 text-amber-600'];
                const avatarColor = colors[doc.doctor_id % colors.length];

                return (
                  <div key={doc.doctor_id} className="py-3 flex items-center justify-between group hover:bg-slate-50/50 rounded-xl px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${avatarColor} shrink-0`}>
                        {initials}
                      </div>
                      <div className="text-start">
                        <div className="font-extrabold text-slate-800 text-sm">{docName}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5">{translatedSpec}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="font-black text-emerald-600 text-sm">{formatCurrency(doc.total_revenues)}</div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-extrabold text-slate-500">{parseFloat(doc.rating_avg || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-10">
              <Award className="w-12 h-12 text-slate-350 mb-2" />
              <p className="text-sm font-bold text-slate-400">{t('adminDashboard.noDoctorData', 'No doctor revenue registered.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton({ isRtl, t }) {
  return (
    <div className={`space-y-8 animate-pulse ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Skeleton */}
      <div className="h-20 bg-white rounded-3xl border border-slate-100 p-6 flex justify-between items-center">
        <div className="space-y-2 w-1/3">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        </div>
        <div className="w-24 h-10 bg-slate-200 rounded-2xl"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
            <div className="space-y-2 pt-2">
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-1/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/3"></div>
          </div>
          <div className="h-64 bg-slate-50 rounded-2xl flex items-end justify-around p-6 gap-6">
            {[60, 80, 45, 90].map((h, i) => (
              <div key={i} className="w-full bg-slate-200 rounded-t-lg max-w-[100px]" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-3 bg-slate-100 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <div className="h-4 bg-slate-200 rounded w-12"></div>
                  <div className="h-3 bg-slate-100 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
