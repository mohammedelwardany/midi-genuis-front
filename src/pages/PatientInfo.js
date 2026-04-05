import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCircle, ClipboardList, ShieldCheck, ArrowLeft, ArrowRight, Info, UploadCloud } from 'lucide-react';

export default function PatientInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
                 <input type="text" placeholder="e.g., Jonathan" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.lastName', { defaultValue: 'Last Name' })}</label>
                 <input type="text" placeholder="e.g., Sterling" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('auth.emailLabel')}</label>
                 <input type="email" placeholder="j.sterling@example.com" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.phoneNumber', { defaultValue: 'Phone Number' })}</label>
                 <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
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
                 <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-700 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow appearance-none text-sm cursor-pointer">
                    <option value="">{t('patientInfo.selectPrimaryConcern', { defaultValue: 'Select primary concern' })}</option>
                    <option value="routine">Routine Checkup</option>
                    <option value="followup">Follow-up Consultation</option>
                    <option value="illness">New Illness/Symptom</option>
                 </select>
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.describeSymptoms', { defaultValue: 'Describe Symptoms or Concerns' })}</label>
                 <textarea rows="4" placeholder="Briefly describe what you've been experiencing..." className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow resize-none text-sm"></textarea>
              </div>
           </div>
        </section>

        {/* Checkup Reports / Insurance */}
        <section className="mb-12">
           <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-50">
              <ShieldCheck className="w-5 h-5 text-primary-600" /> {t('patientInfo.checkupReports', { defaultValue: 'Checkup Reports' })}
           </h3>
           <div className="space-y-6">
              <div>
                 <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.insuranceProvider', { defaultValue: 'Insurance Provider' })}</label>
                 <input type="text" placeholder="e.g., Blue Cross Shield" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.policyNumber', { defaultValue: 'Policy Number' })}</label>
                    <input type="text" placeholder="ABC-123456789" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-mono focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
                 </div>
                 <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('patientInfo.groupIdOptional', { defaultValue: 'Group ID (Optional)' })}</label>
                    <input type="text" placeholder="GRP-9988" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-slate-900 font-mono focus:ring-2 focus:ring-primary-500 transition-shadow text-sm" />
                 </div>
              </div>

              {/* Upload Medical Records Feature */}
              <div className="pt-4 border-t border-slate-50 mt-4">
                 <label className="block text-[11px] font-bold text-slate-700 mb-3 uppercase tracking-widest">{t('patientInfo.attachRecordsOptional', { defaultValue: 'Attach Medical Records (Optional)' })}</label>
                 <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group">
                    <div className="bg-white p-2 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                       <UploadCloud className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm mb-1">{t('patientInfo.uploadPrompt', { defaultValue: 'Click to upload or drag & drop' })}</div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Relevant X-Rays, Lab Results, or Discharges</div>
                 </div>
              </div>
           </div>
        </section>

        {/* Action Bar Local */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
           <button onClick={() => navigate('/patient/book/schedule')} className="font-bold text-slate-700 flex items-center hover:text-slate-900 transition-colors py-2 text-sm">
              <ArrowLeft className="w-4 h-4 me-2" /> {t('patientInfo.backToSchedule', { defaultValue: 'Back to Schedule' })}
           </button>
           <button onClick={() => navigate('/patient/book/payment')} className="bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 text-white font-bold py-3 px-8 rounded-xl transition-all hover:-translate-y-0.5 text-sm flex items-center">
              {t('patientInfo.continueToPayment', { defaultValue: 'Continue to Payment' })} <ArrowRight className="w-4 h-4 ms-2" />
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
