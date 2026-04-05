import React from 'react';
import { Lock, Apple, CreditCard, ArrowRight, ShieldCheck, Mail, HeadphonesIcon, HelpCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function FinalizePayment() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest mb-4 mt-2">
         <Lock className="w-3.5 h-3.5" /> {t('finalizePayment.secureTransaction', { defaultValue: 'Secure Transaction' })}
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('finalizePayment.title', { defaultValue: 'Finalize Payment' })}</h2>
      <p className="text-slate-600 mb-10 text-[15px] font-medium">
        {t('finalizePayment.completeBookingFor', { defaultValue: 'Complete your booking for' })} <span className="font-bold text-primary-600">{t('finalizePayment.specialistConsultation', { defaultValue: 'Specialist Consultation' })}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Col (Payment Form) */}
        <div className="lg:col-span-3 space-y-8">
           
           <div className="grid grid-cols-2 gap-4">
              <button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 flex items-center justify-center font-bold text-sm transition-colors border-2 border-slate-900 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                 <Apple className="w-5 h-5 me-2" />
                 {t('finalizePayment.payWithApplePay', { defaultValue: 'Pay with Apple Pay' })}
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 rounded-xl py-3.5 flex items-center justify-center font-bold text-sm transition-colors border border-slate-200">
                 <CreditCard className="w-5 h-5 me-2" />
                 {t('finalizePayment.instantBankTransfer', { defaultValue: 'Instant Bank Transfer' })}
              </button>
           </div>

           <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                 <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                 <span className="bg-slate-50 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('finalizePayment.orPayByCard', { defaultValue: 'Or pay by card' })}</span>
              </div>
           </div>

           <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 relative">
              
              <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2">{t('finalizePayment.cardholderName', { defaultValue: 'Cardholder Name' })}</label>
                   <input type="text" defaultValue="Johnathan Doe" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2">{t('finalizePayment.cardNumber', { defaultValue: 'Card Number' })}</label>
                   <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 border border-slate-200 rounded-lg ps-4 pe-12 py-3.5 text-slate-900 font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                      <CreditCard className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">{t('finalizePayment.expiryDate', { defaultValue: 'Expiry Date' })}</label>
                        <input type="text" placeholder="MM / YY" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-slate-900 font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">{t('finalizePayment.cvv', { defaultValue: 'CVV / CVC' })}</label>
                        <input type="password" placeholder="123" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-slate-900 font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" />
                    </div>
                 </div>
                 
                 <label className="flex items-start gap-4 cursor-pointer mt-8 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 flex-shrink-0" />
                    <span className="text-xs text-slate-600 font-medium leading-relaxed">
                      Securely save this card for future appointments. Your data is encrypted and managed by PCI-compliant partners.
                    </span>
                 </label>
              </div>
           </div>

           <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
               <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> PCI-DSS Compliant</div>
               <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encryption</div>
           </div>

        </div>

        {/* Right Col (Summary Box) */}
        <div className="lg:col-span-2 space-y-6">
           
           <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{t('finalizePayment.bookingSummary', { defaultValue: 'Booking Summary' })}</h3>
              
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                 <img src="https://ui-avatars.com/api/?name=Aris+Thorne&background=f1f5f9" className="w-12 h-12 rounded-lg object-cover" alt="Dr Aris" />
                 <div>
                    <h4 className="font-bold text-slate-900 text-sm">Dr. Aris Thorne</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Neuro-Consultation</p>
                    <p className="text-[10px] font-bold text-primary-600 mt-1 uppercase tracking-widest">Oct 24, 2024 • 09:30 AM</p>
                 </div>
              </div>

              <div className="space-y-4 text-sm font-medium border-b border-slate-100 pb-6 mb-6">
                 <div className="flex justify-between items-center text-slate-600">
                    <span>{t('finalizePayment.consultationFee', { defaultValue: 'Consultation Fee' })}</span>
                    <span className="font-bold text-slate-900">$240.00</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-600">
                    <span>{t('finalizePayment.clinicFacilityCharge', { defaultValue: 'Clinic Facility Charge' })}</span>
                    <span className="font-bold text-slate-900">$15.00</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-600">
                    <span>{t('finalizePayment.serviceTax', { defaultValue: 'Service Tax (4%)' })}</span>
                    <span className="font-bold text-slate-900">$10.20</span>
                 </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('finalizePayment.totalAmount', { defaultValue: 'Total Amount' })}</div>
                 <div className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                    $265.20 <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full mt-1 line-through decoration-transparent">USD</span>
                 </div>
              </div>

              <button 
                onClick={() => navigate('/patient/book/confirm')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-base font-bold py-3.5 rounded-xl shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
              >
                 {t('finalizePayment.completePayment', { defaultValue: 'Complete Payment' })}
              </button>
              
              <p className="text-[10px] text-center text-slate-400 mt-6 font-medium leading-relaxed">
                 By clicking "Complete Payment", you agree to ClinicFlow's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Cancellation Policy</a>.
              </p>
           </div>

           {/* Help Widget */}
           <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                 <div className="bg-white rounded-full p-2 text-primary-600 shadow-sm border border-slate-100">
                    <HeadphonesIcon className="w-5 h-5" />
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-900 text-sm">{t('finalizePayment.needHelp', { defaultValue: 'Need help?' })}</h5>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{t('finalizePayment.concierge', { defaultValue: 'Our concierge is available 24/7' })}</p>
                 </div>
              </div>
              <button className="text-primary-600 font-bold text-sm">{t('finalizePayment.chat', { defaultValue: 'Chat' })}</button>
           </div>
        </div>

      </div>
    </div>
  )
}
