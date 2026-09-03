'use client';

import React from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  AlertTriangle,
  CheckCircle2,
  Users,
  Bot,
  GraduationCap,
  Database,
  ArrowRight,
  TrendingUp,
  Clock,
  PlusCircle,
  FileCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const attentionAlerts = [
    {
      id: 'a1',
      severity: 'high',
      title: 'BUET Admission 2026 application deadline requires verification',
      time: 'Updated 2 hours ago',
      actionLabel: 'Verify Deadline',
      href: '/admin/circulars',
    },
    {
      id: 'a2',
      severity: 'medium',
      title: '3 new MCQ submissions in Chemistry Chapter 04 missing detailed explanations',
      time: 'Submitted today',
      actionLabel: 'Review Questions',
      href: '/admin/questions',
    },
    {
      id: 'a3',
      severity: 'low',
      title: 'DU Ka Unit official circular PDF ready for pgvector re-indexing',
      time: 'Uploaded 1 day ago',
      actionLabel: 'Index Chunks',
      href: '/admin/knowledge',
    },
  ];

  const contentStatus = [
    {
      type: 'Universities & Circulars',
      published: 34,
      pending: 2,
      total: 36,
      icon: GraduationCap,
      href: '/admin/universities',
      iconColor: 'text-[#FF5500] bg-orange-50 border-orange-200/60',
    },
    {
      type: 'Curriculum Lessons',
      published: 128,
      pending: 12,
      total: 140,
      icon: BookOpen,
      href: '/admin/curriculum',
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200/60',
    },
    {
      type: 'Question Bank MCQs',
      published: 4850,
      pending: 45,
      total: 4895,
      icon: CheckCircle2,
      href: '/admin/questions',
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
    },
    {
      type: 'SEO Guides & Articles',
      published: 24,
      pending: 3,
      total: 27,
      icon: FileCheck,
      href: '/admin/guides',
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200/60',
    },
  ];

  return (
    <AdminShell
      pageTitle="Platform Operations Dashboard"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]}
    >
      <div className="space-y-6">
        {/* ── 1. WELCOME & OPERATIONS HERO CARD ── */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          {/* Subtle modern ambient gradient glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-orange-400/15 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 right-1/4 w-64 h-64 bg-gradient-to-tr from-rose-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#FF5500] border border-orange-200/80">
                  <Sparkles className="w-3.5 h-3.5" />
                  EduGuide Platform Operations
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  System Normal
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Good afternoon, <span className="bg-gradient-to-r from-[#FF5500] via-orange-600 to-amber-500 bg-clip-text text-transparent">Administrator</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
                Here is what requires your verification, management, and publishing today across universities, admissions, and student AI services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/admin/questions"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Question</span>
              </Link>
              <Link
                href="/admin/universities"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 text-xs font-bold shadow-2xs hover:shadow-xs transition cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#FF5500]" />
                <span>Manage Universities</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. KPI METRIC OVERVIEW CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Registered Students */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">1,420</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>+12%</span>
                <span className="text-slate-400 font-normal">• 385 active today</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs group-hover:scale-105 transition shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Questions Solved */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Practice Questions Solved</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">18,450</h3>
              <p className="text-[11px] text-slate-500 font-medium">Across 48 HSC Chapters</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: AI Requests */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-300 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Advisor & Tutor Requests</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">4,890</h3>
              <p className="text-[11px] text-violet-600 font-semibold">Est. Cost: $0.84 USD</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200/60 text-violet-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition shrink-0">
              <Bot className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: RAG Chunks */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">RAG Knowledge Base</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">48 Chunks</h3>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                PostgreSQL pgvector Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition shrink-0">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── 3. HERO "NEEDS ATTENTION" ALERT SECTION ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Items Requiring Operational Attention ({attentionAlerts.length})
                </h3>
                <p className="text-[11px] text-slate-500">Unresolved tasks and admissions deadlines</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Action Required
            </span>
          </div>

          <div className="space-y-2.5">
            {attentionAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-50/70 hover:bg-orange-50/20 border border-slate-200/70 hover:border-orange-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        alert.severity === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : alert.severity === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {alert.severity} Priority
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {alert.title}
                  </div>
                </div>

                <Link href={alert.href} className="shrink-0">
                  <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white group-hover:bg-[#FF5500] text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-[#FF5500] text-xs font-bold transition shadow-2xs cursor-pointer">
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. CONTENT PUBLISHING STATUS MATRIX ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Platform Content Publishing Status
                </h3>
                <p className="text-[11px] text-slate-500">Live PostgreSQL database state vs pending drafts</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Live Database Records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentStatus.map((cs) => {
              const Icon = cs.icon;
              return (
                <Link
                  key={cs.type}
                  href={cs.href}
                  className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 hover:border-orange-300 hover:shadow-xs transition-all space-y-3 block group"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-slate-600 line-clamp-1">{cs.type}</div>
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${cs.iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="text-2xl font-black text-slate-900 font-mono">{cs.published.toLocaleString()}</div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {cs.published} Live
                    </span>
                    {cs.pending > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200/60">
                        {cs.pending} Pending
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">All Synced</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── 5. WEEKLY SYSTEM TRAFFIC & AI TOKEN USAGE (CHART) ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Weekly System Traffic & AI Token Usage
                </h3>
                <p className="text-[11px] text-slate-500">7 Days Activity & Query Volume Trend</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
                <span>AI Queries</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <span>Active Students</span>
              </span>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2.5 sm:gap-4 pt-6 px-3 sm:px-6 bg-gradient-to-b from-slate-50/60 to-slate-100/40 rounded-2xl border border-slate-200/60">
            {[
              { day: 'Mon', queries: 420, users: 110 },
              { day: 'Tue', queries: 580, users: 145 },
              { day: 'Wed', queries: 720, users: 180 },
              { day: 'Thu', queries: 890, users: 220 },
              { day: 'Fri', queries: 950, users: 250 },
              { day: 'Sat', queries: 1120, users: 290 },
              { day: 'Sun', queries: 1350, users: 340 },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-black text-[#FF5500] opacity-0 group-hover:opacity-100 transition">
                  {bar.queries}
                </span>
                <div className="w-full flex gap-1 items-end h-28 max-w-[42px]">
                  <div
                    className="flex-1 bg-gradient-to-t from-[#FF5500] to-orange-400 rounded-t-lg shadow-2xs group-hover:brightness-110 transition-all cursor-pointer"
                    style={{ height: `${(bar.queries / 1400) * 100}%` }}
                    title={`${bar.queries} AI queries`}
                  />
                  <div
                    className="flex-1 bg-gradient-to-t from-slate-800 to-slate-600 rounded-t-lg shadow-2xs group-hover:brightness-110 transition-all cursor-pointer"
                    style={{ height: `${(bar.users / 350) * 100}%` }}
                    title={`${bar.users} active students`}
                  />
                </div>
                <span className="text-[11px] text-slate-500 font-bold group-hover:text-slate-900 transition">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
