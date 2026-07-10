import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import TopNav from './TopNav';
import { Calendar, UserCircle, CreditCard, CheckCircle, BriefcaseMedical, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { selectBookingDraft } from '../store/slices/appointmentSlice';

export default function SidebarLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language.startsWith('ar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const draft = useSelector(selectBookingDraft);

  // A schedule slot can only be picked once a doctor is chosen, and the
  // later steps all depend on that slot being picked - gate them so the
  // sidebar can never link to a route that isn't valid yet (routes like
  // /patient/book/schedule/:id and /patient/book/:appointmentId/confirm
  // require params the sidebar has no way to fill in on its own).
  const hasDoctor = !!draft.doctorId;
  const hasSchedule = hasDoctor && !!draft.selectedSlot;

  const steps = [
    {
      id: 'schedule',
      name: t('booking.steps.pickSchedule', { defaultValue: 'Pick Schedule' }),
      icon: Calendar,
      path: hasDoctor ? `/patient/book/schedule/${draft.doctorId}` : '/patient/book/doctors',
    },
    {
      id: 'patient',
      name: t('booking.steps.patientInfo', { defaultValue: 'Patient Info' }),
      icon: UserCircle,
      path: '/patient/book/patient',
      disabled: !hasSchedule,
    },
    {
      id: 'payment',
      name: t('booking.steps.payment', { defaultValue: 'Payment' }),
      icon: CreditCard,
      path: '/patient/book/payment',
      disabled: !hasSchedule,
    },
    {
      // No confirmation exists to link to until a booking is actually
      // completed (the URL needs a real :appointmentId) - this step is
      // reached via the app's own post-payment redirect, never via the
      // sidebar itself.
      id: 'confirm',
      name: t('booking.steps.confirm', { defaultValue: 'Confirm' }),
      icon: CheckCircle,
      path: '#',
      disabled: true,
    },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">
      <TopNav
        title={t('app.patientPortalTitle', { defaultValue: 'MediGenius Patient Portal' })}
        tabs={[{name: t('nav.bookVisit'), href: '/patient/book/doctors'}]}
        onMenuClick={toggleMobileMenu}
      />
      <div className="flex flex-1 relative">
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 start-0 w-64 bg-white border-e border-slate-100 flex flex-col py-6 z-[70] transition-transform duration-300 lg:translate-x-0 shadow-2xl lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : (isRtl ? "translate-x-full" : "-translate-x-full")
        )}>
          <div className="px-6 mb-8 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-primary-600 rounded flex items-center justify-center p-2">
                    <BriefcaseMedical className="w-5 h-5 text-white" />
                </div>
                <div>
                    <div className="font-bold text-primary-700 tracking-tight text-sm">{t('booking.sidebar.title', { defaultValue: 'Booking Portal' })}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">{t('booking.sidebar.subtitle', { defaultValue: 'Precision Scheduling' })}</div>
                </div>
             </div>
             <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
             </button>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              {steps.map((step) => {
                const Icon = step.icon;
                // The confirm step's real path always carries a dynamic
                // :appointmentId the sidebar doesn't have, so it can't be
                // matched via NavLink's own `to` comparison - detect it by
                // URL shape instead, independent of whether it's clickable.
                const isCurrentActive = step.id === 'confirm'
                  ? /^\/patient\/book\/[^/]+\/confirm$/.test(location.pathname)
                  : location.pathname === step.path;
                return (
                  <li key={step.id}>
                    <NavLink
                      to={step.disabled ? '#' : step.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={() => cn(
                        "flex items-center gap-3 px-6 py-3 font-medium transition-colors",
                        isCurrentActive
                          ? "bg-slate-50 text-primary-600 border-s-2 border-primary-600"
                          : step.disabled
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-50"
                      )}
                      style={step.disabled ? { pointerEvents: 'none' } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{step.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full h-full relative">
           <div className="max-w-7xl mx-auto">
              <Outlet />
              {/* Footer / Copyright */}
              <div className="mt-20 border-t border-slate-100 pt-8 pb-12">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-xs text-slate-400 text-center lg:text-start">
                  <span>{t('footer.copyright', { defaultValue: '© 2026 ClinicFlow Medical Systems. All rights reserved.' })}</span>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                      <a href="#" className="hover:text-slate-600 transition-colors">{t('footer.privacyPolicy', { defaultValue: 'Privacy Policy' })}</a>
                      <a href="#" className="hover:text-slate-600 transition-colors">{t('footer.termsOfService', { defaultValue: 'Terms of Service' })}</a>
                      <a href="#" className="hover:text-slate-600 transition-colors">{t('footer.supportPortal', { defaultValue: 'Support Portal' })}</a>
                  </div>
                </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
