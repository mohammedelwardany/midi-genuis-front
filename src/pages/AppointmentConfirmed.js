import React from 'react';
import { Check, CalendarPlus, Printer, UserCircle2, Calendar, FileText, Info, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AppointmentConfirmed() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto pt-10 text-center relative">
      <div className="absolute inset-0 top-1/3 bg-primary-50 rounded-full blur-[100px] opacity-20 -z-10 w-3/4 mx-auto aspect-square" />
      
      {/* Success Icon */}
      <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary-600/20 mb-8 border border-primary-500">
        <Check className="w-8 h-8 text-white stroke-[3px]" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{t('appointmentConfirmed.title', { defaultValue: 'Appointment Confirmed!' })}</h1>
      <p className="text-slate-600 max-w-lg mx-auto text-base leading-relaxed mb-12 font-medium">
         {t('appointmentConfirmed.description', { defaultValue: 'Your visit has been successfully scheduled. A confirmation email has been sent to the patient.' })}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
        
        {/* Left Column (Details) */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden h-full flex flex-col">
           <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
              <div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1">{t('appointmentConfirmed.referenceId', { defaultValue: 'Reference ID' })}</div>
                 <div className="text-2xl font-extrabold font-mono tracking-tighter text-slate-900">#CF-8829-4401</div>
              </div>
              <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">{t('appointmentConfirmed.scheduled', { defaultValue: 'Scheduled' })}</span>
           </div>

           <div className="space-y-6 flex-1">
              <div className="flex gap-4">
                 <div className="text-primary-500 mt-0.5"><UserCircle2 className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.doctor', { defaultValue: 'Doctor' })}</div>
                    <div className="font-bold text-slate-900 text-[15px]">Dr. Sarah Montgomery</div>
                    <div className="text-sm font-medium text-slate-500">Senior Cardiologist • Room 402</div>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="text-primary-500 mt-0.5"><Calendar className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.dateTime', { defaultValue: 'Date & Time' })}</div>
                    <div className="font-bold text-slate-900 text-[15px]">Monday, Oct 24, 2023</div>
                    <div className="text-sm font-medium text-slate-500">10:30 AM — 11:15 AM (45 min)</div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="text-primary-500 mt-0.5"><FileText className="w-5 h-5" /></div>
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('appointmentConfirmed.patientInfo', { defaultValue: 'Patient Info' })}</div>
                    <div className="font-bold text-slate-900 text-[15px]">Jonathan Aris</div>
                    <div className="text-sm font-medium text-slate-500">ID: PAT-992-10 • Routine Checkup</div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4 mt-10">
              <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow flex justify-center items-center text-sm border-b-2 border-primary-700">
                 <CalendarPlus className="w-4 h-4 me-2" /> {t('appointmentConfirmed.addToCalendar', { defaultValue: 'Add to Calendar' })}
              </button>
              <button className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center text-sm border border-primary-100/50">
                 <Printer className="w-4 h-4 me-2" /> {t('appointmentConfirmed.printReceipt', { defaultValue: 'Print Receipt' })}
              </button>
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 h-full flex flex-col">
           
           {/* Payment Summary */}
           <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100/80">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-6">
                 <FileText className="w-4 h-4 text-slate-400" /> {t('appointmentConfirmed.paymentSummary', { defaultValue: 'Payment Summary' })}
              </h4>
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200/60 pb-4 text-sm font-medium">
                 <div className="flex justify-between">
                    <span className="text-slate-600">{t('appointmentConfirmed.consultationFee', { defaultValue: 'Consultation Fee' })}</span>
                    <span className="font-bold text-slate-900">$150.00</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-600">{t('appointmentConfirmed.labServices', { defaultValue: 'Lab Services' })}</span>
                    <span className="font-bold text-slate-900">$45.00</span>
                 </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                 <div className="text-sm font-bold text-slate-900">{t('appointmentConfirmed.totalAmountPaid', { defaultValue: 'Total Amount Paid' })}</div>
                 <div className="text-xl font-extrabold text-primary-700">$195.00</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 border border-slate-100 shadow-sm">
                 <Check className="w-4 h-4 text-primary-500 shrink-0" />
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Transaction successful via Visa ending in 4242</span>
              </div>
           </div>

           {/* Clinical Guidance */}
           <div className="bg-white rounded-3xl p-8 border border-slate-100/80 shadow-[0_2px_15px_rgb(0,0,0,0.02)] flex-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">{t('appointmentConfirmed.clinicalGuidance', { defaultValue: 'Clinical Guidance' })}</h4>
              
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="text-primary-500 shrink-0 mt-0.5"><Info className="w-4 h-4" /></div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                       Please arrive 15 minutes early for vital checks and check-in documentation.
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-primary-500 shrink-0 mt-0.5"><Info className="w-4 h-4" /></div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                       Bring all current medications or a digital list for the doctor to review.
                    </p>
                 </div>
              </div>
           </div>

           {/* Actions below */}
           <div className="pt-4 text-center">
              <button 
                onClick={() => navigate('/patient/bookings')}
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-100 text-primary-600 font-extrabold text-[15px] py-4 rounded-xl transition-all shadow-sm hover:shadow-md mb-6 flex justify-center items-center"
              >
                 <Plus className="w-5 h-5 me-2" /> {t('appointmentConfirmed.scheduleAnother', { defaultValue: 'Schedule Another Appointment' })}
              </button>
              <button 
                onClick={() => navigate('/patient/bookings')}
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
