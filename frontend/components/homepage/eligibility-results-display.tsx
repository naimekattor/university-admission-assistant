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
      <div className="p-5 rounded-xl bg-white border border-[var(--eg-border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--eg-success)]" />
            <h3 className="font-bold text-lg text-[var(--eg-text-primary)]">
              Your Eligibility Results
            </h3>
          </div>
          {profile && (
            <p className="text-xs text-[var(--eg-text-secondary)] mt-1">
              Evaluated for <span className="font-semibold text-[var(--eg-text-primary)]">{profile.group}</span> group • SSC GPA: <span className="font-mono font-bold text-[var(--eg-text-primary)]">{profile.sscGPA.toFixed(2)}</span> • HSC GPA: <span className="font-mono font-bold text-[var(--eg-text-primary)]">{profile.hscGPA.toFixed(2)}</span> • Passing Year: <span className="font-semibold text-[var(--eg-text-primary)]">{profile.passingYear}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{eligibleCount} Eligible Units</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
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
                  ? 'bg-white border-emerald-200 hover:border-emerald-400 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              } flex flex-col justify-between space-y-4`}
            >
              {/* Header: University & Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-[var(--eg-text-primary)]">
                    {res.university}
                  </h4>
                  <p className="text-xs text-[var(--eg-text-secondary)]">
                    {res.department || res.program || 'Undergraduate Admission'}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    isEligible
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {isEligible ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
                  <div className="flex items-start gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{res.satisfiedRequirements[0]}</span>
                  </div>
                )}
                {res.unsatisfiedRequirements && res.unsatisfiedRequirements.length > 0 && (
                  <div className="flex items-start gap-1.5 text-rose-600">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{res.unsatisfiedRequirements[0]}</span>
                  </div>
                )}
              </div>

              {/* Dates & Cutoff */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--eg-border)]">
                <div>
                  <span className="text-[11px] text-[var(--eg-text-muted)]">Application Deadline:</span>
                  <div className="font-medium text-[var(--eg-text-primary)]">{res.deadline || 'Sep 18, 2026'}</div>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--eg-text-muted)]">Admission Test:</span>
                  <div className="font-medium text-[var(--eg-text-primary)]">{res.testDate || 'Sep 28, 2026'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Link href="/prepare" className="flex-1">
                  <button className="w-full py-2 px-3 bg-[var(--eg-primary)] hover:bg-[var(--eg-primary-hover)] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Prepare for this University</span>
                  </button>
                </Link>
                <Link href="/universities" className="shrink-0">
                  <button className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition flex items-center gap-1">
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
