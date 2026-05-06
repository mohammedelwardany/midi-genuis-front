import React from 'react';
import { Check, CalendarPlus, Printer, UserCircle2, Calendar, FileText, Info, Plus, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AppointmentConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const { doctorName, date, time, pending } = location.state || {};

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!date || !time) return;
    
    const [start] = time.split(' - ');
    const eventDate = date.replace(/-/g, '');
    const startTime = start.replace(/:/g, '') + '00';
    
    // Simple ICS generation
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${eventDate}T${startTime}`,
      `SUMMARY:Medical Appointment with ${doctorName}`,
      'DESCRIPTION:Appointment confirmed via MediGenius Portal',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment-${date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto pt-10 text-center relative print:pt-0">
      <div className="absolute inset-0 top-1/3 bg-primary-50 rounded-full blur-[100px] opacity-20 -z-10 w-3/4 mx-auto aspect-square print:hidden" />
      
      {/* Success Icon */}
      <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary-600/20 mb-8 border border-primary-500 print:hidden">
        {pending ? <Clock className="w-8 h-8 text-white stroke-[3px]" /> : <Check className="w-8 h-8 text-white stroke-[3px]" />}
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 print:text-2xl print:mb-2">
        {pending ? t('finalizePayment.manualApproval', { defaultValue: 'Submission Received!' }) : t('appointmentConfirmed.title', { defaultValue: 'Appointment Confirmed!' })}
      </h1>
      <p className="text-slate-600 max-w-lg mx-auto text-base leading-relaxed mb-12 font-medium print:hidden">
         {pending 
           ? t('finalizePayment.manualApprovalNotice', { defaultValue: 'Your booking will be reviewed by our administration. You will receive a confirmation once the payment is verified.' })
           : t('appointmentConfirmed.description', { defaultValue: 'Your visit has been successfully scheduled. A confirmation email has been sent to the patient.' })
         }
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
        
        {/* Left Column (Details) */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden h-full flex flex-col print:shadow-none print:border-slate-200">
           <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
              <div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1">{t('appointmentConfirmed.referenceId', { defaultValue: 'Reference ID' })}</div>
                 <div className="text-2xl font-extrabold font-mono tracking-tighter text-slate-900">#CF-{Math.floor(Math.random() * 9000) + 1000}</div>
              </div>
              <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest print:border print:border-primary-100">
                {pending ? t('bookings.pending', { defaultValue: 'Pending' }) : t('appointmentConfirmed.scheduled', { defaultValue: 'Scheduled' })}
              </span>
           </div>

           <div className="space-y-6 flex-1">
              <div className="flex gap-4">
                 <div className="text-primary-500 mt-0.5 print:hidden"><UserCircle2 className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.doctor', { defaultValue: 'Doctor' })}</div>
                    <div className="font-bold text-slate-900 text-[15px]">{doctorName || 'Medical Specialist'}</div>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="text-primary-500 mt-0.5 print:hidden"><Calendar className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.dateTime', { defaultValue: 'Date & Time' })}</div>
                    <div className="font-bold text-slate-900 text-[15px]">
                      {date ? new Date(date).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                    </div>
                    <div className="text-sm font-medium text-slate-500">{time || '---'}</div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4 mt-10 print:hidden">
              <button 
                onClick={handleAddToCalendar}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow flex justify-center items-center text-sm border-b-2 border-primary-700"
              >
                 <CalendarPlus className="w-4 h-4 me-2" /> {t('appointmentConfirmed.addToCalendar', { defaultValue: 'Add to Calendar' })}
              </button>
              <button 
                onClick={handlePrint}
                className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center text-sm border border-primary-100/50"
              >
                 <Printer className="w-4 h-4 me-2" /> {t('appointmentConfirmed.printReceipt', { defaultValue: 'Print Receipt' })}
              </button>
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 h-full flex flex-col print:hidden">
           
           {/* Clinical Guidance */}
           <div className="bg-white rounded-3xl p-8 border border-slate-100/80 shadow-[0_2px_15px_rgb(0,0,0,0.02)] flex-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">{t('appointmentConfirmed.clinicalGuidance', { defaultValue: 'Clinical Guidance' })}</h4>
              
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="text-primary-500 shrink-0 mt-0.5"><Info className="w-4 h-4" /></div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                       {t('appointmentConfirmed.guidance1', { defaultValue: 'Please arrive 15 minutes early for vital checks and check-in documentation.' })}
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-primary-500 shrink-0 mt-0.5"><Info className="w-4 h-4" /></div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                       {t('appointmentConfirmed.guidance2', { defaultValue: 'Bring all current medications or a digital list for the doctor to review.' })}
                    </p>
                 </div>
              </div>
           </div>

           {/* Actions below */}
           <div className="pt-4 text-center">
              <button 
                onClick={() => navigate('/patient/book/doctors')}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-100 text-primary-600 font-extrabold text-[15px] py-4 rounded-xl transition-all shadow-sm hover:shadow-md mb-6 flex justify-center items-center"
              >
                 <Plus className="w-5 h-5 me-2" /> {t('appointmentConfirmed.scheduleAnother', { defaultValue: 'Schedule Another Appointment' })}
              </button>
              <button 
                onClick={() => navigate('/patient/dashboard')}
                className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
               >
                 {t('appointmentConfirmed.returnToDashboard', { defaultValue: 'Return to Dashboard' })}
              </button>
           </div>

        </div>

      </div>
    </div>
  )
}
