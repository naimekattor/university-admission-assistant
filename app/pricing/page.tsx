'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3 border-b border-slate-800 pb-8">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" /> EduGuide SaaS Membership Plans
        </div>
        <h1 className="text-4xl font-black text-white">Invest in Your Admission Success</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Start for free to explore universities and basic practice, or upgrade to Premium for unlimited AI tutoring, mock test series, and personalized study plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FREE PLAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Free Starter</span>
              <h2 className="text-3xl font-extrabold text-white">৳ 0 <span className="text-xs font-normal text-slate-400">/ forever</span></h2>
            </div>
            <p className="text-xs text-slate-300">Basic access to explore Bangladeshi universities, check eligibility, and attempt sample practice questions.</p>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> University Explorer & Requirements</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Deterministic Eligibility Checker</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> AI Admission Advisor (10 queries/day)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Sample MCQ Practice Drills</li>
            </ul>
          </div>

          <Link href="/prepare">
            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition">
              Get Started Free
            </button>
          </Link>
        </div>

        {/* PREMIUM PLAN */}
        <div className="bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500 rounded-2xl p-6 space-y-6 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Recommended
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase">Premium Admission Pass</span>
              <h2 className="text-3xl font-extrabold text-white">৳ 1,490 <span className="text-xs font-normal text-slate-400">/ season pass</span></h2>
            </div>
            <p className="text-xs text-slate-300">Complete AI-powered personal coach pass for HSC candidates preparing for BUET, DU, Medical & GST Cluster.</p>

            <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Unlimited AI Tutor Problem Solving</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Full 30-Day Personalized Study Plans</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Complete Admission Mock Test Series</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Personal Mistake Notebook Analytics</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Interactive Visual Lesson Library</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Spaced Revision Scheduler</li>
            </ul>
          </div>

          <Link href="/prepare">
            <button className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition">
              Subscribe to Premium Admission Pass
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
