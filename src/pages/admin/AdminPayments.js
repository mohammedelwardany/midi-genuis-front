import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Wallet, AlertCircle, FileText, Search, Loader2, X, Eye, Check, RefreshCw } from 'lucide-react';
import { fetchAllPayments, reviewPayment, selectAllPayments, selectPaymentsLoading } from '../../store/slices/paymentSlice';
import { fetchPatients, selectPatients } from '../../store/slices/patientSlice';
import { fetchAllAppointments, selectAppointments } from '../../store/slices/appointmentSlice';
import { BASE_URL } from '../../api/endpoints';
import toast from 'react-hot-toast';

const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (!val || typeof val !== 'object') return [];
  if (Array.isArray(val.data)) return val.data;
  if (Array.isArray(val.appointments)) return val.appointments;
  if (Array.isArray(val.payments)) return val.payments;
  if (Array.isArray(val.patients)) return val.patients;
  const firstArray = Object.values(val).find(Array.isArray);
  if (firstArray) return firstArray;
  return [];
};

export default function AdminPayments() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');

  const rawPayments = useSelector(selectAllPayments);
  const payments = ensureArray(rawPayments);

  const loading = useSelector(selectPaymentsLoading);

  const rawPatients = useSelector(selectPatients);
  const patients = ensureArray(rawPatients);

  const rawAppointments = useSelector(selectAppointments);
  const appointments = ensureArray(rawAppointments);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apptDateFilter, setApptDateFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPayments());
    dispatch(fetchPatients());
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllPayments());
    dispatch(fetchPatients());
    dispatch(fetchAllAppointments());
    toast.success(t('adminPayments.reloaded', { defaultValue: 'Payments reloaded' }));
  };

  const getNormalizedStatus = (p) => {
    const raw = String(p.reviewStatus || p.status || 'pending').toLowerCase();
    if (raw === 'pending_review') return 'pending';
    if (raw === 'completed' || raw === 'success') return 'approved';
    return raw; // 'approved', 'rejected', 'failed', 'pending'
  };

  const getStatusText = (status) => {
    const norm = String(status).toLowerCase();
    if (norm === 'approved' || norm === 'success' || norm === 'completed') {
      return t('adminPayments.approved', 'Approved');
    }
    if (norm === 'pending' || norm === 'pending_review') {
      return t('adminPayments.pendingAudit', 'Pending Audit');
    }
    if (norm === 'rejected' || norm === 'failed') {
      return t('adminPayments.rejected', 'Rejected');
    }
    return status;
  };

  const getTransferModeLabel = (mode) => {
    const normalized = String(mode).toLowerCase();
    if (normalized === 'manual_transfer' || normalized === 'manual') {
      return t('adminBookVisit.manualTransfer', 'Manual Transfer');
    }
    if (normalized === 'cash') {
      return t('adminBookVisit.cash', 'Cash');
    }
    return t(`adminPayments.modal.transferModes.${normalized}`, normalized.replace('_', ' '));
  };

  const getReceiptSrc = (p) => {
    const url = p.receipt_url || p.receiptUrl || p.receipt;
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = BASE_URL.replace('/backend/api', '').replace('/api', '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleOpenReview = (payment) => {
    setSelectedPayment(payment);
    setReviewStatus(getNormalizedStatus(payment) === 'approved' ? 'approved' : (getNormalizedStatus(payment) === 'rejected' ? 'rejected' : 'approved'));
    setReviewNotes(payment.notes || '');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedPayment) return;
    const paymentId = selectedPayment.payment_id || selectedPayment.paymentId || selectedPayment.id;
    try {
      setIsSubmitting(true);
      const payload = {
        paymentId: paymentId,
        reviewStatus: reviewStatus,
        notes: reviewNotes
      };
      await dispatch(reviewPayment(payload)).unwrap();
      toast.success(t('adminPayments.modal.updateSuccess', { id: paymentId, status: reviewStatus, defaultValue: `Payment #${paymentId} updated to ${reviewStatus}` }));
      setShowReviewModal(false);
      dispatch(fetchAllPayments()); // Refresh list
    } catch (err) {
      toast.error(err?.message || t('adminPayments.modal.updateError', { defaultValue: 'Failed to review payment' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (String(status).toLowerCase()) {
      case 'approved':
      case 'success':
      case 'completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'pending':
      case 'pending_review':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'rejected':
      case 'failed':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  // Filter & Search Logic
  const filteredPayments = payments
    .filter((p) => {
      const pId = p.payment_id || p.id;
      const associatedPatient = (Array.isArray(patients) && typeof patients.find === 'function')
        ? patients.find(pat => String(pat.patient_id || pat.user_id || pat.id) === String(p.patient_id))
        : undefined;
      const patName = p.patient_name || p.patientName || p.patient?.name || (associatedPatient ? (associatedPatient.name_en || associatedPatient.name) : `Patient #${p.patient_id}`);
      const patEmail = p.patientEmail || p.patient?.email || (associatedPatient ? associatedPatient.email : 'N/A');
      const patPolicy = p.policy_number || (associatedPatient ? associatedPatient.policy_number : '');
      const patSubText = patEmail !== 'N/A'
        ? (patPolicy ? `${patEmail} • ${patPolicy}` : patEmail)
        : (patPolicy || 'N/A');

      const matchesSearch =
        String(pId).includes(searchTerm) ||
        patName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patSubText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.amount && String(p.amount).includes(searchTerm));

      const matchesStatus =
        statusFilter === 'all' ||
        getNormalizedStatus(p) === statusFilter.toLowerCase();

      const associatedAppt = (Array.isArray(appointments) && typeof appointments.find === 'function')
        ? appointments.find(appt => appt.id === p.appointment_id)
        : undefined;
      const apptDateStr = associatedAppt?.scheduled_at || associatedAppt?.scheduledAt || associatedAppt?.date;
      const isFuture = apptDateStr ? new Date(apptDateStr) > new Date() : false;

      let matchesApptDate = true;
      if (apptDateFilter === 'next') {
        matchesApptDate = isFuture;
      } else if (apptDateFilter === 'past') {
        matchesApptDate = !isFuture;
      }

      return matchesSearch && matchesStatus && matchesApptDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0);
      const dateB = new Date(b.created_at || b.createdAt || 0);
      return dateB - dateA;
    });

  // Modal resolved fields
  const modalPatient = (selectedPayment && Array.isArray(patients) && typeof patients.find === 'function')
    ? patients.find(pat => String(pat.patient_id || pat.user_id || pat.id) === String(selectedPayment.patient_id))
    : null;
  const modalPatientName = selectedPayment ? (selectedPayment.patient_name || selectedPayment.patientName || selectedPayment.patient?.name || (modalPatient ? (modalPatient.name_en || modalPatient.name) : `Patient #${selectedPayment.patient_id}`)) : 'N/A';
  const modalPatientPolicy = selectedPayment ? (selectedPayment.policy_number || (modalPatient ? modalPatient.policy_number : '')) : '';
  const modalPatientGender = selectedPayment ? (selectedPayment.gender || (modalPatient ? modalPatient.gender : '')) : '';

  // Analytics Metrics
  const totalVolume = payments
    .filter(p => getNormalizedStatus(p) === 'approved')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingAudits = payments.filter(p => getNormalizedStatus(p) === 'pending').length;
  const approvedAudits = payments.filter(p => getNormalizedStatus(p) === 'approved').length;

  return (
    <div 
      className={`space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10 ${isRtl ? 'rtl' : 'ltr'}`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >

      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('adminPayments.title')}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {t('adminPayments.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition flex items-center justify-center"
            title={t('adminPayments.refreshLedger')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Approved Volume */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {t('adminPayments.totalApprovedVolume')}
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-955 tracking-tight">
              EGP {totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">
              {t('adminPayments.verifiedSettlements', { count: approvedAudits })}
            </p>
          </div>
        </div>

        {/* Pending Audits */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {t('adminPayments.pendingVerification')}
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-955 tracking-tight">
              {pendingAudits} <span className="text-sm font-bold text-slate-400">{t('adminPayments.transactions')}</span>
            </div>
            <p className="text-xs text-amber-600 mt-2 font-bold uppercase tracking-wider">
              {t('adminPayments.awaitingAction')}
            </p>
          </div>
        </div>

        {/* Total Ledger Size */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {t('adminPayments.totalStatements')}
            </span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-955 tracking-tight">
              {payments.length} <span className="text-sm font-bold text-slate-400">{t('adminPayments.records')}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">
              {t('adminPayments.ledgerSize')}
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
              placeholder={t('adminPayments.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 text-sm border-none focus:ring-1 focus:ring-primary-500 outline-none text-slate-700 font-medium transition-shadow"
            />
          </div>

          {/* Filtering Tabs Group */}
          <div className="flex flex-wrap gap-3 items-center shrink-0 self-start md:self-auto">
            {/* Status Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
              {[
                { id: 'all', label: t('adminPayments.allLedgers') },
                { id: 'pending', label: t('adminPayments.pendingAudit') },
                { id: 'approved', label: t('adminPayments.approved') },
                { id: 'rejected', label: t('adminPayments.rejected') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Appointment Date Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
              {[
                { id: 'all', label: t('adminPayments.allAppointments') },
                { id: 'next', label: t('adminPayments.nextAppointments') },
                { id: 'past', label: t('adminPayments.pastAppointments') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setApptDateFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${apptDateFilter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="p-4 ps-6 text-start">{t('adminPayments.table.txnId')}</th>
                <th className="p-4 text-start">{t('adminPayments.table.submissionDate')}</th>
                <th className="p-4 text-start">{t('adminPayments.table.patientProfile')}</th>
                <th className="p-4 text-start">{t('adminPayments.table.associatedAppointment')}</th>
                <th className="p-4 text-start">{t('adminPayments.table.amount')}</th>
                <th className="p-4 text-start">{t('adminPayments.table.verificationStatus')}</th>
                <th className="p-4 text-center pe-6">{t('adminPayments.table.reviewAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading && payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-24 text-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-2" />
                    <span className="text-slate-400 font-bold text-sm">
                      {t('adminPayments.queryingRecords')}
                    </span>
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((p) => {
                  const pId = p.payment_id || p.id;
                  const pDate = p.created_at || p.createdAt;
                  const pStatus = getNormalizedStatus(p);

                  // Resolve patient dynamically
                  const associatedPatient = (Array.isArray(patients) && typeof patients.find === 'function')
                    ? patients.find(pat => String(pat.patient_id || pat.user_id || pat.id) === String(p.patient_id))
                    : undefined;
                  const patName = p.patient_name || p.patientName || p.patient?.name || (associatedPatient ? (associatedPatient.name_en || associatedPatient.name) : `Patient #${p.patient_id}`);
                  const patEmail = p.patientEmail || p.patient?.email || (associatedPatient ? associatedPatient.email : 'N/A');
                  const patPolicy = p.policy_number || (associatedPatient ? associatedPatient.policy_number : '');
                  const patSubText = patEmail !== 'N/A'
                    ? (patPolicy ? `${patEmail} • ${patPolicy}` : patEmail)
                    : (patPolicy || 'N/A');

                  // Resolve appointment & doctor details dynamically
                  const associatedAppt = (Array.isArray(appointments) && typeof appointments.find === 'function')
                    ? appointments.find(appt => appt.id === p.appointment_id)
                    : undefined;
                  const docName = p.doctorName || (associatedAppt ? (isRtl ? (associatedAppt.doctor?.name_ar || associatedAppt.doctor?.name) : (associatedAppt.doctor?.name_en || associatedAppt.doctor?.name)) : '');
                  const apptDateStr = associatedAppt?.scheduled_at || associatedAppt?.scheduledAt || associatedAppt?.date;
                  const isFuture = apptDateStr ? new Date(apptDateStr) > new Date() : false;

                  return (
                    <tr key={pId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 ps-6 font-bold text-primary-600 text-start">
                        <span dir="ltr">#PAY-{pId}</span>
                      </td>
                      <td className="p-4 text-slate-500 font-medium text-start">
                        {pDate ? new Date(pDate).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }) : 'N/A'}
                      </td>
                      <td className="p-4 text-start">
                        <div className="font-bold text-slate-800 text-start">{patName}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5 text-start">{patSubText}</div>
                      </td>
                      <td className="p-4 text-start">
                        <div className="text-slate-700 font-semibold text-start flex items-center gap-1.5">
                          <span dir="ltr">#APT-{p.appointment_id || p.appointmentId || 'N/A'}</span>
                          {associatedAppt && (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              isFuture 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {isFuture ? t('adminPayments.next') : t('adminPayments.past')}
                            </span>
                          )}
                        </div>
                        {docName && <span className="text-[10px] text-slate-400 font-bold block mt-0.5 text-start">{docName}</span>}
                      </td>
                      <td className="p-4 font-extrabold text-slate-800 text-start">
                        {p.amount} {p.currency || 'EGP'}
                      </td>
                      <td className="p-4 text-start">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(pStatus)}`}>
                          {getStatusText(pStatus)}
                        </span>
                      </td>
                      <td className="p-4 text-center pe-6">
                        <button
                          onClick={() => handleOpenReview(p)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 mx-auto shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" /> {t('adminPayments.auditTxn')}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-slate-400 font-bold italic bg-slate-50/20">
                    {t('adminPayments.noTransactions')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verification Modal */}
      {showReviewModal && selectedPayment && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[150] transition-opacity animate-in fade-in"
            onClick={() => setShowReviewModal(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none animate-in zoom-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] pointer-events-auto">

              {/* Receipt Visual Audit (Left pane on large screens) */}
              <div className="w-full md:w-1/2 bg-slate-100 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                  {t('adminPayments.modal.receiptProof')}
                </h4>

                {selectedPayment.receipt_url || selectedPayment.receiptUrl || selectedPayment.receipt ? (
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md flex-1 flex items-center justify-center max-h-[60vh]">
                    <img
                      src={getReceiptSrc(selectedPayment)}
                      alt={t('adminPayments.modal.receiptProof')}
                      className="max-w-full max-h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400?text=Receipt+Proof+Image';
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-200 flex-1 flex flex-col items-center justify-center text-center">
                    <FileText className="w-12 h-12 text-slate-300 mb-3" />
                    <span className="text-xs text-slate-400 font-black uppercase tracking-widest">
                      {t('adminPayments.modal.noReceipt')}
                    </span>
                  </div>
                )}

                {(selectedPayment.receipt_url || selectedPayment.receiptUrl || selectedPayment.receipt) && (
                  <a
                    href={getReceiptSrc(selectedPayment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary-600 hover:text-primary-800 text-center mt-4 transition block"
                  >
                    {t('adminPayments.modal.openFullscreen')}
                  </a>
                )}
              </div>

              {/* Review Actions (Right pane) */}
              <div className="w-full md:w-1/2 p-6 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {t('adminPayments.modal.verifyLedger')}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      {t('adminPayments.modal.referenceId', { id: selectedPayment.payment_id || selectedPayment.id })}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition animate-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                  {/* Transaction Metadata */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                        {t('adminPayments.modal.patientName')}
                      </span>
                      <span className="text-sm font-bold text-slate-800 truncate block">{modalPatientName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                        {t('adminPayments.modal.paymentAmount')}
                      </span>
                      <span className="text-sm font-extrabold text-slate-955 block">{selectedPayment.amount} {selectedPayment.currency || 'EGP'}</span>
                    </div>
                    {modalPatientGender && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                          {t('patientInfo.gender', { defaultValue: 'Gender' })}
                        </span>
                        <span className="text-sm font-bold text-slate-700 block">{modalPatientGender}</span>
                      </div>
                    )}
                    {modalPatientPolicy && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                          {t('patientInfo.policyNumber', { defaultValue: 'Policy Number' })}
                        </span>
                        <span className="text-sm font-bold text-slate-700 block">{modalPatientPolicy}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                        {t('adminPayments.modal.transferMode')}
                      </span>
                      <span className="text-sm font-bold text-slate-700 block">
                        {getTransferModeLabel(selectedPayment.payment_method || selectedPayment.paymentMethod || 'manual')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                        {t('adminPayments.modal.paymentDate')}
                      </span>
                      <span className="text-sm font-bold text-slate-700 block">
                        {selectedPayment.created_at || selectedPayment.createdAt ? new Date(selectedPayment.created_at || selectedPayment.createdAt).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Decision Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                      {t('adminPayments.modal.auditDetermination')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setReviewStatus('approved')}
                        className={`py-3.5 px-4 rounded-2xl font-bold text-sm border transition flex items-center justify-center gap-2 ${reviewStatus === 'approved' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        <Check className="w-4 h-4" /> {t('adminPayments.modal.approveLedger')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewStatus('rejected')}
                        className={`py-3.5 px-4 rounded-2xl font-bold text-sm border transition flex items-center justify-center gap-2 ${reviewStatus === 'rejected' ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        <X className="w-4 h-4" /> {t('adminPayments.modal.rejectProof')}
                      </button>
                    </div>
                  </div>

                  {/* Review Notes Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                      {t('adminPayments.modal.auditorComments')}
                    </label>
                    <textarea
                      placeholder={t('adminPayments.modal.placeholderComments')}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-55 border border-slate-250 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-primary-500 outline-none text-slate-700 placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="border-t border-slate-100 pt-4 mt-4 flex gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition"
                  >
                    {t('adminPayments.modal.discardChanges')}
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className={`flex-1 ${reviewStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold py-3.5 rounded-xl text-sm transition shadow flex items-center justify-center gap-2`}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t('adminPayments.modal.confirmDecision')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}
