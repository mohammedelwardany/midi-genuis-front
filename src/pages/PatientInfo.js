import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { UserCircle, ClipboardList, ShieldCheck, ArrowLeft, ArrowRight, Info, UploadCloud, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { selectCurrentUser } from '../store/slices/authSlice';
import { fetchMyReports, uploadReport, selectMyReports, selectPatientsLoading } from '../store/slices/patientSlice';
import { updateBookingDraft, selectBookingDraft } from '../store/slices/appointmentSlice';

export default function PatientInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const user = useSelector(selectCurrentUser);
  const reports = useSelector(selectMyReports);
  const loading = useSelector(selectPatientsLoading);
  const draft = useSelector(selectBookingDraft);

  const [formData, setFormData] = useState({
    firstName: draft.firstName || '',
    lastName: draft.lastName || '',
    email: draft.email || '',
    phone: draft.phone || '',
    reason: draft.reason || '',
    symptoms: draft.symptoms || '',
    insuranceProvider: draft.insuranceProvider || '',
    policyNumber: draft.policyNumber || '',
    groupId: draft.groupId || '',
  });

  const [selectedReportIds, setSelectedReportIds] = useState(draft.reports || []);

  useEffect(() => {
    dispatch(fetchMyReports());
    // Auto-fill from user ONLY if draft fields are empty
    if (user && !draft.firstName && !draft.email) {
      const names = (user.name_en || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, dispatch, draft.firstName, draft.email]);

  const toggleReportSelection = (id) => {
    const newSelection = selectedReportIds.includes(id) 
      ? selectedReportIds.filter(rid => rid !== id) 
      : [...selectedReportIds, id];
    setSelectedReportIds(newSelection);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    try {
      toast.loading('Uploading...', { id: 'upload' });
      const result = await dispatch(uploadReport(fd)).unwrap();
      const newReport = result.data || result;
      setSelectedReportIds(prev => [...prev, newReport.id]);
      toast.success('Uploaded and selected', { id: 'upload' });
    } catch (err) {
      toast.error('Upload failed', { id: 'upload' });
    }
  };

  if (!draft.doctorId || !draft.selectedSlot) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <Info className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-800">{t('pickSchedule.noBookingData', { defaultValue: 'No Booking Data Found' })}</h3>
        <button onClick={() => navigate('/patient/book/doctors')} className="mt-4 text-primary-600 font-bold hover:underline">{t('pickSchedule.backToDoctors', { defaultValue: 'Go back to doctors list' })}</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-24">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('patientInfo.title', { defaultValue: 'Patient Information' })}</h2>
        <p className="text-slate-500 max-w-xl text-[15px] font-medium leading-relaxed">
          {t('patientInfo.description', { defaultValue: "Please provide the patient's comprehensive medical and contact details to ensure accurate clinical documentation." })}
        </p>
      </div>

      <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-slate-100">
        
        {/* Contact Details */}
        <section className="mb-12">
           <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-50">
              <UserCircle className="w-5 h-5 text-primary-600" /> {t('patientInfo.contactDetails', { defaultValue: 'Contact Details' })}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.firstName', { defaultValue: 'First Name' })}</label>
                 <input 
                   type="text" 
                   value={formData.firstName}
                   onChange={e => setFormData({...formData, firstName: e.target.value})}
                   placeholder="e.g., Jonathan" 
                   className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" 
                 />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.lastName', { defaultValue: 'Last Name' })}</label>
                 <input 
                   type="text" 
                   value={formData.lastName}
                   onChange={e => setFormData({...formData, lastName: e.target.value})}
                   placeholder="e.g., Sterling" 
                   className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" 
                 />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('auth.emailLabel')}</label>
                 <input 
                   type="email" 
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   placeholder="j.sterling@example.com" 
                   className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" 
                 />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.phoneNumber', { defaultValue: 'Phone Number' })}</label>
                 <input 
                   type="tel" 
                   value={formData.phone}
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                   placeholder="+1 (555) 000-0000" 
                   className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" 
                 />
              </div>
           </div>
        </section>

        {/* Visit Information */}
        <section className="mb-12">
           <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-50">
              <ClipboardList className="w-5 h-5 text-primary-600" /> {t('patientInfo.visitInformation', { defaultValue: 'Visit Information' })}
           </h3>
           <div className="space-y-6">
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.reasonForVisit', { defaultValue: 'Reason for Visit' })}</label>
                 <select 
                   value={formData.reason}
                   onChange={e => setFormData({...formData, reason: e.target.value})}
                   className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-700 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow appearance-none text-sm cursor-pointer"
                 >
                    <option value="">{t('patientInfo.selectPrimaryConcern', { defaultValue: 'Select primary concern' })}</option>
                    <option value="routine">{t('patientInfo.routineCheckup', { defaultValue: 'Routine Checkup' })}</option>
                    <option value="followup">{t('patientInfo.followupConsultation', { defaultValue: 'Follow-up Consultation' })}</option>
                    <option value="illness">{t('patientInfo.newIllnessSymptom', { defaultValue: 'New Illness/Symptom' })}</option>
                 </select>
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.describeSymptoms', { defaultValue: 'Describe Symptoms or Concerns' })}</label>
                 <textarea 
                   rows="4" 
                   value={formData.symptoms}
                   onChange={e => setFormData({...formData, symptoms: e.target.value})}
                   placeholder="Briefly describe what you've been experiencing..." 
                   className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow resize-none text-sm"
                 ></textarea>
              </div>
           </div>
        </section>

        {/* Medical Reports */}
        <section className="mb-12">
           <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-50">
              <ShieldCheck className="w-5 h-5 text-primary-600" /> {t('patientInfo.checkupReports', { defaultValue: 'Medical Records & Reports' })}
           </h3>
           <div className="space-y-6">
              <div className="bg-slate-50/50 rounded-[20px] p-6 border border-slate-100">
                <label className="block text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-widest">{t('patientInfo.selectExisting', { defaultValue: 'Select from existing records' })}</label>
                <div className="flex flex-wrap gap-3">
                  {reports?.map(report => (
                    <button
                      key={report.id}
                      onClick={() => toggleReportSelection(report.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all ${
                        selectedReportIds.includes(report.id)
                          ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {selectedReportIds.includes(report.id) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4 opacity-50" />
                      )}
                      <span className="truncate max-w-[140px]">{report.file_name || (report.file_url ? report.file_url.split('/').pop() : 'Report')}</span>
                    </button>
                  ))}
                  {reports?.length === 0 && <span className="text-xs font-medium text-slate-400">{t('patientDashboard.noRecords', { defaultValue: 'No records found.' })}</span>}
                </div>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary-50/30 border-2 border-dashed border-primary-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer group"
              >
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                 <div className="bg-white p-2.5 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform border border-primary-50">
                    {loading ? <Loader2 className="w-5 h-5 text-primary-600 animate-spin" /> : <UploadCloud className="w-5 h-5 text-primary-600" />}
                 </div>
                 <div className="font-bold text-slate-700 text-sm mb-1">{t('patientInfo.uploadNewReport', { defaultValue: 'Upload New Report' })}</div>
                 <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">PDF, JPG or PNG (Max 10MB)</div>
              </div>
           </div>
        </section>

        {/* Action Bar Local */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
           <button onClick={() => navigate(draft.doctorId ? `/patient/book/schedule/${draft.doctorId}` : '/patient/book/doctors')} className="font-bold text-slate-700 flex items-center hover:text-slate-900 transition-colors py-2 text-sm">
              <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" /> {t('patientInfo.backToSchedule', { defaultValue: 'Back to Schedule' })}
           </button>
           <button 
             onClick={() => {
               dispatch(updateBookingDraft({ ...formData, reports: selectedReportIds }));
               navigate('/patient/book/payment');
             }} 
             className="bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 text-white font-bold py-3 px-8 rounded-xl transition-all hover:-translate-y-0.5 text-sm flex items-center"
           >
              {t('patientInfo.continueToPayment', { defaultValue: 'Continue to Payment' })} <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
           </button>
        </div>

      </div>

      {/* Privacy Notice */}
      <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100 flex gap-4 items-start mt-8">
         <div className="text-primary-600 shrink-0 mt-0.5">
            <Info className="w-5 h-5 bg-white rounded-full" />
         </div>
         <div>
            <h5 className="font-bold text-slate-900 text-[13px] mb-1">{t('patientInfo.privacySecurity', { defaultValue: 'Privacy & Security' })}</h5>
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
               Your data is protected by industry-standard HIPAA-compliant encryption. We never share your medical information without your explicit consent.
            </p>
         </div>
      </div>
    </div>
  )
}
