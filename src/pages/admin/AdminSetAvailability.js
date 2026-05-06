import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Settings, Plus, LayoutGrid, List as ListIcon, Clock, MapPin, Calendar, Loader2, ArrowLeft, ArrowRight, UserCircle, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchUpcomingAvailability, 
  addAvailability, 
  fetchDoctorById,
  selectDoctorSchedule, 
  selectDoctorsLoading,
  selectSelectedDoctor
} from '../../store/slices/doctorSlice';

export default function AdminSetAvailability() {
  const { id: doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  
  const schedule = useSelector(selectDoctorSchedule);
  const loading = useSelector(selectDoctorsLoading);
  const selectedDoctor = useSelector(selectSelectedDoctor);
  
  const [view, setView] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [newSlot, setNewSlot] = useState({
    available_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '11:00'
  });

  const getTimeInMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const GRID_START = 8 * 60;
  const GRID_END = 18 * 60;
  const GRID_TOTAL = GRID_END - GRID_START;

  const getSlotStyle = (start, end) => {
    const startMin = getTimeInMinutes(start);
    const endMin = getTimeInMinutes(end);
    const top = ((startMin - GRID_START) / GRID_TOTAL) * 100;
    const height = ((endMin - startMin) / GRID_TOTAL) * 100;
    return {
      top: `${Math.max(0, top)}%`,
      height: `${Math.min(100 - top, height)}%`
    };
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const getWeekDays = (start) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const navigateWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newStart);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const groupedSchedule = (schedule || []).reduce((acc, slot) => {
    const dateStr = formatDate(slot.available_date);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {});

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorById(doctorId));
      dispatch(fetchUpcomingAvailability(doctorId));
    }
  }, [dispatch, doctorId]);

  const handleAddSlot = async (e) => {
    if (e) e.preventDefault();
    try {
      await dispatch(addAvailability({
        doctor_id: doctorId,
        available_date: newSlot.available_date,
        start_time: newSlot.start_time,
        end_time: newSlot.end_time
      })).unwrap();

      toast.success(t('doctorSchedule.slotAdded', { defaultValue: 'Availability block added successfully' }));
      setShowAddModal(false);
      dispatch(fetchUpcomingAvailability(doctorId));
    } catch (err) {
      toast.error(err?.message || 'Failed to add availability');
    }
  };

    const doctorName = i18n.language.startsWith('ar') ? (selectedDoctor?.name_ar || selectedDoctor?.name) : (selectedDoctor?.name_en || selectedDoctor?.name);
  
    return (
      <div className="animate-in fade-in duration-500 pb-20 relative font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 border border-primary-100">
               <UserCircle className="w-10 h-10" />
            </div>
            <div>
               <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> {t('admin.manageAvailability', { defaultValue: 'Manage Clinician Availability' })}
               </div>
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                 {doctorName || t('doctorSchedule.loading')}
               </h2>
               <p className="text-sm font-medium text-slate-500 mt-1">
                 {selectedDoctor?.specialization || t('doctorSchedule.medicalSpecialist')}
               </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="flex bg-slate-100 p-1.5 rounded-[16px] shadow-sm">
                <button 
                  onClick={() => setView('grid')}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-[12px] transition-all ${view === 'grid' ? 'bg-white text-primary-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)]' : 'text-slate-500 hover:text-slate-800'}`}>
                  <LayoutGrid className="w-4 h-4" /> {t('doctorSchedule.weeklyGrid')}
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-[12px] transition-all ${view === 'list' ? 'bg-white text-primary-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)]' : 'text-slate-500 hover:text-slate-800'}`}>
                  <ListIcon className="w-4 h-4" /> {t('doctorSchedule.listView')}
                </button>
             </div>
             
             <button onClick={() => setShowAddModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-[16px] font-bold shadow-lg shadow-primary-600/20 transition-all flex items-center gap-2 text-[15px]">
                <Plus className="w-4 h-4" /> {t('doctorSchedule.addAvailability')}
             </button>
          </div>
        </div>
  
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] min-h-[600px] overflow-hidden">
           {view === 'grid' ? (
               <div className="p-4">
                 <div className="min-w-[800px]">
                    <div className="flex items-center justify-between mb-8 px-2">
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                             <button onClick={() => navigateWeek(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-colors">
                                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                             </button>
                             <button onClick={() => navigateWeek(1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-colors">
                                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                             </button>
                          </div>
                          <div>
                             <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                {currentWeekStart.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
                             </h3>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {currentWeekStart.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })} - {new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6)).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                             </div>
                          </div>
                       </div>
                    </div>
  
                    <div className="grid grid-cols-8 border-b border-slate-100 pb-6 mb-4">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 ps-4">{t('doctorSchedule.time')}</div>
                       {getWeekDays(currentWeekStart).map((date, i) => (
                          <div key={i} className="text-center group">
                             <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${formatDate(new Date()) === formatDate(date) ? 'text-primary-600' : 'text-slate-400'}`}>
                                {date.toLocaleDateString(i18n.language, { weekday: 'short' })}
                             </div>
                             <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-xl font-black text-lg ${formatDate(new Date()) === formatDate(date) ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-800'}`}>
                                {date.getDate()}
                             </div>
                          </div>
                       ))}
                    </div>
  
                    <div className="relative h-[600px] grid grid-cols-8 px-4 divide-x divide-slate-50/50">
                       <div className="flex flex-col justify-between pe-4 pb-4">
                          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
                             <div key={time} className="text-[11px] font-bold text-slate-400 h-16">{time}</div>
                          ))}
                       </div>
                       {getWeekDays(currentWeekStart).map((date, idx) => (
                          <div key={idx} className="relative h-full flex flex-col border-l border-slate-100/50">
                             {[...Array(10)].map((_, i) => <div key={i} className="flex-1 border-t border-slate-100/50"></div>)}
                             {(groupedSchedule[formatDate(date)] || []).map((slot, i) => (
                                <div key={i} style={getSlotStyle(slot.start_time, slot.end_time)} className="absolute start-1 end-1 bg-blue-50/90 border-s-4 border-s-blue-500 rounded-xl shadow-sm px-3 hover:bg-blue-100 transition-all cursor-pointer overflow-hidden flex flex-col justify-center">
                                   <div className="text-[10px] font-black text-blue-700 leading-none mb-1">{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</div>
                                   <div className="text-[9px] font-bold text-blue-400 leading-none truncate">{t('doctorSchedule.available')}</div>
                                </div>
                             ))}
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
           ) : (
              <div className="p-8">
                 <div className="grid grid-cols-12 mb-6 border-b border-slate-100 pb-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ps-4">
                    <div className="col-span-3">{t('doctorSchedule.day')}</div>
                    <div className="col-span-4">{t('doctorSchedule.clinicalHours')}</div>
                    <div className="col-span-3">{t('doctorSchedule.status')}</div>
                    <div className="col-span-2 text-end">{t('doctorSchedule.action')}</div>
                 </div>
                 <div className="space-y-[18px]">
                    {schedule.length > 0 ? schedule.map((item) => (
                       <div key={item.id} className="grid grid-cols-12 items-center bg-white border border-slate-100 p-4 rounded-[16px] shadow-sm">
                          <div className="col-span-3 flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-extrabold">{new Date(item.available_date).toLocaleDateString(i18n.language, { weekday: 'narrow' })}</div>
                             <div>
                                <div className="font-extrabold text-slate-900">{new Date(item.available_date).toLocaleDateString(i18n.language, { weekday: 'long' })}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(item.available_date)}</div>
                             </div>
                          </div>
                        <div className="col-span-4 font-bold text-primary-700 flex items-center gap-2"><Clock className="w-4 h-4" /> {item.start_time} - {item.end_time}</div>
                        <div className="col-span-3 font-semibold text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {t('doctorSchedule.available')}</div>
                        <div className="col-span-2 text-end">
                           <button className="text-red-500 hover:text-red-700 font-bold text-xs">{t('doctorSchedule.remove')}</button>
                        </div>
                     </div>
                  )) : (
                     <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                        <Plus className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-500">{t('doctorSchedule.noAvailabilityFound')}</p>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">{t('doctorSchedule.addAvailability')}</h3>
            <form onSubmit={handleAddSlot} className="space-y-6">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">{t('doctorSchedule.availableDate')}</label>
                <input type="date" required value={newSlot.available_date} onChange={(e) => setNewSlot({...newSlot, available_date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-semibold focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">{t('doctorSchedule.startTime')}</label>
                  <input type="time" required value={newSlot.start_time} onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-semibold focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">{t('doctorSchedule.endTime')}</label>
                  <input type="time" required value={newSlot.end_time} onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-semibold focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 font-extrabold text-sm rounded-xl hover:bg-slate-200">{t('common.cancel')}</button>
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-extrabold text-sm rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} {t('doctorSchedule.confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
