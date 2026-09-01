'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Bell, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdmissionInfoCenterPage() {
  const circularTimeline = [
    { step: 1, title: 'Official Circular Publication', date: 'November 2025', status: 'completed' },
    { step: 2, title: 'Application Form Opens', date: 'December 01, 2025', status: 'completed' },
    { step: 3, title: 'Application Submission Deadline', date: 'December 31, 2025', status: 'active' },
    { step: 4, title: 'Admit Card Download', date: 'January 10, 2026', status: 'upcoming' },
    { step: 5, title: 'Admission Preliminary Exam', date: 'January 25, 2026', status: 'upcoming' },
    { step: 6, title: 'Final Written Exam & Merit List', date: 'February 15, 2026', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Bell className="w-4 h-4" /> Admission Intelligence & Updates
        </div>
        <h1 className="text-3xl font-extrabold text-white">Bangladesh Admission Circulars 2026</h1>
        <p className="text-sm text-slate-400">
          Track official application deadlines, exam schedules, and circular updates for all public & engineering universities.
        </p>
      </div>

      {/* Visual Circular Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span>BUET Admission 2026 Official Timeline</span>
        </h2>

        <div className="space-y-4">
          {circularTimeline.map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : item.status === 'active' ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}>
                {item.step}
              </div>
              <div className="flex-1 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-100">{item.title}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> {item.date}
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : item.status === 'active' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {item.status === 'completed' ? 'Completed' : item.status === 'active' ? 'Active Deadline' : 'Upcoming'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Want to verify if you meet these requirements?</div>
          <div className="text-xs text-slate-400">Run our deterministic eligibility checker based on your SSC & HSC marks.</div>
        </div>
        <Link href="/eligibility">
          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2">
            Check My Eligibility <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
