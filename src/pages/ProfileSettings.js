import React, { useState } from 'react';
import { User, Shield, CreditCard, Bell, Camera, Lock, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');
  const { t } = useTranslation();

  const renderContent = () => {
    switch(activeTab) {
      case 'security':
        return (
          <div className="animate-in fade-in duration-300 space-y-8">
             <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Security & Password</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Manage your password and security settings to keep your health data safe.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                   <div className="hidden md:block"></div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">New Password</label>
                      <input type="password" placeholder="Enter new password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Confirm New Password</label>
                      <input type="password" placeholder="Repeat new password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-primary-600" /> Two-Factor Authentication (2FA)</h3>
                <div className="flex items-start justify-between bg-primary-50/50 border border-primary-100 p-6 rounded-2xl gap-4">
                   <div>
                      <div className="font-bold text-slate-900 text-[15px] mb-1">Authenticator App</div>
                      <p className="text-[13px] font-medium text-slate-600 leading-relaxed">Secure your account with an Authenticator like Google Authenticator or Authy. This offers the highest level of security.</p>
                   </div>
                   <button className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 rounded-xl text-[13px] shadow-sm transition-colors">Enable 2FA</button>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 pb-2">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">Recent Login Activity</h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 Days</span>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div>
                         <div className="font-bold text-slate-800 text-sm mb-0.5">Mac OS X • Chrome</div>
                         <div className="text-[11px] font-medium text-slate-500 text-xs">New York, USA (IP: 192.168.1.1)</div>
                      </div>
                      <div className="text-end">
                         <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end"><CheckCircle2 className="w-3.5 h-3.5" /> Active Match</div>
                         <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Current Session</div>
                      </div>
                   </div>
                   <div className="flex justify-between items-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div>
                         <div className="font-bold text-slate-800 text-sm mb-0.5">iOS 16 • Safari</div>
                         <div className="text-[11px] font-medium text-slate-500 text-xs">New York, USA (IP: 192.168.1.5)</div>
                      </div>
                      <div className="text-end">
                         <div className="text-[11px] font-bold text-slate-500">Yesterday at 4:32 PM</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <button className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">Update Password</button>
             </div>
          </div>
        );
      case 'insurance':
        return (
          <div className="animate-in fade-in duration-300 space-y-8">
             <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Insurance Details</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Manage your primary and secondary health insurance coverage files.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Primary Insurance Provider</label>
                      <input type="text" defaultValue="Blue Cross Blue Shield" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Policy Number / Member ID</label>
                      <input type="text" defaultValue="BCB-987654321A" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Group ID</label>
                      <input type="text" defaultValue="GRP-4432X" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                </div>
             </div>
             
             <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Insurance Card Photos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group min-h-[160px]">
                      <div className="bg-white p-2 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera className="w-5 h-5 text-primary-600" /></div>
                      <div className="font-bold text-slate-700 text-sm">Upload Front</div>
                      <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">Max 5MB</div>
                   </div>
                   <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group min-h-[160px]">
                      <div className="bg-white p-2 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera className="w-5 h-5 text-slate-400 group-hover:text-primary-600" /></div>
                      <div className="font-bold text-slate-700 text-sm">Upload Back</div>
                      <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">Optional</div>
                   </div>
                </div>
             </div>

             <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <button className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">Save Records</button>
             </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="animate-in fade-in duration-300 space-y-8">
             <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Notification Preferences</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Choose how and when we communicate with you regarding your medical care.</p>
                
                <div className="space-y-4">
                   
                   <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                         <div className="font-bold text-slate-800 text-[15px] mb-1">Appointment Reminders</div>
                         <div className="text-[13px] font-medium text-slate-500">Receive SMS texts and emails 24 hours before your scheduled visit.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                   </div>

                   <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                         <div className="font-bold text-slate-800 text-[15px] mb-1">Secure Messages</div>
                         <div className="text-[13px] font-medium text-slate-500">Get an email alert when your clinical team replies to you.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                   </div>

                   <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                         <div className="font-bold text-slate-800 text-[15px] mb-1">New Test Results</div>
                         <div className="text-[13px] font-medium text-slate-500">Instant SMS alert when your laboratory or radiology results are published.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                   </div>

                   <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                         <div className="font-bold text-slate-800 text-[15px] mb-1">Billing & Statements</div>
                         <div className="text-[13px] font-medium text-slate-500">Monthly invoice summaries and payment receipt confirmations.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                   </div>

                </div>
             </div>
             
             <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4" /> Preferences Auto-Saved
                </span>
             </div>
          </div>
        );
      case 'personal':
      default:
        return (
          <div className="animate-in fade-in duration-300 text-start">
            <div className="flex items-center gap-6 pb-8 border-b border-slate-100 mb-8">
               <div className="relative group shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Jonathan+Doe&size=150&background=c7d2fe&color=3730a3" className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm object-cover" alt="Profile" />
                  <button className="absolute bottom-0 end-0 bg-primary-600 text-white p-2 rounded-full border-2 border-white hover:bg-primary-700 transition-colors shadow-sm">
                     <Camera className="w-4 h-4" />
                  </button>
               </div>
               <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">Profile Photo</h3>
                  <p className="text-sm font-medium text-slate-500 mb-3">JPG, PNG or GIF (Max 5MB).</p>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100/50 max-w-max">
                     <CheckCircle2 className="w-4 h-4" /> Uploaded successfully
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">First Name</label>
                     <input type="text" defaultValue="Jonathan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Last Name</label>
                     <input type="text" defaultValue="Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Email Address</label>
                     <div className="relative">
                        <input type="email" defaultValue="jonathan.doe@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-4 pe-12 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                        <Lock className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Phone Number</label>
                     <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Date of Birth</label>
                     <input type="text" defaultValue="March 15, 1985" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm disabled:opacity-75" disabled />
                  </div>
               </div>

               <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">Discard</button>
                  <button className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">Save Changes</button>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('profileSettings.title', { defaultValue: 'Account Settings' })}</h2>
           <p className="text-[15px] font-medium text-slate-500 max-w-2xl leading-relaxed">
              {t('profileSettings.description', { defaultValue: 'Manage your personal information, security preferences, and update your billing/insurance details securely.' })}
           </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         
         {/* Settings Sidebar */}
         <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
            <button 
               onClick={() => setActiveTab('personal')}
               className={cn(
                 "w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2",
                 activeTab === 'personal' ? "bg-slate-100/80 text-primary-700 border-primary-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent"
               )}>
               <User className="w-4 h-4" /> {t('profileSettings.personalInfo', { defaultValue: 'Personal Info' })}
            </button>
            <button 
               onClick={() => setActiveTab('security')}
               className={cn(
                 "w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2",
                 activeTab === 'security' ? "bg-slate-100/80 text-primary-700 border-primary-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent"
               )}>
               <Shield className="w-4 h-4" /> {t('profileSettings.security', { defaultValue: 'Security' })}
            </button>
            <button 
               onClick={() => setActiveTab('insurance')}
               className={cn(
                 "w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2",
                 activeTab === 'insurance' ? "bg-slate-100/80 text-primary-700 border-primary-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent"
               )}>
               <CreditCard className="w-4 h-4" /> {t('profileSettings.insuranceDetails', { defaultValue: 'Insurance Details' })}
            </button>
            <button 
               onClick={() => setActiveTab('notifications')}
               className={cn(
                 "w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2",
                 activeTab === 'notifications' ? "bg-slate-100/80 text-primary-700 border-primary-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent"
               )}>
               <Bell className="w-4 h-4" /> {t('profileSettings.notifications', { defaultValue: 'Notifications' })}
            </button>
         </div>

         {/* Content Area */}
         <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 min-w-0 w-full overflow-hidden">
            {renderContent()}
         </div>

      </div>
    </div>
  )
}
