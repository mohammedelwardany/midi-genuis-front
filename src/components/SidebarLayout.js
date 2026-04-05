import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopNav from './TopNav';
import { Calendar, UserCircle, CreditCard, CheckCircle, BriefcaseMedical } from 'lucide-react';
import { cn } from '../utils/cn';

export default function SidebarLayout() {
  const { t } = useTranslation();
  const steps = [
    { name: t('booking.steps.pickSchedule', { defaultValue: 'Pick Schedule' }), icon: Calendar, path: '/patient/book/schedule' },
    { name: t('booking.steps.patientInfo', { defaultValue: 'Patient Info' }), icon: UserCircle, path: '/patient/book/patient' },
    { name: t('booking.steps.payment', { defaultValue: 'Payment' }), icon: CreditCard, path: '/patient/book/payment' },
    { name: t('booking.steps.confirm', { defaultValue: 'Confirm' }), icon: CheckCircle, path: '/patient/book/confirm' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNav
        title={t('app.patientPortalTitle', { defaultValue: 'MediGenius Patient Portal' })}
        tabs={[{name: t('nav.bookVisit'), href: '/patient/book/doctors'}]}
        showSearch={false}
      />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col py-6">
          <div className="px-6 mb-8 flex items-center gap-3">
             <div className="bg-primary-600 rounded flex items-center justify-center p-2">
                 <BriefcaseMedical className="w-5 h-5 text-white" />
             </div>
             <div>
                 <div className="font-bold text-primary-700 tracking-tight text-sm">{t('booking.sidebar.title', { defaultValue: 'Booking Portal' })}</div>
                 <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">{t('booking.sidebar.subtitle', { defaultValue: 'Precision Scheduling' })}</div>
             </div>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.name}>
                    <NavLink
                      to={step.disabled ? '#' : step.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-6 py-3 font-medium transition-colors",
                         isActive && !step.disabled
                           ? "bg-slate-50 text-primary-600 border-s-2 border-primary-600"
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
        <main className="flex-1 p-8 overflow-y-auto w-full h-full relative">
           <Outlet />
           {/* Footer / Copyright */}
           <div className="absolute bottom-8 start-8 end-8 flex justify-between items-center text-xs text-slate-400 mt-12 bg-slate-50 pt-4 pb-2 mt-auto">
             <span>{t('footer.copyright', { defaultValue: '© 2023 ClinicFlow Medical Systems. All rights reserved.' })}</span>
             <div className="flex gap-4">
                 <a href="#" className="hover:text-slate-600 transition-colors">{t('footer.privacyPolicy', { defaultValue: 'Privacy Policy' })}</a>
                 <a href="#" className="hover:text-slate-600 transition-colors">{t('footer.termsOfService', { defaultValue: 'Terms of Service' })}</a>
                 <a href="#" className="hover:text-slate-600 transition-colors">{t('footer.supportPortal', { defaultValue: 'Support Portal' })}</a>
             </div>
           </div>
        </main>
      </div>
    </div>
  );
}
