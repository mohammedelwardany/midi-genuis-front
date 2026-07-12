import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Search, Loader2, Eye, RefreshCw, Clock } from 'lucide-react';
import { fetchAllAppointments, selectAppointments, selectAppointmentsLoading, selectAppointmentsError } from '../../store/slices/appointmentSlice';
import toast from 'react-hot-toast';
import { getAppointmentStatusColor } from '../../utils/statusColors';
import { formatDate, formatTime } from '../../utils/dateFormatter';
import { getApptTypeLabel, isFollowUpAppointment } from '../../utils/appointmentDisplay';


const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (!val || typeof val !== 'object') return [];
  if (Array.isArray(val.data)) return val.data;
  if (Array.isArray(val.appointments)) return val.appointments;
  const firstArray = Object.values(val).find(Array.isArray);
  if (firstArray) return firstArray;
  return [];
};

export default function AdminAppointments() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRtl = i18n.language.startsWith('ar');

  const rawAppointments = useSelector(selectAppointments);
  const appointments = ensureArray(rawAppointments);

  const loading = useSelector(selectAppointmentsLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllAppointments());
    toast.success(isRtl ? 'تم تحديث المواعيد' : 'Appointments reloaded');
  };

  const getStatusBadge = getAppointmentStatusColor;

  // Filter & Search Logic
  const filteredAppointments = (Array.isArray(appointments) && typeof appointments.filter === 'function')
    ? appointments.filter((appt) => {
        const doctorName = isRtl
          ? (appt.doctor?.name_ar || appt.doctor_name_ar || appt.doctor?.name || appt.doctor_name || '')
          : (appt.doctor?.name_en || appt.doctor_name_en || appt.doctor?.name || appt.doctor_name || '');
        
        const patientName = appt.patient?.name || appt.patientName || appt.patient_name || '';
        
        // Match flat fields like gender, phone, email for search matching
        const pGender = appt.patient_gender || appt.patient?.gender || appt.gender || '';
        const pPhone = appt.patient_phone || appt.phone || appt.patient?.phone || '';
        const pEmail = appt.patient?.email || appt.patientEmail || '';
        const patientSub = pEmail || pPhone || pGender || '';

        const reason = appt.reason || appt.notes || '';
        const docSpec = appt.doctor?.specialization || appt.doctor_specialization || '';

        const matchesSearch = 
          String(appt.id).includes(searchTerm) ||
          doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patientSub.toLowerCase().includes(searchTerm.toLowerCase()) ||
          docSpec.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' || 
          String(appt.status).toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  // Metrics
  const totalBooked = Array.isArray(appointments) ? appointments.length : 0;
  const pendingCount = (Array.isArray(appointments) && typeof appointments.filter === 'function') ? appointments.filter(a => String(a.status).toLowerCase() === 'pending').length : 0;
  const confirmedCount = (Array.isArray(appointments) && typeof appointments.filter === 'function') ? appointments.filter(a => String(a.status).toLowerCase() === 'confirmed').length : 0;
  const cancelledCount = (Array.isArray(appointments) && typeof appointments.filter === 'function') ? appointments.filter(a => String(a.status).toLowerCase() === 'cancelled').length : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? 'إدارة المواعيد الطبية' : 'Clinical Appointments'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isRtl 
              ? 'مراقبة وإدارة جميع المواعيد والزيارات والجدول الزمني عبر المنصة بالكامل.' 
              : 'Monitor, filter, and review all patient visits and scheduled sessions across the entire system.'}
          </p>
        </div>
        <div>
          <button 
            onClick={handleRefresh}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition flex items-center justify-center"
            title={isRtl ? 'إعادة تحميل' : 'Refresh Appointments'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Booked */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {isRtl ? 'إجمالي الحجوزات' : 'Total Booked'}
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-950 tracking-tight">
              {totalBooked}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
              {isRtl ? 'جلسات مجدولة' : 'Scheduled Sessions'}
            </p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {isRtl ? 'قيد الانتظار' : 'Pending'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-955 tracking-tight text-amber-650">
              {pendingCount}
            </div>
            <p className="text-[10px] text-amber-600 mt-1.5 font-bold uppercase tracking-wider">
              {isRtl ? 'في انتظار التأكيد' : 'Awaiting Approval'}
            </p>
          </div>
        </div>

        {/* Confirmed / Active */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {isRtl ? 'مؤكدة' : 'Confirmed'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-955 tracking-tight">
              {confirmedCount}
            </div>
            <p className="text-[10px] text-emerald-600 mt-1.5 font-bold uppercase tracking-wider">
              {isRtl ? 'مؤكدة ونشطة' : 'Active Schedules'}
            </p>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {isRtl ? 'ملغاة' : 'Cancelled'}
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-955 tracking-tight">
              {cancelledCount}
            </div>
            <p className="text-[10px] text-rose-500 mt-1.5 font-bold uppercase tracking-wider">
              {isRtl ? 'ملغاة بالنظام' : 'Voided Visits'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isRtl ? 'ابحث باسم المريض، الطبيب، أو رقم الحجز...' : 'Search appointments by ID, patient, doctor, or reason...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 text-sm border-none focus:ring-1 focus:ring-primary-500 outline-none text-slate-700 font-medium transition-shadow"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 shrink-0 self-start overflow-x-auto max-w-full">
            {[
              { id: 'all', label: isRtl ? 'الكل' : 'All Sessions' },
              { id: 'pending', label: isRtl ? 'قيد الانتظار' : 'Pending' },
              { id: 'confirmed', label: isRtl ? 'مؤكدة' : 'Confirmed' },
              { id: 'completed', label: isRtl ? 'مكتملة' : 'Completed' },
              { id: 'cancelled', label: isRtl ? 'ملغاة' : 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="p-4 ps-6 text-start">{isRtl ? 'رقم الموعد' : 'Appt ID'}</th>
                <th className="p-4 text-start">{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</th>
                <th className="p-4 text-start">{isRtl ? 'المريض' : 'Patient Profile'}</th>
                <th className="p-4 text-start">{isRtl ? 'الطبيب المعالج' : 'Care Provider'}</th>
                <th className="p-4 text-start">{isRtl ? 'نوع الحجز' : 'Type'}</th>
                <th className="p-4 text-start">{isRtl ? 'سبب الزيارة' : 'Reason for Visit'}</th>
                <th className="p-4 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="p-4 text-center pe-6">{isRtl ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading && appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-24 text-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-2" />
                    <span className="text-slate-400 font-bold text-sm">
                      {isRtl ? 'جاري الاستعلام عن المواعيد...' : 'Fetching clinical records...'}
                    </span>
                  </td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => {
                  const docName = isRtl
                    ? (appt.doctor?.name_ar || appt.doctor_name_ar || appt.doctor?.name || appt.doctor_name || 'طبيب متخصص')
                    : (appt.doctor?.name_en || appt.doctor_name_en || appt.doctor?.name || appt.doctor_name || 'Medical Specialist');

                  // Handle flat or nested specialization, including abbreviation normalizations
                  const specFallback = appt.doctor?.specialization || appt.doctor_specialization;
                  let specKey = '';
                  if (specFallback) {
                    specKey = String(specFallback).toLowerCase().trim().replace(/[._]/g, '').replace(/\s+/g, '_');
                    if (specKey === 'psych') specKey = 'psychiatry';
                  }

                  const spec = isRtl
                    ? (appt.doctor?.specialization_ar || appt.doctor_specialization_ar || (specKey ? t('specializations.' + specKey, { defaultValue: specFallback }) : 'مستشار طبي'))
                    : (appt.doctor?.specialization_en || appt.doctor_specialization_en || (specKey ? t('specializations.' + specKey, { defaultValue: specFallback }) : 'Clinical Specialist'));

                  const patientName = appt.patient?.name || appt.patientName || appt.patient_name || 'Unnamed Patient';
                  
                  // Extract sub-text under patient name (Email, then Phone, then translated Gender)
                  const pGender = appt.patient_gender || appt.patient?.gender || appt.gender;
                  const pPhone = appt.patient_phone || appt.phone || appt.patient?.phone;
                  const pEmail = appt.patient?.email || appt.patientEmail;

                  let patientSub = 'N/A';
                  if (pEmail) {
                    patientSub = pEmail;
                  } else if (pPhone) {
                    patientSub = pPhone;
                  } else if (pGender) {
                    patientSub = String(pGender).toLowerCase() === 'female'
                      ? t('userManagement.genderFemale', { defaultValue: 'Female' })
                      : t('userManagement.genderMale', { defaultValue: 'Male' });
                  }

                  const scheduledDate = appt.scheduledAt || appt.scheduled_at || appt.date;
                  const formattedDate = scheduledDate
                    ? formatDate(scheduledDate, isRtl, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';
                  const formattedTime = scheduledDate
                    ? formatTime(scheduledDate, isRtl)
                    : 'N/A';

                  return (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 ps-6 font-bold text-primary-600 text-start">
                        <span dir="ltr">#APT-{appt.id}</span>
                      </td>
                      <td className="p-4 text-start">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-start">
                          <Clock className="w-3.5 h-3.5 text-primary-500" />
                          <span>{formattedTime}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 text-start">{formattedDate}</div>
                      </td>
                      <td className="p-4 text-start">
                        <div className="font-bold text-slate-800 text-start">{patientName}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5 text-start">{patientSub}</div>
                      </td>
                      <td className="p-4 text-start">
                        <div className="font-bold text-slate-800 text-start">{docName}</div>
                        <div className="text-[11px] text-primary-600 font-bold mt-0.5 text-start">{spec}</div>
                      </td>
                      <td className="p-4 text-start">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isFollowUpAppointment(appt) ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-primary-50 text-primary-600 border border-primary-100'}`}>
                          {getApptTypeLabel(appt, t)}
                        </span>
                      </td>
                      <td className="p-4 max-w-[200px] truncate text-start">
                        <span className="text-slate-600 font-medium text-start">{appt.reason || appt.notes || '-'}</span>
                      </td>
                      <td className="p-4 text-start">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(appt.status)}`}>
                          {appt.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center pe-6">
                        <button
                          onClick={() => navigate(`/admin/appointments/${appt.id}`)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 mx-auto shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" /> {isRtl ? 'عرض التفاصيل' : 'View Info'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-20 text-center text-slate-400 font-bold italic bg-slate-50/20">
                    {isRtl ? 'لا توجد مواعيد تطابق معايير البحث المحددة.' : 'No appointments match search criteria or selected filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
