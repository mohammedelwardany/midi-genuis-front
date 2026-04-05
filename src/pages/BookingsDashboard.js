import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, MapPin, History, FileText, Download, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export default function BookingsDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('bookings.title', { defaultValue: 'My Bookings' })}</h2>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
            {t('bookings.description', { defaultValue: 'Manage your clinical sessions, view history, and keep track of your healthcare journey.' })}
          </p>
        </div>
        <button 
          onClick={() => navigate('/patient/book/doctors')} 
          className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-6 py-2.5 rounded-lg flex items-center font-bold transition-colors text-sm border border-primary-100/50"
        >
          {t('nav.bookVisit')}
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary-600" />
            {t('bookings.upcomingAppointments', { defaultValue: 'Upcoming Appointments' })}
          </h3>
          <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-tight uppercase">
            {t('bookings.activeCount', { defaultValue: '2 Active' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 start-0 w-1.5 h-full bg-primary-600 rounded-s-full"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <img src="https://ui-avatars.com/api/?name=Sarah+Miller&background=dbeafe&color=1d4ed8&size=100" alt="Dr" className="w-14 h-14 rounded-full border-2 border-slate-50 shadow-sm" />
                <div>
                  <div className="font-bold text-lg text-slate-800 tracking-tight">Dr. Sarah Miller</div>
                  <div className="text-sm font-medium text-slate-500">Cardiology Specialist</div>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">{t('bookings.confirmed', { defaultValue: 'Confirmed' })}</span>
            </div>

            <div className="bg-slate-50/50 rounded-xl p-4 flex gap-8 mb-6 border border-slate-100/50">
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t('bookings.dateTime', { defaultValue: 'Date & Time' })}</div>
                  <div className="text-sm font-bold text-slate-800">Oct 24, 09:30 AM</div>
               </div>
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t('bookings.clinic', { defaultValue: 'Clinic' })}</div>
                  <div className="text-sm font-bold text-slate-800">North Wing, R-204</div>
               </div>
            </div>

            <div className="flex gap-3">
               <button onClick={() => navigate('/patient/appointments/1')} className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-sm py-2.5 rounded-lg transition-colors border border-primary-100/50">{t('bookings.reschedule', { defaultValue: 'Reschedule' })}</button>
               <button className="flex-1 bg-white hover:bg-red-50 text-red-600 font-bold text-sm py-2.5 rounded-lg transition-colors border border-slate-100 hover:border-red-100">{t('bookings.cancel', { defaultValue: 'Cancel' })}</button>
            </div>
          </div>

          {/* Card 2 */}
           <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 start-0 w-1.5 h-full bg-orange-500 rounded-s-full"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=ffedd5&color=c2410c&size=100" alt="Dr" className="w-14 h-14 rounded-full border-2 border-slate-50 shadow-sm" />
                <div>
                  <div className="font-bold text-lg text-slate-800 tracking-tight">Dr. Michael Chen</div>
                  <div className="text-sm font-medium text-slate-500">Annual Health Checkup</div>
                </div>
              </div>
              <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">{t('bookings.pending', { defaultValue: 'Pending' })}</span>
            </div>

            <div className="bg-slate-50/50 rounded-xl p-4 flex gap-8 mb-6 border border-slate-100/50">
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Date & Time</div>
                  <div className="text-sm font-bold text-slate-800">Nov 02, 02:15 PM</div>
               </div>
               <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Clinic</div>
                  <div className="text-sm font-bold text-slate-800">Main Plaza, Lobby A</div>
               </div>
            </div>

            <div className="flex gap-3">
               <button className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-sm py-2.5 rounded-lg transition-colors border border-primary-100/50">{t('bookings.completeForms', { defaultValue: 'Complete Forms' })}</button>
               <button className="flex-1 bg-white hover:bg-red-50 text-red-600 font-bold text-sm py-2.5 rounded-lg transition-colors border border-slate-100 hover:border-red-100">{t('bookings.cancel', { defaultValue: 'Cancel' })}</button>
            </div>
          </div>

        </div>
      </div>

      {/* Visit History Table */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" />
            {t('bookings.visitHistory', { defaultValue: 'Visit History' })}
          </h3>
          <button className="text-sm font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800">
            {t('bookings.allSpecialties', { defaultValue: 'All Specialties' })} <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden pt-2">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="p-4 ps-6 w-[250px]">{t('bookings.table.practitioner', { defaultValue: 'Practitioner' })}</th>
                <th className="p-4">{t('bookings.table.service', { defaultValue: 'Service' })}</th>
                <th className="p-4">{t('bookings.table.date', { defaultValue: 'Date' })}</th>
                <th className="p-4">{t('bookings.table.status', { defaultValue: 'Status' })}</th>
                <th className="p-4 text-end pe-8">{t('bookings.table.records', { defaultValue: 'Records' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              <tr className="hover:bg-slate-50/50 transition-colors">
                 <td className="p-4 ps-6 flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=Emily+Watson&size=80&background=f1f5f9" className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                    <span className="font-bold text-slate-800">Dr. Emily Watson</span>
                 </td>
                 <td className="p-4 font-medium text-slate-500">Dermatology Consult</td>
                 <td className="p-4 font-bold text-slate-800">Sep 12, 2023</td>
                 <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border border-slate-200/60">{t('bookings.completed', { defaultValue: 'Completed' })}</span>
                 </td>
                 <td className="p-4 text-end pe-6">
                    <button className="inline-flex items-center text-primary-600 font-bold text-sm hover:text-primary-700">
                      <FileText className="w-4 h-4 me-1.5" /> {t('bookings.report', { defaultValue: 'Report' })}
                    </button>
                 </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                 <td className="p-4 ps-6 flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=James+Wilson&size=80&background=f1f5f9" className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                    <span className="font-bold text-slate-800">Dr. James Wilson</span>
                 </td>
                 <td className="p-4 font-medium text-slate-500">Vaccination (Flu)</td>
                 <td className="p-4 font-bold text-slate-800">Aug 28, 2023</td>
                 <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border border-slate-200/60">{t('bookings.completed', { defaultValue: 'Completed' })}</span>
                 </td>
                 <td className="p-4 text-end pe-6">
                    <button className="inline-flex items-center text-primary-600 font-bold text-sm hover:text-primary-700">
                      <Download className="w-4 h-4 me-1.5" /> {t('bookings.certificate', { defaultValue: 'Certificate' })}
                    </button>
                 </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                 <td className="p-4 ps-6 flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Miller&size=80&background=f1f5f9" className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                    <span className="font-bold text-slate-800">Dr. Sarah Miller</span>
                 </td>
                 <td className="p-4 font-medium text-slate-500">Routine ECG</td>
                 <td className="p-4 font-bold text-slate-800">Jul 15, 2023</td>
                 <td className="p-4">
                     <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border border-slate-200/60">{t('bookings.completed', { defaultValue: 'Completed' })}</span>
                 </td>
                 <td className="p-4 text-end pe-6">
                    <button className="inline-flex items-center text-primary-600 font-bold text-sm hover:text-primary-700">
                      <FileText className="w-4 h-4 me-1.5" /> {t('bookings.report', { defaultValue: 'Report' })}
                    </button>
                 </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                 <td className="p-4 ps-6 flex items-center gap-3">
                    <img src="https://ui-avatars.com/api/?name=Michael+Chen&size=80&background=f1f5f9" className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                    <span className="font-bold text-slate-800">Dr. Michael Chen</span>
                 </td>
                 <td className="p-4 font-medium text-slate-500">Blood Work Analysis</td>
                 <td className="p-4 font-bold text-slate-800">Jun 02, 2023</td>
                 <td className="p-4">
                     <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border border-slate-200/60">{t('bookings.completed', { defaultValue: 'Completed' })}</span>
                 </td>
                 <td className="p-4 text-end pe-6">
                    <button className="inline-flex items-center text-primary-600 font-bold text-sm hover:text-primary-700">
                      <FileText className="w-4 h-4 me-1.5" /> {t('bookings.results', { defaultValue: 'Results' })}
                    </button>
                 </td>
              </tr>
            </tbody>
          </table>
          
          <div className="p-4 text-center border-t border-slate-100">
             <button onClick={() => navigate('/patient/history')} className="font-bold text-sm text-primary-600 hover:text-primary-800 py-1 transition-colors tracking-wide">
               {t('bookings.viewAllHistory', { defaultValue: 'View All History' })}
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
