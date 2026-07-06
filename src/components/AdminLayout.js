import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, BriefcaseMedical } from 'lucide-react';
import TopNav from './TopNav';
import { cn } from '../utils/cn';

export default function AdminLayout({ title, tabs, mobileBrandLabel = 'Admin Portal' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-x-hidden">
      <TopNav title={title} tabs={tabs} showSearch={true} onMenuClick={toggleMobileMenu} />

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar/Drawer */}
      <aside className={cn(
        "fixed inset-y-0 start-0 w-64 bg-white border-e border-slate-100 flex flex-col py-6 z-[70] transition-transform duration-300 lg:hidden shadow-2xl",
        isMobileMenuOpen ? "translate-x-0" : (isRtl ? "translate-x-full" : "-translate-x-full")
      )}>
        <div className="px-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 rounded flex items-center justify-center p-2">
                  <BriefcaseMedical className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-primary-700 tracking-tight text-sm">{mobileBrandLabel}</span>
            </div>
            <button onClick={toggleMobileMenu} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <NavLink
                  to={tab.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-6 py-3 font-medium transition-colors text-sm",
                      isActive
                        ? "bg-slate-50 text-primary-600 border-s-2 border-primary-600"
                        : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {tab.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
