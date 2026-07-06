// EGP currency formatting shared across admin dashboard/appointment pages.
export const formatCurrency = (val, isRtl) => {
  const num = parseFloat(val || 0);
  return isRtl
    ? `${num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`
    : `EGP ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
