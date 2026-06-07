import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, Clock, Loader2, CheckCircle2, XCircle, Circle, 
  MapPin, User, Mail, Phone, ShieldCheck, Activity, ArrowLeft, 
  Video, Award, Star, Printer, ChevronRight 
} from 'lucide-react';
import { 
  fetchAppointmentById, 
  selectSelectedAppt, 
  selectAppointmentsLoading, 
  selectAppointmentsError,
  setSelectedAppt
} from '../../store/slices/appointmentSlice';
import { 
  fetchDoctorById, 
  selectSelectedDoctor,
  clearSelectedDoctor
} from '../../store/slices/doctorSlice';
import { 
  fetchPatientById, 
  selectSelectedPatient,
  clearSelectedPatient
} from '../../store/slices/patientSlice';

export default function AdminAppointmentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const appointment = useSelector(selectSelectedAppt);
  const loadingAppt = useSelector(selectAppointmentsLoading);
  const errorAppt = useSelector(selectAppointmentsError);
  const doctor = useSelector(selectSelectedDoctor);
  const patient = useSelector(selectSelectedPatient);

  // Safely resolve nested responses
  const doctorData = doctor?.doctor ?? doctor?.data ?? doctor;
  const patientData = patient?.patient ?? patient?.data ?? patient;

  useEffect(() => {
    if (id) {
      // Clear any stale records first
      dispatch(setSelectedAppt(null));
      dispatch(clearSelectedDoctor());
      dispatch(clearSelectedPatient());
      dispatch(fetchAppointmentById(id));
    }
    return () => {
      dispatch(setSelectedAppt(null));
      dispatch(clearSelectedDoctor());
      dispatch(clearSelectedPatient());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (appointment) {
      const apptData = appointment.appointment ?? appointment;
      const docId = apptData.doctor_id || apptData.doctor?.id || apptData.doctorId;
      const patId = apptData.patient_id || apptData.patient?.id || apptData.patient_user_id || apptData.patientUserId;
      if (docId) {
        dispatch(fetchDoctorById(docId));
      }
      if (patId) {
        dispatch(fetchPatientById(patId));
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

  if (loadingAppt && !appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-6xl mx-auto min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">{t('appointmentDetails.loading', { defaultValue: 'Synchronizing appointment details...' })}</p>
      </div>
    );
  }

  if (errorAppt || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-6xl mx-auto text-center px-6">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{t('appointmentDetails.errorTitle', { defaultValue: 'Failed to Load Appointment' })}</h3>
        <p className="text-slate-500 max-w-md mb-6">{errorAppt || t('appointmentDetails.errorDesc', { defaultValue: 'The requested appointment details could not be retrieved.' })}</p>
        <button
          onClick={() => navigate('/admin/appointments')}
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

  const apptData = appointment.appointment ?? appointment;

  // Names and specializations
  const docName = isRtl
    ? (doctorData?.name_ar || apptData.doctor?.name_ar || apptData.doctor_name_ar || doctorData?.name || apptData.doctor?.name || 'طبيب متخصص')
    : (doctorData?.name_en || apptData.doctor?.name_en || apptData.doctor_name_en || doctorData?.name || apptData.doctor?.name || 'Medical Specialist');

  const rawSpecialization = isRtl
    ? (doctorData?.specialization_ar || apptData.doctor?.specialization_ar || apptData.doctor_specialization_ar)
    : (doctorData?.specialization_en || apptData.doctor?.specialization_en || apptData.doctor_specialization_en);

  const specFallback = doctorData?.specialization || apptData.doctor?.specialization || apptData.doctor_specialization;
  const specKey = String(specFallback || '').toLowerCase().replace(' ', '_');
  const specialization = rawSpecialization || t('specializations.' + specKey, { defaultValue: specFallback || (isRtl ? 'طبيب استشاري' : 'Clinical Specialist') });

  const patientName = isRtl
    ? (patientData?.name_ar || apptData.patient?.name_ar || apptData.patient_name_ar || patientData?.name || apptData.patient?.name || 'مريض')
    : (patientData?.name_en || apptData.patient?.name_en || apptData.patient_name_en || patientData?.name || apptData.patient?.name || 'Patient');

  const age = calculateAge(patientData?.date_of_birth || patientData?.dob);
  const ageString = age !== null ? `${age} ${isRtl ? 'سنة' : 'years'}` : '';
  const genderString = patientData?.gender === 'Female'
    ? t('userManagement.genderFemale', { defaultValue: 'Female' })
    : t('userManagement.genderMale', { defaultValue: 'Male' });

  const scheduledDate = apptData.scheduledAt || apptData.scheduled_at || apptData.date;
  const formattedDate = scheduledDate
    ? new Date(scheduledDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' });

  const formattedTime = scheduledDate
    ? new Date(scheduledDate).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    : t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' });

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      
      {/* Header / Breadcrumbs */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            <span onClick={() => navigate('/admin/appointments')} className="hover:text-slate-900 cursor-pointer">{isRtl ? 'إدارة المواعيد' : 'Appointments'}</span>
            <ChevronRight className="w-4 h-4 mx-1 rtl:rotate-180" />
            <span className="text-slate-950 font-black">#APT-{apptData.id}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isRtl ? 'تفاصيل الحجز السريري' : 'Clinical Appointment File'}</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-950 px-4 py-2 rounded-xl flex items-center font-bold transition-all text-xs shadow-sm"
          >
            <Printer className="w-4 h-4 me-2" />
            {isRtl ? 'طباعة الملف الكلي' : 'Print Full Summary'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Appointment Information Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative">
            <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest mb-4 inline-block capitalize ${getStatusBadge(apptData.status)}`}>
              {t(`appointmentDetails.status.${String(apptData.status || 'pending').toLowerCase()}`, { defaultValue: apptData.status || 'Pending' })}
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
              {specialization} {isRtl ? 'جلسة فحص' : 'Consultation'}
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-slate-700">
               <div className="flex items-center gap-2.5 font-bold text-sm bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100/50">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  {formattedDate}
               </div>
               <div className="flex items-center gap-2.5 font-bold text-sm bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100/50">
                  <Clock className="w-4 h-4 text-primary-600" />
                  {formattedTime}
               </div>
               <div className="flex items-center gap-2.5 font-bold text-sm bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100/50">
                  <Video className="w-4 h-4 text-primary-600" />
                  {t(`appointmentDetails.type.${String(apptData.type || apptData.bookingType || 'telehealth').toLowerCase().replace(' ', '_')}`, { defaultValue: apptData.type || apptData.bookingType || 'Telehealth Visit' })}
               </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{isRtl ? 'الشكوى السريرية والملاحظات' : 'Clinical Complaint & Notes'}</h3>
              <p className="text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {apptData.notes || apptData.reason || (isRtl ? 'لم يتم تقديم ملاحظات أو شكاوى تفصيلية للزيارة.' : 'No additional reason or consultation notes provided.')}
              </p>
            </div>
          </div>

          {/* Patient Profile Card (Admin View) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
             <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2.5">
                <User className="w-5 h-5 text-primary-600" />
                {isRtl ? 'معلومات المريض الشخصية' : 'Demographics & Patient Profile'}
             </h3>

             <div className="flex gap-4 items-center mb-6 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-black text-lg">
                   {patientName.charAt(0).toUpperCase()}
                </div>
                <div>
                   <h4 className="font-extrabold text-slate-900 text-base leading-tight">{patientName}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{isRtl ? 'ملف طبي رقم' : 'Medical ID'}: #{patientData?.user_id || patientData?.id || apptData.patient_id}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Mail className="w-4 h-4" /></div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</p>
                      <p className="font-bold text-slate-700">{patientData?.email || apptData.patient?.email || 'N/A'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Phone className="w-4 h-4" /></div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</p>
                      <p className="font-bold text-slate-700">{patientData?.phone || 'N/A'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Activity className="w-4 h-4" /></div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{isRtl ? 'العمر والجنس' : 'Gender & Age'}</p>
                      <p className="font-bold text-slate-700">
                         {genderString}
                         {ageString && ` • ${ageString}`}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><ShieldCheck className="w-4 h-4" /></div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{isRtl ? 'الجهة التأمينية' : 'Health Insurance'}</p>
                      <p className="font-bold text-slate-700">
                         {patientData?.insurance_provider ? `${patientData.insurance_provider} (${patientData.policy_number})` : (isRtl ? 'لا يوجد تغطية تأمينية' : 'Self-Pay (No Insurance)')}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column (Sidebar Information) */}
        <div className="space-y-6">
          
          {/* Care Provider Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
               <Award className="w-4 h-4 text-primary-600" />
               {isRtl ? 'الطبيب المعالج' : 'Physician Details'}
            </h4>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
              <img 
                src={doctorData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=eff6ff&color=1d4ed8&size=100`} 
                alt={docName} 
                className="w-14 h-14 rounded-full border border-slate-100 object-cover" 
              />
              <div>
                <div className="font-bold text-slate-900 text-base leading-tight">{docName}</div>
                <div className="text-primary-600 font-bold text-xs mt-1.5">{specialization}</div>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-600">
               <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-wider">{isRtl ? 'سنوات الخبرة' : 'Experience'}</span>
                  <span className="text-slate-800">{doctorData?.experience_years || doctorData?.experience || '5'}+ {isRtl ? 'سنوات' : 'Years'}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-wider">{isRtl ? 'تقييم المرضى' : 'Patient Rating'}</span>
                  <span className="text-slate-800 flex items-center gap-1">
                     <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                     {doctorData?.rating_avg || '5.0'}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-wider">{isRtl ? 'مقر الممارسة' : 'Clinic / Center'}</span>
                  <span className="text-slate-800">{doctorData?.clinic || (isRtl ? 'المركز الطبي الرئيسي' : 'Main Medical Center')}</span>
               </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{isRtl ? 'حالة الحجز الطبية' : 'Status & Scheduling Steps'}</h4>
             
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
                      {String(apptData.status).toLowerCase() === 'confirmed' || String(apptData.status).toLowerCase() === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-primary-600" />
                      ) : String(apptData.status).toLowerCase() === 'cancelled' ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-amber-500 fill-amber-50 animate-pulse" />
                      )}
                   </div>
                   <div className="font-bold text-slate-900 text-sm">
                      {String(apptData.status).toLowerCase() === 'confirmed' 
                        ? t('appointmentDetails.timeline.confirmedByClinic', { defaultValue: 'Confirmed by Clinic' }) 
                        : String(apptData.status).toLowerCase() === 'cancelled' 
                        ? t('appointmentDetails.timeline.cancelled', { defaultValue: 'Cancelled' }) 
                        : t('appointmentDetails.timeline.awaitingConfirmation', { defaultValue: 'Awaiting Confirmation' })}
                   </div>
                   <div className="text-xs text-slate-400 font-medium mt-0.5">{t('appointmentDetails.timeline.clinicApproval', { defaultValue: 'Clinic administration approval' })}</div>
                </div>

                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      {String(apptData.status).toLowerCase() === 'completed' ? (
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

          {/* Clinic Location */}
          <div>
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ps-1">{isRtl ? 'الموقع والعنوان' : 'Facility Location'}</h4>
             <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-32 bg-slate-800 relative w-full overflow-hidden flex items-center justify-center">
                   <MapPin className="w-10 h-10 text-rose-500 absolute z-10 drop-shadow-lg" fill="currentColor" />
                   <div className="absolute w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                </div>
                <div className="p-5 bg-white">
                   <div className="font-bold text-slate-900 mb-1 text-sm">{isRtl ? 'مجمع MediGenius الطبي' : 'MediGenius Medical Plaza'}</div>
                   <div className="text-xs text-slate-600 font-medium">450 Sutter St, Suite 1200, San Francisco, CA 94108</div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
