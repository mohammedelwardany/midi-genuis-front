import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, UserPlus, ShieldCheck, ShieldAlert, Save, LogIn, Palette, Trash2, KeyRound, Copy, Check, Upload, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchClinicById,
  addClinicAdmin,
  deleteClinicAdmin,
  resetAdminPassword,
  updateSubscription,
  updateClinicStatus,
  updateClinicBranding,
  uploadClinicLogo,
  fetchSubscriptionPlans,
  clearSelectedClinic,
  selectSelectedClinic,
  selectSubscriptionPlans,
  selectPlatformLoading,
} from '../../store/slices/platformSlice';
import { impersonateClinicAdmin } from '../../store/slices/authSlice';
import ModalPortal from '../../components/ModalPortal';
import { BASE_URL } from '../../api/endpoints';
import { generatePrimaryShades } from '../../utils/colorPalette';
import { useConfirm } from '../../context/ConfirmDialogContext';

export default function ClinicDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const confirm = useConfirm();

  const clinic = useSelector(selectSelectedClinic);
  const plans = useSelector(selectSubscriptionPlans);
  const loading = useSelector(selectPlatformLoading);

  const [subForm, setSubForm] = useState({
    plan_id: '', plan_name: '',
    max_doctors_per_specialization: '', max_patients: '', max_monthly_appointments: '',
    max_admins: '', max_specializations: '', chatbot_enabled: false, stock_enabled: false,
    status: 'active',
  });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [brandForm, setBrandForm] = useState({
    tagline: '', primaryColor: '', accentColor: '', dangerColor: '', successColor: '', warningColor: '',
    portalTitles: {
      patient: { title: '', titleAr: '' },
      doctor: { title: '', titleAr: '' },
      admin: { title: '', titleAr: '' },
    },
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [savingSub, setSavingSub] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [impersonatingId, setImpersonatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [resettingId, setResettingId] = useState(null);
  const [resetResult, setResetResult] = useState(null); // { email, tempPassword }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchClinicById(id));
    dispatch(fetchSubscriptionPlans());
    return () => dispatch(clearSelectedClinic());
  }, [id, dispatch]);

  useEffect(() => {
    if (clinic) {
      setSubForm({
        plan_id: clinic.plan_id ?? '',
        plan_name: clinic.plan_name || '',
        max_doctors_per_specialization: clinic.max_doctors_per_specialization ?? '',
        max_patients: clinic.max_patients ?? '',
        max_monthly_appointments: clinic.max_monthly_appointments ?? '',
        max_admins: clinic.max_admins ?? '',
        max_specializations: clinic.max_specializations ?? '',
        chatbot_enabled: !!clinic.chatbot_enabled,
        stock_enabled: !!clinic.stock_enabled,
        status: clinic.subscription_status || 'active',
      });
      setBrandForm({
        tagline: clinic.branding?.clinic?.tagline || '',
        primaryColor: clinic.branding?.branding?.colors?.primary?.['600'] || '',
        accentColor: clinic.branding?.branding?.colors?.accent || '',
        dangerColor: clinic.branding?.branding?.colors?.danger || '',
        successColor: clinic.branding?.branding?.colors?.success || '',
        warningColor: clinic.branding?.branding?.colors?.warning || '',
        portalTitles: {
          patient: { title: clinic.branding?.portals?.patient?.title || '', titleAr: clinic.branding?.portals?.patient?.titleAr || '' },
          doctor: { title: clinic.branding?.portals?.doctor?.title || '', titleAr: clinic.branding?.portals?.doctor?.titleAr || '' },
          admin: { title: clinic.branding?.portals?.admin?.title || '', titleAr: clinic.branding?.portals?.admin?.titleAr || '' },
        },
      });
      setLogoFile(null);
      setLogoPreview(null);
    }
  }, [clinic]);

  const toInt = (v) => (v === '' ? null : parseInt(v, 10));
  const getFullLogoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const origin = BASE_URL.split('/backend/api')[0];
    return `${origin}${path}`;
  };
  const setPortalTitle = (role, field, value) => {
    setBrandForm((prev) => ({
      ...prev,
      portalTitles: { ...prev.portalTitles, [role]: { ...prev.portalTitles[role], [field]: value } },
    }));
  };
  const activePlans = plans.filter((p) => p.active);
  const isCustomPlan = !subForm.plan_id;

  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    setSavingSub(true);
    try {
      await dispatch(updateSubscription({
        id,
        data: subForm.plan_id
          ? { plan_id: parseInt(subForm.plan_id, 10), status: subForm.status }
          : {
              plan_name: subForm.plan_name,
              max_doctors_per_specialization: toInt(subForm.max_doctors_per_specialization),
              max_patients: toInt(subForm.max_patients),
              max_monthly_appointments: toInt(subForm.max_monthly_appointments),
              max_admins: toInt(subForm.max_admins),
              max_specializations: toInt(subForm.max_specializations),
              chatbot_enabled: !!subForm.chatbot_enabled,
              stock_enabled: !!subForm.stock_enabled,
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

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    setSavingBrand(true);
    try {
      const payload = {
        ...brandForm,
        // The admin only ever picks one base color ("Primary Color") -
        // the full 9-shade palette every bg-primary-*/text-primary-*
        // class actually needs is generated from it here, so the backend
        // just stores whatever shade map it's given.
        primaryShades: brandForm.primaryColor ? generatePrimaryShades(brandForm.primaryColor) : undefined,
      };
      await dispatch(updateClinicBranding({ id, data: payload })).unwrap();
      toast.success(isRtl ? 'تم تحديث هوية العيادة' : 'Clinic branding updated');
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث الهوية' : 'Failed to update branding'));
    } finally {
      setSavingBrand(false);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      await dispatch(uploadClinicLogo({ id, file: logoFile })).unwrap();
      toast.success(isRtl ? 'تم رفع الشعار' : 'Logo uploaded');
      setLogoFile(null);
      setLogoPreview(null);
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل رفع الشعار' : 'Failed to upload logo'));
    } finally {
      setUploadingLogo(false);
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
    const newStatus = clinic.subscription_status === 'active' ? 'suspended' : 'active';
    try {
      await dispatch(updateClinicStatus({ id, status: newStatus })).unwrap();
      toast.success(newStatus === 'active'
        ? (isRtl ? 'تم إعادة تفعيل العيادة' : 'Clinic reactivated')
        : (isRtl ? 'تم تعليق العيادة' : 'Clinic suspended'));
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تحديث حالة العيادة' : 'Failed to update clinic status'));
    }
  };

  const handleImpersonate = async (adminId) => {
    setImpersonatingId(adminId);
    try {
      await dispatch(impersonateClinicAdmin({ clinicId: id, adminId, clinicName: clinic.name })).unwrap();
      toast.success(isRtl ? `تسجيل الدخول كـ ${clinic.name}` : `Logged in as ${clinic.name}`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل تسجيل الدخول بالنيابة' : 'Failed to impersonate admin'));
    } finally {
      setImpersonatingId(null);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!(await confirm({
      message: isRtl
        ? `هل تريد حذف حساب المسؤول ${admin.email}؟ لا يمكن التراجع عن هذا الإجراء.`
        : `Delete admin account ${admin.email}? This cannot be undone.`,
      danger: true,
    }))) {
      return;
    }
    setDeletingId(admin.id);
    try {
      await dispatch(deleteClinicAdmin(admin.id)).unwrap();
      toast.success(isRtl ? 'تم حذف المسؤول' : 'Admin deleted');
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشل حذف المسؤول' : 'Failed to delete admin'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetPassword = async (admin) => {
    if (!(await confirm({
      message: isRtl
        ? `إعادة تعيين كلمة مرور ${admin.email}؟ سيُطلب منه تعيين كلمة مرور جديدة عند تسجيل الدخول التالي.`
        : `Reset the password for ${admin.email}? They'll be required to set a new one on their next login.`,
    }))) {
      return;
    }
    setResettingId(admin.id);
    try {
      const result = await dispatch(resetAdminPassword(admin.id)).unwrap();
      setResetResult({ email: result.email, tempPassword: result.tempPassword });
      setCopied(false);
    } catch (err) {
      toast.error(err?.message || (isRtl ? 'فشلت إعادة تعيين كلمة المرور' : 'Failed to reset password'));
    } finally {
      setResettingId(null);
    }
  };

  const handleCopyTempPassword = () => {
    navigator.clipboard.writeText(resetResult.tempPassword);
    setCopied(true);
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
            clinic.subscription_status === 'active'
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100'
          }`}
        >
          {clinic.subscription_status === 'active' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {clinic.subscription_status === 'active' ? (isRtl ? 'تعليق العيادة' : 'Suspend Clinic') : (isRtl ? 'إعادة التفعيل' : 'Reactivate Clinic')}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">{isRtl ? 'الاشتراك والحصص' : 'Subscription & Quotas'}</h3>
        {clinic.plan_catalog_name && (
          <p className="text-xs font-bold text-slate-400 mb-4 -mt-2">
            {isRtl ? 'الخطة الحالية:' : 'Current catalog plan:'} <span className="text-primary-600">{clinic.plan_catalog_name}</span>
            {clinic.plan_description ? ` — ${clinic.plan_description}` : ''}
          </p>
        )}
        <form onSubmit={handleSaveSubscription} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'خطة الاشتراك' : 'Subscription Plan'}</label>
            <select value={subForm.plan_id} onChange={(e) => setSubForm({ ...subForm, plan_id: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="">{isRtl ? 'مخصص (إدخال يدوي)' : 'Custom (manual limits)'}</option>
              {activePlans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.duration_days}d</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'حالة الاشتراك' : 'Subscription Status'}</label>
            <select value={subForm.status} onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {isCustomPlan && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'اسم الخطة' : 'Plan Name'}</label>
                <input value={subForm.plan_name} onChange={(e) => setSubForm({ ...subForm, plan_name: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الأطباء لكل تخصص' : 'Doctors per Specialization'}</label>
                <input type="number" min="0" value={subForm.max_doctors_per_specialization} onChange={(e) => setSubForm({ ...subForm, max_doctors_per_specialization: e.target.value })}
                  placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للمرضى' : 'Max Patients'}</label>
                <input type="number" min="0" value={subForm.max_patients} onChange={(e) => setSubForm({ ...subForm, max_patients: e.target.value })}
                  placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'المواعيد الشهرية' : 'Monthly Appointments'}</label>
                <input type="number" min="0" value={subForm.max_monthly_appointments} onChange={(e) => setSubForm({ ...subForm, max_monthly_appointments: e.target.value })}
                  placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للمسؤولين' : 'Max Admins'}</label>
                <input type="number" min="0" value={subForm.max_admins} onChange={(e) => setSubForm({ ...subForm, max_admins: e.target.value })}
                  placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للتخصصات' : 'Max Specializations'}</label>
                <input type="number" min="0" value={subForm.max_specializations} onChange={(e) => setSubForm({ ...subForm, max_specializations: e.target.value })}
                  placeholder={isRtl ? 'غير محدود' : 'Unlimited'}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm cursor-pointer w-full">
                  <input type="checkbox" checked={subForm.chatbot_enabled} onChange={(e) => setSubForm({ ...subForm, chatbot_enabled: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                  <span className="font-bold text-slate-600">{isRtl ? 'شات بوت' : 'ChatBot'}</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm cursor-pointer w-full">
                  <input type="checkbox" checked={subForm.stock_enabled} onChange={(e) => setSubForm({ ...subForm, stock_enabled: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                  <span className="font-bold text-slate-600">{isRtl ? 'إدارة المخزون' : 'Stock Management'}</span>
                </label>
              </div>
            </>
          )}
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
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary-600" /> {isRtl ? 'الهوية البصرية' : 'Branding'}
        </h3>

        {/* Logo - uploaded directly to the server, persisted independently of the form below */}
        <div className="mb-6 pb-6 border-b border-slate-50">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الشعار' : 'Logo'}</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {(logoPreview || getFullLogoUrl(clinic.branding?.clinic?.logoUrl)) ? (
                <img src={logoPreview || getFullLogoUrl(clinic.branding?.clinic?.logoUrl)} alt="" className="w-full h-full object-contain" />
              ) : (
                <ImageOff className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/webp"
                onChange={handleLogoFileChange}
                className="flex-1 text-sm file:me-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 file:font-bold file:text-xs hover:file:bg-slate-200 file:cursor-pointer cursor-pointer"
              />
              <button
                type="button"
                onClick={handleUploadLogo}
                disabled={!logoFile || uploadingLogo}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {isRtl ? 'رفع' : 'Upload'}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isRtl ? 'الشعار النصي' : 'Tagline'}</label>
            <input value={brandForm.tagline} onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
              placeholder={isRtl ? 'مثال: رعاية استثنائية' : 'e.g. Exceptional Care'}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>

          {/* Colors */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{isRtl ? 'الألوان' : 'Colors'}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'primaryColor', label: isRtl ? 'اللون الأساسي' : 'Primary Color', fallback: '#3b82f6' },
                { key: 'accentColor', label: isRtl ? 'لون التمييز' : 'Accent Color', fallback: '#6366f1' },
                { key: 'dangerColor', label: isRtl ? 'لون الخطر' : 'Danger Color', fallback: '#ef4444' },
                { key: 'successColor', label: isRtl ? 'لون النجاح' : 'Success Color', fallback: '#10b981' },
                { key: 'warningColor', label: isRtl ? 'لون التحذير' : 'Warning Color', fallback: '#f59e0b' },
              ].map(({ key, label, fallback }) => (
                <div key={key}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input type="color" value={brandForm[key] || fallback} onChange={(e) => setBrandForm({ ...brandForm, [key]: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer shrink-0" />
                    <input value={brandForm[key]} onChange={(e) => setBrandForm({ ...brandForm, [key]: e.target.value })}
                      placeholder={fallback}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>
              ))}
            </div>
            {/* Live preview of the 9 shades that'll be generated from the single Primary Color above */}
            {brandForm.primaryColor && (
              <div className="mt-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{isRtl ? 'معاينة التدرج' : 'Generated shade preview'}</div>
                <div className="flex rounded-lg overflow-hidden border border-slate-200">
                  {Object.entries(generatePrimaryShades(brandForm.primaryColor)).map(([shade, hex]) => (
                    <div key={shade} style={{ backgroundColor: hex }} className="flex-1 h-8" title={`${shade}: ${hex}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Portal titles */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{isRtl ? 'عناوين البوابات' : 'Portal Titles'}</label>
            <div className="space-y-3">
              {[
                { role: 'patient', label: isRtl ? 'بوابة المريض' : 'Patient Portal' },
                { role: 'doctor', label: isRtl ? 'بوابة الطبيب' : 'Doctor Portal' },
                { role: 'admin', label: isRtl ? 'بوابة الإدارة' : 'Admin Portal' },
              ].map(({ role, label }) => (
                <div key={role} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <span className="text-xs font-bold text-slate-500">{label}</span>
                  <input value={brandForm.portalTitles[role].title} onChange={(e) => setPortalTitle(role, 'title', e.target.value)}
                    placeholder={isRtl ? 'العنوان (إنجليزي)' : 'Title (English)'}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  <input value={brandForm.portalTitles[role].titleAr} onChange={(e) => setPortalTitle(role, 'titleAr', e.target.value)}
                    placeholder={isRtl ? 'العنوان (عربي)' : 'Title (Arabic)'} dir="rtl"
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={savingBrand}
              className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
            >
              {savingBrand ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isRtl ? 'حفظ الهوية' : 'Save Branding'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">{isRtl ? 'مسؤولو العيادة' : 'Clinic Admins'}</h3>
        <div className="divide-y divide-slate-50 mb-6">
          {(clinic.admins || []).map((admin) => (
            <div key={admin.id} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 text-sm block">{admin.email}</span>
                <span className="text-xs text-slate-400">{new Date(admin.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleImpersonate(admin.id)}
                  disabled={impersonatingId === admin.id}
                  className="bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 text-indigo-600 border border-indigo-100 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
                  title={isRtl ? 'تسجيل الدخول كهذا المسؤول' : 'Log in as this admin'}
                >
                  {impersonatingId === admin.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                  {isRtl ? 'تسجيل الدخول كـ' : 'Log in as'}
                </button>
                <button
                  onClick={() => handleResetPassword(admin)}
                  disabled={resettingId === admin.id}
                  className="bg-amber-50 hover:bg-amber-100 disabled:opacity-60 text-amber-600 border border-amber-100 font-bold p-1.5 rounded-lg text-xs transition"
                  title={isRtl ? 'إعادة تعيين كلمة المرور' : 'Reset password'}
                >
                  {resettingId === admin.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin)}
                  disabled={deletingId === admin.id}
                  className="bg-rose-50 hover:bg-rose-100 disabled:opacity-60 text-rose-600 border border-rose-100 font-bold p-1.5 rounded-lg text-xs transition"
                  title={isRtl ? 'حذف هذا المسؤول' : 'Delete this admin'}
                >
                  {deletingId === admin.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
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

      {resetResult && (
        <ModalPortal>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setResetResult(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">{isRtl ? 'تم إعادة تعيين كلمة المرور' : 'Password Reset'}</h3>
              <p className="text-sm font-medium text-slate-500 mb-5">
                {isRtl
                  ? `شارك كلمة المرور المؤقتة هذه مع ${resetResult.email} خارج التطبيق. لن تظهر مرة أخرى.`
                  : `Share this temporary password with ${resetResult.email} outside the app. It won't be shown again.`}
              </p>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <code className="flex-1 font-mono text-sm font-bold text-slate-900 break-all">{resetResult.tempPassword}</code>
                <button
                  onClick={handleCopyTempPassword}
                  className="shrink-0 p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
                  title={isRtl ? 'نسخ' : 'Copy'}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={() => setResetResult(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition"
              >
                {isRtl ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
