import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Download, UploadCloud, File, Trash2, ShieldCheck, Filter, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { 
  fetchMyReports, 
  uploadReport, 
  deleteMyReport, 
  selectMyReports, 
  selectPatientsLoading 
} from '../store/slices/patientSlice';
import { BASE_URL } from '../api/endpoints';

export default function MedicalRecords() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const reports = useSelector(selectMyReports);
  const loading = useSelector(selectPatientsLoading);

  useEffect(() => {
    dispatch(fetchMyReports());
  }, [dispatch]);

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      toast.loading('Uploading document...', { id: 'upload-doc' });
      await dispatch(uploadReport(formData)).unwrap();
      toast.success('Document uploaded successfully', { id: 'upload-doc' });
      e.target.value = ''; // Reset input
    } catch (err) {
      toast.error(err?.message || 'Failed to upload document', { id: 'upload-doc' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await dispatch(deleteMyReport(id)).unwrap();
      toast.success('Record deleted successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete record');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFullUrl = (path) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    const origin = BASE_URL.split('/backend/api')[0];
    return `${origin}${path}`;
  };

  const getFileIcon = (type = '', url = '') => {
    if (type.includes('pdf') || url.toLowerCase().endsWith('.pdf')) return <FileText className="w-6 h-6 stroke-[1.5]" />;
    if (type.includes('image') || url.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)) return <File className="w-6 h-6 stroke-[1.5]" />;
    return <FileText className="w-6 h-6 stroke-[1.5]" />;
  };

  const getFileTheme = (type = '', url = '') => {
    if (type.includes('pdf') || url.toLowerCase().endsWith('.pdf')) return 'bg-red-50 text-red-600 border-red-100';
    if (type.includes('image') || url.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)) return 'bg-blue-50 text-blue-600 border-blue-100';
    return 'bg-primary-50 text-primary-600 border-primary-100/50';
  };

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
            <div 
              onClick={handleFileClick}
              className="bg-primary-50/50 rounded-3xl p-6 border-2 border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-center cursor-pointer group flex flex-col items-center justify-center min-h-[240px]"
            >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileUpload} 
                 className="hidden" 
                 accept=".pdf,.jpg,.jpeg,.png"
               />
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform text-primary-600 border border-primary-100/50">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <UploadCloud className="w-8 h-8" />}
               </div>
               <h3 className="font-extrabold text-slate-900 mb-1 text-[15px]">{t('medicalRecords.uploadDocument', { defaultValue: 'Upload Document' })}</h3>
               <p className="text-xs font-medium text-slate-500 mb-6">Drag & drop or browse</p>
               <div className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl shadow-sm text-[13px] group-hover:border-primary-300 transition-colors">
                  Select File
               </div>
               <div className="mt-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">PDF, JPG, PNG (Max 10MB)</div>
            </div>


         </div>

         {/* File List Section */}
         <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px]">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">{t('medicalRecords.yourFiles', { defaultValue: 'Your Files' })}</h3>
                  <button className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2">
                     <Filter className="w-4 h-4" /> {t('medicalRecords.sortByDate', { defaultValue: 'Sort by Date' })}
                  </button>
               </div>

               <div className="space-y-4">
                  {loading && reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                      <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-4" />
                      <p className="text-sm font-bold text-slate-500">Loading your medical records...</p>
                    </div>
                  ) : reports && reports.length > 0 ? (
                     reports.map((report) => (
                        <div key={report.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 hover:border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors gap-4 group">
                           <div className="flex items-center gap-4 min-w-0 flex-1">
                              <div className={`p-3 rounded-xl shrink-0 border ${getFileTheme(report.file_type || '', report.file_url)}`}>
                                 {getFileIcon(report.file_type || '', report.file_url)}
                              </div>
                              <div className="min-w-0 flex-1">
                                 <div className="font-bold text-[15px] text-slate-900 mb-0.5 truncate pe-4">
                                    {report.file_name || report.file_url?.split('/').pop() || 'Untitled Document'}
                                 </div>
                                 <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                    <span>{formatDate(report.created_at || new Date())}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-[10px] font-extrabold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-widest">
                                       {report.type || (report.file_type?.includes('pdf') ? 'Lab Result' : 'Imaging')}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span>{report.file_size ? (report.file_size / 1024 / 1024).toFixed(1) : '1.2'} MB</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-2 shrink-0">
                              <a 
                                href={getFullUrl(report.file_url)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white border text-primary-600 border-slate-200 p-2 rounded-xl hover:text-primary-800 hover:border-primary-200 transition-colors shadow-sm"
                              >
                                 <Download className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleDelete(report.id)}
                                className="bg-white border text-slate-400 border-slate-200 p-2 rounded-xl hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     ))
                  ) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                      <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-500">No medical records found</p>
                      <button onClick={handleFileClick} className="text-primary-600 font-extrabold text-sm mt-2 hover:underline">Upload your first document</button>
                    </div>
                  )}
               </div>
               
               {reports.length > 10 && (
                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                   <button className="text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors">{t('medicalRecords.loadOlder', { defaultValue: 'Load Older Files' })}</button>
                </div>
               )}
            </div>
         </div>

      </div>
    </div>
  )
}
