import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  FileText, Image as ImageIcon, 
  Activity, Loader2 
} from 'lucide-react';
import {
  fetchPatientById,
  fetchPatientReports,
  selectSelectedPatient,
  selectMyReports,
  selectPatientsLoading
} from '../../store/slices/patientSlice';

export default function PatientProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const patient = useSelector(selectSelectedPatient);
  const reports = useSelector(selectMyReports);
  const loading = useSelector(selectPatientsLoading);

  const isRtl = i18n.language.startsWith('ar');

  useEffect(() => {
    dispatch(fetchPatientById(id));
    dispatch(fetchPatientReports(id));
  }, [dispatch, id]);

  const getFullUrl = (path) => {
    if (!path) return '#';
    const origin = window.location.origin.includes('localhost') ? 'http://localhost:4000' : '';
    return `${origin}${path}`;
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading && !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#0550c7] animate-spin mb-4" />
        <p className="text-slate-500 font-bold">{isRtl ? 'جاري تحميل ملف المريض...' : 'Loading patient profile...'}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 min-h-[400px]">
        <p className="text-slate-500 font-bold">{isRtl ? 'لم يتم العثور على المريض' : 'Patient not found'}</p>
      </div>
    );
  }

  const patientName = isRtl ? (patient.name_ar || patient.name) : (patient.name_en || patient.name || 'Patient');
  const age = calculateAge(patient.date_of_birth || patient.dob);
  const ageString = age !== null ? `${age} ${isRtl ? 'سنة' : 'years'}` : '';
  const genderLabel = patient.gender === 'Female'
    ? (isRtl ? 'أنثى' : 'Female')
    : (isRtl ? 'ذكر' : 'Male');

  const getConditions = () => {
    if (Array.isArray(patient.chronic_conditions)) return patient.chronic_conditions;
    if (typeof patient.chronic_conditions === 'string') {
      return patient.chronic_conditions.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (patient.chronic_condition) return [patient.chronic_condition];
    return [];
  };

  const conditions = getConditions();

  const formattedDob = patient.date_of_birth || patient.dob
    ? new Date(patient.date_of_birth || patient.dob).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const formattedCreatedAt = patient.created_at
    ? new Date(patient.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="animate-in fade-in duration-500 pb-20 font-sans max-w-7xl mx-auto">

      <div className="w-full space-y-8">
         
         {/* Patient Header Card */}
         <div className="bg-white rounded-[24px] p-8 md:p-10 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 end-0 w-32 h-32 bg-blue-50 rounded-bs-full pointer-events-none opacity-50"></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
               <img 
                 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&size=180&background=0550c7&color=ffffff`} 
                 alt="Avatar" 
                 className="w-32 h-32 rounded-3xl object-cover shadow-sm border-4 border-slate-50 shrink-0" 
               />
               
               <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                     <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{patientName}</h1>
                     <span className="bg-[#a5b4fc] text-[#1e3a8a] px-3 py-1 rounded w-max text-[11px] font-extrabold uppercase tracking-widest shadow-sm">ID: #{patient.user_id || patient.id}</span>
                  </div>
                  
                  <p className="text-[17px] font-medium text-slate-600 mb-2 drop-shadow-sm">
                     {ageString && <><span className="font-bold">{ageString}</span> • </>}
                     {genderLabel}
                     {conditions.length > 0 && (
                       <>
                          {" "}•{" "}
                          <span className="font-bold text-slate-800 border-b border-primary-200">
                             {conditions.join(', ')}
                          </span>
                       </>
                     )}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100 text-sm">
                     <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</div>
                        <div className="text-[14px] font-bold text-slate-800">{patient.email || 'N/A'}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</div>
                        <div className="text-[14px] font-bold text-slate-800">{patient.phone || 'N/A'}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'تاريخ الميلاد' : 'Date of Birth'}</div>
                        <div className="text-[14px] font-bold text-slate-800">{formattedDob}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'الجنس' : 'Gender'}</div>
                        <div className="text-[14px] font-bold text-slate-800">{genderLabel}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'عضو منذ' : 'Member Since'}</div>
                        <div className="text-[14px] font-bold text-slate-800">{formattedCreatedAt}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{isRtl ? 'التأمين الصحي' : 'Health Insurance'}</div>
                        <div className="text-[14px] font-bold text-slate-800">
                           {patient.insurance_provider ? `${patient.insurance_provider} (${patient.policy_number})` : (isRtl ? 'لا يوجد تغطية تأمينية' : 'Self-Pay (No Insurance)')}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Clinical Reports Table */}
         <div>
            <div className="flex justify-between items-end mb-6">
               <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('doctorPatientProfile.reportsTitle', { defaultValue: 'Clinical Reports & Attachments' })}</h3>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden">
               <table className="w-full text-start border-collapse min-w-[700px]">
                  <thead>
                     <tr className="bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5 w-[350px]">{t('doctorPatientProfile.table.docName', { defaultValue: 'Document Name' })}</th>
                        <th className="px-4 py-5 w-[150px]">{t('doctorPatientProfile.table.uploadDate', { defaultValue: 'Upload Date' })}</th>
                        <th className="px-4 py-5 w-[100px]">{t('doctorPatientProfile.table.type', { defaultValue: 'Type' })}</th>
                        <th className="px-4 py-5 text-center w-[150px]">{t('doctorPatientProfile.table.action', { defaultValue: 'Action' })}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                     {reports?.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold text-sm">
                              {t('doctorPatientProfile.noReports', { defaultValue: 'No medical records found' })}
                           </td>
                        </tr>
                     ) : (
                        reports?.map((report) => {
                          const isPdf = report.file_name?.toLowerCase().endsWith('.pdf') || report.file_url?.toLowerCase().endsWith('.pdf');
                          const isImage = report.file_name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) || report.file_url?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
                          
                          let Icon = FileText;
                          let bgClass = 'bg-red-50 text-red-600';
                          let typeLabel = 'PDF';
                          
                          if (isImage) {
                            Icon = ImageIcon;
                            bgClass = 'bg-blue-50 text-blue-600';
                            typeLabel = 'IMAGE';
                          } else if (!isPdf) {
                            Icon = Activity;
                            bgClass = 'bg-purple-50 text-purple-600';
                            typeLabel = 'RECORD';
                          }

                          return (
                             <tr key={report.id || report.report_id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className={`p-2.5 rounded-xl shrink-0 ${bgClass}`}><Icon className="w-5 h-5" /></div>
                                      <span className="font-bold text-[14px] text-slate-800 tracking-tight truncate max-w-[250px]">
                                         {report.file_name || report.file_url.split('/').pop()}
                                      </span>
                                   </div>
                                </td>
                                <td className="px-4 py-6">
                                   <div className="font-bold text-[13px] text-slate-700 leading-tight">
                                      {new Date(report.created_at).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}
                                   </div>
                                </td>
                                <td className="px-4 py-6">
                                   <span className="bg-slate-100 text-slate-500 font-extrabold text-[9px] px-2.5 py-1 rounded uppercase tracking-widest">{typeLabel}</span>
                                </td>
                                <td className="px-4 py-6 text-center">
                                   <a
                                      href={getFullUrl(report.file_url)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[13px] font-bold text-primary-600 hover:text-primary-800 transition-colors flex items-center justify-center gap-1.5 w-full"
                                   >
                                      {t('doctorPatientProfile.viewDownload', { defaultValue: 'View/Download' })}
                                   </a>
                                </td>
                             </tr>
                          );
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
