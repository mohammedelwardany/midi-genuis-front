import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Search, Heart, Star, ShieldCheck, Globe, Video, CreditCard, Clock, ChevronDown, Info, Loader2, Sparkles } from 'lucide-react';
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

   const doctors = useSelector(selectDoctors);
   const topDoctors = useSelector(selectTopDoctors);
   const loading = useSelector(selectDoctorsLoading);

   const [searchQuery, setSearchQuery] = useState('');
   const [selectedSpecialty, setSelectedSpecialty] = useState('All');
   const [sortBy, setSortBy] = useState('Highest Rated');

   useEffect(() => {
      dispatch(fetchDoctors());
      dispatch(fetchTopDoctors());
   }, [dispatch]);

   const handleBookNow = (doctorId) => {
      dispatch(clearBookingDraft());
      dispatch(updateBookingDraft({ doctorId }));
      navigate(`/patient/book/schedule/${doctorId}`);
   };

   const [isFilterOpen, setIsFilterOpen] = useState(false);

   const specialties = ['All', ...new Set((doctors || []).map(d => d.specialization).filter(Boolean))];

   const filteredDoctors = (doctors || []).filter(doctor => {
      const name = i18n.language.startsWith('ar') ? (doctor.name_ar || doctor.name) : (doctor.name_en || doctor.name || '');
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialization === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
   });

   return (
      <div className="animate-in fade-in duration-500 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start relative">

         {/* Mobile Filter Toggle */}
         <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden w-full mb-4 bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm"
         >
            <Search className="w-4 h-4" /> {t('bookVisit.filters', { defaultValue: 'Filter Specialists' })}
         </button>

         {/* Left Sidebar (Filters) */}
         <div className={`w-full md:w-64 shrink-0 space-y-8 sticky top-24 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border border-slate-100 md:border-none shadow-sm md:shadow-none">
               <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight hidden md:block">{t('bookVisit.refineSearch', { defaultValue: 'Refine Search' })}</h3>

               <div className="space-y-6">
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                     <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('bookVisit.specialty', { defaultValue: 'Specialty' })}</div>
                     <div className="flex flex-wrap md:flex-col gap-3 md:gap-3">
                        {specialties.map(spec => (
                           <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                 type="radio"
                                 name="specialty"
                                 checked={selectedSpecialty === spec}
                                 onChange={() => setSelectedSpecialty(spec)}
                                 className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedSpecialty === spec ? 'border-primary-500 bg-primary-600 text-white' : 'border-slate-300 bg-white'}`}>
                                 {selectedSpecialty === spec && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              </div>
                              <span className={`text-sm transition-colors ${selectedSpecialty === spec ? 'font-bold text-slate-900' : 'font-medium text-slate-600 group-hover:text-primary-600'}`}>
                                 {spec === 'All' ? t('common.all', { defaultValue: 'All' }) : spec}
                              </span>
                           </label>
                        ))}
                     </div>
                  </div>

                  <div className="pb-6 border-b border-slate-100">
                     <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('bookVisit.availability', { defaultValue: 'Availability' })}</div>
                     <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="flex-1 bg-primary-700 text-white shadow-sm rounded-lg py-2 text-xs font-bold transition-all">{t('bookVisit.today', { defaultValue: 'Today' })}</button>
                        <button className="flex-1 text-slate-500 hover:text-slate-900 rounded-lg py-2 text-xs font-bold transition-all">{t('bookVisit.next3Days', { defaultValue: 'Next 3 Days' })}</button>
                     </div>
                  </div>

                  <div className="pb-6">
                     <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('bookVisit.doctorGender', { defaultValue: 'Doctor Gender' })}</div>
                     <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-primary-600 bg-primary-50 transition-colors">{t('bookVisit.any', { defaultValue: 'Any' })}</button>
                        <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors bg-white">{t('userManagement.genderFemale', { defaultValue: 'Female' })}</button>
                        <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors bg-white">{t('userManagement.genderMale', { defaultValue: 'Male' })}</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content (Doctors List) */}
         <div className="flex-1 min-w-0 w-full">

            {/* Top Doctors / Featured Section */}
            {!searchQuery && topDoctors?.length > 0 && (
               <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 text-amber-500">
                           <Sparkles className="w-5 h-5 fill-amber-500" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{t('bookVisit.featuredSpecialists', { defaultValue: 'Featured Specialists' })}</h3>
                     </div>
                     <button className="text-[13px] font-bold text-primary-600 hover:underline">{t('common.seeAll', { defaultValue: 'See All' })}</button>
                  </div>

                  <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-4 gap-4 md:gap-6 custom-scrollbar snap-x">
                     {topDoctors.map(doctor => (
                        <div key={doctor.id} className="min-w-[280px] md:min-w-[340px] snap-start bg-white rounded-[24px] p-4 md:p-5 shadow-sm border border-slate-100 hover:border-primary-200 transition-colors group">
                           <div className="relative mb-4">
                              <div className="absolute top-2 start-2 bg-amber-100/90 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm z-10 border border-amber-200/50">
                                 <Star className="w-3 h-3 fill-amber-700" /> {t('bookVisit.topRated', { defaultValue: 'Top Rated' })}
                              </div>
                              <img
                                 src={`https://ui-avatars.com/api/?name=${(i18n.language.startsWith('ar') ? doctor.name_ar : doctor.name_en) || doctor.name}&size=150&background=c7d2fe&color=3730a3`}
                                 alt={doctor.name_en}
                                 className="w-full h-[140px] md:h-[160px] rounded-2xl object-cover bg-slate-50 border border-slate-100"
                              />
                           </div>
                           <div className="mb-4">
                              <div className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest mb-1">{doctor.specialization}</div>
                              <h4 className="font-extrabold text-slate-900 truncate">{i18n.language.startsWith('ar') ? (doctor.name_ar || doctor.name) : (doctor.name_en || doctor.name)}</h4>
                              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-1">{doctor.bio || t('bookVisit.consultingSpecialist', { defaultValue: 'Consulting Specialist' })}</p>
                           </div>
                           <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-1.5">
                                 <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                 <span className="text-xs font-black text-slate-900">{doctor.rating_avg || '5.0'}</span>
                              </div>
                              <button
                                 onClick={() => handleBookNow(doctor.id || doctor.user_id)}
                                 className="bg-slate-950 text-white h-9 px-4 rounded-xl text-xs font-bold hover:bg-primary-600 transition-colors"
                              >
                                 {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 md:gap-6">
               <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">{t('bookVisit.availableSpecialists', { defaultValue: 'Available Specialists' })}</h2>
                  <div className="relative mt-4">
                     <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('common.search', { defaultValue: 'Search doctors...' })}
                        className="w-full bg-white border border-slate-200 rounded-2xl ps-11 pe-4 py-3 md:py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                     />
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{t('bookVisit.sortBy', { defaultValue: 'Sort by:' })}</span>
                  <div className="relative">
                     <select className="bg-white border text-[13px] font-bold text-slate-800 border-slate-200 rounded-lg px-3 py-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-8 shadow-sm">
                        <option>{t('bookVisit.highestRated', { defaultValue: 'Highest Rated' })}</option>
                        <option>{t('bookVisit.nearestDate', { defaultValue: 'Nearest Date' })}</option>
                     </select>
                     <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                  </div>
               </div>
            </div>

            {loading && !topDoctors?.length ? (
               <div className="flex flex-col items-center justify-center py-12 md:py-20 bg-white rounded-[24px] border border-slate-100">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-primary-600 animate-spin mb-4" />
                  <p className="text-slate-500 font-bold text-sm md:text-base">{t('bookVisit.findingSpecialists', { defaultValue: 'Finding specialists...' })}</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                     <div key={doctor.id} className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group flex flex-col justify-between">
                        <button className="absolute top-5 end-5 text-slate-300 hover:text-red-500 transition-colors z-10">
                           <Heart className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <div className="flex gap-4 md:gap-5 mb-5 md:mb-6 relative">
                           <div className="relative shrink-0">
                              <img
                                 src={`https://ui-avatars.com/api/?name=${(i18n.language.startsWith('ar') ? doctor.name_ar : doctor.name_en) || doctor.name}&size=150&background=c7d2fe&color=3730a3`}
                                 alt={doctor.name_en}
                                 className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[20px] object-cover bg-slate-100 border border-slate-200/50"
                              />
                              <div className="absolute -bottom-2.5 start-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                                 <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {doctor.rating_avg || '4.9'}
                              </div>
                           </div>
                           <div className="min-w-0 flex-1">
                              <h3 className="font-extrabold text-[15px] md:text-[17px] text-slate-900 mb-1 truncate">{i18n.language.startsWith('ar') ? (doctor.name_ar || doctor.name) : (doctor.name_en || doctor.name)}</h3>
                              <div className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest mb-2 md:mb-2.5">{doctor.specialization}</div>
                              <p className="text-xs md:text-[13px] text-slate-600 font-medium leading-snug line-clamp-2 md:line-clamp-3 mb-3 md:mb-4">
                                 {doctor.bio || 'Experienced specialist providing comprehensive patient care.'}
                              </p>
                              <div className="hidden sm:flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                                 <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> {t('bookVisit.boardCertified', { defaultValue: 'Board Certified' })}</span>
                                 <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {doctor.experience_years}+ {t('userManagement.years', { defaultValue: 'Yrs' })}</span>
                              </div>
                           </div>
                        </div>
                        <div className="pt-4 md:pt-5 border-t border-slate-50 flex items-center justify-between">
                           <div className="hidden xs:block">
                              <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t('bookVisit.nextAvailable', { defaultValue: 'Next Available' })}</div>
                              <div className="font-extrabold text-xs md:text-sm text-slate-900">Tomorrow, 9:30 AM</div>
                           </div>
                           <button onClick={() => handleBookNow(doctor.id || doctor.user_id)} className="w-full xs:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all text-xs md:text-[13px]">
                              {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                           </button>
                        </div>
                     </div>
                  )) : (
                     <div className="col-span-1 lg:col-span-2 py-16 md:py-20 text-center bg-white rounded-[24px] border border-slate-100">
                        <p className="text-slate-500 font-bold">{t('bookVisit.noDoctorsFound', { defaultValue: 'No doctors found matching your criteria.' })}</p>
                        <button onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); }} className="mt-4 text-primary-600 font-bold hover:underline">{t('bookVisit.resetFilters', { defaultValue: 'Reset Filters' })}</button>
                     </div>
                  )}
               </div>
            )}

            <div className="mt-8 text-center">
               <button className="bg-primary-100 text-primary-700 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-primary-200 transition-colors inline-flex items-center gap-2">
                  {t('bookVisit.viewMoreSpecialists', { defaultValue: 'View More Specialists' })} <ChevronDown className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   )
}
