import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';

export default function PatientLayout({ title, tabs }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <TopNav title={title} tabs={tabs} showSearch={title === "Clinical Portal"} />
      <main className="flex-1 w-full max-w-[1280px] mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
