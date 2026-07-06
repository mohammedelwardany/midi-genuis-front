import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Wallet, Calendar as CalendarIcon, MoreVertical, Verified, Info, Loader2, X, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchMyPayments, fetchPaymentById, selectAllPayments, selectPaymentsLoading, selectSelectedPayment } from '../store/slices/paymentSlice';
import { BASE_URL } from '../api/endpoints';
import { getPaymentStatusColor } from '../utils/statusColors';
import { formatDate } from '../utils/dateFormatter';

export default function BillingDashboard() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  
  const rawPayments = useSelector(selectAllPayments) || [];
  const loading = useSelector(selectPaymentsLoading);
  const selectedPayment = useSelector(selectSelectedPayment);
  
  const payments = [...rawPayments].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0);
    const dateB = new Date(b.created_at || b.createdAt || 0);
    return dateB - dateA;
  });
  
  const [selectedId, setSelectedId] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    dispatch(fetchMyPayments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) {
      dispatch(fetchPaymentById(selectedId));
    }
  }, [selectedId, dispatch]);

  const handleViewDetails = (id) => {
    setSelectedId(id);
    setShowDrawer(true);
  };

  const getStatusStyle = getPaymentStatusColor;

  const getNormalizedStatus = (p) => {
    const raw = String(p.reviewStatus || p.status || 'pending').toLowerCase();
    if (raw === 'pending_review') return 'pending';
    if (raw === 'completed' || raw === 'success') return 'approved';
    return raw; // 'approved', 'rejected', 'failed', 'pending'
  };

  const getReceiptSrc = (p) => {
    const url = p.receipt_url || p.receiptUrl || p.receipt;
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = BASE_URL.replace('/backend/api', '').replace('/api', '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const getTranslatedPaymentMethod = (method) => {
    const raw = String(method || 'manual').toLowerCase().replace('_', '');
    if (raw === 'manualtransfer' || raw === 'manual') {
      return t('billing.paymentMethod.manualTransfer', { defaultValue: 'Manual Transfer' });
    }
    if (raw === 'cash') {
      return t('billing.paymentMethod.cash', { defaultValue: 'Cash' });
    }
    return String(method).replace('_', ' ');
  };

  // Calculations based on actual payments
  const totalPaid = payments
    .filter(p => getNormalizedStatus(p) === 'approved')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingAmount = payments
    .filter(p => getNormalizedStatus(p) === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('billing.title', { defaultValue: 'Billing & Payments' })}</h2>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
            {t('billing.description', { defaultValue: 'Monitor your healthcare expenses, check verification statuses, and view complete transaction statements.' })}
          </p>
        </div>
        <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors text-sm">
          <Download className="w-4 h-4 me-2" />
          {t('billing.statement', { defaultValue: 'Statement' })}
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Paid */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('billing.totalPaid', { defaultValue: 'Total Approved Paid' })}</span>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              EGP {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm mt-2 text-slate-500">
              {payments.filter(p => getNormalizedStatus(p) === 'approved').length} {t('billing.approvedTrans', { defaultValue: 'verified payments' })}
            </div>
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('billing.pendingVerification', { defaultValue: 'Pending Audit' })}</span>
             <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              EGP {pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm mt-2 text-slate-500">
              {payments.filter(p => getNormalizedStatus(p) === 'pending').length} {t('billing.pendingTrans', { defaultValue: 'awaiting admin review' })}
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider block mb-3">{t('billing.support', { defaultValue: 'Billing Support' })}</span>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            {t('billing.supportDescription', { defaultValue: 'Need details about outstanding clinic charges or manual wire details? Get in touch with our desk.' })}
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Payment History Table */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-end mb-2 pe-2">
             <h3 className="text-xl font-bold text-slate-900">{t('billing.paymentHistory', { defaultValue: 'Payment Transactions' })}</h3>
           </div>

           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 ps-6 text-start">{t('billing.table.invoiceId', { defaultValue: 'Payment ID' })}</th>
                    <th className="p-4 text-start">{t('billing.table.date', { defaultValue: 'Date' })}</th>
                    <th className="p-4 text-start">{t('billing.table.serviceDoctor', { defaultValue: 'Method' })}</th>
                    <th className="p-4 text-start">{t('billing.table.amount', { defaultValue: 'Amount' })}</th>
                    <th className="p-4 text-start">{t('billing.table.status', { defaultValue: 'Status' })}</th>
                    <th className="p-4 text-center">{t('billing.table.action', { defaultValue: 'Action' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {loading && payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
                        <span className="text-slate-500 font-medium">{t('billing.fetchingStatements', { defaultValue: 'Fetching statements...' })}</span>
                      </td>
                    </tr>
                  ) : payments.length > 0 ? (
                    payments.map((payment) => {
                      const pId = payment.payment_id || payment.id;
                      const pDate = payment.created_at || payment.createdAt;
                      const pStatus = getNormalizedStatus(payment);
                      return (
                        <tr key={pId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 ps-6 font-bold text-primary-600 text-start">
                            <span dir="ltr">#PAY-{pId}</span>
                          </td>
                          <td className="p-4 text-slate-500 font-medium text-start">
                            {pDate ? formatDate(pDate, i18n.language.startsWith('ar'), { month: 'short', day: 'numeric', year: 'numeric' }) : t('billing.na', { defaultValue: 'N/A' })}
                          </td>
                          <td className="p-4 font-semibold text-slate-700 capitalize text-start">
                            {getTranslatedPaymentMethod(payment.payment_method || payment.paymentMethod)}
                          </td>
                          <td className="p-4 font-extrabold text-slate-800 text-start">
                            {payment.amount} {payment.currency || 'EGP'}
                          </td>
                          <td className="p-4 text-start">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusStyle(pStatus)}`}>
                              {t(`billing.status.${pStatus}`, { defaultValue: pStatus })}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                               onClick={() => handleViewDetails(pId)}
                              className="bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors border border-slate-100 hover:border-primary-100"
                            >
                              {t('billing.table.details', { defaultValue: 'Details' })}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-20 text-center text-slate-400 font-semibold italic bg-slate-50/20">
                        {t('billing.noPayments', { defaultValue: 'No payment transactions recorded.' })}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>

        {/* Right Col: Standard Payment Info */}
        <div className="space-y-6">
           <div className="flex justify-between items-end mb-2">
             <h3 className="text-xl font-bold text-slate-900">{t('billing.paymentMethods', { defaultValue: 'Verification Policy' })}</h3>
           </div>
           
           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative group overflow-hidden hover:border-slate-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-slate-900 rounded py-1 px-2 text-white font-bold text-[10px] uppercase tracking-widest mt-1">
                  {t('billing.secure', { defaultValue: 'SECURE' })}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{t('billing.manualTransferAudit', { defaultValue: 'Manual Transfer Audit' })}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {t('billing.manualTransferAuditDesc', { defaultValue: 'All manual wallet transfers and bank deposits require transaction receipts. Our financial desk completes audits within 1-2 operational hours.' })}
                  </p>
                </div>
              </div>
           </div>

           {/* Support Policy Block */}
           <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100 relative overflow-hidden">
              <div className="flex gap-3 relative z-10">
                 <div className="text-primary-600 shrink-0">
                    <Info className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{t('billing.supportTitle', { defaultValue: 'Need Invoice Copies?' })}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                       {t('billing.invoiceCopiesDesc', { defaultValue: 'Official stamped corporate statements or insurance reports are readily downloadable. Contact the reception desk at (555) 012-3456.' })}
                    </p>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Premium Side Drawer for Payment Details */}
      {showDrawer && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
            onClick={() => setShowDrawer(false)}
          />

          {/* Sliding Pane */}
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t('billing.drawer.title', { defaultValue: 'Transaction Audit Log' })}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {t('billing.drawer.referenceId', { id: selectedId, defaultValue: 'Reference ID: #PAY-{{id}}' })}
                </p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading || !selectedPayment ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                  <p className="text-slate-500 font-bold text-sm">
                    {t('billing.drawer.loading', { defaultValue: 'Retrieving audit data...' })}
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Status Box */}
                  <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        {t('billing.drawer.verificationStatus', { defaultValue: 'Audit Verification Status' })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${getStatusStyle(getNormalizedStatus(selectedPayment))}`}>
                        {t(`billing.status.${getNormalizedStatus(selectedPayment)}`, { defaultValue: getNormalizedStatus(selectedPayment) })}
                      </span>
                    </div>
                    {/* Visual indicators */}
                    {getNormalizedStatus(selectedPayment) === 'approved' && (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    )}
                    {getNormalizedStatus(selectedPayment) === 'pending' && (
                      <AlertCircle className="w-10 h-10 text-amber-500 animate-pulse" />
                    )}
                    {getNormalizedStatus(selectedPayment) === 'rejected' && (
                      <XCircle className="w-10 h-10 text-rose-500" />
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t('billing.drawer.amountSummary', { defaultValue: 'Amount Summary' })}
                    </h4>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                          {selectedPayment.amount} <span className="text-lg font-bold text-slate-500">{selectedPayment.currency || 'EGP'}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {t('billing.drawer.paymentMethodLabel', { defaultValue: 'Payment Method' })}:{' '}
                          <span className="font-bold text-slate-700 capitalize">
                            {getTranslatedPaymentMethod(selectedPayment.payment_method || selectedPayment.paymentMethod)}
                          </span>
                        </div>
                      </div>
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                  </div>

                  {/* Date & Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                        {t('billing.drawer.paymentDate', { defaultValue: 'Payment Date' })}
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {selectedPayment.created_at || selectedPayment.createdAt ? new Date(selectedPayment.created_at || selectedPayment.createdAt).toLocaleString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : t('billing.na', { defaultValue: 'N/A' })}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                        {t('billing.drawer.appointmentId', { defaultValue: 'Appointment ID' })}
                      </span>
                      <span className="text-sm font-bold text-primary-600">
                        #APT-{selectedPayment.appointment_id || selectedPayment.appointmentId || t('billing.na', { defaultValue: 'N/A' })}
                      </span>
                    </div>
                  </div>

                  {/* Notes Card */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t('billing.drawer.adminNotes', { defaultValue: 'Administrative Notes' })}
                    </h4>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-sm">
                      <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                        {selectedPayment.notes || t('billing.drawer.noNotes', { defaultValue: 'No review notes left by the administrator.' })}
                      </p>
                    </div>
                  </div>

                  {/* Receipt Preview */}
                  {selectedPayment.receipt_url || selectedPayment.receiptUrl || selectedPayment.receipt ? (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t('billing.drawer.submittedScreenshot', { defaultValue: 'Submitted Screenshot' })}
                      </h4>
                      <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 group relative">
                        <img 
                          src={getReceiptSrc(selectedPayment)} 
                          className="w-full h-auto max-h-80 object-contain mx-auto"
                          alt="Payment Receipt"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/600x400?text=Receipt+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                            href={getReceiptSrc(selectedPayment)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> {t('billing.drawer.viewFullscreen', { defaultValue: 'View Fullscreen' })}
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200 text-center">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-widest">
                        {t('billing.drawer.noScreenshot', { defaultValue: 'No Screenshot Uploaded' })}
                      </span>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowDrawer(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition shadow"
              >
                {t('billing.drawer.close', { defaultValue: 'Close View' })}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
