// Tiny pub/sub so apiClient.js (a plain module, outside React) can notify the
// app that the current user's clinic just got suspended, without needing a
// direct import of the Redux store or Router context - mirrors how apiClient
// already handles the 401 case imperatively (clearing storage / redirecting).
let listeners = [];

export const onClinicSuspended = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};

export const emitClinicSuspended = () => {
  listeners.forEach((callback) => callback());
};
