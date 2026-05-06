import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, ChevronLeft, Sun, Moon, Info, ArrowLeft, Loader2 } from 'lucide-react';
import { fetchDoctorAvailability, selectDoctorAvailability, selectPatientsLoading } from '../store/slices/patientSlice';
import { fetchDoctorById, selectSelectedDoctor } from '../store/slices/doctorSlice';
import { updateBookingDraft, selectBookingDraft } from '../store/slices/appointmentSlice';

export default function PickSchedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const draft = useSelector(selectBookingDraft);

  const doctorId = (id && id !== 'undefined') ? id : (location.state?.doctorId || draft.doctorId);
  const availability = useSelector(selectDoctorAvailability);
  const selectedDoctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectPatientsLoading);

  const [selectedDate, setSelectedDate] = useState(draft.selectedDate || new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(draft.selectedSlot || null);
  const [viewMonth, setViewMonth] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

  const handleMonthChange = (offset) => {
    setViewMonth(prev => {
      let newMonth = prev.month + offset;
      let newYear = prev.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      else if (newMonth < 0) { newMonth = 11; newYear--; }
      return { month: newMonth, year: newYear };
    });
  };

  const getCalendarDays = () => {
    const { month, year } = viewMonth;
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust for Mon start (0=Mon, 6=Sun)
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorAvailability(doctorId));
      dispatch(fetchDoctorById(doctorId));
      // Save doctorId to draft if it's new
      if (doctorId !== draft.doctorId) {
        dispatch(updateBookingDraft({ doctorId }));
      }
    }
  }, [dispatch, doctorId, draft.doctorId]);

  // Group slots by date - Normalize to YYYY-MM-DD to avoid mismatch with time components
  const availableDates = [...new Set(availability.map(slot => {
    try {
      return new Date(slot.available_date).toISOString().split('T')[0];
    } catch (e) {
      return slot.available_date; // Fallback
    }
  }))];
  
  const slotsForSelectedDate = availability.filter(slot => {
    try {
      const normalizedSlotDate = new Date(slot.available_date).toISOString().split('T')[0];
      return normalizedSlotDate === selectedDate;
    } catch (e) {
      return slot.available_date === selectedDate;
    }
  });

  const morningSlots = slotsForSelectedDate.filter(s => parseInt(s.start_time.split(':')[0]) < 12);
  const afternoonSlots = slotsForSelectedDate.filter(s => {
    const hour = parseInt(s.start_time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  const eveningSlots = slotsForSelectedDate.filter(s => parseInt(s.start_time.split(':')[0]) >= 17);

  const handleContinue = () => {
    if (!selectedSlot) return;
    
    // Save to Redux Draft
    dispatch(updateBookingDraft({
      doctorId,
      selectedDate,
      selectedSlot
    }));

    navigate('/patient/book/patient', { 
      state: { 
        doctorId, 
        selectedDate, 
        selectedSlot 
      } 
    });
  };

  if (!doctorId) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <Info className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-800">No Doctor Selected</h3>
        <button onClick={() => navigate('/patient/book/doctors')} className="mt-4 text-primary-600 font-bold hover:underline">Go back to doctors list</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto flex flex-col h-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('pickSchedule.title', { defaultValue: 'Pick Schedule' })}</h2>
          <p className="text-slate-500 max-w-xl text-[15px] font-medium leading-relaxed">
            {t('pickSchedule.descriptionPrefix', { defaultValue: 'Select an available date and time slot for' })} <span className="text-slate-700 font-bold">{selectedDoctor?.name_en || 'Specialist'}</span>.
          </p>
        </div>
        <div className="bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 border border-primary-100/50">
           <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span> {t('pickSchedule.availableNow', { defaultValue: 'Fetching Real-time' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 pb-24">
        {/* Left Col: Calendar Date Picker */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">
                {new Date(viewMonth.year, viewMonth.month).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                 <button 
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
                 >
                   <ChevronLeft className="w-5 h-5"/>
                 </button>
                 <button 
                  onClick={() => handleMonthChange(1)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
                 >
                   <ChevronRight className="w-5 h-5"/>
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-7 gap-y-6 text-center text-sm font-bold text-slate-400 mb-6 uppercase text-[10px] tracking-widest">
              <div>{t('days.mon_short', { defaultValue: 'Mon' })}</div>
              <div>{t('days.tue_short', { defaultValue: 'Tue' })}</div>
              <div>{t('days.wed_short', { defaultValue: 'Wed' })}</div>
              <div>{t('days.thu_short', { defaultValue: 'Thu' })}</div>
              <div>{t('days.fri_short', { defaultValue: 'Fri' })}</div>
              <div>{t('days.sat_short', { defaultValue: 'Sat' })}</div>
              <div>{t('days.sun_short', { defaultValue: 'Sun' })}</div>
           </div>

           {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('pickSchedule.updatingSchedule', { defaultValue: 'Updating Schedule...' })}</p>
             </div>
           ) : (
             <div className="grid grid-cols-7 gap-y-2 gap-x-2 text-center">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;
                  
                  const dateStr = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
                  const isAvailable = availableDates.includes(dateStr);
                  const isSelected = selectedDate === dateStr;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = new Date(dateStr) < today;

                  return (
                    <div key={dateStr} className="relative aspect-square flex items-center justify-center">
                       <button 
                         disabled={!isAvailable || isPast}
                         onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                         className={`w-full h-full max-w-[40px] max-h-[40px] rounded-xl flex flex-col items-center justify-center transition-all text-sm font-bold relative
                           ${isSelected ? 'bg-primary-700 text-white shadow-lg shadow-primary-200' : ''}
                           ${isAvailable && !isSelected && !isPast ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100' : ''}
                           ${!isAvailable || isPast ? 'text-slate-300 cursor-not-allowed' : ''}
                           ${isPast ? 'opacity-30' : ''}
                         `}
                       >
                         {day.day}
                         {isAvailable && !isSelected && (
                           <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-500"></span>
                         )}
                       </button>
                    </div>
                  );
                })}
             </div>
           )}

           {!loading && availableDates.length === 0 && (
             <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {t('pickSchedule.noAvailability', { 
                    month: new Date(viewMonth.year, viewMonth.month).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'long' }),
                    defaultValue: 'No availability found for this doctor.' 
                  })}
                </p>
             </div>
           )}
        </div>

        {/* Right Col: Slots */}
        <div className="space-y-6">
           <div className="bg-primary-700 rounded-2xl p-6 text-white shadow-md shadow-primary-700/20 relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-2">{t('pickSchedule.selectedDate', { defaultValue: 'Selected Date' })}</div>
              <div className="text-2xl font-extrabold tracking-tight mb-4">
                {selectedDate ? new Date(selectedDate).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : t('pickSchedule.pickDate', { defaultValue: 'Pick a date' })}
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold backdrop-blur-sm border border-white/10">
                 <Info className="w-3.5 h-3.5" /> {t('pickSchedule.availableBlocks', { count: slotsForSelectedDate.length, defaultValue: `${slotsForSelectedDate.length} available blocks found` })}
              </div>
           </div>

           {/* Booking Type Selection */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('pickSchedule.bookingType', { defaultValue: 'Booking Type' })}</div>
              <div className="flex gap-4">
                 <button 
                  onClick={() => dispatch(updateBookingDraft({ bookingType: 'consultation' }))}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${draft.bookingType === 'consultation' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                 >
                    <div className="font-bold text-sm">{t('pickSchedule.consultation', { defaultValue: 'كشف' })}</div>
                     <div className="text-[10px] font-bold uppercase opacity-60">{t('pickSchedule.consultationEn', { defaultValue: 'Consultation' })}</div>
                 </button>
                 <button 
                  onClick={() => dispatch(updateBookingDraft({ bookingType: 'followup' }))}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${draft.bookingType === 'followup' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                 >
                    <div className="font-bold text-sm">{t('pickSchedule.followup', { defaultValue: 'استشارة' })}</div>
                     <div className="text-[10px] font-bold uppercase opacity-60">{t('pickSchedule.followupEn', { defaultValue: 'Follow-up' })}</div>
                 </button>
              </div>
           </div>

           <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {slotsForSelectedDate.length > 0 ? (
                <>
                  {morningSlots.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4"><Sun className="w-4 h-4 text-orange-500" /> {t('pickSchedule.morning', { defaultValue: 'Morning' })}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {morningSlots.map(slot => (
                          <button 
                            key={slot.id || slot.start_time}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl text-start border-2 transition-all ${selectedSlot === slot ? 'border-primary-600 bg-primary-600 shadow-md' : 'border-slate-100 hover:border-primary-500 bg-white'}`}
                          >
                             <div className={`font-bold text-sm mb-1 ${selectedSlot === slot ? 'text-white' : 'text-slate-800'}`}>{slot.start_time} - {slot.end_time}</div>
                             <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedSlot === slot ? 'text-primary-100' : 'text-primary-600'}`}>{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {afternoonSlots.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 text-slate-500"><Sun className="w-4 h-4 text-primary-500" /> {t('pickSchedule.afternoon', { defaultValue: 'Afternoon' })}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {afternoonSlots.map(slot => (
                          <button 
                            key={slot.id || slot.start_time}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl text-start border-2 transition-all ${selectedSlot === slot ? 'border-primary-600 bg-primary-600 shadow-md' : 'border-slate-100 hover:border-primary-500 bg-white'}`}
                          >
                             <div className={`font-bold text-sm mb-1 ${selectedSlot === slot ? 'text-white' : 'text-slate-800'}`}>{slot.start_time} - {slot.end_time}</div>
                             <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedSlot === slot ? 'text-primary-100' : 'text-primary-600'}`}>{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {eveningSlots.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 text-slate-500"><Moon className="w-4 h-4 text-slate-400" /> {t('pickSchedule.evening', { defaultValue: 'Evening' })}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {eveningSlots.map(slot => (
                          <button 
                            key={slot.id || slot.start_time}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-4 rounded-xl text-start border-2 transition-all ${selectedSlot === slot ? 'border-primary-600 bg-primary-600 shadow-md' : 'border-slate-100 hover:border-primary-500 bg-white'}`}
                          >
                             <div className={`font-bold text-sm mb-1 ${selectedSlot === slot ? 'text-white' : 'text-slate-800'}`}>{slot.start_time} - {slot.end_time}</div>
                             <div className={`text-[10px] font-bold uppercase tracking-widest ${selectedSlot === slot ? 'text-primary-100' : 'text-primary-600'}`}>{t('pickSchedule.available', { defaultValue: 'Available' })}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : !loading && (
                <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic">{t('pickSchedule.noSlots', { defaultValue: 'Select a date to view available slots.' })}</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Action Bar fixed overlay */}
      <div className="fixed bottom-8 start-4 sm:start-[18.5rem] end-4 sm:end-10 bg-white/95 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center shadow-2xl shadow-slate-300/50 border border-slate-200/60 z-[999]">
         <button onClick={() => navigate('/patient/book/doctors')} className="font-bold text-slate-700 flex items-center hover:text-slate-900 transition-colors px-4 py-2 mb-4 sm:mb-0">
            <ArrowLeft className="w-4 h-4 me-2" /> {t('pickSchedule.backToDoctors', { defaultValue: 'Back to Doctors' })}
         </button>
         <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            {selectedSlot && (
              <div className="text-center sm:text-end">
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('pickSchedule.selectedSession', { defaultValue: 'Selected Session' })}</div>
                 <div className="font-bold text-sm text-slate-900">{new Date(selectedDate).toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} at {selectedSlot.start_time} - {selectedSlot.end_time}</div>
              </div>
            )}
            <button 
              onClick={handleContinue}
              disabled={!selectedSlot}
              className="bg-primary-700 hover:bg-primary-800 disabled:opacity-50 shadow-lg shadow-primary-700/20 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto text-sm"
            >
               {t('pickSchedule.continueToPatientInfo', { defaultValue: 'Continue to Patient Info' })}
            </button>
         </div>
      </div>
    </div>
  );
}
