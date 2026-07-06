// Locale-aware date/time formatting shared across pages that render
// appointment/payment timestamps in the user's chosen language.
export const formatDate = (value, isRtl, options) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', options);
};

export const formatTime = (value, isRtl, options = { hour: '2-digit', minute: '2-digit' }) => {
  if (!value) return null;
  return new Date(value).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', options);
};
