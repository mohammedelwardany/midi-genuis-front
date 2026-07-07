import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { UserCog, KeyRound, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { changeOwnPassword } from '../../store/slices/platformSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

export default function PlatformSettings() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');

  const currentUser = useSelector(selectCurrentUser);

  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      toast.error(isRtl ? 'كلمتا المرور الجديدتان غير متطابقتين' : 'New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await dispatch(changeOwnPassword({
        current_password: form.current_password,
        new_password: form.new_password,
      })).unwrap();
      toast.success(isRtl ? 'تم تحديث كلمة المرور' : 'Password updated');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث كلمة المرور' : 'Failed to update password'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCog className="w-6 h-6 text-primary-600" /> {isRtl ? 'إعدادات الحساب' : 'Account Settings'}
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {isRtl ? 'حساب مسؤول المنصة الخاص بك' : 'Your platform-owner account'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</div>
            <div className="font-extrabold text-slate-900 truncate">{currentUser?.email}</div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{isRtl ? 'الدور' : 'Role'}</div>
            <div className="font-extrabold text-slate-900 capitalize">{isRtl ? 'مسؤول المنصة' : 'Platform Admin'}</div>
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary-600" /> {isRtl ? 'تغيير كلمة المرور' : 'Change Password'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'كلمة المرور الحالية' : 'Current Password'}</label>
            <input required type="password" value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'كلمة المرور الجديدة' : 'New Password'}</label>
            <input required type="password" minLength={6} value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
            <input required type="password" minLength={6} value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isRtl ? 'حفظ كلمة المرور' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
