import React, { useState } from 'react';
import { Users, Timer, Star, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PerformanceAnalytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500 pb-20 relative font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('doctorPerformance.title', { defaultValue: 'Performance Analytics' })}</h2>
           <p className="text-[15px] font-medium text-slate-500 max-w-xl">
             {t('doctorPerformance.description', { defaultValue: 'Detailed overview of clinical efficiency and patient outcomes.' })}
           </p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.02)] border border-slate-100 shrink-0">
           <button 
             onClick={() => setTimeRange('monthly')}
           className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${timeRange === 'monthly' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t('doctorPerformance.monthly', { defaultValue: 'Monthly' })}
           </button>
           <button 
             onClick={() => setTimeRange('quarterly')}
           className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${timeRange === 'quarterly' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t('doctorPerformance.quarterly', { defaultValue: 'Quarterly' })}
           </button>
           <button 
             onClick={() => setTimeRange('yearly')}
           className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${timeRange === 'yearly' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t('doctorPerformance.yearly', { defaultValue: 'Yearly' })}
           </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600"><Users className="w-5 h-5" /></div>
               <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-widest">+12.4%</span>
            </div>
            <div className="text-[13px] font-bold text-slate-500 mb-0.5 tracking-wide">Total Patients</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">1,284</div>
         </div>

         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-purple-50 p-2.5 rounded-2xl text-purple-600"><Timer className="w-5 h-5" /></div>
               <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-widest">-2.1%</span>
            </div>
            <div className="text-[13px] font-bold text-slate-500 mb-0.5 tracking-wide">Avg Consultation</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">18.5 <span className="text-sm font-bold text-slate-400">min</span></div>
         </div>

         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-orange-50 p-2.5 rounded-2xl text-orange-600"><Star className="w-5 h-5 fill-current" /></div>
               <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-widest">+0.3</span>
            </div>
            <div className="text-[13px] font-bold text-slate-500 mb-0.5 tracking-wide">Patient Satisfaction</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">4.9 <span className="text-sm font-bold text-slate-400">/ 5.0</span></div>
         </div>

         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
               <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-widest">Target</span>
            </div>
            <div className="text-[13px] font-bold text-slate-500 mb-0.5 tracking-wide">Completion Rate</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">98.2<span className="text-lg">%</span></div>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         
         {/* CSS Bar Chart - Patient Volume Trends */}
         <div className="lg:col-span-2 bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] flex flex-col min-h-[400px]">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">Patient Volume Trends</h3>
                  <p className="text-[13px] font-medium text-slate-500">In-person vs. Telehealth visits</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0550c7]"></span><span className="text-[11px] font-bold text-slate-600">In-Person</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#a5b4fc]"></span><span className="text-[11px] font-bold text-slate-600">Telehealth</span></div>
               </div>
            </div>

            <div className="flex-1 flex items-end justify-between relative mt-4">
               {/* Background Grid Lines rendering 3 horizontal lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
               </div>
               
               {/* CSS Bars Container - Each Month */}
               {/* Jan */}
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="h-[220px] w-full flex items-end justify-center gap-1 md:gap-2 px-1">
                     <div className="w-full max-w-[40px] bg-[#0550c7] rounded-t-lg transition-all duration-1000 animate-in slide-in-from-bottom" style={{ height: '55%' }}></div>
                     <div className="w-full max-w-[40px] bg-[#a5b4fc] rounded-t-lg transition-all duration-1000 delay-75 animate-in slide-in-from-bottom" style={{ height: '30%' }}></div>
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 mt-4 uppercase tracking-widest">Jan</div>
               </div>

               {/* Feb */}
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="h-[220px] w-full flex items-end justify-center gap-1 md:gap-2 px-1">
                     <div className="w-full max-w-[40px] bg-[#0550c7] rounded-t-lg transition-all duration-1000 delay-100 animate-in slide-in-from-bottom" style={{ height: '70%' }}></div>
                     <div className="w-full max-w-[40px] bg-[#a5b4fc] rounded-t-lg transition-all duration-1000 delay-150 animate-in slide-in-from-bottom" style={{ height: '25%' }}></div>
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 mt-4 uppercase tracking-widest">Feb</div>
               </div>

               {/* Mar */}
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="h-[220px] w-full flex items-end justify-center gap-1 md:gap-2 px-1">
                     <div className="w-full max-w-[40px] bg-[#0550c7] rounded-t-lg transition-all duration-1000 delay-200 animate-in slide-in-from-bottom" style={{ height: '40%' }}></div>
                     <div className="w-full max-w-[40px] bg-[#a5b4fc] rounded-t-lg transition-all duration-1000 delay-200 animate-in slide-in-from-bottom" style={{ height: '55%' }}></div>
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 mt-4 uppercase tracking-widest">Mar</div>
               </div>
               
               {/* Apr */}
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="h-[220px] w-full flex items-end justify-center gap-1 md:gap-2 px-1">
                     <div className="w-full max-w-[40px] bg-[#0550c7] rounded-t-lg transition-all duration-1000 delay-300 animate-in slide-in-from-bottom" style={{ height: '75%' }}></div>
                     <div className="w-full max-w-[40px] bg-[#a5b4fc] rounded-t-lg transition-all duration-1000 delay-300 animate-in slide-in-from-bottom" style={{ height: '40%' }}></div>
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 mt-4 uppercase tracking-widest">Apr</div>
               </div>

               {/* May */}
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="h-[220px] w-full flex items-end justify-center gap-1 md:gap-2 px-1">
                     <div className="w-full max-w-[40px] bg-[#0550c7] rounded-t-lg transition-all duration-1000 delay-[400ms] animate-in slide-in-from-bottom" style={{ height: '60%' }}></div>
                     <div className="w-full max-w-[40px] bg-[#a5b4fc] rounded-t-lg transition-all duration-1000 delay-[400ms] animate-in slide-in-from-bottom" style={{ height: '35%' }}></div>
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 mt-4 uppercase tracking-widest">May</div>
               </div>

               {/* Jun */}
               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="h-[220px] w-full flex items-end justify-center gap-1 md:gap-2 px-1">
                     <div className="w-full max-w-[40px] bg-[#0550c7] rounded-t-lg transition-all duration-1000 delay-[500ms] animate-in slide-in-from-bottom" style={{ height: '85%' }}></div>
                     <div className="w-full max-w-[40px] bg-[#a5b4fc] rounded-t-lg transition-all duration-1000 delay-[500ms] animate-in slide-in-from-bottom" style={{ height: '20%' }}></div>
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-400 mt-4 uppercase tracking-widest">Jun</div>
               </div>
            </div>
         </div>

         {/* Common Diagnoses Line Charts */}
         <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 tracking-tight">Common Diagnoses</h3>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-bold text-[13px] text-slate-800">Hypertension</span>
                     <span className="font-extrabold text-[12px] text-slate-500">342 cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="bg-[#0550c7] h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-bold text-[13px] text-slate-800">Type 2 Diabetes</span>
                     <span className="font-extrabold text-[12px] text-slate-500">218 cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="bg-[#0550c7] h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-bold text-[13px] text-slate-800">Asthma</span>
                     <span className="font-extrabold text-[12px] text-slate-500">156 cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="bg-[#0550c7] h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-bold text-[13px] text-slate-800">Hyperlipidemia</span>
                     <span className="font-extrabold text-[12px] text-slate-500">124 cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="bg-[#0550c7] h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-bold text-[13px] text-slate-800">Anxiety Disorders</span>
                     <span className="font-extrabold text-[12px] text-slate-500">98 cases</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="bg-[#0550c7] h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
               <button className="text-[13px] font-bold text-primary-600 hover:text-primary-800 transition-colors">View All Diagnoses</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Patient Feedback */}
         <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Patient Feedback</h3>
               <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest">Recent Reviews</span>
            </div>

            <div className="space-y-6">
               <div className="border-s-2 border-orange-400 ps-4 py-1">
                  <div className="flex gap-1 mb-2">
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <span className="text-[11px] font-bold text-slate-500 ms-2">Today</span>
                  </div>
                  <p className="text-[14px] font-bold text-slate-800 leading-relaxed">
                     "Extremely thorough consultation. Dr. Smith took the time to explain my medication adjustments clearly."
                  </p>
               </div>

               <div className="border-s-2 border-orange-400 ps-4 py-1">
                  <div className="flex gap-1 mb-2">
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                     <Star className="w-3.5 h-3.5 fill-transparent text-orange-200" />
                     <span className="text-[11px] font-bold text-slate-500 ms-2">Yesterday</span>
                  </div>
                  <p className="text-[14px] font-bold text-slate-700 leading-relaxed">
                     "Great experience, though the waiting room was a bit crowded. The clinical care was top-notch."
                  </p>
               </div>
            </div>
         </div>

         {/* Efficiency Insights Card */}
         <div className="bg-[#0550c7] rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-900/20">
            <div className="absolute top-0 end-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h3 className="text-2xl font-extrabold tracking-tight mb-2 relative z-10">Efficiency Insights</h3>
            <p className="text-[15px] font-medium text-blue-100 max-w-sm mb-10 relative z-10">
               Based on last week's data, your schedule optimization has improved.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
               <div className="bg-white/10 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                  <div className="text-[9px] font-extrabold text-blue-200 uppercase tracking-widest mb-1 opacity-80">Peak Time</div>
                  <div className="text-[20px] font-extrabold tracking-tight">10 AM - 12 PM</div>
               </div>
               <div className="bg-white/10 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                  <div className="text-[9px] font-extrabold text-blue-200 uppercase tracking-widest mb-1 opacity-80">Buffer Used</div>
                  <div className="text-[20px] font-extrabold tracking-tight flex items-baseline gap-1">14 <span className="text-sm">mins/day</span></div>
               </div>
            </div>

            <button className="bg-white text-[#0550c7] font-extrabold text-[14px] px-8 py-3.5 rounded-xl transition-all hover:bg-slate-50 hover:-translate-y-0.5 relative z-10 shadow-sm">
               Generate Full Report
            </button>
         </div>

      </div>

    </div>
  )
}
