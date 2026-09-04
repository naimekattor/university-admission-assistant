'use client';

import React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  TrendingUp,
  Award,
  Sparkles,
  Building2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { CommunityTag } from '@/lib/community-types';
import { ContributorBadge } from './contributor-badge';

interface CommunitySidebarProps {
  popularTags?: CommunityTag[];
  onSelectTag?: (tag: string) => void;
}

export function CommunitySidebar({ popularTags = [], onSelectTag }: CommunitySidebarProps) {
  const verifiedContributors = [
    {
      name: 'Dr. Shahriar Karim',
      role: 'teacher' as const,
      badge: 'Verified Physics Educator',
      institution: 'Ex-BUET Physics Faculty',
      answers: 48,
    },
    {
      name: 'Tanvir Ahmed',
      role: 'senior' as const,
      badge: 'Senior Mentor (BUET CSE)',
      institution: 'BUET CSE \'21',
      answers: 32,
    },
    {
      name: 'Fariha Yasmin',
      role: 'senior' as const,
      badge: 'Senior Mentor (DMC)',
      institution: 'Dhaka Medical College',
      answers: 26,
    },
  ];

  const universityShortcuts = [
    { name: 'BUET Questions', count: '140+ discussions', slug: 'buet' },
    { name: 'DU A Unit & Ka', count: '98+ discussions', slug: 'du' },
    { name: 'Medical Admission', count: '85+ discussions', slug: 'medical' },
    { name: 'CKRUET Cluster', count: '64+ discussions', slug: 'ckruet' },
  ];

  return (
    <aside className="space-y-5">
      {/* ── 1. ASK QUESTION CTA CARD ── */}
      <div className="bg-gradient-to-br from-[#FF5500] to-[#E64D00] rounded-2xl p-5 text-white shadow-md shadow-orange-500/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-extrabold text-base mb-1 tracking-tight">
            Have a Question?
          </h4>
          <p className="text-xs text-orange-100 mb-4 leading-relaxed font-normal">
            Ask admission questions, chapter problems or equations. Seniors and educators respond quickly. No login required!
          </p>
          <Link
            href="/community/ask"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-[#FF5500] hover:bg-orange-50 font-bold text-xs shadow-sm transition"
          >
            <span>Ask a Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 2. ASK AI ADVISOR COMPANION ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900">
          <Bot className="w-4 h-4 text-[#FF5500]" />
          <span>Need Instant Assistance?</span>
        </div>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Ask EduGuide AI Advisor to evaluate your eligibility, check circulars, or solve problems instantly.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5500] hover:underline"
        >
          <span>Open AI Advisor</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── 3. POPULAR TOPICS & TAGS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Popular Topics</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((t) => (
            <button
              key={t.id || t.slug}
              type="button"
              onClick={() => onSelectTag?.(t.name)}
              className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 text-slate-700 hover:text-[#FF5500] text-xs font-medium transition cursor-pointer"
            >
              #{t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. TARGET UNIVERSITY SHORTCUTS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>University Hubs</span>
        </div>
        <div className="space-y-2">
          {universityShortcuts.map((uni, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              onClick={() => onSelectTag?.(uni.slug)}
            >
              <span className="text-xs font-semibold text-slate-800">{uni.name}</span>
              <span className="text-[11px] text-slate-400 font-mono">{uni.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. TOP VERIFIED EDUCATORS & SENIORS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-[#FF5500]" />
          <span>Verified Mentors</span>
        </div>
        <div className="space-y-3">
          {verifiedContributors.map((c, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 mt-0.5">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-xs font-bold text-slate-900 truncate">{c.name}</span>
                </div>
                <ContributorBadge role={c.role} customBadge={c.badge} />
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{c.institution}</span>
                  <span className="font-semibold text-emerald-600">{c.answers} answers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
