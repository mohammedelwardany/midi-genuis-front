import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Stethoscope, 
  Mail, 
  Award, 
  History, 
  ChevronLeft, 
  Edit3,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { fetchDoctorById, selectSelectedDoctor, selectDoctorsLoading } from '../../store/slices/doctorSlice';
import { selectCurrentUser, selectUserRole } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { i18n } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const doctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectDoctorsLoading);

  useEffect(() => {
    if (id) {
      // If viewed profile is the logged-in doctor, redirect to settings
      const currentId = currentUser?.user_id || currentUser?.id;
      if (currentId && parseInt(id) === parseInt(currentId)) {
        navigate('/doctor/settings');
        return;
      }
      dispatch(fetchDoctorById(id));
    }
  }, [id, currentUser, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
        <p className="text-xl font-bold">Doctor not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 font-bold flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 font-sans max-w-5xl mx-auto text-start">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to List
      </button>

      <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-full opacity-40 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
          <div className="relative shrink-0">
            <img 
              src={`https://ui-avatars.com/api/?name=${i18n.language.startsWith('ar') ? (doctor.name_ar || doctor.name_en) : doctor.name_en}&size=200&background=0550c7&color=ffffff`} 
              alt={doctor.name_en} 
              className="w-44 h-44 rounded-[40px] object-cover shadow-xl border-4 border-white" 
            />
            <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {i18n.language.startsWith('ar') ? (doctor.name_ar || doctor.name_en) : doctor.name_en}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-widest">{doctor.specialization}</span>
                  <span className="text-slate-400 text-sm font-bold flex items-center gap-1.5">
                    <History className="w-4 h-4" /> {doctor.experience_years} Years Experience
                  </span>
                </div>
              </div>

              {userRole === 'admin' && (
                <button 
                  onClick={() => navigate(`/admin/doctors/edit/${doctor.id}`)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary-500" /> Biography
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {doctor.bio || 'No biography provided.'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-500" /> Contact Information
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700">{doctor.email}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Primary Clinical Email</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary-500" /> Clinical Registry
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-lg font-extrabold text-slate-800">1.2k</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patients</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-lg font-extrabold text-slate-800">{doctor.rating_avg || '0.0'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
