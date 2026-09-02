'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, AlertCircle, XCircle, ArrowRight, Calendar, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

interface EligibilityResultsDisplayProps {
  evaluation: {
    profile?: {
      sscGPA: number;
      hscGPA: number;
      group: string;
      passingYear: number;
    };
    totalEvaluated: number;
    eligibleCount: number;
    ineligibleCount: number;
    results: Array<{
      id: string;
      university: string;
      department?: string;
      program?: string;
      status: string;
      isEligible: boolean;
      deadline?: string;
      testDate?: string;
      minGpa?: string;
      gpaMargin?: number;
      satisfiedRequirements?: string[];
      unsatisfiedRequirements?: string[];
    }>;
  };
}

export function EligibilityResultsDisplay({ evaluation }: EligibilityResultsDisplayProps) {
  const { profile, results = [], eligibleCount = 0, totalEvaluated = 0 } = evaluation;

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── PROFILE & SUMMARY STATS ── */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">
              Your Eligibility Results
            </h3>
          </div>
          {profile && (
            <p className="text-xs text-slate-300 mt-1">
              Evaluated for <span className="font-semibold text-amber-400">{profile.group}</span> group • SSC GPA: <span className="font-mono font-bold text-white">{profile.sscGPA.toFixed(2)}</span> • HSC GPA: <span className="font-mono font-bold text-white">{profile.hscGPA.toFixed(2)}</span> • Passing Year: <span className="font-semibold text-white">{profile.passingYear}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{eligibleCount} Eligible Units</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium">
            <span>{totalEvaluated} Evaluated</span>
          </div>
        </div>
      </div>

      {/* ── MATCHING UNIVERSITIES GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((res, idx) => {
          const isEligible = res.isEligible || res.status === 'eligible';

          return (
            <div
              key={res.id || idx}
              className={`p-5 rounded-xl border transition-all ${
                isEligible
                  ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/50 shadow-2xs'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-75'
              } flex flex-col justify-between space-y-4`}
            >
              {/* Header: University & Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-white">
                    {res.university}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {res.department || res.program || 'Undergraduate Admission'}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    isEligible
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {isEligible ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Eligible</span>
                    </>
                  ) : (
                    <span>Not Eligible</span>
                  )}
                </span>
              </div>

              {/* Requirement Bullet Notes */}
              <div className="space-y-1 text-xs">
                {res.satisfiedRequirements && res.satisfiedRequirements.length > 0 && (
                  <div className="flex items-start gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{res.satisfiedRequirements[0]}</span>
                  </div>
                )}
                {res.unsatisfiedRequirements && res.unsatisfiedRequirements.length > 0 && (
                  <div className="flex items-start gap-1.5 text-rose-400">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{res.unsatisfiedRequirements[0]}</span>
                  </div>
                )}
              </div>

              {/* Dates & Cutoff */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400">Application Deadline:</span>
                  <div className="font-medium text-slate-200">{res.deadline || 'Sep 18, 2026'}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Admission Test:</span>
                  <div className="font-medium text-amber-300">{res.testDate || 'Sep 28, 2026'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Link href="/prepare" className="flex-1">
                  <button className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Prepare for this University</span>
                  </button>
                </Link>
                <Link href="/universities" className="shrink-0">
                  <button className="py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition flex items-center gap-1">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
