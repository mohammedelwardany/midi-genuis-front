import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Search, Star, Clock, Loader2, Award, X } from 'lucide-react';
import {
   fetchDoctors,
   fetchTopDoctors,
   selectDoctors,
   selectTopDoctors,
   selectDoctorsLoading
} from '../store/slices/doctorSlice';
import { updateBookingDraft, clearBookingDraft } from '../store/slices/appointmentSlice';

export default function BookVisit() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { t, i18n } = useTranslation();
   const isRtl = i18n.language.startsWith('ar');

   const doctors = useSelector(selectDoctors);
   const topDoctors = useSelector(selectTopDoctors);
   const loading = useSelector(selectDoctorsLoading);

   const formatNextAvailable = (date, startTime, endTime) => {
      if (!date) return t('bookVisit.noAvailability', { defaultValue: 'No upcoming slots' });

      const parsedDate = new Date(date);
      const dateStr = parsedDate.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
         weekday: 'short',
         month: 'short',
         day: 'numeric'
      });

      if (startTime) {
         return `${dateStr}, ${startTime.substring(0, 5)}`;
      }
      return dateStr;
   };

   const [searchQuery, setSearchQuery] = useState('');
   const [selectedSpecialty, setSelectedSpecialty] = useState('All');
   const [sortMode, setSortMode] = useState('rating'); // 'rating' | 'soonest'

   useEffect(() => {
      dispatch(fetchDoctors());
      dispatch(fetchTopDoctors());
   }, [dispatch]);

   const handleBookNow = (doctorId) => {
      dispatch(clearBookingDraft());
      dispatch(updateBookingDraft({ doctorId }));
      navigate(`/patient/book/schedule/${doctorId}`);
   };

   const specialties = ['All', ...new Set((doctors || []).map(d => d.specialization).filter(Boolean))];
   const topDoctorIds = new Set((topDoctors || []).map(d => d.id || d.user_id));

   const filteredDoctors = (doctors || []).filter(doctor => {
      const name = isRtl ? (doctor.name_ar || doctor.name) : (doctor.name_en || doctor.name || '');
      const matchesSearch = name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialization === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
   });

   const sortedDoctors = [...filteredDoctors].sort((a, b) => {
      if (sortMode === 'rating') {
         return (parseFloat(b.rating_avg) || 0) - (parseFloat(a.rating_avg) || 0);
      }
      const aTime = a.next_available_date ? new Date(a.next_available_date).getTime() : Infinity;
      const bTime = b.next_available_date ? new Date(b.next_available_date).getTime() : Infinity;
      return aTime - bTime;
   });

   const resetFilters = () => {
      setSearchQuery('');
      setSelectedSpecialty('All');
   };

   return (
      <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">

         {/* Page Header */}
         <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
               {t('bookVisit.availableSpecialists', { defaultValue: 'Find a Doctor' })}
            </h1>
            <p className="text-slate-600 text-base font-medium leading-relaxed">
               {t('bookVisit.pageSubtitle', { defaultValue: 'Search or pick a specialty, then tap "Book Now" to schedule your visit.' })}
            </p>
         </div>

         {/* Search */}
         <div className="relative mb-5">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={t('bookVisit.searchPlaceholder', { defaultValue: 'Search doctors by name...' })}
               className="w-full bg-white border-2 border-slate-200 rounded-2xl ps-12 pe-4 py-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
            {searchQuery && (
               <button
                  onClick={() => setSearchQuery('')}
                  aria-label={t('common.clear', { defaultValue: 'Clear' })}
                  className="absolute end-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
               >
                  <X className="w-5 h-5" />
               </button>
            )}
         </div>

         {/* Specialty filter - large, always-visible pill buttons (no hidden menus) */}
         <div className="mb-6">
            <div className="text-sm font-bold text-slate-700 mb-3">
               {t('bookVisit.specialty', { defaultValue: 'Specialty' })}
            </div>
            <div className="flex flex-wrap gap-2.5">
               {specialties.map(spec => (
                  <button
                     key={spec}
                     onClick={() => setSelectedSpecialty(spec)}
                     className={`px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all ${
                        selectedSpecialty === spec
                           ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                           : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                     }`}
                  >
                     {spec === 'All' ? t('common.all', { defaultValue: 'All' }) : spec}
                  </button>
               ))}
            </div>
         </div>

         {/* Sort - simple two-button segmented control instead of a small dropdown */}
         <div className="flex items-center gap-3 mb-8">
            <span className="text-sm font-bold text-slate-700">{t('bookVisit.sortBy', { defaultValue: 'Sort by:' })}</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button
                  onClick={() => setSortMode('rating')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortMode === 'rating' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  {t('bookVisit.highestRated', { defaultValue: 'Highest Rated' })}
               </button>
               <button
                  onClick={() => setSortMode('soonest')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortMode === 'soonest' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  {t('bookVisit.nearestDate', { defaultValue: 'Soonest Available' })}
               </button>
            </div>
         </div>

         {/* Doctor list - single column, one clear row per doctor */}
         {loading && !doctors?.length ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
               <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
               <p className="text-slate-600 font-bold text-base">{t('bookVisit.findingSpecialists', { defaultValue: 'Finding specialists...' })}</p>
            </div>
         ) : sortedDoctors.length > 0 ? (
            <div className="space-y-4">
               {sortedDoctors.map(doctor => {
                  const doctorId = doctor.id || doctor.user_id;
                  const name = isRtl ? (doctor.name_ar || doctor.name) : (doctor.name_en || doctor.name);
                  const isTopRated = topDoctorIds.has(doctorId);
                  return (
                     <div
                        key={doctorId}
                        className="bg-white rounded-3xl border-2 border-slate-100 p-5 md:p-6 hover:border-primary-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-5"
                     >
                        {/* Photo */}
                        <div className="shrink-0 flex sm:block items-center gap-4">
                           <img
                              src={`https://ui-avatars.com/api/?name=${name || 'Doctor'}&size=150&background=c7d2fe&color=3730a3`}
                              alt={name}
                              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover bg-slate-100 border-2 border-slate-100"
                           />
                           {/* Name shown next to photo on mobile only, for a tighter first row */}
                           <div className="sm:hidden min-w-0">
                              <h3 className="font-extrabold text-lg text-slate-900 truncate">{name}</h3>
                              <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                                 <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {doctor.rating_avg || '5.0'}
                              </div>
                           </div>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                           <div className="hidden sm:flex items-center gap-3 mb-1">
                              <h3 className="font-extrabold text-lg md:text-xl text-slate-900 truncate">{name}</h3>
                              <div className="flex items-center gap-1 text-amber-600 font-bold text-sm shrink-0">
                                 <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {doctor.rating_avg || '5.0'}
                              </div>
                              {isTopRated && (
                                 <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                                    <Award className="w-3.5 h-3.5" /> {t('bookVisit.topRated', { defaultValue: 'Top Rated' })}
                                 </span>
                              )}
                           </div>

                           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                              <span className="text-sm md:text-base font-bold text-primary-700">{doctor.specialization}</span>
                              {isTopRated && (
                                 <span className="sm:hidden inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold">
                                    <Award className="w-3 h-3" /> {t('bookVisit.topRated', { defaultValue: 'Top Rated' })}
                                 </span>
                              )}
                              {doctor.experience_years && (
                                 <span className="text-sm text-slate-600 font-medium">
                                    {doctor.experience_years}+ {t('userManagement.years', { defaultValue: 'Years' })}
                                 </span>
                              )}
                           </div>

                           <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-slate-700">
                              <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                              <span>{t('bookVisit.nextAvailable', { defaultValue: 'Next Available' })}: {formatNextAvailable(doctor.next_available_date, doctor.next_start_time, doctor.next_end_time)}</span>
                           </div>
                        </div>

                        {/* Action */}
                        <button
                           onClick={() => handleBookNow(doctorId)}
                           className="w-full sm:w-auto shrink-0 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-3.5 px-8 rounded-2xl shadow-sm transition-all text-base min-h-[52px]"
                        >
                           {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                        </button>
                     </div>
                  );
               })}
            </div>
         ) : (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-100">
               <p className="text-slate-600 font-bold text-base mb-4">{t('bookVisit.noDoctorsFound', { defaultValue: 'No doctors found matching your criteria.' })}</p>
               <button
                  onClick={resetFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
               >
                  {t('bookVisit.resetFilters', { defaultValue: 'Reset Filters' })}
               </button>
            </div>
         )}
      </div>
   )
}
