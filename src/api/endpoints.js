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
    getNextAppointment: '/patients/getNextAppointment',
    getPatientAppointments: '/patients/getPatientAppointments',
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
    getDoctorAppointments: '/doctors/getDoctorAppointments',
    getMyPatientsByDate: (date) => `/doctors/getMyPatientsByDate/${date}`,
  },

  // ── Appointments ──────────────────────────────────
  appointments: {
    list: '/appointments',
    getAllAppointments: '/appointments/getAllAppointments',
    getAppointmentById: (id) => `/appointments/getAppointmentById/${id}`,
    byId: (id) => `/appointments/${id}`,
    create: '/appointments/book',
    cancel: (id) => `/appointments/${id}/cancel`,
  },

  // ── Admin ─────────────────────────────────────────
  admin: {
    stats: '/admin/stats',
    settings: '/admin/settings',
  },

  // ── Admin Dashboard ────────────────────────────────
  adminDashboard: {
    metrics: '/adminDashboard/metrics',
    doctorRevenues: '/adminDashboard/doctorRevenues',
    monthlyRevenues: '/adminDashboard/monthlyRevenues',
    subscription: '/adminDashboard/subscription',
  },

  // ── Messages ──────────────────────────────────────
  messages: {
    list: '/messages',
    thread: (id) => `/messages/thread/${id}`,
    send: '/messages',
  },

  // ── Payments ──────────────────────────────────────
  payments: {
    initiate: '/payments/initiatePayment',
    uploadReceipt: (id) => `/payments/uploadReceipt/${id}`,
    review: '/payments/reviewPayment',
    getAllPayments: '/payments/getAllPayments',
    getMyPayments: '/payments/getMyPayments',
    getPaymentById: (id) => `/payments/getPaymentById/${id}`,
  },

  // ── Platform (owner-level, cross-clinic) ───────────
  platform: {
    metrics: '/platform/metrics',
    clinics: '/platform/clinics',
    clinicById: (id) => `/platform/clinics/${id}`,
    addClinicAdmin: (id) => `/platform/clinics/${id}/admins`,
    updateSubscription: (id) => `/platform/clinics/${id}/subscription`,
    updateClinicStatus: (id) => `/platform/clinics/${id}/status`,
    updateClinicBranding: (id) => `/platform/clinics/${id}/branding`,
    impersonate: (id) => `/platform/clinics/${id}/impersonate`,
    platformAdmins: '/platform/platform-admins',
    platformAdminStatus: (id) => `/platform/platform-admins/${id}/status`,
    auditLogs: '/platform/audit-logs',
    subscriptionPlans: '/platform/subscription-plans',
    subscriptionPlanById: (id) => `/platform/subscription-plans/${id}`,
    subscriptionPlanStatus: (id) => `/platform/subscription-plans/${id}/status`,
  },

  // ── Clinic (public, pre-auth) ──────────────────────
  clinic: {
    branding: '/clinics/branding',
  },
};
