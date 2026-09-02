'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, AlertCircle, XCircle, ArrowRight, Calendar, BookOpen, ExternalLink } from 'lucide-react';

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
    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* ── SUMMARY STATS BAR ── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF5500]" />
            <h3 className="font-bold text-base text-slate-900">
              Evaluation Results
            </h3>
          </div>
          {profile && (
            <p className="text-xs text-slate-600 mt-0.5">
              Evaluated for <span className="font-bold text-[#FF5500]">{profile.group}</span> • SSC: <span className="font-mono font-bold text-slate-900">{profile.sscGPA.toFixed(2)}</span> • HSC: <span className="font-mono font-bold text-slate-900">{profile.hscGPA.toFixed(2)}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{eligibleCount} Eligible Units</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <span>{totalEvaluated} Checked</span>
          </div>
        </div>
      </div>

      {/* ── MATCHING UNITS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {results.map((res, idx) => {
          const isEligible = res.isEligible || res.status === 'eligible';

          return (
            <div
              key={res.id || idx}
              className={`p-5 rounded-2xl border transition-all ${
                isEligible
                  ? 'bg-white border-emerald-200 shadow-xs hover:border-emerald-300'
                  : 'bg-slate-50/70 border-slate-200 opacity-75'
              } flex flex-col justify-between space-y-3.5`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {res.university}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {res.department || res.program || 'Undergraduate Admission'}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                    isEligible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isEligible ? 'Eligible' : 'Ineligible'}
                </span>
              </div>

              {/* Requirement Notes */}
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

              {/* Exam date & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 font-medium">
                  Test Date: <span className="font-bold text-[#FF5500]">{res.testDate || 'TBA'}</span>
                </div>
                <Link href="/prepare">
                  <button className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF5500] to-[#FF6B00] text-white text-xs font-bold rounded-full shadow-2xs hover:shadow transition flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Prepare</span>
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
