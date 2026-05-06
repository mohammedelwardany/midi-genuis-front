/**
 * Centralized API endpoint constants.
 * Update BASE_URL to your real backend.
 */

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/backend/api';

export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/patients/register',
  },

  // ── Patients ──────────────────────────────────────
  patients: {
    register: '/patients/register',
    updateMe: '/patients/updateMe',
    deleteMe: '/patients/deleteMe',
    addPatient: '/patients/addPatient',
    list: '/patients/getAllPatients',
    byId: (id) => `/patients/getPatientById/${id}`,
    update: (id) => `/patients/updatePatient/${id}`,
    delete: (id) => `/patients/deletePatient/${id}`,
    uploadReport: '/patients/uploadReport',
    getMyReports: '/patients/getMyReports',
    deleteMyReport: (id) => `/patients/deleteMyReport/${id}`,
    getPatientReports: (id) => `/patients/getPatientReports/${id}`,
    deletePatientReport: (pid, rid) => `/patients/deletePatientReport/${pid}/${rid}`,
    getDoctorAvailability: (id) => `/patients/getDoctorAvailability/${id}`,
  },

  // ── Doctors ───────────────────────────────────────
  doctors: {
    list: '/doctors/getAllDoctors',
    add: '/doctors/addDoctor',
    byId: (id) => `/doctors/getDoctorById/${id}`,
    update: (id) => `/doctors/updateDoctor/${id}`,
    delete: (id) => `/doctors/deleteDoctor/${id}`,
    schedule: (id) => `/doctors/${id}/schedule`,
    patients: (id) => `/doctors/${id}/patients`,
    addAvailability: '/doctors/addAvailability',
    upcomingAvailability: (id) => `/doctors/getUpcomingAvailability/${id}`,
    getTopDoctors: '/doctors/getTopDoctors',
  },

  // ── Appointments ──────────────────────────────────
  appointments: {
    list: '/appointments',
    byId: (id) => `/appointments/${id}`,
    create: '/appointments/book',
    cancel: (id) => `/appointments/${id}/cancel`,
  },

  // ── Admin ─────────────────────────────────────────
  admin: {
    stats: '/admin/stats',
    settings: '/admin/settings',
  },

  // ── Messages ──────────────────────────────────────
  messages: {
    list: '/messages',
    thread: (id) => `/messages/thread/${id}`,
    send: '/messages',
  },
};
