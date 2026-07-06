import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { UserCog, Plus, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchPlatformAdmins,
  createPlatformAdmin,
  updatePlatformAdminStatus,
  selectPlatformAdmins,
  selectPlatformLoading,
} from '../../store/slices/platformSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

export default function PlatformAdmins() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');

  const admins = useSelector(selectPlatformAdmins);
  const loading = useSelector(selectPlatformLoading);
  const currentUser = useSelector(selectCurrentUser);

  const [form, setForm] = useState({ email: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPlatformAdmins());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await dispatch(createPlatformAdmin(form)).unwrap();
      toast.success(isRtl ? 'تمت إضافة مسؤول المنصة' : 'Platform admin added');
      setForm({ email: '', password: '' });
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل الإضافة' : 'Failed to create platform admin'));
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (admin) => {
    setTogglingId(admin.id);
    try {
      await dispatch(updatePlatformAdminStatus({ id: admin.id, active: !admin.active })).unwrap();
      toast.success(admin.active
        ? (isRtl ? 'تم إيقاف الحساب' : 'Account deactivated')
        : (isRtl ? 'تم تفعيل الحساب' : 'Account reactivated'));
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث الحالة' : 'Failed to update status'));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCog className="w-6 h-6 text-primary-600" /> {isRtl ? 'مسؤولو المنصة' : 'Platform Admins'}
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {isRtl ? 'الحسابات التي تملك صلاحيات كاملة على المنصة' : 'Accounts with full platform-owner privileges'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        {loading && admins.length === 0 ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div>
        ) : (
          <div className="divide-y divide-slate-50 mb-6">
            {admins.map((admin) => (
              <div key={admin.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">
                    {admin.email} {admin.id === currentUser?.user_id && <span className="text-primary-600 text-xs">({isRtl ? 'أنت' : 'you'})</span>}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(admin.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
                    admin.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                  }`}>
                    {admin.active ? (isRtl ? 'نشط' : 'active') : (isRtl ? 'موقوف' : 'deactivated')}
                  </span>
                  <button
                    onClick={() => handleToggle(admin)}
                    disabled={togglingId === admin.id || admin.id === currentUser?.user_id}
                    title={admin.id === currentUser?.user_id ? (isRtl ? 'لا يمكنك إيقاف حسابك الخاص' : "You can't deactivate your own account") : ''}
                    className={`font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                      admin.active
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100'
                    }`}
                  >
                    {togglingId === admin.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : admin.active ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {admin.active ? (isRtl ? 'إيقاف' : 'Deactivate') : (isRtl ? 'تفعيل' : 'Reactivate')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-6">
          <input required type="email" placeholder={isRtl ? 'بريد إلكتروني جديد' : 'New admin email'}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          <input required type="password" placeholder={isRtl ? 'كلمة المرور' : 'Password'}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          <button
            type="submit"
            disabled={creating}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow shrink-0"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isRtl ? 'إضافة' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
}
