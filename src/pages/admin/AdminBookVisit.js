import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Star, Clock, ChevronDown, ChevronRight, ChevronLeft, Sun, Moon, Info, ArrowLeft, Loader2, User, UserCircle, Coins, CreditCard, Camera, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
   fetchDoctors,
   selectDoctors,
   selectDoctorsLoading
} from '../../store/slices/doctorSlice';
import {
   fetchDoctorAvailability,
   selectDoctorAvailability,
   selectPatientsLoading,
   fetchPatientById,
   selectSelectedPatient
} from '../../store/slices/patientSlice';
import { createAppointment } from '../../store/slices/appointmentSlice';
import { initiatePayment, uploadReceipt, reviewPayment } from '../../store/slices/paymentSlice';

export default function AdminBookVisit() {
   const { id: patientId } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { t, i18n } = useTranslation();

   const doctors = useSelector(selectDoctors);
   const doctorsLoading = useSelector(selectDoctorsLoading);
   const selectedPatient = useSelector(selectSelectedPatient);
   const availability = useSelector(selectDoctorAvailability);
   const patientsLoading = useSelector(selectPatientsLoading);

   const [step, setStep] = useState(1); // 1: Select Doctor, 2: Pick Schedule, 3: Confirm
   const [selectedDoctor, setSelectedDoctor] = useState(null);
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [selectedSlot, setSelectedSlot] = useState(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [loading, setLoading] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState('cash');
   const [paymentScreenshot, setPaymentScreenshot] = useState(null);
   const [previewUrl, setPreviewUrl] = useState(null);
   const [amount, setAmount] = useState('250');

   useEffect(() => {
      if (patientId) {
         dispatch(fetchPatientById(patientId));
      }
      dispatch(fetchDoctors());
   }, [dispatch, patientId]);

   useEffect(() => {
      if (selectedDoctor) {
         dispatch(fetchDoctorAvailability(selectedDoctor.id || selectedDoctor.user_id));
         const fee = selectedDoctor.consultationFee || selectedDoctor.consultation_fee || selectedDoctor.fee || selectedDoctor.price || selectedDoctor.vizita || 250;
         setAmount(String(fee));
      }
   }, [dispatch, selectedDoctor]);

   const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setPaymentScreenshot(file);
         setPreviewUrl(URL.createObjectURL(file));
      }
   };

   const handleSelectDoctor = (doc) => {
      setSelectedDoctor(doc);
      setStep(2);
   };

   const handleConfirmBooking = async () => {
      if (!selectedDoctor || !selectedSlot || !selectedDate) return;

      if (paymentMethod === 'manual_transfer' && !paymentScreenshot) {
         toast.error(t('adminBookVisit.uploadScreenshotError', { defaultValue: 'Please upload your payment screenshot first' }));
         return;
      }

      setLoading(true);
      try {
         toast.loading('Processing booking...', { id: 'booking' });
         // console.log(selectedPatient.user_id)
         const payload = {
            patient_user_id: parseInt(selectedPatient.user_id, 10),
            doctor_id: selectedDoctor.id || selectedDoctor.user_id,
            availability_id: selectedSlot.id,
            scheduled_at: `${selectedDate} ${selectedSlot.start_time.substring(0, 5)}`,
            status: 'confirmed',
            notes: `Admin booking for patient: ${selectedPatient?.name_en || selectedPatient?.name}`
         };

         const apptResult = await dispatch(createAppointment(payload)).unwrap();
         const appointmentId =
            apptResult?.id ||
            apptResult?.appointment_id ||
            apptResult?.appointmentId ||
            apptResult?.appointment?.id ||
            apptResult?.appointment?.appointment_id ||
            apptResult?.appointment?.appointmentId ||
            apptResult?.data?.id ||
            apptResult?.data?.appointment_id ||
            apptResult?.data?.appointmentId ||
            apptResult?.data?.appointment?.id ||
            apptResult?.data?.appointment?.appointment_id ||
            apptResult?.data?.appointment?.appointmentId;

         if (!appointmentId) {
            throw new Error("Failed to get appointment ID.");
         }

         const paymentPayload = {
            appointment_id: appointmentId,
            amount: parseFloat(amount) || 0.00,
            currency: "EGP",
            paymentMethod: 'manual_transfer', // 'cash' or 'manual_transfer'
            patient_id: parseInt(patientId, 10)
         };

         const paymentResult = await dispatch(initiatePayment(paymentPayload)).unwrap();
         const paymentId =
            paymentResult?.id ||
            paymentResult?.payment_id ||
            paymentResult?.paymentId ||
            paymentResult?.payment?.id ||
            paymentResult?.payment?.payment_id ||
            paymentResult?.payment?.paymentId ||
            paymentResult?.data?.id ||
            paymentResult?.data?.payment_id ||
            paymentResult?.data?.paymentId ||
            paymentResult?.data?.payment?.id ||
            paymentResult?.data?.payment?.payment_id ||
            paymentResult?.data?.payment?.paymentId;

         if (!paymentId) {
            throw new Error("Failed to initiate payment.");
         }

         if (paymentMethod === 'manual_transfer') {
            const fd = new FormData();
            fd.append('receipt', paymentScreenshot);
            await dispatch(uploadReceipt({ id: paymentId, formData: fd })).unwrap();
         }

         await dispatch(reviewPayment({
            paymentId: paymentId,
            reviewStatus: 'approved',
            notes: `Auto-approved by admin booking for patient: ${selectedPatient?.name_en || selectedPatient?.name}`
         })).unwrap();

         toast.success('Appointment and payment confirmed successfully!', { id: 'booking' });
         navigate('/admin/dashboard');
      } catch (err) {
         console.error(err);
         toast.error(err?.message || 'Failed to complete booking process', { id: 'booking' });
      } finally {
         setLoading(false);
      }
   };

   const filteredDoctors = (doctors || []).filter(doc => {
      const name = i18n.language.startsWith('ar') ? (doc.name_ar || doc.name) : (doc.name_en || doc.name);
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
   });

   const availableDates = [...new Set(availability.map(slot => new Date(slot.available_date).toISOString().split('T')[0]))];
   const slotsForSelectedDate = availability.filter(slot => new Date(slot.available_date).toISOString().split('T')[0] === selectedDate);

   const patientName = i18n.language.startsWith('ar') ? (selectedPatient?.name_ar || selectedPatient?.name) : (selectedPatient?.name_en || selectedPatient?.name);

   return (
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">

         {/* Stepper Header */}
         <div className="flex items-center gap-4 mb-10 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                     <UserCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">{t('admin.bookForPatient', { defaultValue: 'Admin Booking' })}</h2>
               </div>
               <p className="text-sm font-medium text-slate-500">{t('adminBookVisit.bookingFor')} <span className="text-slate-800 font-bold">{patientName || t('common.loading', { defaultValue: 'Loading...' })}</span></p>
            </div>

            <div className="flex items-center gap-3">
               {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step === s ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {s}
                     </div>
                     {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>}
                  </div>
               ))}
            </div>
         </div>

         {step === 1 && (
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-2xl font-extrabold text-slate-900">{t('adminBookVisit.step1')}</h3>
                  <div className="relative w-full md:w-80">
                     <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('adminBookVisit.searchPlaceholder')}
                        className="w-full ps-10 pe-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctorsLoading ? (
                     <div className="col-span-full py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary-500 mb-4" />
                        <p className="text-slate-500 font-bold">{t('adminBookVisit.loadingSpecialists')}</p>
                     </div>
                  ) : filteredDoctors.map(doc => (
                     <div key={doc.id} onClick={() => handleSelectDoctor(doc)} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                        <div className="flex gap-4 items-start">
                           <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                              <UserCircle className="w-10 h-10" />
                           </div>
                           <div>
                              <h4 className="font-extrabold text-slate-900 leading-tight mb-1">{i18n.language.startsWith('ar') ? (doc.name_ar || doc.name) : (doc.name_en || doc.name)}</h4>
                              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{t('specializations.' + doc.specialization, { defaultValue: doc.specialization })}</div>
                           </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                           <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-black text-slate-800">{doc.rating_avg || '5.0'}</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors rtl:rotate-180" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors">
                     <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('adminBookVisit.backToDoctors')}
                  </button>
                  <h3 className="text-xl font-extrabold text-slate-900">{t('adminBookVisit.step2')}</h3>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar Mockup logic (simplified for admin) */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                     <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('adminBookVisit.pickDate')}</label>
                     <div className="grid grid-cols-7 gap-2">
                        {[...Array(14)].map((_, i) => {
                           const d = new Date();
                           d.setDate(d.getDate() + i);
                           const dateStr = d.toISOString().split('T')[0];
                           const isAvailable = availableDates.includes(dateStr);
                           const isSelected = selectedDate === dateStr;

                           return (
                              <button
                                 key={i}
                                 onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                                 disabled={!isAvailable}
                                 className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${isSelected ? 'bg-primary-600 text-white shadow-lg' : isAvailable ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                              >
                                 <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString(i18n.language, { weekday: 'short' })}</span>
                                 <span className="text-sm font-black">{d.getDate()}</span>
                              </button>
                           );
                        })}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 text-primary-900">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{t('adminBookVisit.selectedDoctor')}</div>
                        <div className="font-extrabold text-lg">{i18n.language.startsWith('ar') ? (selectedDoctor?.name_ar || selectedDoctor?.name) : (selectedDoctor?.name_en || selectedDoctor?.name)}</div>
                     </div>

                     <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-[300px] overflow-y-auto custom-scrollbar">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('adminBookVisit.availableSlotsFor', { date: selectedDate })}</label>
                        <div className="grid grid-cols-2 gap-3">
                           {slotsForSelectedDate.length > 0 ? slotsForSelectedDate.map(slot => (
                              <button
                                 key={slot.id}
                                 onClick={() => setSelectedSlot(slot)}
                                 className={`p-4 rounded-xl text-center border-2 transition-all ${selectedSlot === slot ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
                              >
                                 {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                              </button>
                           )) : (
                              <div className="col-span-full py-10 text-center text-slate-400 font-medium">{t('adminBookVisit.noSlotsFound')}</div>
                           )}
                        </div>
                     </div>

                     <button
                        disabled={!selectedSlot}
                        onClick={() => setStep(3)}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-50"
                     >
                        {t('adminBookVisit.continueToConfirm')}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {step === 3 && (
            <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
               <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{t('adminBookVisit.finalConfirmation')}</h3>
                  <p className="text-slate-500 font-medium mb-8">{t('adminBookVisit.reviewDetails')}</p>

                  <div className="space-y-4 text-start bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                     <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminBookVisit.patient')}</span>
                        <span className="font-extrabold text-slate-900">{patientName}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminBookVisit.doctor')}</span>
                        <span className="font-extrabold text-slate-900">{i18n.language.startsWith('ar') ? (selectedDoctor?.name_ar || selectedDoctor?.name) : (selectedDoctor?.name_en || selectedDoctor?.name)}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminBookVisit.date')}</span>
                        <span className="font-extrabold text-slate-900">{selectedDate}</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('adminBookVisit.timeSlot')}</span>
                        <span className="font-extrabold text-primary-700">{selectedSlot?.start_time.substring(0, 5)} - {selectedSlot?.end_time.substring(0, 5)}</span>
                     </div>
                  </div>

                  {/* Payment Selection and optional Receipt upload */}
                  <div className="text-start mb-8 space-y-6">
                     <div className="pt-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t('adminBookVisit.amountToPay', { defaultValue: 'Amount to Pay (EGP)' })}</label>
                        <input
                           type="text"
                           readOnly
                           value={amount}
                           className="w-full bg-slate-100/80 border border-slate-200/60 rounded-2xl px-5 py-4 text-slate-500 font-extrabold cursor-not-allowed text-base select-none"
                           placeholder="e.g. 250"
                        />
                     </div>

                     <div className="pt-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t('adminBookVisit.paymentMethod', { defaultValue: 'Payment Method' })}</label>
                        <div className="grid grid-cols-2 gap-4">
                           <button
                              type="button"
                              onClick={() => setPaymentMethod('cash')}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${paymentMethod === 'cash' ? 'border-primary-600 bg-primary-50/50 text-primary-700 font-bold' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
                           >
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                                 <Coins className="w-4 h-4 text-emerald-600" />
                              </div>
                              <span className="font-extrabold text-xs">{t('adminBookVisit.cash', { defaultValue: 'Cash' })}</span>
                              <span className="text-[9px] opacity-60 mt-0.5">{t('adminBookVisit.cashDesc', { defaultValue: 'Paid at clinic front desk' })}</span>
                           </button>

                           <button
                              type="button"
                              onClick={() => setPaymentMethod('manual_transfer')}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all ${paymentMethod === 'manual_transfer' ? 'border-primary-600 bg-primary-50/50 text-primary-700 font-bold' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
                           >
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                                 <CreditCard className="w-4 h-4 text-indigo-600" />
                              </div>
                              <span className="font-extrabold text-xs">{t('adminBookVisit.manualTransfer', { defaultValue: 'Manual Transfer' })}</span>
                              <span className="text-[9px] opacity-60 mt-0.5">{t('adminBookVisit.manualTransferDesc', { defaultValue: 'Upload payment receipt' })}</span>
                           </button>
                        </div>
                     </div>

                     {paymentMethod === 'manual_transfer' && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t('adminBookVisit.uploadReceipt', { defaultValue: 'Upload Transaction Receipt' })}</label>
                           <div className="relative group">
                              <input
                                 type="file"
                                 accept="image/*"
                                 onChange={handleFileChange}
                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className={`border-2 border-dashed rounded-[20px] p-6 flex flex-col items-center justify-center transition-all ${previewUrl ? 'border-primary-600 bg-primary-50/30' : 'border-slate-200 group-hover:border-primary-400 bg-slate-50'}`}>
                                 {previewUrl ? (
                                    <div className="text-center">
                                       <div className="relative inline-block">
                                          <img src={previewUrl} className="max-h-40 rounded-xl shadow-md mb-2 border-2 border-white" alt="Preview" />
                                       </div>
                                       <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center justify-center gap-2">
                                          <Camera className="w-3.5 h-3.5" />
                                          {t('adminBookVisit.tapToChange', { defaultValue: 'Tap to Change Image' })}
                                       </p>
                                    </div>
                                 ) : (
                                    <>
                                       <div className="bg-white rounded-2xl p-4 shadow-sm mb-2 text-slate-300 group-hover:text-primary-600 group-hover:scale-110 transition-all">
                                          <Camera className="w-8 h-8" />
                                       </div>
                                       <p className="text-xs font-bold text-slate-800 mb-1">{t('adminBookVisit.uploadPrompt', { defaultValue: 'Click or drag to upload receipt' })}</p>
                                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t('adminBookVisit.uploadLimit', { defaultValue: 'JPG or PNG (Max 5MB)' })}</p>
                                    </>
                                 )}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setStep(2)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">{t('adminBookVisit.goBack')}</button>
                     <button
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className="flex-1 px-6 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                     >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {t('adminBookVisit.confirmSchedule')}
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
}

function ShieldCheck(props) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
         <path d="m9 12 2 2 4-4" />
      </svg>
   );
}
