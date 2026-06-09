import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, Printer, AlertTriangle, Calendar as CalendarIcon, Clock, CheckCircle2, Circle, MapPin, Loader2, XCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchAppointmentById, selectSelectedAppt, selectAppointmentsLoading, selectAppointmentsError } from '../store/slices/appointmentSlice';
import { fetchDoctorById, selectSelectedDoctor, clearSelectedDoctor } from '../store/slices/doctorSlice';
import { useSiteConfig } from '../context/SiteConfigContext';

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

  const appointment = rawAppointment?.appointment ?? rawAppointment?.data ?? rawAppointment;
  const doctorData = doctor?.doctor ?? doctor?.data ?? doctor;

  useEffect(() => {
    if (id) {
      dispatch(clearSelectedDoctor());
      dispatch(fetchAppointmentById(id));
    }
    return () => {
      dispatch(clearSelectedDoctor());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (appointment) {
      const docId = appointment.doctor_id || appointment.doctor?.id || appointment.doctorId;
      if (docId) {
        dispatch(fetchDoctorById(docId));
      }
    }
  }, [appointment, dispatch]);

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

  const getStatusBadge = (status) => {
    switch (String(status).toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'completed':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const doctorName = isRtl
    ? (doctorData?.name_ar || appointment?.doctor?.name_ar || appointment?.doctor_name_ar || doctorData?.name || appointment?.doctor?.name || appointment?.doctor_name || 'طبيب متخصص')
    : (doctorData?.name_en || appointment?.doctor?.name_en || appointment?.doctor_name_en || doctorData?.name || appointment?.doctor?.name || appointment?.doctor_name || 'Medical Specialist');

  const rawSpecialization = isRtl
    ? (doctorData?.specialization_ar || appointment?.doctor?.specialization_ar || appointment?.doctor_specialization_ar)
    : (doctorData?.specialization_en || appointment?.doctor?.specialization_en || appointment?.doctor_specialization_en);

  const specializationFallback = doctorData?.specialization || appointment?.doctor?.specialization || appointment?.doctor_specialization;
  const specKey = String(specializationFallback || '').toLowerCase().replace(' ', '_');
  const specialization = rawSpecialization || t('specializations.' + specKey, { defaultValue: specializationFallback || (isRtl ? 'طبيب استشاري' : 'Clinical Specialist') });

  const scheduledDate = appointment.scheduledAt || appointment.scheduled_at || appointment.date;
  const formattedDate = scheduledDate
    ? new Date(scheduledDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' });

  const formattedTime = scheduledDate
    ? new Date(scheduledDate).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    : t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' });

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
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
            <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest mb-4 inline-block capitalize ${getStatusBadge(appointment.status)}`}>
              {t(`appointmentDetails.status.${String(appointment.status || 'pending').toLowerCase()}`, { defaultValue: appointment.status || 'Pending' })}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              {specialization} {t('appointmentDetails.consultation', { defaultValue: 'Consultation' })}
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
                src={doctorData?.avatar || appointment?.doctor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=eff6ff&color=1d4ed8&size=100`} 
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

          {/* Location */}
          <div className="bg-transparent">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ps-1">{t('appointmentDetails.location', { defaultValue: 'Location' })}</h4>
             <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-32 bg-slate-800 relative w-full overflow-hidden flex items-center justify-center">
                   <MapPin className="w-10 h-10 text-rose-500 absolute z-10 drop-shadow-lg" fill="currentColor" />
                   <div className="absolute w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                </div>
                <div className="p-5 bg-white">
                   <div className="font-bold text-slate-900 mb-1 text-sm">{siteConfig?.clinic?.name || 'MediGenius Medical Plaza'}</div>
                   <div className="text-xs text-slate-600 font-medium">{siteConfig?.clinic?.address || '450 Sutter St, Suite 1200, San Francisco, CA 94108'}</div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
