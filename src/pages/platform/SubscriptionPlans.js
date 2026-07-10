import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Layers, Plus, X, Loader2, Save, Archive, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  updateSubscriptionPlanStatus,
  selectSubscriptionPlans,
  selectPlatformLoading,
} from '../../store/slices/platformSlice';

const emptyForm = {
  name: '', description: '',
  max_doctors_per_specialization: '', max_patients: '', max_monthly_appointments: '',
  max_admins: '', max_specializations: '', chatbot_enabled: false, stock_enabled: false,
  duration_days: '30',
};

export default function SubscriptionPlans() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');

  const plans = useSelector(selectSubscriptionPlans);
  const loading = useSelector(selectPlatformLoading);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      description: plan.description || '',
      max_doctors_per_specialization: plan.max_doctors_per_specialization ?? '',
      max_patients: plan.max_patients ?? '',
      max_monthly_appointments: plan.max_monthly_appointments ?? '',
      max_admins: plan.max_admins ?? '',
      max_specializations: plan.max_specializations ?? '',
      chatbot_enabled: !!plan.chatbot_enabled,
      stock_enabled: !!plan.stock_enabled,
      duration_days: plan.duration_days,
    });
    setShowModal(true);
  };

  const toInt = (v) => (v === '' ? null : parseInt(v, 10));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = {
      name: form.name,
      description: form.description || null,
      max_doctors_per_specialization: toInt(form.max_doctors_per_specialization),
      max_patients: toInt(form.max_patients),
      max_monthly_appointments: toInt(form.max_monthly_appointments),
      max_admins: toInt(form.max_admins),
      max_specializations: toInt(form.max_specializations),
      chatbot_enabled: !!form.chatbot_enabled,
      stock_enabled: !!form.stock_enabled,
      duration_days: parseInt(form.duration_days, 10) || 30,
    };
    try {
      if (editingId) {
        await dispatch(updateSubscriptionPlan({ id: editingId, data })).unwrap();
        toast.success(isRtl ? 'تم تحديث الخطة' : 'Plan updated');
      } else {
        await dispatch(createSubscriptionPlan(data)).unwrap();
        toast.success(isRtl ? 'تم إنشاء الخطة' : 'Plan created');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشلت العملية' : 'Failed to save plan'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (plan) => {
    setTogglingId(plan.id);
    try {
      await dispatch(updateSubscriptionPlanStatus({ id: plan.id, active: !plan.active })).unwrap();
      toast.success(plan.active
        ? (isRtl ? 'تمت أرشفة الخطة' : 'Plan archived')
        : (isRtl ? 'تمت استعادة الخطة' : 'Plan restored'));
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث الحالة' : 'Failed to update status'));
    } finally {
      setTogglingId(null);
    }
  };

  const limitLabel = (v) => (v === null || v === undefined ? (isRtl ? 'غير محدود' : 'Unlimited') : v);

  const featureBadge = (enabled) => (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
      enabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
    }`}>
      {enabled ? (isRtl ? 'متضمن' : 'Included') : (isRtl ? 'غير متضمن' : 'Not included')}
    </span>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary-600" /> {isRtl ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isRtl ? 'أنواع الخطط القياسية التي يمكن اختيارها لأي عيادة' : 'Standard plan types selectable for any clinic'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> {isRtl ? 'خطة جديدة' : 'New Plan'}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        {loading && plans.length === 0 ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div>
        ) : plans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-3 text-start">{isRtl ? 'الاسم' : 'Name'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المسؤولون' : 'Admins'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الأطباء / تخصص' : 'Doctors / Specialization'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المرضى' : 'Patients'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المواعيد الشهرية' : 'Monthly Appts'}</th>
                  <th className="p-3 text-start">{isRtl ? 'التخصصات' : 'Specializations'}</th>
                  <th className="p-3 text-start">{isRtl ? 'شات بوت' : 'ChatBot'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المخزون' : 'Stock'}</th>
                  <th className="p-3 text-start">{isRtl ? 'المدة (أيام)' : 'Duration (days)'}</th>
                  <th className="p-3 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3 text-start"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map((plan) => (
                  <tr key={plan.id} className={!plan.active ? 'opacity-50' : ''}>
                    <td className="p-3">
                      <button onClick={() => openEdit(plan)} className="font-extrabold text-slate-800 hover:text-primary-600 transition">{plan.name}</button>
                      {plan.description && <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-xs truncate">{plan.description}</p>}
                    </td>
                    <td className="p-3 text-slate-600">{limitLabel(plan.max_admins)}</td>
                    <td className="p-3 text-slate-600">{limitLabel(plan.max_doctors_per_specialization)}</td>
                    <td className="p-3 text-slate-600">{limitLabel(plan.max_patients)}</td>
                    <td className="p-3 text-slate-600">{limitLabel(plan.max_monthly_appointments)}</td>
                    <td className="p-3 text-slate-600">{limitLabel(plan.max_specializations)}</td>
                    <td className="p-3">{featureBadge(plan.chatbot_enabled)}</td>
                    <td className="p-3">{featureBadge(plan.stock_enabled)}</td>
                    <td className="p-3 text-slate-600">{plan.duration_days}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
                        plan.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {plan.active ? (isRtl ? 'نشطة' : 'active') : (isRtl ? 'مؤرشفة' : 'archived')}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        disabled={togglingId === plan.id}
                        className={`font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 disabled:opacity-40 ${
                          plan.active
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100'
                        }`}
                      >
                        {togglingId === plan.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : plan.active ? <Archive className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        {plan.active ? (isRtl ? 'أرشفة' : 'Archive') : (isRtl ? 'استعادة' : 'Restore')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Layers className="w-12 h-12 text-slate-350 mb-2" />
            <p className="text-sm font-bold text-slate-400">{isRtl ? 'لا توجد خطط بعد' : 'No plans yet'}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingId ? (isRtl ? 'تعديل الخطة' : 'Edit Plan') : (isRtl ? 'خطة جديدة' : 'New Plan')}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'اسم الخطة' : 'Plan Name'}</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الوصف' : 'Description'}</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للمسؤولين' : 'Max Admins'}</label>
                  <input type="number" min="0" value={form.max_admins} onChange={(e) => setForm({ ...form, max_admins: e.target.value })}
                    placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                    className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الأطباء لكل تخصص' : 'Doctors per Specialization'}</label>
                  <input type="number" min="0" value={form.max_doctors_per_specialization} onChange={(e) => setForm({ ...form, max_doctors_per_specialization: e.target.value })}
                    placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                    className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للمرضى' : 'Max Patients'}</label>
                  <input type="number" min="0" value={form.max_patients} onChange={(e) => setForm({ ...form, max_patients: e.target.value })}
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
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'المواعيد الشهرية' : 'Monthly Appointments'}</label>
                  <input type="number" min="0" value={form.max_monthly_appointments} onChange={(e) => setForm({ ...form, max_monthly_appointments: e.target.value })}
                    placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                    className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'المدة (أيام)' : 'Duration (days)'}</label>
                  <input required type="number" min="1" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
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
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? (isRtl ? 'حفظ التغييرات' : 'Save Changes') : (isRtl ? 'إنشاء الخطة' : 'Create Plan')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
