// Tailwind badge classes for appointment status (confirmed/pending/completed/cancelled).
export const getAppointmentStatusColor = (status) => {
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

// Tailwind badge classes for payment status (approved/pending/rejected variants).
export const getPaymentStatusColor = (status) => {
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
