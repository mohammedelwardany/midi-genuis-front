import React, { useState } from 'react';
import { Lock, CreditCard, ShieldCheck, Loader2, Camera, Smartphone, Globe, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment, selectAppointmentsLoading, selectBookingDraft, clearBookingDraft } from '../store/slices/appointmentSlice';
import { selectSelectedDoctor } from '../store/slices/doctorSlice';
import { uploadReport } from '../store/slices/patientSlice';
import { useSiteConfig } from '../context/SiteConfigContext';
import { selectCurrentUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function FinalizePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const siteConfig = useSiteConfig();
  const draft = useSelector(selectBookingDraft);
  const currentUser = useSelector(selectCurrentUser);

  const { doctorId, selectedDate, selectedSlot, firstName, lastName, email, phone, reason, symptoms, reports, bookingType } = draft;
  const selectedDoctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectAppointmentsLoading);

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paymentScreenshotId, setPaymentScreenshotId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Upload immediately to ensure it's in reports
      const fd = new FormData();
      fd.append('file', file);
      const patientId = currentUser?.user_id || currentUser?.id;
      if (patientId) fd.append('patient_id', patientId);

      try {
        setIsUploading(true);
        toast.loading(t('finalizePayment.toastUploading', { defaultValue: 'Uploading payment proof...' }), { id: 'upload' });
        const result = await dispatch(uploadReport(fd)).unwrap();

        // Be robust about finding the ID
        const reportId = result.id || result.report_id || result.data?.id || result.data?.report_id || result.report?.id || (typeof result === 'number' ? result : null);

        if (reportId) {
          setPaymentScreenshotId(reportId);
          toast.success(t('finalizePayment.toastUploadSuccess', { defaultValue: 'Payment proof uploaded successfully' }), { id: 'upload' });
        } else {
          console.error('Upload succeeded but no ID found in response:', result);
          toast.error(t('finalizePayment.errorNoRefId', { defaultValue: 'Upload succeeded but failed to get reference ID' }), { id: 'upload' });
        }
      } catch (err) {
        toast.error(t('finalizePayment.errorUploadFail', { defaultValue: 'Failed to upload screenshot' }), { id: 'upload' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCompletePayment = async () => {
    if (!doctorId || !selectedDate || !selectedSlot) {
      toast.error(t('finalizePayment.errorMissingInfo', { defaultValue: 'Missing booking information' }));
      return;
    }

    // if (!paymentScreenshotId) {
    //   toast.error('Please upload your payment screenshot first');
    //   return;
    // }

    try {
      const payload = {
        doctor_id: parseInt(doctorId),
        availability_id: selectedSlot.id,
        scheduled_at: `${selectedDate} ${selectedSlot.start_time.substring(0, 5)}`,
        notes: `${reason || symptoms || "Patient booking"} (Payment Ref: ${paymentScreenshotId})`
      };

      await dispatch(createAppointment(payload)).unwrap();
      dispatch(clearBookingDraft());

      toast.success(t('finalizePayment.toastSuccess', { defaultValue: 'Appointment booked successfully!' }));

      navigate('/patient/book/confirm', {
        state: {
          doctorName: i18n.language.startsWith('ar') ? (selectedDoctor?.name_ar || selectedDoctor?.name) : (selectedDoctor?.name_en || selectedDoctor?.name || 'Specialist'),
          date: selectedDate,
          time: `${selectedSlot.start_time} - ${selectedSlot.end_time}`,
          pending: true
        }
      });
    } catch (err) {
      toast.error(err?.message || t('finalizePayment.toastError', { defaultValue: 'Failed to book appointment' }));
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
        <ShieldCheck className="w-3.5 h-3.5" /> {t('finalizePayment.secureBooking', { defaultValue: 'Secure Appointment Booking' })}
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('finalizePayment.title', { defaultValue: 'Confirm Your Appointment' })}</h2>
      <p className="text-slate-600 mb-10 text-[15px] font-medium leading-relaxed">
        {t('finalizePayment.instruction', { defaultValue: 'Please review your booking details below. Once confirmed, your appointment will be scheduled immediately.' })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-20">
        <div className="lg:col-span-3 space-y-8">

          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">{t('patientInfo.contactDetails', { defaultValue: 'Patient Information' })}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('patientInfo.firstName', { defaultValue: 'Name' })}</div>
                <div className="font-bold text-slate-800">{firstName} {lastName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('auth.emailLabel', { defaultValue: 'Email' })}</div>
                <div className="font-bold text-slate-800">{email}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('patientInfo.phoneNumber', { defaultValue: 'Phone' })}</div>
                <div className="font-bold text-slate-800">{phone}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('pickSchedule.bookingType', { defaultValue: 'Type' })}</div>
                <div className="font-bold text-slate-800 capitalize">{bookingType}</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('patientInfo.reasonForVisit', { defaultValue: 'Reason for Visit' })}</div>
              <div className="font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {reason || t('common.none', { defaultValue: 'No specific reason provided' })}
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
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                    <p className="text-xs font-black text-primary-600 uppercase tracking-widest flex items-center justify-center gap-2">
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                      {isUploading ? t('finalizePayment.waitingForUpload', { defaultValue: 'Uploading...' }) : t('finalizePayment.changeImage', { defaultValue: 'Tap to Change Image' })}
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
          </div>

          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start gap-4">
            <div className="bg-primary-600 rounded-xl p-3 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-primary-900 mb-1">{t('finalizePayment.manualApproval', { defaultValue: 'Manual Approval Required' })}</h4>
              <p className="text-sm text-primary-700 leading-relaxed">
                {t('finalizePayment.manualApprovalNotice', { defaultValue: 'Your appointment will be confirmed once the administration verifies your payment screenshot.' })}
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
                <h4 onClick={() => console.log(draft)} className="font-bold text-slate-900 text-sm">{(i18n.language.startsWith('ar') ? selectedDoctor?.name_ar : selectedDoctor?.name_en) || 'Medical Specialist'}</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{selectedDoctor?.specialization || t('finalizePayment.specialistConsultation', { defaultValue: 'Consultation' })}</p>
                <p className="text-[10px] font-bold text-primary-600 mt-1 uppercase tracking-widest">
                  {selectedDate && new Date(selectedDate).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} • {selectedSlot?.start_time}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('finalizePayment.consultationFee', { defaultValue: 'Consultation Fee' })}</div>
              <div className="text-2xl font-extrabold text-slate-900">$250.00</div>
            </div>

            <button
              onClick={handleCompletePayment}
              disabled={loading || isUploading}
              className={`w-full ${loading || isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white text-base font-bold py-3.5 rounded-xl shadow-sm transition-all hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2`}
            >
              {(loading || isUploading) && <Loader2 className="w-5 h-5 animate-spin" />}
              {isUploading ? t('finalizePayment.waitingForUpload', { defaultValue: 'Waiting for upload...' }) : t('finalizePayment.confirmBooking', { defaultValue: 'Confirm & Book Appointment' })}
            </button>

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
              {t('finalizePayment.instantConfirmation', { defaultValue: 'Instant Confirmation' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
