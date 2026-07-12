import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, CreditCard, Bell, Camera, Lock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectCurrentUser, logoutUser } from '../store/slices/authSlice';
import { updateMe, deleteMe } from '../store/slices/patientSlice';
import { cn } from '../utils/cn';
import { getAvatarSrc } from '../utils/avatar';
import { useConfirm } from '../context/ConfirmDialogContext';

export default function ProfileSettings() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const currentUser = useSelector(selectCurrentUser);
   const [activeTab, setActiveTab] = useState('personal');
   const [loading, setLoading] = useState(false);
   const { t, i18n } = useTranslation();
   const confirm = useConfirm();

   const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      return dateString.split('T')[0];
   };

         const [hasInsurance, setHasInsurance] = useState(false);
   const [formData, setFormData] = useState({
      name_en: '',
      name_ar: '',
      phone: '',
      gender: 'Male',
      date_of_birth: '',
      insurance_provider: '',
      policy_number: ''
   });

   // Initialize form when user data is available
         React.useEffect(() => {
      if (currentUser) {
         setFormData({
            name_en: currentUser.name_en || '',
            name_ar: currentUser.name_ar || '',
            phone: currentUser.phone || '',
            gender: currentUser.gender || 'Male',
            date_of_birth: formatDateForInput(currentUser.date_of_birth),
            insurance_provider: currentUser.insurance_provider || '',
            policy_number: currentUser.policy_number || ''
         });
         setHasInsurance(!!(currentUser.insurance_provider || currentUser.policy_number));
       }
    }, [currentUser]);

      const handleSaveChanges = async () => {
      setLoading(true);
      try {
         const payload = {
            ...formData,
            insurance_provider: hasInsurance ? formData.insurance_provider : '',
            policy_number: hasInsurance ? formData.policy_number : ''
         };
         await dispatch(updateMe(payload)).unwrap();
         toast.success('Profile updated successfully!');
      } catch (err) {
         toast.error(err?.message || 'Failed to update profile');
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteAccount = async () => {
      if (!(await confirm({
         message: t('profileSettings.deleteAccountConfirm', { defaultValue: 'Are you absolutely sure? This will permanently delete your account and clinical data.' }),
         danger: true,
      }))) return;

      setLoading(true);
      try {
         await dispatch(deleteMe()).unwrap();
         toast.success('Account deleted successfully');
         dispatch(logoutUser());
         navigate('/login');
      } catch (err) {
         toast.error(err?.message || 'Failed to delete account');
      } finally {
         setLoading(false);
      }
   };

   const renderContent = () => {
      switch (activeTab) {
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

                  <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
                     <button
                        onClick={handleDeleteAccount}
                        className="text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100"
                     >
                        Delete Account
                     </button>
                     <button className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">Update Password</button>
                  </div>
               </div>
            );
         case 'insurance':
            return (
               <div className="animate-in fade-in duration-300 space-y-8">
                  <div>
                     <h3 className="text-xl font-extrabold text-slate-900 mb-1">{t('profileSettings.insuranceDetailsTitle', { defaultValue: 'Insurance Details' })}</h3>
                     <p className="text-sm font-medium text-slate-500 mb-6">{t('profileSettings.insuranceDetailsDesc', { defaultValue: 'Manage your primary and secondary health insurance coverage files.' })}</p>
                                          <div className="flex items-center gap-2.5 pb-2.5">
                        <input
                           type="checkbox"
                           id="settingsHasInsurance"
                           checked={hasInsurance}
                           onChange={(e) => setHasInsurance(e.target.checked)}
                           className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer"
                        />
                        <label htmlFor="settingsHasInsurance" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                           {t('profileSettings.hasInsuranceCheckbox', { defaultValue: 'I have health insurance' })}
                        </label>
                     </div>

                     {hasInsurance && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('profileSettings.primaryProviderLabel', { defaultValue: 'Primary Insurance Provider' })}</label>
                              <input 
                                 type="text" 
                                 value={formData.insurance_provider} 
                                 onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })} 
                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" 
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('profileSettings.policyNumberLabel', { defaultValue: 'Policy Number / Member ID' })}</label>
                              <input 
                                 type="text" 
                                 value={formData.policy_number} 
                                 onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })} 
                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" 
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">{t('profileSettings.groupIdLabel', { defaultValue: 'Group ID' })}</label>
                              <input type="text" defaultValue="GRP-4432X" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                           </div>
                        </div>
                     )}
                  </div>

                  {/* <div className="pt-6 border-t border-slate-100">
                     <h3 className="text-lg font-bold text-slate-900 mb-4">{t('profileSettings.cardPhotosTitle', { defaultValue: 'Insurance Card Photos' })}</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group min-h-[160px]">
                           <div className="bg-white p-2 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera className="w-5 h-5 text-primary-600" /></div>
                           <div className="font-bold text-slate-700 text-sm">{t('profileSettings.uploadFrontLabel', { defaultValue: 'Upload Front' })}</div>
                           <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">{t('profileSettings.max5mbLabel', { defaultValue: 'Max 5MB' })}</div>
                        </div>
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group min-h-[160px]">
                           <div className="bg-white p-2 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Camera className="w-5 h-5 text-slate-400 group-hover:text-primary-600" /></div>
                           <div className="font-bold text-slate-700 text-sm">{t('profileSettings.uploadBackLabel', { defaultValue: 'Upload Back' })}</div>
                           <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">{t('profileSettings.optionalLabel', { defaultValue: 'Optional' })}</div>
                        </div>
                     </div>
                  </div> */}

                                    <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                     <button 
                        onClick={handleSaveChanges} 
                        disabled={loading}
                        className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
                     >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t('profileSettings.saveRecordsButton', { defaultValue: 'Save Records' })}
                     </button>
                  </div>
               </div>
            );
        
         case 'personal':
         default:
            return (
               <div className="animate-in fade-in duration-300 text-start">
                  <div className="flex items-center gap-6 pb-8 border-b border-slate-100 mb-8">
                     <div className="relative group shrink-0">
                        <img src={getAvatarSrc(currentUser?.avatar, formData.gender)} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm object-cover" alt="Profile" />
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
                           <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Full Name (EN)</label>
                           <input
                              type="text"
                              value={formData.name_en}
                              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                           />
                        </div>
                        <div>
                           <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Full Name (AR)</label>
                           <input
                              type="text"
                              value={formData.name_ar}
                              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm text-right"
                           />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Email Address</label>
                           <div className="relative">
                              <input type="email" value={currentUser?.email || ''} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl ps-4 pe-12 py-3.5 text-slate-500 font-semibold focus:outline-none cursor-not-allowed text-sm" />
                              <Lock className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Phone Number</label>
                           <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                           />
                        </div>
                        <div>
                           <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Date of Birth</label>
                           <input
                              type="date"
                              value={formData.date_of_birth}
                              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                           />
                        </div>
                        <div>
                           <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Gender</label>
                           <select
                              value={formData.gender}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm appearance-none"
                           >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                           </select>
                        </div>
                     </div>

                     <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">Discard</button>
                        <button
                           onClick={handleSaveChanges}
                           disabled={loading}
                           className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                           Save Changes
                        </button>
                     </div>

                     {/* Danger Zone */}
                     <div className="mt-12 pt-8 border-t border-red-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-red-50/50 p-6 rounded-2xl border border-red-100">
                           <div className="text-start">
                              <h4 className="text-red-700 font-extrabold flex items-center gap-2 mb-1">
                                 <AlertTriangle className="w-4 h-4" /> Danger Zone
                              </h4>
                              <p className="text-xs font-medium text-red-600/80 leading-relaxed">
                                 Once you delete your account, there is no going back. All clinical records, appointments, and personal data will be permanently purged from MediGenius.
                              </p>
                           </div>
                           <button
                              onClick={handleDeleteAccount}
                              disabled={loading}
                              className="shrink-0 px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                           >
                              Delete My Account
                           </button>
                        </div>
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

            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-slate-100 min-w-0 w-full overflow-hidden">
               {renderContent()}
            </div>

         </div>
      </div>
   )
}
