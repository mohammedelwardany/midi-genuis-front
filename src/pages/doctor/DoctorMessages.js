import React, { useState } from 'react';
import { Search, Send, FileImage, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

export default function DoctorMessages() {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const chats = [
    { id: 1, name: 'Jonathan Aris', unread: 2, time: '10:42 AM', preview: 'Can I change my prescription?', status: 'Active Patient' },
    { id: 2, name: 'Amanda Smith', unread: 0, time: 'Yesterday', preview: 'Thank you Dr. Miller!', status: 'Active Patient' },
    { id: 3, name: 'Clinical Admin', unread: 0, time: 'Mon', preview: 'Your new schedule is live.', status: 'System' }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight">{t('doctorMessages.title', { defaultValue: 'Messages' })}</h2>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('doctorMessages.searchPatients', { defaultValue: 'Search patients...' })} 
              className="w-full bg-white border border-slate-200 rounded-xl ps-9 pe-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "p-4 cursor-pointer border-b border-slate-50 transition-colors flex gap-3",
                activeChat === chat.id ? "bg-primary-50/50 border-s-[3px] border-s-primary-600" : "hover:bg-white border-s-[3px] border-s-transparent"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 text-sm">
                {chat.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-slate-800 text-sm truncate pe-2">{chat.name}</h4>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate font-medium">{chat.preview}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                 J
              </div>
              <div>
                 <h3 className="font-extrabold text-slate-800 text-sm">Jonathan Aris</h3>
                 <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3" /> {t('doctorMessages.patientActive', { defaultValue: 'Patient Active' })}
                 </p>
              </div>
           </div>
           <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50">
             <MoreVertical className="w-5 h-5" />
           </button>
        </div>

        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 pt-0.5">J</div>
             <div>
                <div className="bg-white p-4 rounded-2xl rounded-ts-none border border-slate-200 shadow-sm shadow-slate-200/20 text-sm text-slate-700 font-medium">
                  Hi Dr. Miller, the new medication is giving me slight headaches. Can I change my prescription?
                </div>
                <div className="text-[10px] font-bold text-slate-400 mt-1.5 ms-1">10:42 AM</div>
             </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-shadow">
             <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-xl hover:bg-white shrink-0">
               <Paperclip className="w-5 h-5" />
             </button>
             <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-xl hover:bg-white shrink-0 me-1">
               <FileImage className="w-5 h-5" />
             </button>
             <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('doctorMessages.typeMessage', { defaultValue: 'Type a secure clinical message...' })} 
                className="w-full max-h-32 min-h-[44px] bg-transparent resize-none py-2.5 text-sm outline-none text-slate-700 font-medium placeholder:font-medium custom-scrollbar"
                rows={1}
             />
             <button className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm transition-all hover:-translate-y-0.5 shrink-0 ms-1">
               <Send className="w-4 h-4 ms-0.5" />
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}
