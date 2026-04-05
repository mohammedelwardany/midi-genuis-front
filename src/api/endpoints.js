/**
 * Centralized API endpoint constants.
 * Update BASE_URL to your real backend.
 */

export const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.medigenius.org/v1';

export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────
  auth: {
    login:    '/auth/login',
    logout:   '/auth/logout',
    refresh:  '/auth/refresh',
    register: '/auth/register',
  },

  // ── Patients ──────────────────────────────────────
  patients: {
    list:         '/patients',
    byId:         (id) => `/patients/${id}`,
    records:      (id) => `/patients/${id}/records`,
    appointments: (id) => `/patients/${id}/appointments`,
  },

  // ── Doctors ───────────────────────────────────────
  doctors: {
    list:     '/doctors',
    byId:     (id) => `/doctors/${id}`,
    schedule: (id) => `/doctors/${id}/schedule`,
    patients: (id) => `/doctors/${id}/patients`,
  },

  // ── Appointments ──────────────────────────────────
  appointments: {
    list:   '/appointments',
    byId:   (id) => `/appointments/${id}`,
    create: '/appointments',
    cancel: (id) => `/appointments/${id}/cancel`,
  },

  // ── Admin ─────────────────────────────────────────
  admin: {
    users:      '/admin/users',
    userById:   (id) => `/admin/users/${id}`,
    stats:      '/admin/stats',
    settings:   '/admin/settings',
  },

  // ── Messages ──────────────────────────────────────
  messages: {
    list:   '/messages',
    thread: (id) => `/messages/thread/${id}`,
    send:   '/messages',
  },
};
