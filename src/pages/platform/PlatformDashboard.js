import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Building2, Users, HeartPulse, Activity, DollarSign, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchPlatformMetrics,
  fetchAllClinics,
  selectPlatformMetrics,
  selectClinics,
  selectPlatformLoading,
  selectPlatformError,
} from '../../store/slices/platformSlice';
import { formatCurrency } from '../../utils/currencyFormatter';

export default function PlatformDashboard() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  const metrics = useSelector(selectPlatformMetrics);
  const clinics = useSelector(selectClinics);
  const loading = useSelector(selectPlatformLoading);
  const error = useSelector(selectPlatformError);

  const loadData = () => {
    dispatch(fetchPlatformMetrics());
    dispatch(fetchAllClinics());
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleRefresh = () => {
    loadData();
    toast.success(isRtl ? 'تم تحديث لوحة التحكم' : 'Dashboard updated successfully');
  };

  const statusColor = (status) => {
    if (status === 'active') return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    if (status === 'suspended') return 'bg-rose-50 text-rose-600 border border-rose-100';
    return 'bg-slate-50 text-slate-600 border border-slate-100';
  };

  const stats = [
    { label: isRtl ? 'إجمالي العيادات' : 'Total Clinics', value: metrics?.total_clinics ?? '0', icon: Building2, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: isRtl ? 'إجمالي الأطباء' : 'Total Doctors', value: metrics?.total_doctors ?? '0', icon: HeartPulse, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: isRtl ? 'إجمالي المرضى' : 'Total Patients', value: metrics?.total_patients ?? '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: isRtl ? 'إجمالي المواعيد' : 'Total Appointments', value: metrics?.total_appointments ?? '0', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: isRtl ? 'إجمالي الإيرادات' : 'Total Revenue', value: formatCurrency(metrics?.total_revenues, isRtl), icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h3 className="text-xl font-bold text-slate-800">{isRtl ? 'فشل تحميل البيانات' : 'Failed to load platform data'}</h3>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
        >
          <RefreshCw className="w-4 h-4" /> {isRtl ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? 'لوحة تحكم المنصة' : 'Platform Console'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isRtl ? 'نظرة عامة على جميع العيادات المشتركة' : 'Overview across every subscribed clinic'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl transition flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRtl ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.01)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-extrabold text-slate-900">{isRtl ? 'العيادات' : 'Clinics'}</h3>
          <button
            onClick={() => navigate('/platform/clinics')}
            className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
          >
            {isRtl ? 'إدارة العيادات' : 'Manage clinics'} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {clinics.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {clinics.slice(0, 6).map((clinic) => (
              <div
                key={clinic.id}
                onClick={() => navigate(`/platform/clinics/${clinic.id}`)}
                className="py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div>
                  <div className="font-extrabold text-slate-800 text-sm">{clinic.name}</div>
                  <div className="text-[11px] font-bold text-slate-400 mt-0.5">
                    {clinic.subdomain} &middot; {clinic.doctor_count} {isRtl ? 'طبيب' : 'doctors'} &middot; {clinic.patient_count} {isRtl ? 'مريض' : 'patients'}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${statusColor(clinic.status)}`}>
                  {clinic.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Building2 className="w-12 h-12 text-slate-350 mb-2" />
            <p className="text-sm font-bold text-slate-400">{isRtl ? 'لا توجد عيادات بعد' : 'No clinics yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
