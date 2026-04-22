import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Shield, Stethoscope, Camera, Key, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { fetchDoctorById, updateDoctor, selectSelectedDoctor, selectDoctorsLoading } from '../../store/slices/doctorSlice';

export default function DoctorSettings() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const doctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectDoctorsLoading);

  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name_en: currentUser?.name_en || '',
    name_ar: currentUser?.name_ar || '',
    specialization: currentUser?.specialization || '',
    experience_years: currentUser?.experience_years || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || ''
  });

  useEffect(() => {
    const doctorId = currentUser?.user_id || currentUser?.id;
    if (doctorId) {
      dispatch(fetchDoctorById(doctorId));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name_en: doctor.name_en || currentUser?.name_en || '',
        name_ar: doctor.name_ar || currentUser?.name_ar || '',
        specialization: doctor.specialization || currentUser?.specialization || '',
        experience_years: doctor.experience_years || currentUser?.experience_years || '',
        bio: doctor.bio || currentUser?.bio || '',
        email: doctor.email || currentUser?.email || ''
      });
    } else if (currentUser) {
      setFormData({
        name_en: currentUser.name_en || '',
        name_ar: currentUser.name_ar || '',
        specialization: currentUser.specialization || '',
        experience_years: currentUser.experience_years || '',
        bio: currentUser.bio || '',
        email: currentUser.email || ''
      });
    }
  }, [doctor, currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    const doctorId = currentUser?.user_id || currentUser?.id;
    dispatch(updateDoctor({
      id: doctorId,
      data: {
        specialization: formData.specialization,
        experience_years: parseInt(formData.experience_years),
        bio: formData.bio
      }
    }));
  };

  if (loading && !doctor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'security':
        return (
          <div className="animate-in fade-in duration-300 space-y-8">
             <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Account Security</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Manage multi-factor authentication and passwords for HIPAA compliance.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                   <div className="hidden md:block"></div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">New Password</label>
                      <input type="password" placeholder="Min. 12 Characters" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Confirm Password</label>
                      <input type="password" placeholder="Repeat new password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" />
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 text-start">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-primary-600" /> Clinical 2FA Required</h3>
                <div className="flex items-start justify-between bg-primary-50/50 border border-primary-100 p-6 rounded-2xl gap-4 text-start">
                   <div>
                      <div className="font-bold text-slate-900 text-[15px] mb-1">Hardware Security Key</div>
                      <p className="text-[13px] font-medium text-slate-600 leading-relaxed max-w-lg">
                        Physicians must authenticate using a registered clinical hardware token (YubiKey) for accessing patient health records (EHR).
                      </p>
                   </div>
                   <button className="shrink-0 bg-white border border-slate-200 hover:border-primary-300 text-primary-700 font-bold px-4 py-2 rounded-xl text-[13px] shadow-sm transition-all focus:ring-2">Manage Keys</button>
                </div>
             </div>

             <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                <button className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">Update Credentials</button>
             </div>
          </div>
        );
      case 'licensing':
        return (
          <div className="animate-in fade-in duration-300 space-y-8 text-start">
             <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Clinical Credentials</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Manage your medical licenses, specialties, and experience.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Board Specialty</label>
                      <input 
                        type="text" 
                        value={formData.specialization} 
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Experience Years</label>
                      <input 
                        type="number" 
                        value={formData.experience_years} 
                        onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm" 
                      />
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Profile Status</label>
                      <div className="relative">
                         <input type="text" value="Active Physician" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl ps-4 pe-12 py-3.5 text-slate-600 font-semibold focus:outline-none transition-all text-sm" />
                         <Lock className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Professional Bio</label>
                      <textarea 
                        value={formData.bio} 
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm h-32" 
                      />
                   </div>
                </div>
             </div>

             <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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
                  <img src={`https://ui-avatars.com/api/?name=${i18n.language.startsWith('ar') ? (formData.name_ar || formData.name_en) : (formData.name_en || 'Doctor')}&size=150&background=dbeafe&color=1d4ed8`} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm object-cover" alt="Profile" />
                  <button className="absolute bottom-0 end-0 bg-[#0550c7] text-white p-2 rounded-full border-2 border-white hover:bg-blue-800 transition-colors shadow-sm">
                     <Camera className="w-4 h-4" />
                  </button>
               </div>
               <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">Physician Portrait</h3>
                  <p className="text-sm font-medium text-slate-500 mb-3">Visible to patients (JPG, PNG). Max 5MB.</p>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100/50 max-w-max">
                     <CheckCircle2 className="w-4 h-4" /> Professional image active
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Full Name (English)</label>
                     <div className="relative">
                        <input 
                          type="text" 
                          value={formData.name_en} 
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-600 font-semibold focus:outline-none transition-all text-sm" 
                        />
                        <Lock className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Full Name (Arabic)</label>
                     <div className="relative">
                        <input 
                          type="text" 
                          value={formData.name_ar} 
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-600 font-semibold focus:outline-none transition-all text-sm text-right" 
                        />
                        <Lock className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Clinical Email</label>
                     <input 
                        type="email" 
                        value={formData.email} 
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-600 font-semibold focus:outline-none transition-all text-sm border-s-[3px] border-s-primary-500" 
                     />
                  </div>
               </div>

               <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    Personal identity information (Name, Email) can only be modified by the System Administrator. Please contact HR for identity updates.
                  </p>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-16 font-sans">
      <div className="mb-10 text-start">
         <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('doctorSettings.title')}</h2>
         <p className="text-[15px] font-medium text-slate-500 max-w-2xl leading-relaxed">
            {t('doctorSettings.description', { defaultValue: 'Manage your personal data, clinical credentials, and account security within the physician network.' })}
         </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         
         {/* Settings Sidebar */}
         <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
            <button 
               onClick={() => setActiveTab('personal')}
               className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'personal' ? 'bg-slate-100/80 text-[#0550c7] border-[#0550c7]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'}`}>
               <User className="w-4 h-4" /> {t('doctorSettings.staffIdentity', { defaultValue: 'Staff Identity' })}
            </button>
            <button 
               onClick={() => setActiveTab('licensing')}
               className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'licensing' ? 'bg-slate-100/80 text-[#0550c7] border-[#0550c7]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'}`}>
               <Stethoscope className="w-4 h-4" /> {t('doctorSettings.clinicalDirectory', { defaultValue: 'Clinical Directory' })}
            </button>
            <button 
               onClick={() => setActiveTab('security')}
               className={`w-full text-start font-bold px-6 py-3.5 rounded-e-xl transition-colors flex items-center gap-3 text-sm border-s-2 ${activeTab === 'security' ? 'bg-slate-100/80 text-[#0550c7] border-[#0550c7]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'}`}>
               <Shield className="w-4 h-4" /> {t('doctorSettings.accountSecurity', { defaultValue: 'Account Security' })}
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
