import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, Printer, AlertTriangle, Calendar as CalendarIcon, Clock, CheckCircle2, Circle, MapPin, Loader2, XCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchAppointmentById, selectSelectedAppt, selectAppointmentsLoading, selectAppointmentsError } from '../store/slices/appointmentSlice';
import { fetchDoctorById, selectSelectedDoctor, clearSelectedDoctor } from '../store/slices/doctorSlice';
import { fetchPaymentByAppointmentId, selectSelectedPayment, setSelectedPayment } from '../store/slices/paymentSlice';
import { selectCurrentUser } from '../store/slices/authSlice';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getAppointmentStatusColor } from '../utils/statusColors';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { getApptTypeLabel, isFollowUpAppointment } from '../utils/appointmentDisplay';
import { formatCurrency } from '../utils/currencyFormatter';
import { getAvatarSrc } from '../utils/avatar';

export default function AppointmentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const siteConfig = useSiteConfig();

  const rawAppointment = useSelector(selectSelectedAppt);
  const loading = useSelector(selectAppointmentsLoading);
  const error = useSelector(selectAppointmentsError);
  const doctor = useSelector(selectSelectedDoctor);
  const rawPayment = useSelector(selectSelectedPayment);
  const currentUser = useSelector(selectCurrentUser);

  const appointment = rawAppointment?.appointment ?? rawAppointment?.data ?? rawAppointment;
  const doctorData = doctor?.doctor ?? doctor?.data ?? doctor;
  // Backend returns the literal string 'Payment not found' (not an object) when there's no match
  const paymentData = rawPayment && typeof rawPayment === 'object' ? (rawPayment.data ?? rawPayment) : null;

  useEffect(() => {
    if (id) {
      dispatch(clearSelectedDoctor());
      dispatch(setSelectedPayment(null));
      dispatch(fetchAppointmentById(id));
    }
    return () => {
      dispatch(clearSelectedDoctor());
      dispatch(setSelectedPayment(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (appointment) {
      const docId = appointment.doctor_id || appointment.doctor?.id || appointment.doctorId;
      if (docId) {
        dispatch(fetchDoctorById(docId));
      }
      // appointments.payment_id is never populated by the backend - look the
      // payment up by appointment id instead, which payments always carries.
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-6xl mx-auto">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">{t('appointmentDetails.loading', { defaultValue: 'Synchronizing appointment details...' })}</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-6xl mx-auto text-center px-6">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{t('appointmentDetails.errorTitle', { defaultValue: 'Failed to Load Appointment' })}</h3>
        <p className="text-slate-500 max-w-md mb-6">{error || t('appointmentDetails.errorDesc', { defaultValue: 'The requested appointment details could not be retrieved. Please check the ID or try again.' })}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('common.goBack', { defaultValue: 'Go Back' })}
        </button>
      </div>
    );
  }

  const getStatusBadge = getAppointmentStatusColor;

  const doctorName = isRtl
    ? (doctorData?.name_ar || appointment?.doctor?.name_ar || appointment?.doctor_name_ar || doctorData?.name || appointment?.doctor?.name || appointment?.doctor_name || 'طبيب متخصص')
    : (doctorData?.name_en || appointment?.doctor?.name_en || appointment?.doctor_name_en || doctorData?.name || appointment?.doctor?.name || appointment?.doctor_name || 'Medical Specialist');

  const rawSpecialization = isRtl
    ? (doctorData?.specialization_ar || appointment?.doctor?.specialization_ar || appointment?.doctor_specialization_ar)
    : (doctorData?.specialization_en || appointment?.doctor?.specialization_en || appointment?.doctor_specialization_en);

  const specializationFallback = doctorData?.specialization || appointment?.doctor?.specialization || appointment?.doctor_specialization;
  const specKey = String(specializationFallback || '').toLowerCase().replace(' ', '_');
  const specialization = rawSpecialization || t('specializations.' + specKey, { defaultValue: specializationFallback || (isRtl ? 'طبيب استشاري' : 'Clinical Specialist') });

  const doctorGender = doctorData?.gender || appointment?.doctor?.gender || appointment?.doctor_gender;

  const scheduledDate = appointment.scheduledAt || appointment.scheduled_at || appointment.date;
  const formattedDate = scheduledDate
    ? formatDate(scheduledDate, isRtl, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' });

  const formattedTime = scheduledDate
    ? formatTime(scheduledDate, isRtl)
    : t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' });

  const patientName = isRtl
    ? (currentUser?.name_ar || currentUser?.name || 'مريض')
    : (currentUser?.name_en || currentUser?.name || 'Patient');

  const patientAge = calculateAge(currentUser?.date_of_birth);
  const patientAgeString = patientAge !== null ? `${patientAge} ${isRtl ? 'سنة' : 'years'}` : '';
  const patientGenderString = currentUser?.gender === 'Female'
    ? t('userManagement.genderFemale', { defaultValue: 'Female' })
    : t('userManagement.genderMale', { defaultValue: 'Male' });

  const bookedOn = appointment.created_at
    ? `${formatDate(appointment.created_at, isRtl, { month: 'short', day: 'numeric', year: 'numeric' })} ${t('appointmentDetails.at', { defaultValue: 'at' })} ${formatTime(appointment.created_at, isRtl)}`
    : null;

  return (
    <div id="patient-appointment-details-container" className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header / Breadcrumbs */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            <span onClick={() => navigate(-1)} className="hover:text-slate-900 cursor-pointer">{t('appointmentDetails.appointments', { defaultValue: 'Appointments' })}</span>
            <ChevronRight className="w-4 h-4 mx-1 rtl:rotate-180" />
            <span className="text-slate-900 font-semibold">#{appointment.id}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg flex items-center font-bold transition-colors text-sm border border-primary-100/50"
          >
            <Printer className="w-4 h-4 me-2" />
            {t('appointmentDetails.printSummary', { defaultValue: 'Print Summary' })}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Appointment Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest inline-block capitalize ${getStatusBadge(appointment.status)}`}>
                {t(`appointmentDetails.status.${String(appointment.status || 'pending').toLowerCase()}`, { defaultValue: appointment.status || 'Pending' })}
              </span>
              <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest inline-block ${isFollowUpAppointment(appointment) ? 'bg-indigo-50 text-indigo-600' : 'bg-primary-50 text-primary-600'}`}>
                {getApptTypeLabel(appointment, t)}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              {specialization} {getApptTypeLabel(appointment, t)}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 pb-8 border-b border-slate-100 text-slate-700">
               <div className="flex items-center gap-2 font-medium">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                  {formattedDate}
               </div>
               <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-5 h-5 text-primary-600" />
                  {formattedTime}
               </div>
            </div>


            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t('appointmentDetails.reasonForVisit', { defaultValue: 'Reason / Patient Notes' })}</h3>
               <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100">
                 {appointment.notes || appointment.reason || t('appointmentDetails.noReason', { defaultValue: 'No additional reason or consultation notes provided.' })}
               </p>
            </div>

            {/* Admin review note - most relevant when the clinic rejected the payment / cancelled the appointment, but shown whenever the admin left one */}
            {paymentData?.notes && (
              <div className={`mt-8 pt-8 border-t ${String(appointment.status).toLowerCase() === 'cancelled' ? 'border-rose-100' : 'border-slate-100'}`}>
                <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${String(appointment.status).toLowerCase() === 'cancelled' ? 'text-rose-600' : 'text-slate-900'}`}>
                  <AlertTriangle className={`w-5 h-5 ${String(appointment.status).toLowerCase() === 'cancelled' ? 'text-rose-500' : 'text-orange-500'}`} />
                  {t('appointmentDetails.adminNoteTitle', { defaultValue: 'Note from Clinic Administration' })}
                </h3>
                <p className={`leading-relaxed font-medium p-5 rounded-2xl border ${String(appointment.status).toLowerCase() === 'cancelled' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                  {paymentData.notes}
                </p>
              </div>
            )}
          </div>

          {/* Pre-Visit Instructions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                {t('appointmentDetails.preVisitInstructions', { defaultValue: 'Pre-Visit Instructions' })}
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-50 rounded-xl p-5 border-s-4 border-s-primary-600">
                  <h4 className="font-bold text-slate-900 mb-1">{t('appointmentDetails.checkInTitle', { defaultValue: 'Clinic Check-in' })}</h4>
                  <p className="text-sm text-slate-600 font-medium">{t('appointmentDetails.checkInDesc', { defaultValue: 'Please connect or check-in at the desk 10 minutes prior to scheduled slot.' })}</p>
               </div>
               <div className="bg-slate-50 rounded-xl p-5 border-s-4 border-s-primary-600">
                  <h4 className="font-bold text-slate-900 mb-1">{t('appointmentDetails.medicationPrepTitle', { defaultValue: 'Medication Prep' })}</h4>
                  <p className="text-sm text-slate-600 font-medium">{t('appointmentDetails.medicationPrepDesc', { defaultValue: 'Have your regular prescription list or pills available during consult.' })}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column (Sidebar Information) */}
        <div className="space-y-6">
          
          {/* Care Provider */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">{t('appointmentDetails.yourCareProvider', { defaultValue: 'Your Care Provider' })}</h4>
            
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={getAvatarSrc(doctorData?.avatar || appointment?.doctor?.avatar, doctorGender)}
                alt={doctorName} 
                className="w-14 h-14 rounded-full border border-slate-100 object-cover" 
              />
              <div>
                <div className="font-bold text-slate-900 text-base leading-tight">{doctorName}</div>
                <div className="text-primary-600 font-bold text-xs mt-1">{specialization}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{doctorData?.clinic || appointment?.doctor?.clinic || t('appointmentDetails.mainMedicalCenter', { defaultValue: 'Main Medical Center' })}</div>
              </div>
            </div>
          </div>

          {/* Appointment Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{t('appointmentDetails.appointmentTimeline', { defaultValue: 'Appointment Status' })}</h4>
             
             <div className="relative border-s-2 border-slate-100 ms-3 space-y-8 pb-4">
                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                   </div>
                   <div className="font-bold text-slate-900 text-sm">{t('appointmentDetails.timeline.requestSubmitted', { defaultValue: 'Request Submitted' })}</div>
                   <div className="text-xs text-slate-400 font-medium mt-0.5">{t('appointmentDetails.timeline.verifiedBySystem', { defaultValue: 'Verified by system' })}</div>
                </div>

                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      {String(appointment.status).toLowerCase() === 'confirmed' || String(appointment.status).toLowerCase() === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-primary-600" />
                      ) : String(appointment.status).toLowerCase() === 'cancelled' ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-amber-500 fill-amber-50 animate-pulse" />
                      )}
                   </div>
                   <div className="font-bold text-slate-900 text-sm">
                     {String(appointment.status).toLowerCase() === 'confirmed' 
                       ? t('appointmentDetails.timeline.confirmedByClinic', { defaultValue: 'Confirmed by Clinic' }) 
                       : String(appointment.status).toLowerCase() === 'cancelled' 
                       ? t('appointmentDetails.timeline.cancelled', { defaultValue: 'Cancelled' }) 
                       : t('appointmentDetails.timeline.awaitingConfirmation', { defaultValue: 'Awaiting Confirmation' })}
                   </div>
                   <div className="text-xs text-slate-400 font-medium mt-0.5">{t('appointmentDetails.timeline.clinicApproval', { defaultValue: 'Clinic administration approval' })}</div>
                </div>

                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      {String(appointment.status).toLowerCase() === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                   </div>
                   <div className="font-bold text-slate-400 text-sm">{t('appointmentDetails.timeline.sessionCompleted', { defaultValue: 'Session Completed' })}</div>
                   <div className="text-xs text-slate-400 font-medium mt-0.5">{t('appointmentDetails.timeline.consultationFinished', { defaultValue: 'Clinical consultation finished' })}</div>
                </div>
             </div>
          </div>


        </div>

      </div>

      {/* Print-only appointment summary (A4) - hides the interactive dashboard chrome and renders a standalone business document */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { size: A4; margin: 0 !important; }
          header, nav, aside, button, .print\\:hidden {
            display: none !important;
          }
          body, html, #root, #root > div, div[class*="min-h-screen"], main, #patient-appointment-details-container {
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
          #patient-appointment-details-container > *:not(#patient-print-wrapper) {
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
              <h2 className="text-xl font-black text-primary-600 uppercase tracking-widest">{t('appointmentDetails.printTitle', { defaultValue: 'Appointment Summary' })}</h2>
              <div className="text-xs text-slate-500 font-bold mt-2 space-y-1">
                <div>{t('appointmentDetails.referenceNo', { defaultValue: 'Reference No' })}: <span className="font-extrabold text-slate-800 font-mono">#APT-{appointment.id}</span></div>
                <div>{t('appointmentDetails.issueDate', { defaultValue: 'Issue Date' })}: <span className="font-extrabold text-slate-800">{formatDate(Date.now(), isRtl, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                {bookedOn && (
                  <div>{t('appointmentDetails.bookedOn', { defaultValue: 'Booked On' })}: <span className="font-extrabold text-slate-800">{bookedOn}</span></div>
                )}
                <div>{t('appointmentDetails.statusLabel', { defaultValue: 'Status' })}: <span className="font-extrabold text-slate-800 capitalize">{t(`appointmentDetails.status.${String(appointment.status || 'pending').toLowerCase()}`, { defaultValue: appointment.status || 'Pending' })}</span></div>
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
                {currentUser?.insurance_provider && (
                  <div>{currentUser.insurance_provider} ({currentUser.policy_number})</div>
                )}
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('appointmentDetails.yourCareProvider', { defaultValue: 'Your Care Provider' })}</h3>
              <div className="text-sm font-extrabold text-slate-800">{doctorName}</div>
              <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                <div>{specialization}</div>
                <div>{doctorData?.clinic || appointment?.doctor?.clinic || t('appointmentDetails.mainMedicalCenter', { defaultValue: 'Main Medical Center' })}</div>
              </div>
            </div>
          </div>

          {/* Visit details table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3 text-start">{t('appointmentDetails.dateTimeLabel', { defaultValue: 'Date & Time' })}</th>
                  <th className="p-3 text-start">{t('pickSchedule.bookingType', { defaultValue: 'Booking Type' })}</th>
                  <th className="p-3 text-start">{t('appointmentDetails.durationLabel', { defaultValue: 'Duration' })}</th>
                  <th className="p-3 text-start">{t('appointmentDetails.reasonForVisit', { defaultValue: 'Reason / Patient Notes' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                <tr>
                  <td className="p-3 align-top">
                    <div className="font-extrabold">{formattedDate}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{formattedTime}</div>
                  </td>
                  <td className="p-3 align-top">
                    {getApptTypeLabel(appointment, t)}
                  </td>
                  <td className="p-3 align-top">
                    {appointment.duration_minutes ? `${appointment.duration_minutes} ${t('appointmentDetails.minutes', { defaultValue: 'min' })}` : 'N/A'}
                  </td>
                  <td className="p-3 align-top">
                    {appointment.notes || appointment.reason || t('appointmentDetails.noReason', { defaultValue: 'No additional reason or consultation notes provided.' })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment section - only rendered when a real payment record exists */}
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
                  {paymentData.notes && (
                    <tr>
                      <td className="p-3" colSpan={3}>
                        <span className="font-bold text-slate-500">{t('appointmentDetails.adminNoteTitle', { defaultValue: 'Note from Clinic Administration' })}:</span> {paymentData.notes}
                      </td>
                    </tr>
                  )}
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
  );
}
