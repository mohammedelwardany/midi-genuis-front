import React, { useState } from 'react';
import { UserPlus, Search, Shield, Filter, MoreVertical, Mail, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

export default function UserManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('doctors');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock Data
  const doctors = [
    { id: '1', name: 'Dr. Sarah Chen', email: 'sarah.chen@medigenius.com', license: 'MD-100293', status: 'Active', patients: 142 },
    { id: '2', name: 'Dr. Marcus Wright', email: 'm.wright@medigenius.com', license: 'MD-998234', status: 'Pending', patients: 0 },
  ];

  const patients = [
    { id: '1', name: 'Jonathan Aris', email: 'jonathan@example.com', dob: '1990-05-15', status: 'Active' },
    { id: '2', name: 'Amanda Smith', email: 'amanda.s@example.com', dob: '1985-11-20', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
         <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('userManagement.title')}</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">{t('userManagement.desc')}</p>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /> {t('userManagement.registerDoc')}
            </button>
         </div>

         <div className="flex gap-6 mt-8 border-b border-slate-100">
           <button 
             onClick={() => setActiveTab('doctors')}
             className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === 'doctors' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
           >
             {t('userManagement.doctorsTab')}
             {activeTab === 'doctors' && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('patients')}
             className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === 'patients' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
           >
             {t('userManagement.patientsTab')}
             {activeTab === 'patients' && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
           </button>
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
         <div className="relative w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={`${t('userManagement.search')} ${activeTab === 'doctors' ? t('userManagement.doctorsTab') : t('userManagement.patientsTab')}`}
              className="w-full ps-9 pe-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
         </div>
         <button className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
            <Filter className="w-4 h-4" /> {t('userManagement.filter')}
         </button>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
         <table className="w-full text-start border-collapse">
            <thead>
               <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                  <th className="p-4 ps-6">{t('userManagement.thName')}</th>
                  <th className="p-4">{activeTab === 'doctors' ? t('userManagement.thLicense') : t('userManagement.thDob')}</th>
                  <th className="p-4 text-center">{t('userManagement.thStatus')}</th>
                  <th className="p-4 text-center">{activeTab === 'doctors' ? t('userManagement.thPatients') : t('userManagement.thVisits')}</th>
                  <th className="p-4 text-end pe-6">{t('userManagement.thActions')}</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {(activeTab === 'doctors' ? doctors : patients).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="p-4 ps-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                             {user.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800">{user.name}</p>
                              <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="p-4 text-sm font-medium text-slate-700">
                        {activeTab === 'doctors' ? user.license : user.dob}
                     </td>
                     <td className="p-4 text-center">
                        <span className={cn(
                           "px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1",
                           user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        )}>
                           {user.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                           {t('userManagement.' + user.status.toLowerCase().replace(' ', ''))}
                        </span>
                     </td>
                     <td className="p-4 text-center text-sm font-bold text-slate-700">
                        {activeTab === 'doctors' ? user.patients : '0'}
                     </td>
                     <td className="p-4 text-end pe-6">
                        <button className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-extrabold text-slate-800">Register Doctor</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                 <AlertCircle className="w-6 h-6 rotate-45" />
               </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                 <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder="Dr. John Doe" required />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                 <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder="doctor@medigenius.com" required />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Medical License Number</label>
                 <div className="relative">
                    <Shield className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder="MD-XXXXXX" required />
                 </div>
               </div>
               <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Temporary Password</label>
                 <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" required />
               </div>

               <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all mt-4">
                 Create Doctor Account
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
