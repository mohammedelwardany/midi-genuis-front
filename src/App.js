import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from './context/SiteConfigContext';

// Layouts
import PatientLayout from './components/PatientLayout';
import SidebarLayout from './components/SidebarLayout';
import DoctorLayout from './components/DoctorLayout';
import AdminLayout from './components/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import BillingDashboard from './pages/BillingDashboard';
import BookingsDashboard from './pages/BookingsDashboard';
import AppointmentDetails from './pages/AppointmentDetails';
import BookVisit from './pages/BookVisit';
import MedicalRecords from './pages/MedicalRecords';
import ProfileSettings from './pages/ProfileSettings';
import VisitHistory from './pages/VisitHistory';

// Booking Flow Pages
import PickSchedule from './pages/PickSchedule';
import PatientInfo from './pages/PatientInfo';
import FinalizePayment from './pages/FinalizePayment';
import AppointmentConfirmed from './pages/AppointmentConfirmed';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDirectory from './pages/doctor/PatientDirectory';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import ConfigureAvailability from './pages/doctor/ConfigureAvailability';
import DoctorSettings from './pages/doctor/DoctorSettings';
import PatientProfile from './pages/doctor/PatientProfile';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminSettings from './pages/admin/AdminSettings';
import EditDoctor from './pages/admin/EditDoctor';
import PatientAdminProfile from './pages/admin/PatientAdminProfile';
import AdminSetAvailability from './pages/admin/AdminSetAvailability';
import AdminBookVisit from './pages/admin/AdminBookVisit';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminAppointmentDetails from './pages/admin/AdminAppointmentDetails';

// Platform Pages (owner-level, cross-clinic)
import PlatformDashboard from './pages/platform/PlatformDashboard';
import ClinicManagement from './pages/platform/ClinicManagement';
import ClinicDetails from './pages/platform/ClinicDetails';
import PlatformAdmins from './pages/platform/PlatformAdmins';
import AuditLog from './pages/platform/AuditLog';
import SubscriptionPlans from './pages/platform/SubscriptionPlans';
import PlatformSettings from './pages/platform/PlatformSettings';

// Global Route
import EmergencyContact from './pages/EmergencyContact';

import { Toaster } from 'react-hot-toast';
import ImpersonationBanner from './components/ImpersonationBanner';

function App() {
  const { t, i18n } = useTranslation();
  const siteConfig = useSiteConfig();
  const isRtl = i18n.language.startsWith('ar');

  React.useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  const patientTitle = isRtl ? siteConfig.portals.patient.titleAr : siteConfig.portals.patient.title;
  const doctorTitle = isRtl ? siteConfig.portals.doctor.titleAr : siteConfig.portals.doctor.title;
  const adminTitle = isRtl ? siteConfig.portals.admin.titleAr : siteConfig.portals.admin.title;

  const patientPortalTabs = [
    { name: t('nav.dashboard'), href: '/patient/dashboard' },
    { name: t('nav.bookVisit'), href: '/patient/book/doctors' },
    { name: t('nav.bookingsHistory'), href: '/patient/bookings' },
    { name: t('nav.records'), href: '/patient/records' },
    { name: t('nav.billing'), href: '/patient/billing' }
  ];

  const doctorPortalTabs = [
    { name: t('nav.dashboard'), href: '/doctor/dashboard' },
    // { name: t('nav.patients'), href: '/doctor/patients' },
    { name: t('nav.schedule'), href: '/doctor/schedule' },
  ];

  const adminPortalTabs = [
    { name: t('nav.dashboard'), href: '/admin/dashboard' },
    { name: t('nav.userManagement'), href: '/admin/users' },
    { name: t('nav.payments'), href: '/admin/payments' },
    { name: t('nav.appointments'), href: '/admin/appointments' }
  ];

  const platformPortalTabs = [
    { name: isRtl ? 'لوحة التحكم' : 'Dashboard', href: '/platform/dashboard' },
    { name: isRtl ? 'العيادات' : 'Clinics', href: '/platform/clinics' },
    { name: isRtl ? 'خطط الاشتراك' : 'Subscription Plans', href: '/platform/subscription-plans' },
    { name: isRtl ? 'مسؤولو المنصة' : 'Platform Admins', href: '/platform/admins' },
    { name: isRtl ? 'سجل التدقيق' : 'Audit Log', href: '/platform/audit-log' },
  ];

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <ImpersonationBanner />
      <Routes>
        {/* Core Auth & Entry */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Portal Main Layout */}
        <Route element={<PatientLayout title={patientTitle} tabs={patientPortalTabs} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/book/doctors" element={<BookVisit />} />
          <Route path="/patient/bookings" element={<BookingsDashboard />} />
          <Route path="/patient/history" element={<VisitHistory />} />
          <Route path="/patient/billing" element={<BillingDashboard />} />
          <Route path="/patient/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/patient/records" element={<MedicalRecords />} />
          <Route path="/patient/settings" element={<ProfileSettings />} />
        </Route>

        {/* Patient Booking Flow Layout (Sidebar) */}
        <Route element={<SidebarLayout />}>
          <Route path="/patient/book/schedule/:id" element={<PickSchedule />} />
          <Route path="/patient/book/patient" element={<PatientInfo />} />
          <Route path="/patient/book/payment" element={<FinalizePayment />} />
          <Route path="/patient/book/:appointmentId/confirm" element={<AppointmentConfirmed />} />
        </Route>

        {/* Doctor Portal Main Layout */}
        <Route element={<DoctorLayout title={doctorTitle} tabs={doctorPortalTabs} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<PatientDirectory />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/schedule/configure" element={<ConfigureAvailability />} />
          <Route path="/doctor/settings" element={<DoctorSettings />} />
          <Route path="/doctor/patients/:id" element={<PatientProfile />} />
          <Route path="/doctor/profile/:id" element={<DoctorProfilePage />} />
        </Route>

        {/* Admin Portal Main Layout */}
        <Route element={<AdminLayout title={adminTitle} tabs={adminPortalTabs} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/appointments/:id" element={<AdminAppointmentDetails />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />
          <Route path="/admin/doctors/availability/:id" element={<AdminSetAvailability />} />
          <Route path="/admin/book-for-patient/:id" element={<AdminBookVisit />} />
          <Route path="/admin/patients/:id" element={<PatientAdminProfile />} />
        </Route>

        {/* Platform Portal Main Layout (owner-level, cross-clinic) */}
        <Route element={<AdminLayout title={isRtl ? 'وحدة إدارة المنصة' : 'Platform Console'} tabs={platformPortalTabs} mobileBrandLabel="Platform Console" />}>
          <Route path="/platform/dashboard" element={<PlatformDashboard />} />
          <Route path="/platform/clinics" element={<ClinicManagement />} />
          <Route path="/platform/clinics/:id" element={<ClinicDetails />} />
          <Route path="/platform/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/platform/admins" element={<PlatformAdmins />} />
          <Route path="/platform/audit-log" element={<AuditLog />} />
          <Route path="/platform/settings" element={<PlatformSettings />} />
        </Route>

        <Route path="/emergency" element={<EmergencyContact />} />

        {/* Catch all to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
