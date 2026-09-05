import React from 'react';
import Link from 'next/link';
import { Compass, Home, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full p-8 md:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500]">
            404 • Page Not Found
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Lost in the Admission Jungle?
          </h1>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page, circular, or guide you are looking for might have been moved or does not exist yet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          <Link
            href="/universities"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/60 hover:border-orange-200 transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#FF5500]" />
              <div>
                <div className="text-xs font-bold text-slate-900">Universities</div>
                <div className="text-[10px] text-slate-500">Explore 40+ universities</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/eligibility"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/60 hover:border-orange-200 transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#FF5500]" />
              <div>
                <div className="text-xs font-bold text-slate-900">Eligibility Qualifier</div>
                <div className="text-[10px] text-slate-500">Calculate GPA eligibility</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E64D00] text-white font-bold text-xs shadow-md transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to EduGuide Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
