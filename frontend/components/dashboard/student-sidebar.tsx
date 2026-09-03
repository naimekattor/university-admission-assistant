'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Award,
  BookOpen,
  CheckSquare,
  FileText,
  AlertTriangle,
  School,
  Sparkles,
  TrendingUp,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface Props {
  studentName?: string;
  targetGoal?: string;
  daysRemaining?: number;
  syllabusProgress?: number;
}

export function StudentSidebar({
  studentName = 'Naim',
  targetGoal = 'BUET CSE',
  daysRemaining = 61,
  syllabusProgress = 68,
}: Props) {
  const pathname = usePathname();

  const navGroups = [
    {
      label: 'Core Preparation',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/chat', label: 'AI Advisor & Chat', icon: Bot, badge: 'AI' },
        { href: '/eligibility', label: 'Eligibility Checker', icon: Award },
        { href: '/prepare', label: 'Curriculum & Lessons', icon: BookOpen },
      ],
    },
    {
      label: 'Testing & Mastery',
      items: [
        { href: '/practice', label: 'Practice MCQs', icon: CheckSquare },
        { href: '/mock-tests', label: 'Mock Tests', icon: FileText },
        { href: '/mistakes', label: 'Mistake Notebook', icon: AlertTriangle, badge: '5 Weak' },
      ],
    },
    {
      label: 'Explore & Insights',
      items: [
        { href: '/universities', label: 'Universities', icon: School },
        { href: '/recommendations', label: 'AI Recommendations', icon: Sparkles },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col space-y-4">
      {/* ── 1. STUDENT MINI PROFILE TILE ── */}
      <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-4 shadow-xl shadow-orange-500/5">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center font-extrabold text-[#FF5500] text-sm shadow-inner">
            STU
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-slate-900 truncate">{studentName}</h3>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                PASS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">{targetGoal}</p>
          </div>
        </div>

        {/* Quick Streak Strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Flame className="w-3.5 h-3.5 text-[#FF5500] fill-[#FF5500]" />
            <span className="text-[11px]">7 Day Streak</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#FF5500] font-mono">{daysRemaining}d to Exam</span>
        </div>
      </div>

      {/* ── 2. NAVIGATION MENU GROUPS ── */}
      <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-3 shadow-xl shadow-orange-500/5 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider">
              {group.label}
            </div>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF5500] to-[#E64D00] text-white shadow-md shadow-orange-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#FF5500]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold font-mono uppercase ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-orange-50 text-[#FF5500] border border-orange-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* ── 3. SYLLABUS MASTERY MINI WIDGET ── */}
      <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-4 shadow-xl shadow-orange-500/5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900 text-xs">Syllabus Mastered</span>
          <span className="font-extrabold text-[#FF5500] font-mono text-xs">{syllabusProgress}%</span>
        </div>

        {/* Gradient Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#FF5500] to-[#E64D00] h-full rounded-full transition-all duration-500 shadow-xs shadow-orange-500/50"
            style={{ width: `${syllabusProgress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 font-medium">33 of 48 Chapters Finished</p>

        {/* Ask AI Tutor Mini CTA */}
        <Link href="/chat">
          <button className="w-full mt-1 py-2.5 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-[#FF5500] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer group">
            <Bot className="w-3.5 h-3.5 group-hover:scale-110 transition" />
            <span>Ask AI Advisor</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </button>
        </Link>
      </div>
    </aside>
  );
}
