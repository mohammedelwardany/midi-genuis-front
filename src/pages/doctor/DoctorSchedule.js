import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Settings, Plus, LayoutGrid, List as ListIcon, Clock, MapPin, ChevronDown, Calendar, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchUpcomingAvailability, 
  addAvailability, 
  selectDoctorSchedule, 
  selectDoctorsLoading 
} from '../../store/slices/doctorSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import ModalPortal from '../../components/ModalPortal';

export default function DoctorSchedule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const schedule = useSelector(selectDoctorSchedule);
  const loading = useSelector(selectDoctorsLoading);
  
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(schedule.length / itemsPerPage);
  const paginatedSchedule = [...schedule].sort((a, b) => new Date(a.available_date) - new Date(b.available_date)).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [newSlot, setNewSlot] = useState({
    available_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '11:00'
  });

  // Calculate grid position
  const getTimeInMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const GRID_START = 8 * 60; // 08:00
  const GRID_END = 18 * 60; // 18:00
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
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
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

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Group schedule by exact local date string
  const groupedSchedule = schedule.reduce((acc, slot) => {
    const dateStr = formatDate(slot.available_date);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {});

  useEffect(() => {
    const doctorId = currentUser?.user_id || currentUser?.id;
    if (doctorId) {
       dispatch(fetchUpcomingAvailability(doctorId));
    }
  }, [dispatch, currentUser]);

  const handleAddSlot = async (e) => {
    if (e) e.preventDefault();
    try {
      await dispatch(addAvailability({
        available_date: newSlot.available_date,
        start_time: newSlot.start_time,
        end_time: newSlot.end_time
      })).unwrap();

      toast.success(t('doctorSchedule.slotAdded', { defaultValue: 'Availability block added successfully' }));
      setShowAddModal(false);
      // Refresh list
      const doctorId = currentUser?.user_id || currentUser?.id;
      if (doctorId) dispatch(fetchUpcomingAvailability(doctorId));
    } catch (err) {
      toast.error(err?.message || 'Failed to add availability');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 relative font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
             {view === 'grid' ? t('doctorSchedule.clinicalWorkHours') : t('doctorSchedule.weeklyWorkHours')}
           </h2>
           <p className="text-[15px] font-medium text-slate-500 max-w-xl">
             {t('doctorConfigureAvailability.description', { defaultValue: 'Define your weekly clinic hours and operational locations. This schedule will be visible to patients and triage coordinators.' })}
           </p>
        </div>
        
        <div className="flex gap-4">
           {/* View Toggle */}
           <div className="flex bg-slate-100 p-1.5 rounded-[16px] shadow-sm">
              <button 
                onClick={() => setView('grid')}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-[12px] transition-all ${view === 'grid' ? 'bg-white text-primary-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)]' : 'text-slate-500 hover:text-slate-800'}`}>
                <LayoutGrid className="w-4 h-4" /> {t('doctorSchedule.weeklyGrid', { defaultValue: 'Weekly Grid' })}
              </button>
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-[12px] transition-all ${view === 'list' ? 'bg-white text-primary-700 shadow-[0_2px_8px_rgb(0,0,0,0.04)]' : 'text-slate-500 hover:text-slate-800'}`}>
                <ListIcon className="w-4 h-4" /> {t('doctorSchedule.listView', { defaultValue: 'List View' })}
              </button>
           </div>
           
           <button onClick={() => navigate('/doctor/schedule/configure')} className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-[16px] font-bold shadow-[0_2px_12px_rgb(0,0,0,0.1)] transition-all flex items-center gap-2 text-[15px]">
              <Settings className="w-4 h-4" /> {t('doctorSchedule.updateChanges', { defaultValue: 'Update Changes' })}
           </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
         
         {/* Main Content Area */}
         <div className="w-full xl:flex-1 bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] min-h-[600px] overflow-hidden">
            
            {view === 'grid' ? (
               /* Grid View Content */
                <div className="p-4">
                  <div className="min-w-[750px]">
                     {/* Calendar Navigation Header */}
                     <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={() => navigateWeek(-1)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100"
                              >
                                 <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                              </button>
                              <button 
                                onClick={() => navigateWeek(1)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100"
                              >
                                 <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                              </button>
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                 {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </h3>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                 {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={goToToday}
                          className="px-5 py-2 text-xs font-bold bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                        >
                           Today
                        </button>
                     </div>

                     {/* Grid Headers */}
                     <div className="grid grid-cols-8 border-b border-slate-100 pb-6 mb-4">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 ps-4">Time</div>
                        
                        {getWeekDays(currentWeekStart).map((date, i) => {
                           const isToday = formatDate(new Date()) === formatDate(date);
                           return (
                              <div key={i} className="text-center group">
                                 <div className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${isToday ? 'text-primary-600' : 'text-slate-400'}`}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                 </div>
                                 <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-xl font-black text-lg transition-all ${isToday ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-800'}`}>
                                    {date.getDate()}
                                 </div>
                              </div>
                           );
                        })}
                     </div>

                    {/* Grid Body */}
                    <div className="relative h-[600px] grid grid-cols-8 px-4 gap-0 divide-x divide-slate-50/50">
                       
                       {/* Time column */}
                       <div className="flex flex-col justify-between pe-4 pb-4">
                          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
                             <div key={time} className="text-[11px] font-bold text-slate-400 h-16 border-t border-transparent">{time}</div>
                          ))}
                       </div>

                       {/* Days Mon-Sun */}
                        {getWeekDays(currentWeekStart).map((date, idx) => {
                           const dateStr = formatDate(date);
                           const isToday = formatDate(new Date()) === dateStr;
                           const daySlots = groupedSchedule[dateStr] || [];

                           return (
                              <div key={idx} className={`relative h-full flex flex-col border-l border-slate-100/50 group ${isToday ? 'bg-primary-50/10' : ''}`}>
                                 {[...Array(10)].map((_, i) => <div key={i} className="flex-1 border-t border-slate-100/50"></div>)}
                                 
                                 {daySlots.map((slot, i) => (
                                    <div 
                                      key={i}
                                      title={`${slot.available_date}: ${slot.start_time} - ${slot.end_time}`}
                                      style={getSlotStyle(slot.start_time, slot.end_time)}
                                      className="absolute start-1 end-1 bg-blue-50/90 border-s-4 border-s-blue-500 rounded-xl shadow-sm px-3 hover:bg-blue-100 transition-all cursor-pointer overflow-hidden flex flex-col justify-center group/slot"
                                    >
                                       <div className="text-[10px] font-black text-blue-700 leading-none mb-1">
                                          {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                       </div>
                                       <div className="text-[9px] font-bold text-blue-400 leading-none truncate">
                                          Clinical Availability
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           );
                        })}
                    </div>
                 </div>
               </div>
            ) : (
               /* List View Content */
               <div className="p-8 pb-12">
                  <div className="grid grid-cols-12 mb-6 border-b border-slate-100 pb-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ps-4">
                     <div className="col-span-3">Day</div>
                     <div className="col-span-4">Clinical Hours</div>
                     <div className="col-span-3">Status/Location</div>
                     <div className="col-span-2 text-end">Action</div>
                  </div>
 
                  <div className="space-y-[18px]">
                     {paginatedSchedule && paginatedSchedule.length > 0 ? (
                        paginatedSchedule.map((item) => (
                          <div key={item.id || item.available_date + item.start_time} className="grid grid-cols-12 items-center bg-white border border-slate-100 hover:border-slate-200 transition-colors p-[18px] rounded-[16px] shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                             <div className="col-span-3 flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-extrabold opacity-80">
                                   {new Date(item.available_date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                </div>
                                <div>
                                   <div className="font-extrabold text-[15px] text-slate-900 leading-tight">
                                     {new Date(item.available_date).toLocaleDateString('en-US', { weekday: 'long' })}
                                   </div>
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                     {new Date(item.available_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                   </div>
                                </div>
                             </div>
                             <div className="col-span-4 font-bold text-[15px] text-primary-700 flex items-center gap-2">
                                <Clock className="w-[18px] h-[18px]" strokeWidth={2.5}/> {item.start_time} - {item.end_time}
                             </div>
                             <div className="col-span-3 font-semibold text-[13px] text-slate-500 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" /> {item.status || 'Available'}
                             </div>
                             <div className="col-span-2 text-end">
                                <span className="bg-emerald-50 font-bold text-[11px] text-emerald-600 px-[14px] py-[6px] rounded-[8px] border border-emerald-100">Confirmed</span>
                             </div>
                          </div>
                        ))
                     ) : (
                        <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                          <Plus className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm font-bold text-slate-500">No availability scheduled yet</p>
                          <button onClick={() => setShowAddModal(true)} className="text-primary-600 font-extrabold text-sm mt-2 hover:underline">Add your first clinical slot</button>
                        </div>
                     )}
                  </div>

                  {/* Pagination Section */}
                  {schedule.length > 0 && (
                     <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                           {t('pagination.showing', { defaultValue: 'Showing' })} <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, schedule.length)}</span> {t('pagination.of', { defaultValue: 'of' })} <span className="text-slate-900">{schedule.length}</span> {t('pagination.results', { defaultValue: 'results' })}
                        </div>

                        {totalPages > 1 && (
                           <div className="flex items-center gap-2">
                              <button 
                                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                 disabled={currentPage === 1}
                                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all uppercase tracking-widest disabled:cursor-not-allowed">
                                 <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" strokeWidth={3} /> {t('pagination.prev', { defaultValue: 'Prev' })}
                              </button>
                              
                              <div className="hidden sm:flex items-center gap-1.5 px-2">
                                 {/* Compact Page Numbers */}
                                 {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1;
                                    // Show first, last, and current +/- 1
                                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                       return (
                                          <button 
                                             key={i}
                                             onClick={() => setCurrentPage(page)}
                                             className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === page ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-slate-400 hover:bg-slate-50'}`}>
                                             {page}
                                          </button>
                                       );
                                    }
                                    // Ellipsis
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                       return <span key={i} className="text-slate-300 font-bold px-1">...</span>;
                                    }
                                    return null;
                                 })}
                              </div>

                              <button 
                                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                 disabled={currentPage === totalPages}
                                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all uppercase tracking-widest disabled:cursor-not-allowed">
                                 {t('pagination.next', { defaultValue: 'Next' })} <ArrowLeft className="w-3.5 h-3.5 rotate-180" strokeWidth={3} />
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            )}
         </div>

         {/* Sidebar Area */}
         <div className="w-full xl:w-[320px] shrink-0 space-y-6">
            
            {/* Quick Add Blocks */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-6">
               <h3 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{t('doctorSchedule.quickAddBlocks', { defaultValue: 'Quick Add Blocks' })}</h3>
               
               <div className="space-y-3">
                  {[
                     { label: t('doctorSchedule.morningShift', { defaultValue: 'Morning Shift' }), start: '08:00', end: '12:00', color: 'bg-blue-600' },
                     { label: t('doctorSchedule.afternoonShift', { defaultValue: 'Afternoon Shift' }), start: '13:00', end: '17:00', color: 'bg-orange-500' },
                     { label: t('doctorSchedule.fullDay', { defaultValue: 'Full Day' }), start: '08:00', end: '18:00', color: 'bg-primary-600' }
                  ].map((preset) => (
                     <div 
                        key={preset.label}
                        onClick={() => {
                           setNewSlot(prev => ({ ...prev, start_time: preset.start, end_time: preset.end }));
                           setShowAddModal(true);
                        }}
                        className="flex justify-between items-center bg-white border border-slate-200 p-3 px-4 rounded-2xl hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                           <span className={`w-2 h-2 rounded-full ${preset.color}`}></span>
                           <div className="text-start">
                              <div className="font-bold text-sm text-slate-800">{preset.label}</div>
                              <div className="text-[10px] font-bold text-slate-400">{preset.start} - {preset.end}</div>
                           </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-primary-600 transition-colors"><Plus className="w-5 h-5" /></div>
                     </div>
                  ))}
               </div>
            </div>

         </div>

      </div>

      {showAddModal && (
        <ModalPortal>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-[18px] bg-primary-50 text-primary-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{t('doctorSchedule.addAvailability', { defaultValue: 'Add Availability' })}</h3>
                <p className="text-sm font-medium text-slate-500">Pick a date and timeframe</p>
              </div>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-6">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Available Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    required
                    value={newSlot.available_date}
                    onChange={(e) => setNewSlot({...newSlot, available_date: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[15px] font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>


              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 font-extrabold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-extrabold text-sm rounded-xl hover:bg-primary-700 shadow-md shadow-primary-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  )
}