import { Users, Activity, DollarSign, TrendingUp, UserPlus, HeartPulse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {t('adminDashboard.title')}, {i18n.language.startsWith('ar') 
              ? (currentUser?.name_ar || currentUser?.name || 'مدير النظام') 
              : (currentUser?.name_en || currentUser?.name || 'System Administrator')}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">{t('adminDashboard.desc')}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> {t('adminDashboard.export')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('adminDashboard.totalPatients'), value: '12,450', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'up' },
          { label: t('adminDashboard.activeDoctors'), value: '142', change: '+3', icon: HeartPulse, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'up' },
          { label: t('adminDashboard.visitsThisMonth'), value: '3,892', change: '+8%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: 'up' },
          { label: t('adminDashboard.platformRevenue'), value: '$840.4k', change: '+15%', icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-100', trend: 'up' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{stat.change}</span>
            </div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-800">{t('adminDashboard.platformUtilization')}</h3>
            <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg py-1.5 focus:ring-0">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 pb-2 relative">
             {/* Mock Chart */}
             <div className="absolute top-0 w-full border-t border-dashed border-slate-200"></div>
             <div className="absolute top-1/2 w-full border-t border-dashed border-slate-200"></div>
             {[40, 70, 45, 90, 65, 85, 100, 60, 80, 50, 75, 95].map((h, i) => (
               <div key={i} className="w-full bg-indigo-100 rounded-t-sm hover:bg-indigo-200 transition-colors group relative z-10" style={{ height: `${h}%` }}>
                 <div className="absolute bottom-full start-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   {h * 12}
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 capitalize">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
