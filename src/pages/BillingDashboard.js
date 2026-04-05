import React from 'react';
import { Download, Wallet, Calendar as CalendarIcon, MoreVertical, Verified, Info, Edit3, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BillingDashboard() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('billing.title', { defaultValue: 'Billing & Payments' })}</h2>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
            {t('billing.description', { defaultValue: 'Monitor your healthcare expenses and manage saved payment accounts. For immediate payment of outstanding balances, please select an invoice below.' })}
          </p>
        </div>
        <button className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors text-sm">
          <Download className="w-4 h-4 me-2" />
          {t('billing.statement', { defaultValue: 'Statement' })}
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Outstanding */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('billing.totalOutstanding', { defaultValue: 'Total Outstanding' })}</span>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">$1,482.00</div>
            <div className="text-sm mt-2 text-slate-500">
              <span className="text-red-500 font-medium">+12%</span> {t('billing.vsLastMonth', { defaultValue: 'vs last month' })}
            </div>
          </div>
        </div>

        {/* Next Due Date */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('billing.nextDueDate', { defaultValue: 'Next Due Date' })}</span>
             <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">Oct 24</div>
            <div className="text-sm mt-2 text-slate-500">
              {t('billing.invoiceLabel', { defaultValue: 'Invoice' })} #INV-9201
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-5">{t('billing.recentActivity', { defaultValue: 'Recent Activity' })}</span>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">{t('billing.lastPaymentReceived', { defaultValue: 'Last Payment Received' })}</span>
              <span className="text-slate-500 font-medium">-$250.00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">{t('billing.newServiceCharges', { defaultValue: 'New Service Charges' })}</span>
              <span className="text-slate-500 font-medium">+$120.00</span>
            </div>
            {/* Progress bar visual */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-6">
               <div className="bg-primary-600 w-2/3 h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Payment History Table */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-end mb-4 pe-2">
             <h3 className="text-xl font-bold text-slate-900">{t('billing.paymentHistory', { defaultValue: 'Payment History' })}</h3>
             <div className="flex gap-2 text-slate-400">
                <button className="hover:bg-slate-200 p-1.5 rounded transition"><MoreVertical className="w-5 h-5 transform rotate-90" /></button>
                <button className="hover:bg-slate-200 p-1.5 rounded transition"><MoreVertical className="w-5 h-5" /></button>
             </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 ps-6">{t('billing.table.invoiceId', { defaultValue: 'Invoice ID' })}</th>
                    <th className="p-4">{t('billing.table.date', { defaultValue: 'Date' })}</th>
                    <th className="p-4">{t('billing.table.serviceDoctor', { defaultValue: 'Service/Doctor' })}</th>
                    <th className="p-4">{t('billing.table.amount', { defaultValue: 'Amount' })}</th>
                    <th className="p-4">{t('billing.table.status', { defaultValue: 'Status' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 ps-6 font-semibold text-primary-600">#INV-9402</td>
                    <td className="p-4 text-slate-500">Oct 12,<br/>2023</td>
                    <td className="p-4">
                       <span className="font-bold text-slate-800 block">General Consultation</span>
                       <span className="text-xs text-slate-500">Dr. Sarah Mitchell</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">$150.00</td>
                    <td className="p-4">
                       <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold">Overdue</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 ps-6 font-semibold text-primary-600">#INV-9398</td>
                    <td className="p-4 text-slate-500">Oct 05,<br/>2023</td>
                    <td className="p-4">
                       <span className="font-bold text-slate-800 block">Lab Diagnostics</span>
                       <span className="text-xs text-slate-500">Clinical Lab A1</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">$420.00</td>
                    <td className="p-4">
                       <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-bold">Pending</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 ps-6 font-semibold text-primary-600">#INV-9382</td>
                    <td className="p-4 text-slate-500">Sep 28,<br/>2023</td>
                    <td className="p-4">
                       <span className="font-bold text-slate-800 block">Physical Therapy</span>
                       <span className="text-xs text-slate-500">Mark Sterling</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">$95.00</td>
                    <td className="p-4">
                       <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">Paid</span>
                    </td>
                  </tr>
                </tbody>
             </table>
           </div>
        </div>

        {/* Right Col: Payment Methods & Support */}
        <div className="space-y-6">
           <div className="flex justify-between items-end mb-4">
             <h3 className="text-xl font-bold text-slate-900">{t('billing.paymentMethods', { defaultValue: 'Payment Methods' })}</h3>
             <button className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors flex items-center">
                 <span className="me-1">+</span> {t('billing.addNew', { defaultValue: 'Add New' })}
             </button>
           </div>
           
           {/* Card 1 */}
           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative group overflow-hidden hover:border-slate-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-900 rounded py-1 px-2 text-white font-bold text-[10px] uppercase tracking-widest mt-1">VISA</div>
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      {t('billing.visaEnding', { defaultValue: 'Visa ending' })} 4242 <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-1.5 py-0.5 rounded">{t('billing.default', { defaultValue: 'DEFAULT' })}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{t('billing.expires', { defaultValue: 'Expires' })} 12/26</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-4 mt-5 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-50">
                <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"><Verified className="w-3.5 h-3.5 text-primary-500" /> {t('billing.verified', { defaultValue: 'Verified' })}</span>
                <button className="hover:text-slate-800">{t('billing.edit', { defaultValue: 'Edit' })}</button>
                <button className="hover:text-red-500">{t('billing.remove', { defaultValue: 'Remove' })}</button>
              </div>
           </div>

           {/* Card 2 */}
           <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex justify-between items-center hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 rounded-lg p-2 text-slate-800">
                  <Wallet className="w-6 h-6" /> {/* Placeholder for Apple Pay Icon */}
                </div>
                <div>
                  <div className="font-bold text-slate-800">Apple Pay</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('billing.connected', { defaultValue: 'CONNECTED' })}</div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
           </div>

           {/* Billing Support Block */}
           <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100 relative overflow-hidden mt-6">
              <div className="flex gap-3 relative z-10">
                 <div className="text-primary-600 shrink-0">
                    <Info className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{t('billing.supportTitle', { defaultValue: 'Billing Support' })}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                       {t('billing.supportBody', { defaultValue: 'Need help with a payment plan? We offer flexible installments for larger balances. Contact our dedicated billing team at (555) 012-3456 or via the help desk.' })}
                    </p>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  )
}
