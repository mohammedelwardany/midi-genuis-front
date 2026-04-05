import React from 'react';
import { ChevronRight, Printer, AlertTriangle, Calendar as CalendarIcon, Clock, Video, CheckCircle2, Circle, MapPin, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AppointmentDetails() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header / Breadcrumbs */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            <span className="hover:text-slate-900 cursor-pointer">{t('appointmentDetails.appointments', { defaultValue: 'Appointments' })}</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-semibold">Cardiology Follow-up</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg flex items-center font-bold transition-colors text-sm border border-primary-100/50">
            <Printer className="w-4 h-4 me-2" />
            {t('appointmentDetails.printSummary', { defaultValue: 'Print Summary' })}
          </button>
          <button className="bg-primary-600 text-white hover:bg-primary-700 px-5 py-2 rounded-lg flex items-center font-bold transition-colors text-sm shadow-sm hover:shadow">
            <MessageSquare className="w-4 h-4 me-2" />
            {t('appointmentDetails.contactClinic', { defaultValue: 'Contact Clinic' })}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Appointment Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest mb-4 inline-block">Confirmed</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">Cardiology Follow-up</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 text-slate-700">
               <div className="flex items-center gap-2 font-medium">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                  October 24, 2023
               </div>
               <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-5 h-5 text-primary-600" />
                  10:30 AM — 11:15 AM
               </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 font-medium mb-10 pb-8 border-b border-slate-100">
               <Video className="w-5 h-5 text-primary-600" />
               Telehealth Visit
            </div>

            <div>
             <h3 className="text-lg font-bold text-slate-900 mb-3">{t('appointmentDetails.reasonForVisit', { defaultValue: 'Reason for Visit' })}</h3>
               <p className="text-slate-600 leading-relaxed font-medium">
                 Routine follow-up after starting new blood pressure medication. Patient reports occasional fatigue but stable readings. Evaluation of ECG results and discussion of lifestyle adjustments.
               </p>
            </div>
          </div>

          {/* Pre-Visit Instructions */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                {t('appointmentDetails.preVisitInstructions', { defaultValue: 'Pre-Visit Instructions' })}
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-slate-50 rounded-xl p-5 border-s-4 border-s-primary-600">
                  <h4 className="font-bold text-slate-900 mb-1">Fast for 8 Hours</h4>
                  <p className="text-sm text-slate-600 font-medium">Required for complete metabolic panel. Water is permitted.</p>
               </div>
               <div className="bg-slate-50 rounded-xl p-5 border-s-4 border-s-primary-600">
                  <h4 className="font-bold text-slate-900 mb-1">Medication List</h4>
                  <p className="text-sm text-slate-600 font-medium">Please have all current prescription bottles ready for review.</p>
               </div>
               <div className="bg-slate-50 rounded-xl p-5 border-s-4 border-s-primary-600">
                  <h4 className="font-bold text-slate-900 mb-1">Blood Pressure Log</h4>
                  <p className="text-sm text-slate-600 font-medium">Upload your last 7 days of readings via the portal.</p>
               </div>
               
             </div>
          </div>
        </div>

        {/* Right Column (Sidebar Information) */}
        <div className="space-y-6">
          
          {/* Care Provider */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">{t('appointmentDetails.yourCareProvider', { defaultValue: 'Your Care Provider' })}</h4>
            
            <div className="flex items-center gap-4 mb-6">
              <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=eff6ff&color=1d4ed8&size=100" alt="Dr" className="w-14 h-14 rounded-full border border-slate-100" />
              <div>
                <div className="font-bold text-slate-900 text-lg">Dr. Sarah Chen</div>
                <div className="text-primary-600 font-bold text-sm">Senior Cardiologist</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Heart & Vascular Institute</div>
              </div>
            </div>

            <div className="space-y-3">
               <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-lg transition-colors">{t('appointmentDetails.viewFullProfile', { defaultValue: 'View Full Profile' })}</button>
               <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm py-2.5 rounded-lg transition-colors">{t('appointmentDetails.viewPreviousNotes', { defaultValue: 'View Previous Notes' })}</button>
            </div>
          </div>

          {/* Appointment Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{t('appointmentDetails.appointmentTimeline', { defaultValue: 'Appointment Timeline' })}</h4>
             
             <div className="relative border-s-2 border-slate-100 ms-3 space-y-8 pb-4">
                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                   </div>
                   <div className="font-bold text-slate-900 text-sm">Request Received</div>
                   <div className="text-xs text-slate-500 font-medium mt-1">Oct 12, 2023 • 09:15 AM</div>
                </div>

                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                   </div>
                   <div className="font-bold text-slate-900 text-sm">Confirmed by Clinic</div>
                   <div className="text-xs text-slate-500 font-medium mt-1">Oct 12, 2023 • 11:45 AM</div>
                </div>

                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      <Circle className="w-5 h-5 text-primary-600 fill-primary-50" />
                   </div>
                   <div className="font-bold text-primary-700 text-sm">Check-in Open</div>
                   <div className="text-xs text-primary-600 font-medium mt-1">Available in 2 days</div>
                </div>

                <div className="relative ps-6">
                   <div className="absolute -start-[11px] bg-white p-0.5 rounded-full">
                      <Circle className="w-5 h-5 text-slate-300" />
                   </div>
                   <div className="font-bold text-slate-400 text-sm">Visit Completed</div>
                   <div className="text-xs text-slate-400 font-medium mt-1">Pending</div>
                </div>
             </div>
          </div>

          {/* Location */}
          <div className="bg-transparent">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ps-1">{t('appointmentDetails.location', { defaultValue: 'Location' })}</h4>
             <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-40 bg-slate-800 relative w-full overflow-hidden flex items-center justify-center">
                   {/* Simplified map representation */}
                   <MapPin className="w-12 h-12 text-red-500 absolute z-10 drop-shadow-lg" fill="currentColor" />
                   <div className="absolute w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                </div>
                <div className="p-5">
                   <div className="font-bold text-slate-900 mb-1 text-sm">Metropolitan Medical Plaza</div>
                   <div className="text-xs text-slate-600 font-medium">450 Sutter St, Suite 1200</div>
                   <div className="text-xs text-slate-600 font-medium">San Francisco, CA 94108</div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
