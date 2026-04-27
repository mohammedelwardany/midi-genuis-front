import React, { useState } from 'react';
import { Lock, CreditCard, ShieldCheck, Loader2, Camera, Smartphone, Globe, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment, selectAppointmentsLoading, selectBookingDraft, clearBookingDraft } from '../store/slices/appointmentSlice';
import { selectSelectedDoctor } from '../store/slices/doctorSlice';
import { useSiteConfig } from '../context/SiteConfigContext';
import toast from 'react-hot-toast';

export default function FinalizePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const siteConfig = useSiteConfig();
  const draft = useSelector(selectBookingDraft);

  const { doctorId, selectedDate, selectedSlot, firstName, lastName, email, phone, reason, symptoms, reports, bookingType } = draft;
  const selectedDoctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectAppointmentsLoading);

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCompletePayment = async () => {
    if (!doctorId || !selectedDate || !selectedSlot) {
      toast.error('Missing booking information');
      return;
    }

    if (!paymentScreenshot) {
      toast.error('Please upload a screenshot of your transfer');
      return;
    }

    const formData = new FormData();
    formData.append('doctor_id', doctorId);
    formData.append('date', selectedDate);
    formData.append('time', selectedSlot.start_time);
    formData.append('reason', reason || '');
    formData.append('symptoms', symptoms || '');
    formData.append('patient_name', `${firstName} ${lastName}`);
    formData.append('patient_email', email);
    formData.append('patient_phone', phone);
    formData.append('payment_screenshot', paymentScreenshot);
    formData.append('booking_type', bookingType || 'consultation');
    
    if (reports && reports.length > 0) {
      reports.forEach(id => formData.append('report_ids[]', id));
    }

    try {
      await dispatch(createAppointment(formData)).unwrap();
      dispatch(clearBookingDraft());
      toast.success(t('finalizePayment.toastSuccess', { defaultValue: 'Payment proof submitted! Appointment pending approval.' }));
      navigate('/patient/book/confirm', { 
        state: { 
          doctorName: i18n.language.startsWith('ar') ? (selectedDoctor?.name_ar || selectedDoctor?.name) : (selectedDoctor?.name_en || selectedDoctor?.name || 'Specialist'), 
          date: selectedDate, 
          time: selectedSlot.start_time,
          pending: true 
        } 
      });
    } catch (err) {
      toast.error(err?.message || t('finalizePayment.toastError', { defaultValue: 'Failed to submit booking' }));
    }
  };

  if (!doctorId) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <h3 className="text-xl font-bold text-slate-800">{t('pickSchedule.noBookingData', { defaultValue: 'No Booking Data Found' })}</h3>
        <button onClick={() => navigate('/patient/book/doctors')} className="mt-4 text-primary-600 font-bold hover:underline">{t('pickSchedule.backToDoctors', { defaultValue: 'Start over' })}</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-4 mt-2">
         <ShieldCheck className="w-3.5 h-3.5" /> {t('finalizePayment.manualApproval', { defaultValue: 'Admin Manual Approval' })}
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('finalizePayment.title', { defaultValue: 'Submit Payment Proof' })}</h2>
      <p className="text-slate-600 mb-10 text-[15px] font-medium leading-relaxed">
        {t('finalizePayment.instruction', { defaultValue: 'Please transfer the amount using InstaPay or Mobile Wallet, then upload the transaction screenshot below.' })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-20">
        <div className="lg:col-span-3 space-y-8">
           
           <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start gap-4">
              <div className="bg-primary-600 rounded-xl p-3 text-white">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary-900 mb-1">{t('finalizePayment.transferDetails', { defaultValue: 'Transfer Details' })}</h4>
                <div className="space-y-3 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-primary-700 font-medium">
                    <div className="flex items-center gap-2 w-28">
                      <Globe className="w-3.5 h-3.5 text-primary-400" />
                      <span className="text-[10px] uppercase tracking-wider text-primary-400">InstaPay:</span>
                    </div>
                    <span className="bg-white px-3 py-1.5 rounded-lg border border-primary-100 select-all font-mono text-xs shadow-sm">
                      {siteConfig.payment?.instapay || 'medigenius@instapay'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-primary-700 font-medium">
                    <div className="flex items-center gap-2 w-28">
                      <Smartphone className="w-3.5 h-3.5 text-primary-400" />
                      <span className="text-[10px] uppercase tracking-wider text-primary-400">Wallet:</span>
                    </div>
                    <span className="bg-white px-3 py-1.5 rounded-lg border border-primary-100 select-all font-mono text-xs shadow-sm">
                      {siteConfig.payment?.wallet || '01000000000'}
                    </span>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-4 uppercase tracking-widest">{t('finalizePayment.uploadScreenshot', { defaultValue: 'Upload Transaction Screenshot' })}</label>
              
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-[20px] p-10 flex flex-col items-center justify-center transition-all ${previewUrl ? 'border-primary-600 bg-primary-50/30' : 'border-slate-200 group-hover:border-primary-400 bg-slate-50'}`}>
                  {previewUrl ? (
                    <div className="text-center">
                      <div className="relative inline-block">
                        <img src={previewUrl} className="max-h-64 rounded-xl shadow-xl mb-4 border-4 border-white" alt="Preview" />
                        <div className="absolute -top-3 -right-3 bg-primary-600 text-white p-2 rounded-full shadow-lg">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-xs font-black text-primary-600 uppercase tracking-widest flex items-center justify-center gap-2">
                        <Camera className="w-3.5 h-3.5" /> {t('finalizePayment.changeImage', { defaultValue: 'Tap to Change Image' })}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 text-slate-300 group-hover:text-primary-600 group-hover:scale-110 transition-all">
                        <Camera className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 mb-1">{t('finalizePayment.clickToUpload', { defaultValue: 'Click or drag to upload' })}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">JPG, PNG or PDF (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  {t('finalizePayment.approvalNotice', { defaultValue: 'Your booking will be reviewed by our administration. You will receive a confirmation once the payment is verified.' })}
                </p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{t('finalizePayment.bookingSummary', { defaultValue: 'Booking Summary' })}</h3>
              
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                  <img src={`https://ui-avatars.com/api/?name=${(i18n.language.startsWith('ar') ? selectedDoctor?.name_ar : selectedDoctor?.name_en) || 'Doc'}&background=f1f5f9`} className="w-12 h-12 rounded-lg object-cover" alt="Dr" />
                 <div>
                    <h4 className="font-bold text-slate-900 text-sm">{(i18n.language.startsWith('ar') ? selectedDoctor?.name_ar : selectedDoctor?.name_en) || 'Medical Specialist'}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{selectedDoctor?.specialization || t('finalizePayment.specialistConsultation', { defaultValue: 'Consultation' })}</p>
                    <p className="text-[10px] font-bold text-primary-600 mt-1 uppercase tracking-widest">
                      {selectedDate && new Date(selectedDate).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} • {selectedSlot?.start_time}
                    </p>
                 </div>
              </div>

              <div className="space-y-4 text-sm font-medium border-b border-slate-100 pb-6 mb-6">
                 <div className="flex justify-between items-center text-slate-600">
                    <span>{t('finalizePayment.consultationFee', { defaultValue: 'Consultation Fee' })}</span>
                    <span className="font-bold text-slate-900">$240.00</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-600">
                    <span>{t('finalizePayment.serviceTax', { defaultValue: 'Service Tax (4%)' })}</span>
                    <span className="font-bold text-slate-900">$10.20</span>
                 </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('finalizePayment.totalAmount', { defaultValue: 'Total Amount' })}</div>
                 <div className="text-3xl font-extrabold text-slate-900">$250.20</div>
              </div>

              <button 
                onClick={handleCompletePayment}
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-base font-bold py-3.5 rounded-xl shadow-sm transition-all hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                 {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                 {t('finalizePayment.submitProof', { defaultValue: 'Submit Payment Proof' })}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
