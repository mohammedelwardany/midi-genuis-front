import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Calendar, Clock, Loader2, CheckCircle2, XCircle, Circle,
  MapPin, User, Mail, Phone, ShieldCheck, Activity, ArrowLeft,
  Award, Star, Printer, ChevronRight
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
import { getAppointmentStatusColor } from '../../utils/statusColors';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate, formatTime } from '../../utils/dateFormatter';

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

  const getStatusBadge = getAppointmentStatusColor;

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
    ? formatDate(scheduledDate, isRtl, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : t('appointmentDetails.pendingDate', { defaultValue: 'Pending Date' });

  const formattedTime = scheduledDate
    ? formatTime(scheduledDate, isRtl)
    : t('appointmentDetails.pendingTime', { defaultValue: 'Pending Time' });


  return (
    <div id="appointment-details-container" className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">

      {/* Header / Breadcrumbs */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            <span onClick={() => navigate('/admin/appointments')} className="hover:text-slate-900 cursor-pointer">{isRtl ? 'إدارة المواعيد' : 'Appointments'}</span>
            <ChevronRight className="w-4 h-4 mx-1 rtl:rotate-180" />
            <span className="text-slate-950 font-black">#APT-{apptData.id}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isRtl ? 'تفاصيل الحجز' : 'Clinical Appointment File'}</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-950 px-4 py-2 rounded-xl flex items-center font-bold transition-all text-xs shadow-sm print:hidden"
          >
            <Printer className="w-4 h-4 me-2" />
            {isRtl ? 'طباعة إيصال الدفع (A4)' : 'Print PDF Receipt (A4)'}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-slate-700">
              <div className="flex items-center gap-2.5 font-bold text-sm bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100/50">
                <Calendar className="w-4 h-4 text-primary-600" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2.5 font-bold text-sm bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100/50">
                <Clock className="w-4 h-4 text-primary-600" />
                {formattedTime}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{isRtl ? 'الشكوى ال والملاحظات' : 'Clinical Complaint & Notes'}</h3>
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


        </div>

      </div>

      {/* A4 PDF Receipt & Prescription Print Area */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4;
            margin: 0 !important;
          }
          /* Hide non-print layouts completely */
          header, nav, aside, button, .print-hidden, .print\\:hidden {
            display: none !important;
          }
          /* Flatten page background and margins */
          body, html, #root, #root > div, div[class*="min-h-screen"], main, #appointment-details-container {
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
          /* Hide the interactive UI layout of this specific details page */
          #appointment-details-container > *:not(#print-wrapper) {
            display: none !important;
          }
          #print-wrapper {
            display: block !important;
            width: 210mm !important;
            background: white !important;
            color: black !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-page {
            width: 210mm !important;
            height: 297mm !important;
            padding: 20mm 15mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            background: white !important;
            position: relative !important;
          }
          .print-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      ` }} />
      <div id="print-wrapper" className="hidden print:block text-slate-800 font-sans">

        {/* PAGE 1: Receipt */}
        <div id="receipt-print-area" className="print-page" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="border-t-8 border-indigo-600 pt-8 flex flex-col justify-between h-full">
            <div>
              {/* Receipt Header */}
              <div className="flex justify-between items-start mb-10">
                <div className="text-start">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">MediGenius</h1>
                  <p className="text-xs text-slate-500 font-bold mt-1">{isRtl ? 'بوابة الرعاية الطبية المتقدمة' : 'Advanced Clinical Intelligence Plaza'}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    450 Sutter St, Suite 1200<br />
                    San Francisco, CA 94108<br />
                    {isRtl ? 'هاتف' : 'Phone'}: 1-800-MED-URGE
                  </p>
                </div>
                <div className="text-end">
                  <h2 className="text-xl font-black text-indigo-600 uppercase tracking-widest">{isRtl ? 'إيصال دفع طبي' : 'Payment Receipt'}</h2>
                  <div className="text-xs text-slate-500 font-bold mt-2 space-y-1">
                    <div>{isRtl ? 'رقم الإيصال' : 'Receipt No'}: <span className="font-extrabold text-slate-800 font-mono">#REC-{apptData.id}</span></div>
                    <div>{isRtl ? 'رقم الحجز' : 'Appointment No'}: <span className="font-extrabold text-slate-800 font-mono">#APT-{apptData.id}</span></div>
                    <div>{isRtl ? 'تاريخ الإصدار' : 'Issue Date'}: <span className="font-extrabold text-slate-800">{formatDate(scheduledDate || Date.now(), isRtl)}</span></div>
                    <div>{isRtl ? 'طريقة الدفع' : 'Payment Method'}: <span className="font-extrabold text-slate-800">{isRtl ? (apptData.paymentMethod === 'Cash' || apptData.payment_method === 'cash' ? 'نقداً' : 'تحويل يدوي') : (apptData.paymentMethod || apptData.payment_method || 'Cash')}</span></div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 mb-8" />

              {/* Billing Info Grid */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="text-start">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'فاتورة إلى (المريض)' : 'Bill To (Patient)'}</h3>
                  <div className="text-sm font-extrabold text-slate-800">{patientName}</div>
                  <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                    <div>{isRtl ? 'رقم الملف' : 'Patient ID'}: #{patientData?.user_id || patientData?.id || apptData.patient_id}</div>
                    <div>{patientData?.email || apptData.patient?.email || 'N/A'}</div>
                    <div>{patientData?.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-start">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{isRtl ? 'مقدم الخدمة الطبية' : 'Care Provider'}</h3>
                  <div className="text-sm font-extrabold text-slate-800">{docName}</div>
                  <div className="text-xs text-slate-500 space-y-0.5 mt-1">
                    <div>{specialization}</div>
                    <div>{doctorData?.clinic || (isRtl ? 'المركز الطبي الرئيسي' : 'Main Medical Center')}</div>
                  </div>
                </div>
              </div>

              {/* Receipt Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
                <table className="w-full text-start border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3 text-start">{isRtl ? 'الوصف' : 'Description'}</th>
                      <th className="p-3 text-start">{isRtl ? 'العيادة' : 'Facility'}</th>
                      <th className="p-3 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                      <th className="p-3 text-end">{isRtl ? 'المبلغ' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                    <tr>
                      <td className="p-3 text-start">
                        <div className="font-extrabold">{specialization} {isRtl ? 'كشف واستشارة طبية' : 'Consultation'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{isRtl ? 'تاريخ الجلسة' : 'Session Date'}: {formattedDate} @ {formattedTime}</div>
                      </td>
                      <td className="p-3 text-start">{doctorData?.clinic || (isRtl ? 'المركز الطبي الرئيسي' : 'Main Medical Center')}</td>
                      <td className="p-3 text-start">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {isRtl ? 'مؤكد ومدفوع' : 'Paid / Confirmed'}
                        </span>
                      </td>
                      <td className="p-3 text-end font-extrabold">{formatCurrency(doctorData?.consultationFee || doctorData?.consultation_fee || doctorData?.fee || doctorData?.price || 250, isRtl)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-16">
                <div className="w-64 space-y-2 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}:</span>
                    <span className="text-slate-800">{formatCurrency(doctorData?.consultationFee || doctorData?.consultation_fee || doctorData?.fee || doctorData?.price || 250, isRtl)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الضريبة المضافة (0٪)' : 'VAT (0%)'}:</span>
                    <span className="text-slate-800">{formatCurrency(0, isRtl)}</span>
                  </div>
                  <hr className="border-slate-200 my-1" />
                  <div className="flex justify-between text-sm font-black">
                    <span className="text-slate-900">{isRtl ? 'الإجمالي المدفوع' : 'Total Amount Paid'}:</span>
                    <span className="text-indigo-600">{formatCurrency(doctorData?.consultationFee || doctorData?.consultation_fee || doctorData?.fee || doctorData?.price || 250, isRtl)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Stamp / Signature Area */}
              <div className="grid grid-cols-2 gap-10 mt-12 text-center text-xs font-bold text-slate-500">
                <div className="space-y-16">
                  <p>{isRtl ? 'توقيع المستلم (المريض)' : 'Patient Signature'}</p>
                  <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
                </div>
                <div className="space-y-16">
                  <p>{isRtl ? 'ختم وتوقيع المركز الطبي' : 'MediGenius Plaza Official Stamp'}</p>
                  <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-8 border-t border-slate-150">
              {isRtl ? 'نشكركم لاختياركم مجمع MediGenius الطبي. نتمنى لكم دوام الصحة والعافية.' : 'Thank you for choosing MediGenius Medical systems. Wish you a healthy recovery.'}
            </div>
          </div>
        </div>

        {/* PAGE 2: Doctor's Prescription */}
        <div id="prescription-print-page" className="print-page" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="border-t-8 border-indigo-600 pt-8 flex flex-col justify-between h-full">
            <div>
              {/* Prescription Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="text-start">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{docName}</h1>
                  <p className="text-xs text-primary-600 font-bold mt-1">{specialization}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">Lic. No: #MD-2026-009</p>
                </div>
                <div className="text-end">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediGenius</h1>
                  <p className="text-xs text-slate-500 font-bold mt-1">{isRtl ? 'مجمع العيادات الطبية التخصصية' : 'Specialist Medical Center'}</p>
                  <p className="text-[10px] text-slate-400 mt-1">450 Sutter St, Suite 1200, SF</p>
                </div>
              </div>

              <hr className="border-slate-200 mb-6" />

              {/* Patient details banner */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-4 gap-4 text-xs font-bold text-slate-600 mb-8">
                <div className="text-start">
                  <span className="text-slate-400 block mb-0.5 text-[9px] uppercase tracking-wider">{isRtl ? 'المريض' : 'Patient Name'}</span>
                  <span className="text-slate-800 text-sm truncate block">{patientName}</span>
                </div>
                <div className="text-start">
                  <span className="text-slate-400 block mb-0.5 text-[9px] uppercase tracking-wider">{isRtl ? 'العمر' : 'Age'}</span>
                  <span className="text-slate-800 text-sm block">{ageString || '---'}</span>
                </div>
                <div className="text-start">
                  <span className="text-slate-400 block mb-0.5 text-[9px] uppercase tracking-wider">{isRtl ? 'الجنس' : 'Gender'}</span>
                  <span className="text-slate-800 text-sm block">{genderString}</span>
                </div>
                <div className="text-start">
                  <span className="text-slate-400 block mb-0.5 text-[9px] uppercase tracking-wider">{isRtl ? 'التاريخ' : 'Date'}</span>
                  <span className="text-slate-800 text-sm block">{formatDate(scheduledDate || Date.now(), isRtl)}</span>
                </div>
              </div>

              {/* Rx Body */}
              <div className="px-2">
                <div className="text-3xl font-black text-indigo-600 tracking-tighter mb-6 font-serif select-none">Rx</div>

                {/* Prescription lines */}
                <div className="space-y-8 min-h-[300px] mt-6">
                  {apptData.prescription ? (
                    <div className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line pl-6 text-start">
                      {apptData.prescription}
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-dashed border-slate-200 pb-2 flex items-center text-slate-400 text-xs">
                        <span className="font-extrabold w-6 text-start">1.</span>
                        <span className="flex-1 border-b border-transparent"></span>
                      </div>
                      <div className="border-b border-dashed border-slate-200 pb-2 flex items-center text-slate-400 text-xs">
                        <span className="font-extrabold w-6 text-start">2.</span>
                        <span className="flex-1 border-b border-transparent"></span>
                      </div>
                      <div className="border-b border-dashed border-slate-200 pb-2 flex items-center text-slate-400 text-xs">
                        <span className="font-extrabold w-6 text-start">3.</span>
                        <span className="flex-1 border-b border-transparent"></span>
                      </div>
                      <div className="border-b border-dashed border-slate-200 pb-2 flex items-center text-slate-400 text-xs">
                        <span className="font-extrabold w-6 text-start">4.</span>
                        <span className="flex-1 border-b border-transparent"></span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Prescription Footer */}
            <div className="mt-12">
              <div className="grid grid-cols-2 gap-10 text-center text-xs font-bold text-slate-500 mb-8">
                <div className="text-start ps-10">
                  <p className="text-slate-400 uppercase tracking-widest text-[9px] mb-1">{isRtl ? 'تعليمات إضافية' : 'Additional Instructions'}</p>
                  <p className="text-slate-700">{isRtl ? 'المتابعة بعد أسبوع أو عند اللزوم' : 'Follow up in 1 week or as needed.'}</p>
                </div>
                <div className="space-y-16">
                  <p>{isRtl ? 'توقيع الطبيب المعالج' : 'Physician Signature'}</p>
                  <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-6 border-t border-slate-150">
                {isRtl ? 'عنوان عيادات MediGenius الطبية • هاتف: 1-800-MED-URGE' : 'MediGenius Medical Plazas Address • Phone: 1-800-MED-URGE'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
