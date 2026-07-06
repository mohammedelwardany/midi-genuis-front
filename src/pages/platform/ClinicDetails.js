import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, UserPlus, ShieldCheck, ShieldAlert, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchClinicById,
  addClinicAdmin,
  updateSubscription,
  updateClinicStatus,
  clearSelectedClinic,
  selectSelectedClinic,
  selectPlatformLoading,
} from '../../store/slices/platformSlice';

export default function ClinicDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const clinic = useSelector(selectSelectedClinic);
  const loading = useSelector(selectPlatformLoading);

  const [subForm, setSubForm] = useState({ plan_name: '', max_doctors: '', status: 'active' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [savingSub, setSavingSub] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    dispatch(fetchClinicById(id));
    return () => dispatch(clearSelectedClinic());
  }, [id, dispatch]);

  useEffect(() => {
    if (clinic) {
      setSubForm({
        plan_name: clinic.plan_name || '',
        max_doctors: clinic.max_doctors ?? '',
        status: clinic.subscription_status || 'active',
      });
    }
  }, [clinic]);

  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    setSavingSub(true);
    try {
      await dispatch(updateSubscription({
        id,
        data: {
          plan_name: subForm.plan_name,
          max_doctors: subForm.max_doctors === '' ? null : parseInt(subForm.max_doctors, 10),
          status: subForm.status,
        },
      })).unwrap();
      toast.success(isRtl ? 'تم تحديث الاشتراك' : 'Subscription updated');
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث الاشتراك' : 'Failed to update subscription'));
    } finally {
      setSavingSub(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddingAdmin(true);
    try {
      await dispatch(addClinicAdmin({ id, admin: adminForm })).unwrap();
      toast.success(isRtl ? 'تمت إضافة المسؤول' : 'Admin added');
      setAdminForm({ email: '', password: '' });
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل إضافة المسؤول' : 'Failed to add admin'));
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = clinic.status === 'active' ? 'suspended' : 'active';
    try {
      await dispatch(updateClinicStatus({ id, status: newStatus })).unwrap();
      toast.success(newStatus === 'active'
        ? (isRtl ? 'تم إعادة تفعيل العيادة' : 'Clinic reactivated')
        : (isRtl ? 'تم تعليق العيادة' : 'Clinic suspended'));
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث حالة العيادة' : 'Failed to update clinic status'));
    }
  };

  if (loading && !clinic) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div>;
  }

  if (!clinic) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <button onClick={() => navigate('/platform/clinics')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {isRtl ? 'رجوع لكل العيادات' : 'Back to all clinics'}
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{clinic.name}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1 font-mono">{clinic.subdomain}</p>
          <div className="flex gap-4 mt-3 text-sm text-slate-600">
            <span>{clinic.doctor_count} {isRtl ? 'طبيب' : 'doctors'}</span>
            <span>{clinic.patient_count} {isRtl ? 'مريض' : 'patients'}</span>
          </div>
        </div>
        <button
          onClick={handleToggleStatus}
          className={`font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow ${
            clinic.status === 'active'
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100'
          }`}
        >
          {clinic.status === 'active' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {clinic.status === 'active' ? (isRtl ? 'تعليق العيادة' : 'Suspend Clinic') : (isRtl ? 'إعادة التفعيل' : 'Reactivate Clinic')}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">{isRtl ? 'الاشتراك' : 'Subscription'}</h3>
        <form onSubmit={handleSaveSubscription} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الخطة' : 'Plan'}</label>
            <input value={subForm.plan_name} onChange={(e) => setSubForm({ ...subForm, plan_name: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للأطباء' : 'Max Doctors'}</label>
            <input type="number" min="0" value={subForm.max_doctors} onChange={(e) => setSubForm({ ...subForm, max_doctors: e.target.value })}
              placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'حالة الاشتراك' : 'Subscription Status'}</label>
            <select value={subForm.status} onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={savingSub}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
            >
              {savingSub ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">{isRtl ? 'مسؤولو العيادة' : 'Clinic Admins'}</h3>
        <div className="divide-y divide-slate-50 mb-6">
          {(clinic.admins || []).map((admin) => (
            <div key={admin.id} className="py-3 flex justify-between items-center">
              <span className="font-bold text-slate-800 text-sm">{admin.email}</span>
              <span className="text-xs text-slate-400">{new Date(admin.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
          <input required type="email" placeholder={isRtl ? 'البريد الإلكتروني للمسؤول الجديد' : 'New admin email'}
            value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          <input required type="password" placeholder={isRtl ? 'كلمة المرور' : 'Password'}
            value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          <button
            type="submit"
            disabled={addingAdmin}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow shrink-0"
          >
            {addingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {isRtl ? 'إضافة' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
}
