'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>EDUGUIDE PASSES & PLANS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Invest in Your Admission Success
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Start for free to explore universities and basic practice, or upgrade to Premium for unlimited AI tutoring, timed mock tests, and personalized revision queues.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE PLAN */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs hover:border-orange-300 transition">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Free Starter</span>
                <h2 className="text-3xl font-black text-slate-900">৳ 0 <span className="text-xs font-normal text-slate-500">/ forever</span></h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Basic access to explore Bangladesh universities, check eligibility criteria, and attempt sample practice questions.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Official Circulars & GPA Engine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Deterministic Eligibility Qualifier</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> AI Admission Advisor (10 queries/day)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Basic Chapter MCQ Drills</li>
              </ul>
            </div>

            <Link href="/prepare">
              <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-full transition cursor-pointer">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-white border-2 border-[#FF5500] rounded-3xl p-7 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-2xl shadow-sm font-mono">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#FF5500] uppercase font-mono">Admission Season Pass</span>
                <h2 className="text-3xl font-black text-slate-900">৳ 1,490 <span className="text-xs font-normal text-slate-500">/ full season</span></h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete AI coach pass for HSC candidates targeting BUET, DU Ka/Kha, Medical & GST Cluster admissions.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF5500] shrink-0" /> Unlimited 24/7 AI Admission Tutor</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF5500] shrink-0" /> Past 15 Years Solved Question Bank</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF5500] shrink-0" /> Full-Length Timed Mock Test Simulator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF5500] shrink-0" /> Automated Mistake Notebook & Spaced Repetition</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF5500] shrink-0" /> Daily Weak Area Diagnostic Analytics</li>
              </ul>
            </div>

            <Link href="/prepare">
              <button className="w-full py-3 bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white text-xs font-bold rounded-full shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Unlock Season Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
