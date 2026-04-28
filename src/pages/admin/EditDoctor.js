import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  Save,
  User,
  Mail,
  Stethoscope,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { fetchDoctorById, updateDoctor, selectSelectedDoctor, selectDoctorsLoading } from '../../store/slices/doctorSlice';

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const doctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectDoctorsLoading);

  const [formData, setFormData] = useState({
    id: '',
    name_en: '',
    name_ar: '',
    specialization: '',
    experience_years: '',
    bio: '',
    email: ''
  });

  const [customSpecialization, setCustomSpecialization] = useState('');

  const specializations = React.useMemo(() =>
    t('specializations', { returnObjects: true }),
    [t]
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(id));
    }
  }, [id, dispatch]);

  // Only initialize form once when doctor is loaded
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (doctor && !initialized) {
      const isKnown = Object.keys(specializations).includes(doctor.specialization);
      setFormData({
        id: id || '',
        name_en: doctor.name_en || '',
        name_ar: doctor.name_ar || '',
        specialization: isKnown ? doctor.specialization : 'other',
        experience_years: doctor.experience_years || '',
        bio: doctor.bio || '',
        email: doctor.email || ''
      });
      if (!isKnown && doctor.specialization) {
        setCustomSpecialization(doctor.specialization);
      }
      setInitialized(true);
    }
  }, [doctor, specializations, initialized]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSpecialization = formData.specialization === 'other' ? customSpecialization : formData.specialization;

    dispatch(updateDoctor({
      id: id,
      data: {
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        specialization: finalSpecialization,
        bio: formData.bio,
        experience_years: formData.experience_years.toString()
      }
    })).then((res) => {
      if (!res.error) {
        navigate('/admin/users');
      }
    });
  };

  if (loading && !doctor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-16 text-start">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> {t('adminEditDoctor.backToUsers')}
      </button>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('adminEditDoctor.title')}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {t('adminEditDoctor.subtitle', { name: i18n.language.startsWith('ar') ? (formData.name_ar || formData.name_en) : formData.name_en })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> {t('adminEditDoctor.fullNameEn')}
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                required
              />
            </div>

            <div className="space-y-2 text-end">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center justify-end gap-2">
                {t('adminEditDoctor.fullNameAr')} <User className="w-3.5 h-3.5" />
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-end"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {t('adminEditDoctor.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-semibold cursor-not-allowed text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Stethoscope className="w-3.5 h-3.5" /> {t('adminEditDoctor.specialization')}
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold appearance-none cursor-pointer mb-2"
                required
              >
                <option value="">{t('common.select', { defaultValue: 'Select...' })}</option>
                {Object.entries(specializations).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>

              {formData.specialization === 'other' && (
                <div className="animate-in slide-in-from-top-1 duration-300">
                  <input
                    type="text"
                    value={customSpecialization}
                    onChange={(e) => setCustomSpecialization(e.target.value)}
                    placeholder={t('adminEditDoctor.customSpecializationPlaceholder', { defaultValue: 'Enter custom specialization...' })}
                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold transition-all"
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> {t('adminEditDoctor.experience')}
              </label>
              <input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
              {t('adminEditDoctor.bio')}
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold h-40 resize-none"
              placeholder={t('adminEditDoctor.bioPlaceholder')}
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 rounded-[28px] text-white shadow-xl shadow-slate-900/20 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs font-bold text-slate-300">{t('adminEditDoctor.notice')}</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              {t('adminEditDoctor.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {t('adminEditDoctor.saveChanges')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
