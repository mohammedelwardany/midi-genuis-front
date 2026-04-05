import React from 'react';
import { FileText, Download, UploadCloud, File, Trash2, ShieldCheck, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MedicalRecords() {
  const { t } = useTranslation();
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
         <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('medicalRecords.title', { defaultValue: 'Medical Records' })}</h2>
            <p className="text-[15px] font-medium text-slate-500 max-w-2xl leading-relaxed">
               {t('medicalRecords.description', { defaultValue: 'Securely manage your clinical documents, lab results, and external records. All files are encrypted and visible only to authorized medical staff.' })}
            </p>
         </div>
         <div className="flex gap-2">
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100/50">
               <ShieldCheck className="w-3.5 h-3.5" /> {t('medicalRecords.hipaaCompliant', { defaultValue: 'HIPAA Compliant' })}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         
         {/* Upload Section */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary-50/50 rounded-3xl p-6 border-2 border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-center cursor-pointer group flex flex-col items-center justify-center min-h-[240px]">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-primary-600 border border-primary-100/50">
                  <UploadCloud className="w-8 h-8" />
               </div>
               <h3 className="font-extrabold text-slate-900 mb-1 text-[15px]">{t('medicalRecords.uploadDocument', { defaultValue: 'Upload Document' })}</h3>
               <p className="text-xs font-medium text-slate-500 mb-6">Drag & drop or browse</p>
               <button className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl shadow-sm text-[13px] group-hover:border-primary-300 transition-colors pointer-events-none">
                  Select File
               </button>
               <div className="mt-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">PDF, JPG, PNG (Max 10MB)</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
               <h4 className="font-bold text-slate-900 text-[13px] mb-4">{t('medicalRecords.filterRecords', { defaultValue: 'Filter Records' })}</h4>
               <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent">
                     <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Lab Results</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent">
                     <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Imaging & X-Rays</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent">
                     <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">Visit Summaries</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent">
                     <input type="checkbox" defaultChecked className="rounded text-primary-600 w-4 h-4 border-slate-300" />
                     <span className="text-sm font-medium text-slate-700">External Uploads</span>
                  </label>
               </div>
            </div>
         </div>

         {/* File List Section */}
         <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-full">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">{t('medicalRecords.yourFiles', { defaultValue: 'Your Files' })}</h3>
                  <button className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2">
                     <Filter className="w-4 h-4" /> {t('medicalRecords.sortByDate', { defaultValue: 'Sort by Date' })}
                  </button>
               </div>

               <div className="space-y-4">
                  {/* Row 1 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors gap-4 group">
                     <div className="flex items-center gap-4 min-w-0">
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl shrink-0 border border-red-100"><FileText className="w-6 h-6 stroke-[1.5]" /></div>
                        <div className="min-w-0">
                           <div className="font-bold text-[15px] text-slate-900 mb-0.5 truncate pe-4">Comprehensive Metabolic Panel</div>
                           <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                              <span>Oct 12, 2023</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[10px] font-extrabold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-widest">Lab Result</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>1.2 MB .PDF</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2 shrink-0">
                        <button className="bg-white border text-primary-600 border-slate-200 p-2 rounded-xl hover:text-primary-800 hover:border-primary-200 transition-colors shadow-sm"><Download className="w-4 h-4" /></button>
                     </div>
                  </div>

                  {/* Row 2 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors gap-4 group">
                     <div className="flex items-center gap-4 min-w-0">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0 border border-blue-100"><File className="w-6 h-6 stroke-[1.5]" /></div>
                        <div className="min-w-0">
                           <div className="font-bold text-[15px] text-slate-900 mb-0.5 truncate pe-4">Chest X-Ray Digital Copy</div>
                           <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                              <span>Sep 28, 2023</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[10px] font-extrabold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-widest">Imaging</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>4.5 MB .JPG</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2 shrink-0">
                        <button className="bg-white border text-primary-600 border-slate-200 p-2 rounded-xl hover:text-primary-800 hover:border-primary-200 transition-colors shadow-sm"><Download className="w-4 h-4" /></button>
                     </div>
                  </div>

                  {/* Row 3 (User Upload) */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors gap-4 group">
                     <div className="flex items-center gap-4 min-w-0">
                        <div className="bg-primary-50 text-primary-600 p-3 rounded-xl shrink-0 border border-primary-100/50"><UploadCloud className="w-6 h-6 stroke-[1.5]" /></div>
                        <div className="min-w-0">
                           <div className="font-bold text-[15px] text-slate-900 mb-0.5 truncate pe-4">Past Surgical History Form</div>
                           <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                              <span>Aug 04, 2023</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[10px] font-extrabold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded uppercase tracking-widest">Uploaded</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>0.8 MB .PDF</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2 shrink-0">
                        <button className="bg-white border text-primary-600 border-slate-200 p-2 rounded-xl hover:text-primary-800 hover:border-primary-200 transition-colors shadow-sm"><Download className="w-4 h-4" /></button>
                        <button className="bg-white border text-slate-400 border-slate-200 p-2 rounded-xl hover:text-red-600 hover:border-red-200 transition-colors shadow-sm group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>

               </div>
               
               <div className="mt-8 text-center pt-6 border-t border-slate-50">
                  <button className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors">{t('medicalRecords.loadOlder', { defaultValue: 'Load Older Files' })}</button>
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}
