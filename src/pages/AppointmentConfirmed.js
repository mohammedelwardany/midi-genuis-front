import React, { useEffect } from 'react';
import { Check, CalendarPlus, Printer, UserCircle2, Calendar, Info, Plus, Clock, Home } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentById, selectSelectedAppt } from '../store/slices/appointmentSlice';
import { fetchDoctorById, selectSelectedDoctor, clearSelectedDoctor } from '../store/slices/doctorSlice';
import { fetchPaymentByAppointmentId, selectSelectedPayment, setSelectedPayment } from '../store/slices/paymentSlice';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useSiteConfig } from '../context/SiteConfigContext';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { formatCurrency } from '../utils/currencyFormatter';

export default function AppointmentConfirmed() {
   const navigate = useNavigate();
   const location = useLocation();
   const { appointmentId: urlAppointmentId } = useParams();
   const { t, i18n } = useTranslation();
   const dispatch = useDispatch();
   const isRtl = i18n.language.startsWith('ar');
   const siteConfig = useSiteConfig();

   const { doctorName, date, time, pending, appointmentId: stateAppointmentId } = location.state || {};
   const appointmentId = urlAppointmentId || stateAppointmentId;

   const rawAppointment = useSelector(selectSelectedAppt);
   const doctor = useSelector(selectSelectedDoctor);
   const rawPayment = useSelector(selectSelectedPayment);
   const currentUser = useSelector(selectCurrentUser);

   const appointment = rawAppointment?.appointment ?? rawAppointment?.data ?? rawAppointment;
   const doctorData = doctor?.doctor ?? doctor?.data ?? doctor;
   // Backend returns the literal string 'Payment not found' (not an object) when there's no match
   const paymentData = rawPayment && typeof rawPayment === 'object' ? (rawPayment.data ?? rawPayment) : null;

   // The live "success" screen renders instantly off location.state (no loading
   // flash right after booking). The print receipt below needs real patient/
   // payment data though, so it's fetched the same way AppointmentDetails.js
   // does it - this is what makes the printout "realistic" rather than a
   // screenshot of the celebratory UI.
   useEffect(() => {
      if (appointmentId) {
         dispatch(clearSelectedDoctor());
         dispatch(setSelectedPayment(null));
         dispatch(fetchAppointmentById(appointmentId));
      }
      return () => {
         dispatch(clearSelectedDoctor());
         dispatch(setSelectedPayment(null));
      };
   }, [appointmentId, dispatch]);

   useEffect(() => {
      if (appointment) {
         const docId = appointment.doctor_id || appointment.doctor?.id || appointment.doctorId;
         if (docId) {
            dispatch(fetchDoctorById(docId));
         }
         // appointments.payment_id is never populated by the backend - look
         // the payment up by appointment id instead, which payments always carries.
         if (appointment.id) {
            dispatch(fetchPaymentByAppointmentId(appointment.id));
         }
      }
   }, [appointment, dispatch]);

   const calculateAge = (dobString) => {
      if (!dobString) return null;
      const birthDate = new Date(dobString);
      if (isNaN(birthDate.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
         age--;
      }
      return age;
   };

   const printDoctorName = isRtl
      ? (doctorData?.name_ar || appointment?.doctor?.name_ar || doctorData?.name || doctorName || 'طبيب متخصص')
      : (doctorData?.name_en || appointment?.doctor?.name_en || doctorData?.name || doctorName || 'Medical Specialist');

   const rawSpecialization = isRtl
      ? (doctorData?.specialization_ar || appointment?.doctor?.specialization_ar)
      : (doctorData?.specialization_en || appointment?.doctor?.specialization_en);
   const specializationFallback = doctorData?.specialization || appointment?.doctor?.specialization;
   const specKey = String(specializationFallback || '').toLowerCase().replace(' ', '_');
   const printSpecialization = rawSpecialization || t('specializations.' + specKey, { defaultValue: specializationFallback || (isRtl ? 'طبيب استشاري' : 'Clinical Specialist') });

   const scheduledDate = appointment?.scheduledAt || appointment?.scheduled_at || appointment?.date;
   const printFormattedDate = scheduledDate
      ? formatDate(scheduledDate, isRtl, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : (date ? new Date(date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' }));
   const printFormattedTime = scheduledDate ? formatTime(scheduledDate, isRtl) : (time || t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' }));

   const patientName = isRtl
      ? (currentUser?.name_ar || currentUser?.name || 'مريض')
      : (currentUser?.name_en || currentUser?.name || 'Patient');
   const patientAge = calculateAge(currentUser?.date_of_birth);
   const patientAgeString = patientAge !== null ? `${patientAge} ${isRtl ? 'سنة' : 'years'}` : '';
   const patientGenderString = currentUser?.gender === 'Female'
      ? t('userManagement.genderFemale', { defaultValue: 'Female' })
      : t('userManagement.genderMale', { defaultValue: 'Male' });

   const printStatus = pending ? 'pending' : (appointment?.status || 'confirmed');

   const handlePrint = () => {
      window.print();
   };

   const handleAddToCalendar = () => {
      if (!date || !time) return;

      const [start] = time.split(' - ');
      const eventDate = date.replace(/-/g, '');
      const startTime = start.replace(/:/g, '') + '00';

      // Simple ICS generation
      const icsContent = [
         'BEGIN:VCALENDAR',
         'VERSION:2.0',
         'BEGIN:VEVENT',
         `DTSTART:${eventDate}T${startTime}`,
         `SUMMARY:Medical Appointment with ${doctorName}`,
         'DESCRIPTION:Appointment confirmed via MediGenius Portal',
         'END:VEVENT',
         'END:VCALENDAR'
      ].join('\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `appointment-${date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   return (
      <div id="patient-confirmed-container" className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto pt-10 text-center relative">
         <div className="absolute inset-0 top-1/3 bg-primary-50 rounded-full blur-[100px] opacity-20 -z-10 w-3/4 mx-auto aspect-square" />

         {/* Success Icon */}
         <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary-600/20 mb-8 border border-primary-500">
            {pending ? <Clock className="w-8 h-8 text-white stroke-[3px]" /> : <Check className="w-8 h-8 text-white stroke-[3px]" />}
         </div>

         <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {pending ? t('finalizePayment.manualApproval', { defaultValue: 'Submission Received!' }) : t('appointmentConfirmed.title', { defaultValue: 'Appointment Confirmed!' })}
         </h1>
         <p className="text-slate-600 max-w-lg mx-auto text-base leading-relaxed mb-12 font-medium">
            {pending
               ? t('finalizePayment.manualApprovalNotice', { defaultValue: 'Your booking will be reviewed by our administration. You will receive a confirmation once the payment is verified.' })
               : t('appointmentConfirmed.description', { defaultValue: 'Your visit has been successfully scheduled. A confirmation email has been sent to the patient.' })
            }
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">

            {/* Left Column (Details) */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden h-full flex flex-col">
               <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
                  <div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1">{t('appointmentConfirmed.referenceId', { defaultValue: 'Reference ID' })}</div>
                     <div className="text-2xl font-extrabold font-mono tracking-tighter text-slate-900">#CF-{appointmentId || ''}</div>
                  </div>
                  <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
                     {pending ? t('bookings.pending', { defaultValue: 'Pending' }) : t('appointmentConfirmed.scheduled', { defaultValue: 'Scheduled' })}
                  </span>
               </div>

               <div className="space-y-6 flex-1">
                  <div className="flex gap-4">
                     <div className="text-primary-500 mt-0.5"><UserCircle2 className="w-5 h-5" /></div>
                     <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.doctor', { defaultValue: 'Doctor' })}</div>
                        <div className="font-bold text-slate-900 text-[15px]">{doctorName || 'Medical Specialist'}</div>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="text-primary-500 mt-0.5"><Calendar className="w-5 h-5" /></div>
                     <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.dateTime', { defaultValue: 'Date & Time' })}</div>
                        <div className="font-bold text-slate-900 text-[15px]">
                           {date ? new Date(date).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                        </div>
                        <div className="text-sm font-medium text-slate-500">{time || '---'}</div>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 mt-10">
                  <button
                     onClick={handleAddToCalendar}
                     className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow flex justify-center items-center text-sm border-b-2 border-primary-700"
                  >
                     <CalendarPlus className="w-4 h-4 me-2" /> {t('appointmentConfirmed.addToCalendar', { defaultValue: 'Add to Calendar' })}
                  </button>
                  <button
                     onClick={handlePrint}
                     className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center text-sm border border-primary-100/50"
                  >
                     <Printer className="w-4 h-4 me-2" /> {t('appointmentConfirmed.printReceipt', { defaultValue: 'Print Receipt' })}
                  </button>
               </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 h-full flex flex-col">

               {/* Clinical Guidance */}
               <div className="bg-white rounded-3xl p-8 border border-slate-100/80 shadow-[0_2px_15px_rgb(0,0,0,0.02)] flex-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">{t('appointmentConfirmed.clinicalGuidance', { defaultValue: 'Clinical Guidance' })}</h4>

                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="text-primary-500 shrink-0 mt-0.5"><Info className="w-4 h-4" /></div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                           {t('appointmentConfirmed.guidance1', { defaultValue: 'Please arrive 15 minutes early for vital checks and check-in documentation.' })}
                        </p>
                     </div>
                     <div className="flex gap-4">
                        <div className="text-primary-500 shrink-0 mt-0.5"><Info className="w-4 h-4" /></div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                           {t('appointmentConfirmed.guidance2', { defaultValue: 'Bring all current medications or a digital list for the doctor to review.' })}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Actions below */}
               <div className="pt-4 text-center space-y-3">
                  <button
                     onClick={() => navigate('/patient/dashboard')}
                     className="w-full bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-[15px] py-4 rounded-xl transition-all shadow-sm hover:shadow-md flex justify-center items-center border-b-2 border-primary-700"
                  >
                     <Home className="w-5 h-5 me-2" /> {t('appointmentConfirmed.returnToDashboard', { defaultValue: 'Return to Dashboard' })}
                  </button>
                  <button
                     onClick={() => navigate('/patient/book/doctors')}
                     className="w-full bg-white hover:bg-slate-50 border-2 border-slate-100 text-primary-600 font-extrabold text-[15px] py-4 rounded-xl transition-all shadow-sm hover:shadow-md flex justify-center items-center"
                  >
                     <Plus className="w-5 h-5 me-2" /> {t('appointmentConfirmed.scheduleAnother', { defaultValue: 'Schedule Another Appointment' })}
                  </button>
               </div>

            </div>

         </div>

         {/* Print-only receipt (A4) - hides the celebratory dashboard chrome and renders a standalone business document, matching the pattern established in AppointmentDetails.js */}
         <style dangerouslySetInnerHTML={{
            __html: `
            @media print {
               @page { size: A4; margin: 0 !important; }
               header, nav, aside, button {
                  display: none !important;
               }
               body, html, #root, #root > div, div[class*="min-h-screen"], main, #patient-confirmed-container {
                  background: white !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  display: block !important;
                  position: relative !important;
                  overflow: visible !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-width: none !important;
               }
               #patient-confirmed-container > *:not(#patient-print-wrapper) {
                  display: none !important;
               }
               #patient-print-wrapper {
                  display: block !important;
                  width: 210mm !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                  margin: 0 !important;
                  padding: 20mm 15mm !important;
               }
            }
         ` }} />
         <div id="patient-print-wrapper" className="hidden print:block text-slate-800 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="border-t-8 border-primary-600 pt-8">
               {/* Letterhead */}
               <div className="flex justify-between items-start mb-10">
                  <div className="text-start">
                     <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{siteConfig.clinic.name}</h1>
                     <p className="text-xs text-slate-500 font-bold mt-1">{siteConfig.clinic.tagline}</p>
                     <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                        {siteConfig.clinic.address}<br />
                        {t('appointmentDetails.phoneLabel', { defaultValue: 'Phone' })}: {siteConfig.clinic.phone}
                     </p>
                  </div>
                  <div className="text-end">
                     <h2 className="text-xl font-black text-primary-600 uppercase tracking-widest">{t('appointmentConfirmed.printTitle', { defaultValue: 'Booking Receipt' })}</h2>
                     <div className="text-xs text-slate-500 font-bold mt-2 space-y-1">
                        <div>{t('appointmentDetails.referenceNo', { defaultValue: 'Reference No' })}: <span className="font-extrabold text-slate-800 font-mono">#APT-{appointmentId}</span></div>
                        <div>{t('appointmentDetails.issueDate', { defaultValue: 'Issue Date' })}: <span className="font-extrabold text-slate-800">{formatDate(Date.now(), isRtl, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                        <div>{t('appointmentDetails.statusLabel', { defaultValue: 'Status' })}: <span className="font-extrabold text-slate-800 capitalize">{t(`appointmentDetails.status.${String(printStatus).toLowerCase()}`, { defaultValue: printStatus })}</span></div>
                     </div>
                  </div>
               </div>

               <hr className="border-slate-200 mb-8" />

               {/* Patient / Provider grid */}
               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="text-start">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('appointmentDetails.patientLabel', { defaultValue: 'Patient' })}</h3>
                     <div className="text-sm font-extrabold text-slate-800">{patientName}</div>
                     <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                        <div>{currentUser?.email || 'N/A'}</div>
                        <div>{currentUser?.phone || 'N/A'}</div>
                        {(patientAgeString || currentUser?.gender) && (
                           <div>{patientGenderString}{patientAgeString && ` • ${patientAgeString}`}</div>
                        )}
                     </div>
                  </div>
                  <div className="text-start">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('appointmentDetails.yourCareProvider', { defaultValue: 'Your Care Provider' })}</h3>
                     <div className="text-sm font-extrabold text-slate-800">{printDoctorName}</div>
                     <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                        <div>{printSpecialization}</div>
                        <div>{t('appointmentDetails.mainMedicalCenter', { defaultValue: 'Main Medical Center' })}</div>
                     </div>
                  </div>
               </div>

               {/* Visit details table */}
               <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
                  <table className="w-full text-start border-collapse text-xs">
                     <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                           <th className="p-3 text-start">{t('appointmentDetails.dateTimeLabel', { defaultValue: 'Date & Time' })}</th>
                           <th className="p-3 text-start">{t('appointmentDetails.reasonForVisit', { defaultValue: 'Reason / Patient Notes' })}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                        <tr>
                           <td className="p-3 align-top">
                              <div className="font-extrabold">{printFormattedDate}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{printFormattedTime}</div>
                           </td>
                           <td className="p-3 align-top">
                              {appointment?.notes || appointment?.reason || t('appointmentDetails.noReason', { defaultValue: 'No additional reason or consultation notes provided.' })}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               {/* Payment section - only rendered once the real payment record has loaded */}
               {paymentData && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
                     <table className="w-full text-start border-collapse text-xs">
                        <thead>
                           <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                              <th className="p-3 text-start">{t('appointmentDetails.paymentMethodLabel', { defaultValue: 'Payment Method' })}</th>
                              <th className="p-3 text-start">{t('appointmentDetails.paymentStatusLabel', { defaultValue: 'Payment Status' })}</th>
                              <th className="p-3 text-end">{t('appointmentDetails.amountLabel', { defaultValue: 'Amount' })}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                           <tr>
                              <td className="p-3 capitalize">{paymentData.payment_method || 'N/A'}</td>
                              <td className="p-3 capitalize">{paymentData.status || 'N/A'}</td>
                              <td className="p-3 text-end font-extrabold">{formatCurrency(paymentData.amount, isRtl)}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               )}

               <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-8 border-t border-slate-150">
                  {t('appointmentDetails.printFooter', { defaultValue: 'Thank you for choosing {{clinicName}}. Wish you a healthy recovery.', clinicName: siteConfig.clinic.name })}
               </div>
            </div>
         </div>
      </div>
   )
}
