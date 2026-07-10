import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, X, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchAllClinics,
  createClinic,
  fetchSubscriptionPlans,
  selectClinics,
  selectSubscriptionPlans,
  selectPlatformLoading,
} from '../../store/slices/platformSlice';

export default function ClinicManagement() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  const clinics = useSelector(selectClinics);
  const plans = useSelector(selectSubscriptionPlans);
  const loading = useSelector(selectPlatformLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    name: '', subdomain: '', plan_id: '', plan_name: 'custom',
    max_doctors_per_specialization: '', max_patients: '', max_monthly_appointments: '',
    max_admins: '', max_specializations: '', chatbot_enabled: false, stock_enabled: false,
    admin_email: '', admin_password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllClinics());
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const activePlans = plans.filter((p) => p.active);
  const isCustomPlan = !form.plan_id;

  const filteredClinics = clinics.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === 'active') return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    if (status === 'suspended') return 'bg-rose-50 text-rose-600 border border-rose-100';
    return 'bg-slate-50 text-slate-600 border border-slate-100';
  };

  const toInt = (v) => (v === '' ? null : parseInt(v, 10));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(createClinic({
        name: form.name,
        subdomain: form.subdomain,
        admin_email: form.admin_email,
        admin_password: form.admin_password,
        ...(form.plan_id
          ? { plan_id: parseInt(form.plan_id, 10) }
          : {
              plan_name: form.plan_name,
              max_doctors_per_specialization: toInt(form.max_doctors_per_specialization),
              max_patients: toInt(form.max_patients),
              max_monthly_appointments: toInt(form.max_monthly_appointments),
              max_admins: toInt(form.max_admins),
              max_specializations: toInt(form.max_specializations),
              chatbot_enabled: !!form.chatbot_enabled,
              stock_enabled: !!form.stock_enabled,
            }),
      })).unwrap();
      toast.success(isRtl ? 'تم إنشاء العيادة بنجاح' : 'Clinic created successfully');
      setShowCreateModal(false);
      setForm({
        name: '', subdomain: '', plan_id: '', plan_name: 'custom',
        max_doctors_per_specialization: '', max_patients: '', max_monthly_appointments: '',
        max_admins: '', max_specializations: '', chatbot_enabled: false, stock_enabled: false,
        admin_email: '', admin_password: '',
      });
      dispatch(fetchAllClinics());
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل إنشاء العيادة' : 'Failed to create clinic'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? 'إدارة العيادات' : 'Clinic Management'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isRtl ? 'إنشاء وإدارة حسابات العيادات المشتركة' : 'Create and manage subscribed clinic accounts'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> {isRtl ? 'عيادة جديدة' : 'New Clinic'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث عن عيادة...' : 'Search clinics...'}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {loading && clinics.length === 0 ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div>
        ) : filteredClinics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-3 text-start">{isRtl ? 'الاسم' : 'Name'}</th>
                  <th className="p-3 text-start">{isRtl ? 'النطاق الفرعي' : 'Subdomain'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الخطة' : 'Plan'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الأطباء' : 'Doctors'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المرضى' : 'Patients'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClinics.map((clinic) => (
                  <tr
                    key={clinic.id}
                    onClick={() => navigate(`/platform/clinics/${clinic.id}`)}
                    className="cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-3 font-extrabold text-slate-800">{clinic.name}</td>
                    <td className="p-3 text-slate-500 font-mono text-xs">{clinic.subdomain}</td>
                    <td className="p-3 text-slate-600">{clinic.plan_catalog_name || clinic.plan_name}</td>
                    <td className="p-3 text-slate-600">{clinic.doctor_count}</td>
                    <td className="p-3 text-slate-600">{clinic.patient_count}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${statusColor(clinic.subscription_status)}`}>
                        {clinic.subscription_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Building2 className="w-12 h-12 text-slate-350 mb-2" />
            <p className="text-sm font-bold text-slate-400">{isRtl ? 'لا توجد عيادات مطابقة' : 'No matching clinics'}</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">{isRtl ? 'إنشاء عيادة جديدة' : 'Create New Clinic'}</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'اسم العيادة' : 'Clinic Name'}</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'النطاق الفرعي' : 'Subdomain'}</label>
                <input required value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
                  placeholder="clinicname"
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'خطة الاشتراك' : 'Subscription Plan'}</label>
                <select value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                  <option value="">{isRtl ? 'مخصص (إدخال يدوي)' : 'Custom (manual limits)'}</option>
                  {activePlans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.duration_days}d</option>
                  ))}
                </select>
              </div>
              {isCustomPlan && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الأطباء لكل تخصص' : 'Doctors / Spec.'}</label>
                      <input type="number" min="0" value={form.max_doctors_per_specialization} onChange={(e) => setForm({ ...form, max_doctors_per_specialization: e.target.value })}
                        placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للمرضى' : 'Max Patients'}</label>
                      <input type="number" min="0" value={form.max_patients} onChange={(e) => setForm({ ...form, max_patients: e.target.value })}
                        placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'المواعيد الشهرية' : 'Monthly Appts'}</label>
                      <input type="number" min="0" value={form.max_monthly_appointments} onChange={(e) => setForm({ ...form, max_monthly_appointments: e.target.value })}
                        placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للمسؤولين' : 'Max Admins'}</label>
                      <input type="number" min="0" value={form.max_admins} onChange={(e) => setForm({ ...form, max_admins: e.target.value })}
                        placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للتخصصات' : 'Max Specializations'}</label>
                      <input type="number" min="0" value={form.max_specializations} onChange={(e) => setForm({ ...form, max_specializations: e.target.value })}
                        placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.chatbot_enabled} onChange={(e) => setForm({ ...form, chatbot_enabled: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                      <span className="font-bold text-slate-600">{isRtl ? 'شات بوت' : 'ChatBot'}</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.stock_enabled} onChange={(e) => setForm({ ...form, stock_enabled: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                      <span className="font-bold text-slate-600">{isRtl ? 'إدارة المخزون' : 'Stock Management'}</span>
                    </label>
                  </div>
                </div>
              )}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{isRtl ? 'حساب المسؤول الأول' : "First Admin's Account"}</p>
                <div className="space-y-4">
                  <input required type="email" placeholder={isRtl ? 'البريد الإلكتروني' : 'Admin Email'}
                    value={form.admin_email} onChange={(e) => setForm({ ...form, admin_email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  <input required type="password" placeholder={isRtl ? 'كلمة المرور' : 'Admin Password'}
                    value={form.admin_password} onChange={(e) => setForm({ ...form, admin_password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isRtl ? 'إنشاء العيادة' : 'Create Clinic'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
