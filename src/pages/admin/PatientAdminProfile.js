import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, User, Mail, Phone, Calendar, Shield,
  FileText, Trash2, Download, ExternalLink, Loader2, Plus, Edit, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchPatientById,
  fetchPatientReports,
  deletePatientReport,
  updatePatient,
  selectSelectedPatient,
  selectMyReports,
  selectPatientsLoading
} from '../../store/slices/patientSlice';
import { ENDPOINTS } from '../../api/endpoints';

export default function PatientAdminProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const patient = useSelector(selectSelectedPatient);
  const reports = useSelector(selectMyReports);
  const loading = useSelector(selectPatientsLoading);

  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [editData, setEditData] = useState({
    name_en: '',
    name_ar: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    insurance_provider: '',
    policy_number: ''
  });

  useEffect(() => {
    dispatch(fetchPatientById(id));
    dispatch(fetchPatientReports(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (patient) {
      setEditData({
        name_en: patient.name_en || '',
        name_ar: patient.name_ar || '',
        phone: patient.phone || '',
        date_of_birth: patient.date_of_birth || patient.dob || '',
        gender: patient.gender || 'Male',
        insurance_provider: patient.insurance_provider || '',
        policy_number: patient.policy_number || ''
      });
      setHasInsurance(!!(patient.insurance_provider || patient.policy_number));
    }
  }, [patient]);

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await dispatch(deletePatientReport({ patientId: id, reportId })).unwrap();
        toast.success('Report deleted');
      } catch (err) {
        toast.error('Failed to delete report');
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(patient)
    try {
      await dispatch(updatePatient({
        id: patient.user_id,
        data: {
          ...editData,
          insurance_provider: hasInsurance ? editData.insurance_provider : '',
          policy_number: hasInsurance ? editData.policy_number : ''
        }
      })).unwrap();
      toast.success('Patient profile updated successfully');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const getFullUrl = (path) => {
    if (!path) return '#';
    const origin = window.location.origin.includes('localhost') ? 'http://localhost:4000' : '';
    return `${origin}${path}`;
  };

  if (loading && !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Loading patient profile...</p>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('patientAdminProfile.title')}</h2>
            <p className="text-sm font-medium text-slate-500">{t('patientAdminProfile.recordNumber')}{patient.user_id || patient.id}</p>
          </div>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          <Edit className="w-4 h-4" /> {t('patientAdminProfile.editProfile')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-3xl mx-auto mb-6 border-4 border-white shadow-lg ring-1 ring-slate-100">
              {(patient.name_en || 'U').charAt(0)}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">{patient.name_en || patient.name}</h3>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 px-3 py-1 bg-indigo-50 rounded-full inline-block">
              {t('patientAdminProfile.patientAccount')}
            </p>

            <div className="space-y-4 text-start pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('patientInfo.emailLabel', { defaultValue: 'Email' })}</p>
                  <p className="text-sm font-bold text-slate-700">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('patientInfo.phoneNumber', { defaultValue: 'Phone Number' })}</p>
                  <p className="text-sm font-bold text-slate-700">{patient.phone || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('patientInfo.dateOfBirth', { defaultValue: 'Date of Birth' })}</p>
                  <p className="text-sm font-bold text-slate-700">{patient.date_of_birth || patient.dob || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('patientInfo.gender', { defaultValue: 'Gender' })}</p>
                  <p className="text-sm font-bold text-slate-700">{patient.gender || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('patientInfo.insuranceProvider', { defaultValue: 'Insurance Provider' })}</p>
                  <p className="text-sm font-bold text-slate-700">{patient.insurance_provider || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('patientInfo.policyNumber', { defaultValue: 'Policy Number' })}</p>
                  <p className="text-sm font-bold text-slate-700">{patient.policy_number || '---'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reports list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('patientAdminProfile.medicalRecords')}</h3>
                <p className="text-sm font-medium text-slate-500">{t('patientAdminProfile.recordsSubtitle')}</p>
              </div>
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {t('patientAdminProfile.recordsCount', { count: reports?.length || 0, defaultValue: `${reports?.length || 0} Records` })}
              </span>
            </div>

            <div className="space-y-4">
              {reports?.map(report => (
                <div key={report.id} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate pe-8">{report.file_name || report.file_url.split('/').pop()}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {t('patientAdminProfile.uploadedOn')} {new Date(report.created_at).toLocaleDateString()} • {(report.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={getFullUrl(report.file_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                    >
                      <Download className="w-4.5 h-4.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
              {reports?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                  <FileText className="w-12 h-12 text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold text-sm">{t('patientAdminProfile.noRecords')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('patientAdminProfile.editModalTitle')}</h3>
                <p className="text-sm font-medium text-slate-500">{t('patientAdminProfile.editModalSubtitle')}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('userManagement.thName')} (English)</label>
                  <input
                    type="text"
                    value={editData.name_en}
                    onChange={e => setEditData({ ...editData, name_en: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('userManagement.thName')} (Arabic)</label>
                  <input
                    type="text"
                    value={editData.name_ar}
                    onChange={e => setEditData({ ...editData, name_ar: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patientInfo.phoneNumber')}</label>
                  <input
                    type="text"
                    value={editData.phone}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patientInfo.dateOfBirth')}</label>
                    <input
                      type="date"
                      value={editData.date_of_birth}
                      onChange={e => setEditData({ ...editData, date_of_birth: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patientInfo.gender')}</label>
                    <select
                      value={editData.gender}
                      onChange={e => setEditData({ ...editData, gender: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-sm appearance-none"
                    >
                      <option value="Male">{t('userManagement.genderMale', { defaultValue: 'Male' })}</option>
                      <option value="Female">{t('userManagement.genderFemale', { defaultValue: 'Female' })}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="adminEditHasInsurance"
                      checked={hasInsurance}
                      onChange={(e) => setHasInsurance(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="adminEditHasInsurance" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                      {t('patientInfo.hasInsurance', { defaultValue: 'Patient has health insurance' })}
                    </label>
                  </div>

                  {hasInsurance && (
                    <div className="grid grid-cols-2 gap-4 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patientInfo.insuranceProvider', { defaultValue: 'Insurance Provider' })}</label>
                        <input
                          type="text"
                          value={editData.insurance_provider}
                          onChange={e => setEditData({ ...editData, insurance_provider: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                          placeholder="e.g. MetLife"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">{t('patientInfo.policyNumber', { defaultValue: 'Policy Number' })}</label>
                        <input
                          type="text"
                          value={editData.policy_number}
                          onChange={e => setEditData({ ...editData, policy_number: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                          placeholder="e.g. ABC-123"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  {t('patientAdminProfile.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
