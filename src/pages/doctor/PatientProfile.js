import React from 'react';
import { Pencil, Play, UploadCloud, FileText, Image as ImageIcon, Activity, ChevronRight, FilePlus, Stethoscope, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PatientProfile() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 pb-20 font-sans max-w-7xl mx-auto">
      
      <div className="flex flex-col xl:flex-row gap-8 items-start">
         
         {/* Left Main Content */}
         <div className="w-full xl:flex-1 space-y-8">
            
            {/* Patient Header Card */}
            <div className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] relative overflow-hidden">
               <div className="absolute top-0 end-0 w-32 h-32 bg-blue-50 rounded-bs-full pointer-events-none opacity-50"></div>
               
               <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                  <img src="https://ui-avatars.com/api/?name=Eleanor+Fitzroy&size=180&background=0550c7&color=ffffff" alt="Avatar" className="w-32 h-32 rounded-3xl object-cover shadow-sm border-4 border-slate-50 shrink-0" />
                  
                  <div className="flex-1">
                     <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Eleanor Fitzroy</h1>
                        <span className="bg-[#a5b4fc] text-[#1e3a8a] px-3 py-1 rounded w-max text-[11px] font-extrabold uppercase tracking-widest shadow-sm">ID: #8829-X</span>
                     </div>
                     <p className="text-[17px] font-medium text-slate-600 mb-6 drop-shadow-sm">
                        <span className="font-bold">72 years</span> • Female • <span className="font-bold text-slate-800 border-b border-primary-200">Type 2 Diabetes</span>
                     </p>
                     
                     <div className="flex flex-wrap justify-between items-end gap-6 mt-4 pt-6 border-t border-slate-100">
                        <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100/50">
                           <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Last Visit</div>
                           <div className="text-[16px] font-extrabold text-slate-900 tracking-tight">Oct 12, 2023</div>
                        </div>

                        <div className="flex gap-3 mt-4 md:mt-0">
                           <button className="bg-slate-100 hover:bg-slate-200 text-[#0550c7] font-bold text-[14px] px-6 py-3.5 rounded-xl transition-all shadow-sm">
                              {t('doctorPatientProfile.editProfile', { defaultValue: 'Edit Profile' })}
                           </button>
                           <button className="bg-[#0550c7] hover:bg-blue-800 text-white font-bold text-[14px] px-8 py-3.5 rounded-xl shadow-md shadow-[#0550c7]/20 transition-all hover:-translate-y-0.5">
                              {t('doctorPatientProfile.startNewSession', { defaultValue: 'Start New Session' })}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Clinical Reports Table */}
            <div>
               <div className="flex justify-between items-end mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('doctorPatientProfile.reportsTitle', { defaultValue: 'Clinical Reports & Attachments' })}</h3>
                  <button className="flex items-center gap-2 text-[13px] font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 px-4 py-2 rounded-xl">
                     <UploadCloud className="w-4 h-4" /> {t('doctorPatientProfile.uploadNew', { defaultValue: 'Upload New' })}
                  </button>
               </div>

               <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden">
                  <table className="w-full text-start border-collapse min-w-[700px]">
                     <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                           <th className="px-8 py-5 w-[350px]">Document Name</th>
                           <th className="px-4 py-5 w-[150px]">Upload Date</th>
                           <th className="px-4 py-5 w-[100px]">Type</th>
                           <th className="px-4 py-5 text-center w-[150px]">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-sm">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0"><FileText className="w-5 h-5" /></div>
                                 <span className="font-bold text-[14px] text-slate-800 tracking-tight">Comprehensive_Metabolic_Panel.pdf</span>
                              </div>
                           </td>
                           <td className="px-4 py-6">
                              <div className="font-bold text-[13px] text-slate-700 leading-tight">Aug 05, 2023</div>
                           </td>
                           <td className="px-4 py-6">
                              <span className="bg-slate-100 text-slate-500 font-extrabold text-[9px] px-2.5 py-1 rounded uppercase tracking-widest">PDF</span>
                           </td>
                           <td className="px-4 py-6 text-center">
                              <button className="text-[13px] font-bold text-primary-600 hover:text-primary-800 transition-colors flex items-center justify-center gap-1.5 w-full">
                                 View/Download
                              </button>
                           </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0"><ImageIcon className="w-5 h-5" /></div>
                                 <span className="font-bold text-[14px] text-slate-800 tracking-tight">Chest_XRay_Posteroanterior.jpg</span>
                              </div>
                           </td>
                           <td className="px-4 py-6">
                              <div className="font-bold text-[13px] text-slate-700 leading-tight">Jun 12, 2023</div>
                           </td>
                           <td className="px-4 py-6">
                              <span className="bg-slate-100 text-slate-500 font-extrabold text-[9px] px-2.5 py-1 rounded uppercase tracking-widest">IMAGE</span>
                           </td>
                           <td className="px-4 py-6 text-center">
                              <button className="text-[13px] font-bold text-primary-600 hover:text-primary-800 transition-colors flex items-center justify-center gap-1.5 w-full">
                                 View/Download
                              </button>
                           </td>
                        </tr>

                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0"><Activity className="w-5 h-5" /></div>
                                 <span className="font-bold text-[14px] text-slate-800 tracking-tight">Lumbar_MRI_Scan_Series.zip</span>
                              </div>
                           </td>
                           <td className="px-4 py-6">
                              <div className="font-bold text-[13px] text-slate-700 leading-tight">Mar 20, 2023</div>
                           </td>
                           <td className="px-4 py-6">
                              <span className="bg-slate-100 text-slate-500 font-extrabold text-[9px] px-2.5 py-1 rounded uppercase tracking-widest">DICOM</span>
                           </td>
                           <td className="px-4 py-6 text-center">
                              <button className="text-[13px] font-bold text-primary-600 hover:text-primary-800 transition-colors flex items-center justify-center gap-1.5 w-full">
                                 View/Download
                              </button>
                           </td>
                        </tr>
                     </tbody>
                  </table>
                  <button className="w-full bg-slate-50 hover:bg-slate-100 transition-colors text-[11px] font-extrabold text-slate-500 uppercase tracking-widest py-5 border-t border-slate-100">
                     Show All Documents (12)
                  </button>
               </div>
            </div>
         </div>

         {/* Right Sidebar Layout */}
         <div className="w-full xl:w-[340px] shrink-0 space-y-8 mt-4 xl:mt-0">
            
            <div>
               <h3 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 ms-1">{t('doctorPatientProfile.quickActions', { defaultValue: 'Quick Actions' })}</h3>
               
               <div className="space-y-4">
                  <button className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FilePlus className="w-5 h-5" /></div>
                        <span className="font-extrabold text-[15px] text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors text-start max-w-[150px]">{t('doctorPatientProfile.newPrescription', { defaultValue: 'New Prescription' })}</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </button>

                  <button className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Stethoscope className="w-5 h-5" /></div>
                        <span className="font-extrabold text-[15px] text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors text-start max-w-[150px]">{t('doctorPatientProfile.orderLabWork', { defaultValue: 'Order Lab Work' })}</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </button>

                  <button className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><LinkIcon className="w-5 h-5" /></div>
                        <span className="font-extrabold text-[15px] text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors text-start max-w-[150px]">{t('doctorPatientProfile.referralLetter', { defaultValue: 'Referral Letter' })}</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </button>
               </div>
            </div>

            <div className="bg-[#1e40af] rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-900/20">
               <div className="absolute -end-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
               <div className="absolute end-0 bottom-4 opacity-10">
                  <Activity className="w-32 h-32 text-white" strokeWidth={1.5} />
               </div>

               <div className="relative z-10">
                  <div className="text-[10px] font-extrabold text-blue-200 uppercase tracking-widest mb-4">Vitals Summary</div>
                  <div className="text-5xl font-extrabold tracking-tight flex items-baseline gap-1 mb-2">96.8 <span className="text-xl">°F</span></div>
                  <div className="text-xs font-semibold text-blue-200 opacity-90">Last measured: 2h ago</div>
               </div>
            </div>

         </div>

      </div>

    </div>
  )
}
