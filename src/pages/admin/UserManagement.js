import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, User, Search, Filter, MoreVertical, Mail, AlertCircle, CheckCircle2, Trash2, Edit, Loader2, Calendar, Plus, Shield, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import ModalPortal from '../../components/ModalPortal';
import {
  fetchDoctors,
  addDoctor,
  deleteDoctor,
  selectDoctors,
  selectDoctorsLoading
} from '../../store/slices/doctorSlice';
import {
  fetchPatients,
  addPatient,
  deletePatient,
  selectPatients,
  selectPatientsLoading
} from '../../store/slices/patientSlice';

export default function UserManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('doctors');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');

  const doctors = useSelector(selectDoctors);
  const doctorsLoading = useSelector(selectDoctorsLoading);
  const patientsList = useSelector(selectPatients);
  const patientsLoading = useSelector(selectPatientsLoading);

  const loading = activeTab === 'doctors' ? doctorsLoading : patientsLoading;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name_en: '',
    name_ar: '',
    specialization: '',
    bio: '',
    experience_years: '',
    appointment_duration: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    insurance_provider: '',
    policy_number: ''
  });

  const [customSpecialization, setCustomSpecialization] = useState('');

  const specializations = React.useMemo(() =>
    t('specializations', { returnObjects: true }),
    [t]
  );


  useEffect(() => {
    if (activeTab === 'doctors') {
      dispatch(fetchDoctors());
    } else {
      dispatch(fetchPatients());
    }
  }, [dispatch, activeTab]);

  const filteredItems = (activeTab === 'doctors' ? (doctors || []) : (patientsList || [])).filter(item => {
    const name = item.name_en || item.name || '';
    const email = item.email || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'doctors') {
      const matchesFilter = filterSpec === 'All' || item.specialization === filterSpec;
      return matchesSearch && matchesFilter;
    }
    return matchesSearch;
  });

  const uniqueSpecializations = ['All', ...new Set((doctors || []).map(d => d.specialization).filter(Boolean))];

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === 'doctors') {
        const finalSpecialization = formData.specialization === 'other' ? customSpecialization : formData.specialization;
        await dispatch(addDoctor({
          ...formData,
          specialization: finalSpecialization,
          experience_years: parseInt(formData.experience_years),
          appointment_duration: parseInt(formData.appointment_duration) || 30
        })).unwrap();
        toast.success(t('userManagement.physicianSuccess'));
      } else {
        await dispatch(addPatient({
          ...formData,
          insurance_provider: hasInsurance ? formData.insurance_provider : '',
          policy_number: hasInsurance ? formData.policy_number : ''
        })).unwrap();
        toast.success(t('userManagement.patientSuccess'));
      }

      setShowAddModal(false);
      setHasInsurance(false);
      setCustomSpecialization('');
      setFormData({
        email: '', password: '', name_en: '', name_ar: '',
        specialization: '', bio: '', experience_years: '', appointment_duration: '',
        phone: '', date_of_birth: '', gender: 'Male',
        insurance_provider: '', policy_number: ''
      });

      if (activeTab === 'doctors') dispatch(fetchDoctors());
      else dispatch(fetchPatients());
    } catch (err) {
      toast.error(err?.message || t('userManagement.failRegister', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = (id) => {
    const type = activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular');
    if (window.confirm(t('userManagement.deleteConfirm', { type }))) {
      if (activeTab === 'doctors') {
        dispatch(deleteDoctor(id));
      } else {
        dispatch(deletePatient(id));
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('userManagement.title')}</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{t('userManagement.desc')}</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {activeTab === 'doctors' ? t('userManagement.registerDoc') : t('userManagement.registerPatient')}
          </button>
        </div>

        <div className="flex gap-6 mt-8 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === 'doctors' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t('userManagement.doctorsTab')}
            {activeTab === 'doctors' && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === 'patients' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t('userManagement.patientsTab')}
            {activeTab === 'patients' && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="relative w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t('userManagement.search')} ${activeTab === 'doctors' ? t('userManagement.doctorsTab') : t('userManagement.patientsTab')}`}
              className="w-full ps-9 pe-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {activeTab === 'doctors' && (
            <div className="relative">
              <Filter className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="ps-9 pe-8 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-bold text-slate-600 appearance-none cursor-pointer"
              >
                {uniqueSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec === 'All' ? t('common.all', { defaultValue: 'All' }) : t('specializations.' + spec, { defaultValue: spec })}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-visible mb-12">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
              <th className="p-4 ps-6 text-start">{t('userManagement.thName')}</th>
              <th className="p-4 text-start">{activeTab === 'doctors' ? t('userManagement.thSpecialization') : t('userManagement.thDob')}</th>
              {activeTab === 'patients' && (
                <>
                  <th className="p-4 text-start">{t('patientInfo.gender', { defaultValue: 'Gender' })}</th>
                  <th className="p-4 text-start">{t('patientInfo.phoneNumber', { defaultValue: 'Phone Number' })}</th>
                </>
              )}
              {activeTab === 'doctors' && (
                <th className="p-4 text-center">{t('userManagement.thExperience')}</th>
              )}
              <th className="p-4 text-end pe-6">{t('userManagement.thActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={activeTab === 'doctors' ? 4 : 5} className="p-8 text-center text-slate-500 font-medium">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                  {t('userManagement.loadingUser', { type: activeTab })}
                </td>
              </tr>
            ) : filteredItems.map((user) => (
              <tr key={user.id || user.user_id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4 ps-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {(i18n.language.startsWith('ar') ? (user.name_ar || user.name_en || user.name || 'U') : (user.name_en || user.name || 'U')).charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {i18n.language.startsWith('ar') ? (user.name_ar || user.name_en || user.name) : (user.name_en || user.name)}
                        </span>
                        {activeTab === 'patients' && user.insurance_provider && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100/50 uppercase tracking-widest leading-none">
                            <Shield className="w-2.5 h-2.5" />
                            {user.insurance_provider}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-slate-700 text-start">
                  {activeTab === 'doctors'
                    ? t('specializations.' + user.specialization, { defaultValue: user.specialization })
                    : (user.date_of_birth || user.dob ? new Date(user.date_of_birth || user.dob).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }) : '---')}
                </td>
                {activeTab === 'patients' && (
                  <>
                    <td className="p-4 text-sm font-semibold text-slate-700 text-start">
                      {user.gender ? (i18n.language.startsWith('ar') ? (user.gender === 'Male' ? 'ذكر' : 'أنثى') : user.gender) : '---'}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700 text-start">
                      <span dir="ltr">{user.phone || '---'}</span>
                    </td>
                  </>
                )}
                {activeTab === 'doctors' && (
                  <td className="p-4 text-center text-sm font-bold text-slate-700">
                    {user.experience_years} {t('userManagement.years')}
                  </td>
                )}
                <td className="p-4 text-end pe-6 relative">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const uid = user.id || user.user_id;
                        setOpenMenuId(openMenuId === uid ? null : uid);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {openMenuId && (openMenuId === (user.id || user.user_id)) && (
                    <div className="absolute right-6 top-12 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-[100] min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                      {activeTab === 'patients' ? (
                        <button
                          // onClick={() => console.log(user)}
                          onClick={() => navigate(`/admin/patients/${user.patient_id}`)}

                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <User className="w-3.5 h-3.5" /> {t('userManagement.viewProfile')}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/admin/doctors/edit/${user.id}`)}

                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> {t('userManagement.editDoctor')}
                          </button>
                          <button
                            // onClick={() => console.log(user)}
                            onClick={() => navigate(`/admin/doctors/availability/${user.id}`)}


                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" /> {t('userManagement.setAvailability', { defaultValue: 'Set Availability' })}
                          </button>
                        </>
                      )}

                      {activeTab === 'patients' && (
                        <button
                          onClick={() => navigate(`/admin/book-for-patient/${user.patient_id || user.id}`)}
                          // onClick={() => console.log(user)}

                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> {t('userManagement.bookVisit', { defaultValue: 'Book Visit' })}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          // deleteDoctor expects the doctors table's own id (user.id here,
                          // since the doctors list is selected via `d.*`); deletePatient
                          // expects the account's users.id (user.user_id here, since the
                          // patients list aliases patients.id to patient_id instead).
                          // Passing the wrong one 404s "not found" against the other table.
                          handleDeleteItem(activeTab === 'doctors' ? user.id : (user.user_id || user.id));
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> {t('userManagement.delete')}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {
        showAddModal && (
          <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-slate-800">
                  {t('userManagement.registerModalTitle', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') })}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thName')} (English)</label>
                    <input type="text" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.nameEnPlaceholder')} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thName')} (Arabic)</label>
                    <input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-right" placeholder={t('userManagement.nameArPlaceholder')} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thEmail')}</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.emailPlaceholder')} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thPassword')}</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" required />
                  </div>
                </div>

                {activeTab === 'doctors' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.gender')}</label>
                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold">
                          <option value="Male">{t('userManagement.genderMale')}</option>
                          <option value="Female">{t('userManagement.genderFemale')}</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thAppointmentDuration', { defaultValue: 'Duration (mins)' })}</label>
                        <input type="number" value={formData.appointment_duration} onChange={(e) => setFormData({ ...formData, appointment_duration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder="30" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thSpecialization')}</label>
                        <select
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold appearance-none cursor-pointer"
                          required
                        >
                          <option value="">{t('common.select', { defaultValue: 'Select...' })}</option>
                          {Object.entries(specializations).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                          ))}
                        </select>

                        {formData.specialization === 'other' && (
                          <div className="animate-in slide-in-from-top-1 duration-150 mt-2">
                            <input
                              type="text"
                              value={customSpecialization}
                              onChange={(e) => setCustomSpecialization(e.target.value)}
                              placeholder={t('adminEditDoctor.customSpecializationPlaceholder', { defaultValue: 'Enter custom specialization...' })}
                              className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold transition-all"
                              required
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thExperience')}</label>
                        <input type="number" value={formData.experience_years} onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.experiencePlaceholder')} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thBio')}</label>
                      <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold h-24" placeholder={t('userManagement.bioPlaceholder')} required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.phoneNumber')}</label>
                        <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.phonePlaceholder')} required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thDob')}</label>
                        <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 pb-1.5">
                        <input
                          type="checkbox"
                          id="adminHasInsurance"
                          checked={hasInsurance}
                          onChange={(e) => setHasInsurance(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="adminHasInsurance" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                          {t('patientInfo.hasInsurance', { defaultValue: 'Patient has health insurance' })}
                        </label>
                      </div>

                      {hasInsurance && (
                        <div className="grid grid-cols-2 gap-4 pb-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.insuranceProvider', { defaultValue: 'Insurance Provider' })}</label>
                            <input type="text" value={formData.insurance_provider} onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder="e.g. MetLife" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.policyNumber', { defaultValue: 'Policy Number' })}</label>
                            <input type="text" value={formData.policy_number} onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder="e.g. ABC-123" />
                          </div>
                        </div>
                      )}
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.gender')}</label>
                      <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold">
                        <option value="Male">{t('userManagement.genderMale')}</option>
                        <option value="Female">{t('userManagement.genderFemale')}</option>
                      </select>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> {t('userManagement.creatingUser', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') })}
                    </>
                  ) : (
                    t('userManagement.createUserBtn', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') })
                  )}
                </button>
              </form>
            </div>
          </div>
          </ModalPortal>
        )
      }
    </div >
  );
}
