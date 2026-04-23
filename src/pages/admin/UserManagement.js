import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, User, Search, Filter, MoreVertical, Mail, AlertCircle, CheckCircle2, Trash2, Edit, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { 
  fetchDoctors, 
  addDoctor, 
  deleteDoctor, 
  selectDoctors, 
  selectDoctorsLoading 
} from '../../store/slices/doctorSlice';
import {
  fetchPatients,
  addPatient,
  deletePatient,
  selectPatients,
  selectPatientsLoading
} from '../../store/slices/patientSlice';

export default function UserManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('doctors');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');

  const doctors = useSelector(selectDoctors);
  const doctorsLoading = useSelector(selectDoctorsLoading);
  const patientsList = useSelector(selectPatients);
  const patientsLoading = useSelector(selectPatientsLoading);

  const loading = activeTab === 'doctors' ? doctorsLoading : patientsLoading;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name_en: '',
    name_ar: '',
    specialization: '',
    bio: '',
    experience_years: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male'
  });

  useEffect(() => {
    if (activeTab === 'doctors') {
      dispatch(fetchDoctors());
    } else {
      dispatch(fetchPatients());
    }
  }, [dispatch, activeTab]);

  const filteredItems = (activeTab === 'doctors' ? (doctors || []) : (patientsList || [])).filter(item => {
    const name = item.name_en || item.name || '';
    const email = item.email || '';
    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'doctors') {
      const matchesFilter = filterSpec === 'All' || item.specialization === filterSpec;
      return matchesSearch && matchesFilter;
    }
    return matchesSearch;
  });

  const uniqueSpecializations = ['All', ...new Set((doctors || []).map(d => d.specialization).filter(Boolean))];

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === 'doctors') {
        await dispatch(addDoctor({
          ...formData,
          experience_years: parseInt(formData.experience_years)
        })).unwrap();
        toast.success(t('userManagement.physicianSuccess'));
      } else {
        await dispatch(addPatient({
          ...formData
        })).unwrap();
        toast.success(t('userManagement.patientSuccess'));
      }
      
      setShowAddModal(false);
      setFormData({
        email: '', password: '', name_en: '', name_ar: '',
        specialization: '', bio: '', experience_years: '',
        phone: '', date_of_birth: '', gender: 'Male'
      });
      
      if (activeTab === 'doctors') dispatch(fetchDoctors());
      else dispatch(fetchPatients());
    } catch (err) {
      toast.error(err?.message || t('userManagement.failRegister', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = (id) => {
    const type = activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular');
    if (window.confirm(t('userManagement.deleteConfirm', { type }))) {
      if (activeTab === 'doctors') {
        dispatch(deleteDoctor(id));
      } else {
        dispatch(deletePatient(id));
      }
    }
  };

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
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
              {activeTab === 'doctors' ? t('userManagement.registerDoc') : t('userManagement.registerPatient')}
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
          <div className="flex items-center justify-between w-full gap-4">
            <div className="relative w-72">
               <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={`${t('userManagement.search')} ${activeTab === 'doctors' ? t('userManagement.doctorsTab') : t('userManagement.patientsTab')}`}
                 className="w-full ps-9 pe-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
               />
            </div>

            {activeTab === 'doctors' && (
              <div className="relative">
                <Filter className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select 
                  value={filterSpec}
                  onChange={(e) => setFilterSpec(e.target.value)}
                  className="ps-9 pe-8 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-bold text-slate-600 appearance-none cursor-pointer"
                >
                  {uniqueSpecializations.map(spec => (
                    <option key={spec} value={spec}>{spec === 'All' ? t('common.all', { defaultValue: 'All' }) : spec}</option>
                  ))}
                </select>
              </div>
            )}
         </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-visible mb-12">
         <table className="w-full text-start border-collapse">
            <thead>
               <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                  <th className="p-4 ps-6">{t('userManagement.thName')}</th>
                  <th className="p-4">{activeTab === 'doctors' ? t('userManagement.thSpecialization') : t('userManagement.thDob')}</th>
                  <th className="p-4 text-center">{t('userManagement.thStatus')}</th>
                  <th className="p-4 text-center">{activeTab === 'doctors' ? t('userManagement.thExperience') : t('userManagement.thVisits')}</th>
                  <th className="p-4 text-end pe-6">{t('userManagement.thActions')}</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                 <tr>
                   <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                     <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                     {t('userManagement.loadingUser', { type: activeTab })}
                   </td>
                 </tr>
               ) : filteredItems.map((user) => (
                  <tr key={user.id || user.user_id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="p-4 ps-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                             {(user.name_en || user.name || 'U').charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-800">{user.name_en || user.name}</p>
                              <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="p-4 text-sm font-medium text-slate-700">
                         {activeTab === 'doctors' ? user.specialization : (user.date_of_birth || user.dob || '---')}
                     </td>
                     <td className="p-4 text-center">
                        <span className={cn(
                           "px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1",
                           (user.status === 'Active' || activeTab === 'doctors') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        )}>
                           {(user.status === 'Active' || activeTab === 'doctors') && <CheckCircle2 className="w-3 h-3" />}
                           {activeTab === 'doctors' ? t('userManagement.active') : t('userManagement.' + (user.status || 'active').toLowerCase().replace(' ', ''))}
                        </span>
                     </td>
                     <td className="p-4 text-center text-sm font-bold text-slate-700">
                        {activeTab === 'doctors' ? `${user.experience_years} ${t('userManagement.years')}` : '0'}
                     </td>
                     <td className="p-4 text-end pe-6 relative">
                         <button 
                           onClick={() => {
                             const uid = user.id || user.user_id;
                             setOpenMenuId(openMenuId === uid ? null : uid);
                           }}
                          className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                           <MoreVertical className="w-5 h-5" />
                        </button>
                        
                         {openMenuId && (openMenuId === (user.id || user.user_id)) && (
                          <div className="absolute right-6 top-12 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-100 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
                            {activeTab === 'patients' ? (
                              <button 
                                onClick={() => navigate(`/admin/patients/${user.user_id || user.id}`)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <User className="w-3.5 h-3.5" /> {t('userManagement.viewProfile')}
                              </button>
                            ) : (
                              <button 
                                onClick={() => navigate(`/admin/doctors/edit/${user.user_id || user.id}`)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" /> {t('userManagement.editDoctor')}
                              </button>
                            )}
                            
                            <button 
                              onClick={() => { handleDeleteItem(user.user_id || user.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> {t('userManagement.delete')}
                            </button>
                          </div>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-extrabold text-slate-800">
                 {t('userManagement.registerModalTitle', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') })}
               </h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                 <AlertCircle className="w-6 h-6 rotate-45" />
               </button>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thName')} (English)</label>
                   <input type="text" value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.nameEnPlaceholder')} required />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thName')} (Arabic)</label>
                   <input type="text" value={formData.name_ar} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-right" placeholder={t('userManagement.nameArPlaceholder')} required />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thEmail')}</label>
                   <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.emailPlaceholder')} required />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thPassword')}</label>
                   <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" required />
                 </div>
               </div>

               {activeTab === 'doctors' ? (
                 <>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thSpecialization')}</label>
                       <input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.specializationPlaceholder')} required />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thExperience')}</label>
                       <input type="number" value={formData.experience_years} onChange={(e) => setFormData({...formData, experience_years: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.experiencePlaceholder')} required />
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thBio')}</label>
                     <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold h-24" placeholder={t('userManagement.bioPlaceholder')} required />
                   </div>
                 </>
               ) : (
                 <>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.phoneNumber')}</label>
                       <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" placeholder={t('userManagement.phonePlaceholder')} required />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('userManagement.thDob')}</label>
                       <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" required />
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{t('patientInfo.gender')}</label>
                     <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold">
                       <option value="Male">{t('userManagement.genderMale')}</option>
                       <option value="Female">{t('userManagement.genderFemale')}</option>
                     </select>
                   </div>
                 </>
               )}

               <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> {t('userManagement.creatingUser', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') })}
                    </>
                  ) : (
                    t('userManagement.createUserBtn', { type: activeTab === 'doctors' ? t('userManagement.doctorSingular') : t('userManagement.patientSingular') })
                  )}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
