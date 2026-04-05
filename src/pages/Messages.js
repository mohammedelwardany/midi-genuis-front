import React from 'react';
import { Search, Send, Paperclip, MoreVertical, Edit, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Messages() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col pt-2">
      <div className="mb-6 flex justify-between items-end shrink-0">
         <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">{t('messages.title', { defaultValue: 'Secure Messaging' })}</h2>
           <p className="text-[15px] font-medium text-slate-500">{t('messages.description', { defaultValue: 'Communicate safely with your clinical team and admin staff.' })}</p>
         </div>
         <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-primary-600/20 transition-all hover:shadow flex items-center gap-2">
            <Edit className="w-4 h-4" /> {t('messages.newMessage', { defaultValue: 'New Message' })}
         </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex min-h-0">
         
         {/* Conversations List */}
         <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
            <div className="p-5 border-b border-slate-100">
               <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder={t('messages.searchPlaceholder', { defaultValue: 'Search messages...' })} className="w-full bg-white border border-slate-200 rounded-lg ps-9 pe-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow transition-colors" />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full">
               
               {/* Active Thread */}
               <div className="p-4 border-s-2 border-s-primary-600 bg-white cursor-pointer hover:bg-slate-50 transition-colors border-b border-b-slate-50 relative">
                  <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-slate-900 text-[13px] truncate pe-2">Dr. Sarah Chen</h4>
                     <span className="text-[10px] font-bold text-primary-600 whitespace-nowrap">10:42 AM</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium truncate pe-4">Yes, your latest ECG results look perfect. Keep up the good work!</div>
                  <Circle className="absolute top-4 end-4 w-2 h-2 fill-primary-600 text-primary-600" />
               </div>

               {/* Read Thread */}
               <div className="p-4 border-s-2 border-s-transparent cursor-pointer hover:bg-slate-50 transition-colors border-b border-b-slate-50 opacity-80">
                  <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-slate-800 text-[13px] truncate pe-2">Billing Department</h4>
                     <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Yesterday</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium truncate">Your statement for Oct 12 is now available.</div>
               </div>

               {/* Read Thread */}
               <div className="p-4 border-s-2 border-s-transparent cursor-pointer hover:bg-slate-50 transition-colors border-b border-b-slate-50 opacity-80">
                  <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-slate-800 text-[13px] truncate pe-2">Pharmacy Services</h4>
                     <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Oct 20</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium truncate">Lisinopril refill has been approved and sent to CVS.</div>
               </div>

            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 flex flex-col bg-white">
            
            {/* Chat Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
               <div className="flex items-center gap-4">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=eff6ff&color=1d4ed8&size=100" alt="Avatar" className="w-10 h-10 rounded-full border border-slate-100" />
                  <div>
                     <h3 className="font-bold text-slate-900 text-sm">Dr. Sarah Chen</h3>
                     <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 rounded mt-0.5 inline-block border border-emerald-100/50">Cardiology Dept</span>
                  </div>
               </div>
               <button className="text-slate-400 hover:text-slate-600 p-2"><MoreVertical className="w-5 h-5"/></button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
               <div className="flex justify-center">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200/50">Yesterday</span>
               </div>

               {/* Patient Message */}
               <div className="flex flex-col items-end">
                  <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-te-sm max-w-lg shadow-sm">
                     <p className="text-[13px] font-medium leading-relaxed">Hi Dr. Chen, I uploaded my blood pressure logs for the last 7 days. I noticed a slight spike on Tuesday evening but otherwise it's been stable.</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 me-1">04:15 PM</span>
               </div>

               <div className="flex justify-center">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200/50">Today</span>
               </div>

               {/* Doctor Message */}
               <div className="flex flex-col items-start">
                  <div className="flex items-end gap-2 mb-1">
                     <span className="text-xs font-bold text-slate-700 ms-1">Dr. Chen</span>
                     <span className="text-[10px] font-semibold text-slate-400">10:42 AM</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-ts-sm max-w-lg shadow-sm">
                     <p className="text-[13px] font-medium text-slate-700 leading-relaxed">Thank you, Alex. I reviewed the logs and the spike on Tuesday correlates with the stress event you mentioned. Yes, your latest ECG results look perfect. Keep up the good work!</p>
                  </div>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                  <button className="text-slate-400 hover:text-primary-600 transition-colors p-2 shrink-0">
                     <Paperclip className="w-5 h-5" />
                  </button>
                  <input type="text" placeholder={t('messages.typePlaceholder', { defaultValue: 'Type a secure message...' })} className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 py-2" />
                  <button className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-xl shadow-sm transition-colors shrink-0">
                     <Send className="w-4 h-4 ms-0.5" />
                  </button>
               </div>
            </div>

         </div>
      </div>
    </div>
  )
}
