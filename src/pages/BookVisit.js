import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Heart, Star, ShieldCheck, Globe, Video, CreditCard, Clock, ChevronDown, Info } from 'lucide-react';

export default function BookVisit() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      
      {/* Left Sidebar (Filters) */}
      <div className="w-full md:w-64 shrink-0 space-y-8 sticky top-24">
         <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">{t('bookVisit.refineSearch', { defaultValue: 'Refine Search' })}</h3>
            
            <div className="space-y-6">
               <div className="space-y-3 pb-6 border-b border-slate-100">
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('bookVisit.specialty', { defaultValue: 'Specialty' })}</div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-5 h-5 rounded border border-primary-500 bg-primary-600 flex items-center justify-center text-white"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                     <span className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{t('bookVisit.cardiology', { defaultValue: 'Cardiology' })}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-primary-400 bg-white"></div>
                     <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600 transition-colors">Neurology</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-primary-400 bg-white"></div>
                     <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600 transition-colors">Pediatrics</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-primary-400 bg-white"></div>
                     <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600 transition-colors">Dermatology</span>
                  </label>
               </div>

               <div className="pb-6 border-b border-slate-100">
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">{t('bookVisit.insurance', { defaultValue: 'Insurance' })}</div>
                  <div className="relative">
                     <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                        <option>{t('bookVisit.allProviders', { defaultValue: 'All Providers' })}</option>
                        <option>Blue Cross</option>
                        <option>Aetna</option>
                     </select>
                     <ChevronDown className="w-4 h-4 text-slate-400 absolute end-4 top-1/2 -translate-y-1/2" />
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
                  <div className="flex gap-2">
                     <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-primary-600 bg-primary-50 transition-colors">{t('bookVisit.any', { defaultValue: 'Any' })}</button>
                     <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors bg-white">Female</button>
                     <button className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors bg-white">Male</button>
                  </div>
               </div>
            </div>

            <div className="bg-primary-600 rounded-2xl p-6 text-white relative overflow-hidden mt-4">
               <div className="absolute -bottom-6 -end-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
               <h4 className="font-extrabold text-[15px] mb-2 relative z-10">{t('bookVisit.telehealthAvailable', { defaultValue: 'Telehealth Available' })}</h4>
               <p className="text-primary-100 text-[13px] leading-relaxed mb-6 font-medium relative z-10">{t('bookVisit.telehealthDescription', { defaultValue: 'Consult with top specialists from the comfort of your home.' })}</p>
               <button className="bg-white text-primary-700 font-bold text-xs py-2 px-4 rounded-lg shadow-sm hover:shadow relative z-10 transition-shadow">{t('bookVisit.learnMore', { defaultValue: 'Learn More' })}</button>
            </div>
         </div>
      </div>

      {/* Main Content (Doctors List) */}
      <div className="flex-1 min-w-0">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">{t('bookVisit.availableSpecialists', { defaultValue: 'Available Specialists' })}</h2>
               <p className="text-[15px] font-medium text-slate-500">{t('bookVisit.showingCount', { defaultValue: 'Showing 128 cardiologists in your network.' })}</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-500">{t('bookVisit.sortBy', { defaultValue: 'Sort by:' })}</span>
               <div className="relative">
                  <select className="bg-white border text-sm font-bold text-slate-800 border-slate-200 rounded-lg px-3 py-1.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer pe-8 shadow-sm">
                     <option>{t('bookVisit.highestRated', { defaultValue: 'Highest Rated' })}</option>
                     <option>{t('bookVisit.nearestDate', { defaultValue: 'Nearest Date' })}</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Dr. Sarah Jenkins */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group flex flex-col justify-between">
               <button className="absolute top-6 end-6 text-slate-300 hover:text-red-500 transition-colors z-10">
                  <Heart className="w-6 h-6" />
               </button>
               <div className="flex gap-5 mb-6 relative">
                  <div className="relative shrink-0">
                     <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&size=150&background=f1f5f9" alt="Dr Snapshot" className="w-[100px] h-[100px] rounded-[20px] object-cover bg-slate-100 border border-slate-200/50" />
                     <div className="absolute -bottom-2.5 start-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9
                     </div>
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-extrabold text-[17px] text-slate-900 mb-1 truncate">Dr. Sarah Jenkins</h3>
                     <div className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest mb-2.5">Senior Cardiologist</div>
                     <p className="text-[13px] text-slate-600 font-medium leading-snug line-clamp-3 mb-4">
                        Over 15 years of experience in non-invasive cardiology and advanced echocardiography.
                     </p>
                     <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> Board Certified</span>
                        <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> English, Spanish</span>
                     </div>
                  </div>
               </div>
               <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div>
                     <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t('bookVisit.nextAvailable', { defaultValue: 'Next Available' })}</div>
                     <div className="font-extrabold text-sm text-slate-900">Tomorrow, 9:30 AM</div>
                  </div>
                  <button onClick={() => navigate('/patient/book/schedule')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all text-[13px] hover:-translate-y-0.5">
                     {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                  </button>
               </div>
            </div>

            {/* Dr. Michael Chen */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group flex flex-col justify-between">
               <button className="absolute top-6 end-6 text-slate-300 hover:text-red-500 transition-colors z-10">
                  <Heart className="w-6 h-6" />
               </button>
               <div className="flex gap-5 mb-6 relative">
                  <div className="relative shrink-0">
                     <img src="https://ui-avatars.com/api/?name=Michael+Chen&size=150&background=f1f5f9" alt="Dr Snapshot" className="w-[100px] h-[100px] rounded-[20px] object-cover bg-slate-100 border border-slate-200/50" />
                     <div className="absolute -bottom-2.5 start-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.8
                     </div>
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-extrabold text-[17px] text-slate-900 mb-1 truncate">Dr. Michael Chen</h3>
                     <div className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest mb-2.5">Interventional Cardiology</div>
                     <p className="text-[13px] text-slate-600 font-medium leading-snug line-clamp-3 mb-4">
                        Specializing in cardiac catheterization and stenting with holistic structural heart disease focus.
                     </p>
                     <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        <span className="bg-blue-50/50 border border-blue-100 px-2 py-1 rounded flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-blue-500" /> Virtual Visit</span>
                        <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-slate-400" /> Accepts Aetna</span>
                     </div>
                  </div>
               </div>
               <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div>
                     <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t('bookVisit.nextAvailable', { defaultValue: 'Next Available' })}</div>
                     <div className="font-extrabold text-sm text-slate-900">Monday, Oct 14</div>
                  </div>
                  <button onClick={() => navigate('/patient/book/schedule')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all text-[13px] hover:-translate-y-0.5">
                     {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                  </button>
               </div>
            </div>

             {/* Dr. Elena Rodriguez */}
             <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group flex flex-col justify-between">
               <button className="absolute top-6 end-6 text-slate-300 hover:text-red-500 transition-colors z-10">
                  <Heart className="w-6 h-6" />
               </button>
               <div className="flex gap-5 mb-6 relative">
                  <div className="relative shrink-0">
                     <img src="https://ui-avatars.com/api/?name=Elena+Rodriguez&size=150&background=f1f5f9" alt="Dr Snapshot" className="w-[100px] h-[100px] rounded-[20px] object-cover bg-slate-100 border border-slate-200/50" />
                     <div className="absolute -bottom-2.5 start-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 5.0
                     </div>
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-extrabold text-[17px] text-slate-900 mb-1 truncate">Dr. Elena Rodriguez</h3>
                     <div className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest mb-2.5">Pediatric Heart Specialist</div>
                     <p className="text-[13px] text-slate-600 font-medium leading-snug line-clamp-3 mb-4">
                        Dedicated to treating congenital heart defects in infants and providing long-term adolescent guidance.
                     </p>
                     <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> In-Person Only</span>
                        <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-slate-400" /> Harvard Med Alum</span>
                     </div>
                  </div>
               </div>
               <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div>
                     <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t('bookVisit.nextAvailable', { defaultValue: 'Next Available' })}</div>
                     <div className="font-extrabold text-sm text-slate-900">Today, 2:00 PM</div>
                  </div>
                  <button onClick={() => navigate('/patient/book/schedule')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all text-[13px] hover:-translate-y-0.5">
                     {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                  </button>
               </div>
            </div>

            {/* Dr. James Wilson */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group flex flex-col justify-between">
               <button className="absolute top-6 end-6 text-slate-300 hover:text-red-500 transition-colors z-10">
                  <Heart className="w-6 h-6" />
               </button>
               <div className="flex gap-5 mb-6 relative">
                  <div className="relative shrink-0">
                     <img src="https://ui-avatars.com/api/?name=James+Wilson&size=150&background=f1f5f9" alt="Dr Snapshot" className="w-[100px] h-[100px] rounded-[20px] object-cover bg-slate-100 border border-slate-200/50" />
                     <div className="absolute -bottom-2.5 start-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.7
                     </div>
                  </div>
                  <div className="min-w-0">
                     <h3 className="font-extrabold text-[17px] text-slate-900 mb-1 truncate">Dr. James Wilson</h3>
                     <div className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest mb-2.5">Cardiac Electrophysiology</div>
                     <p className="text-[13px] text-slate-600 font-medium leading-snug line-clamp-3 mb-4">
                        Expert in heart rhythm disorders and pacemaker implantation...
                     </p>
                     <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> 20+ Years Exp.</span>
                     </div>
                  </div>
               </div>
               <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div>
                     <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t('bookVisit.nextAvailable', { defaultValue: 'Next Available' })}</div>
                     <div className="font-extrabold text-sm text-slate-900">Wednesday, Oct 16</div>
                  </div>
                  <button onClick={() => navigate('/patient/book/schedule')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:shadow transition-all text-[13px] hover:-translate-y-0.5">
                     {t('bookVisit.bookNow', { defaultValue: 'Book Now' })}
                  </button>
               </div>
            </div>

         </div>

         <div className="mt-8 text-center">
            <button className="bg-primary-100 text-primary-700 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-primary-200 transition-colors inline-flex items-center gap-2">
               {t('bookVisit.viewMoreSpecialists', { defaultValue: 'View More Specialists' })} <ChevronDown className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  )
}
