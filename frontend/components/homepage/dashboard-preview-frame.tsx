'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Gauge,
  BookOpen,
  FolderClosed,
  Bot,
  MessageSquare,
  Users,
  Calendar,
  Video,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Layers,
  MoreHorizontal,
  Palette,
  Atom,
  GraduationCap,
} from 'lucide-react';

export function DashboardPreviewFrame() {
  return (
    <div id="dashboard-preview" className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* ── BROWSER / TABLET DEVICE FRAME ── */}
      <div className="rounded-[2rem] border-[7px] border-slate-800 bg-[#FAFAF9] shadow-2xl overflow-hidden max-w-6xl mx-auto">
        
        {/* ── 1. DASHBOARD APP TOP BAR ── */}
        <div className="bg-white border-b border-slate-200/80 px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FF5500] text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                EG
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                Edu<span className="text-[#FF5500]">Guide</span>
              </span>
            </div>

            <h2 className="font-extrabold text-sm text-slate-900 hidden sm:block">Overview</h2>
          </div>

          {/* Search Box in Top Bar */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block">
            <input
              type="text"
              readOnly
              value="Find universities, circulars, or subjects..."
              className="w-full pl-3.5 pr-8 py-1.5 rounded-full bg-slate-100/80 text-[11px] text-slate-500 border border-slate-200/60 focus:outline-none cursor-default"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
              <Search className="w-3 h-3" />
            </div>
          </div>

          {/* Top Bar Right: Notification & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5500]" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                ST
              </div>
              <span className="text-xs font-bold text-slate-900 hidden sm:inline">HSC Candidate</span>
            </div>
          </div>
        </div>

        {/* ── 2. DASHBOARD BODY WITH SIDEBAR & MAIN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          
          {/* Left Sidebar Navigation (2.5 cols) */}
          <div className="md:col-span-3 bg-white border-r border-slate-200/80 p-4 space-y-1 text-xs font-medium text-slate-600 hidden md:block">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold shadow-xs">
              <Gauge className="w-4 h-4 text-white" />
              <span>Overview</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span>Universities</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
              <FolderClosed className="w-4 h-4 text-slate-500" />
              <span>Circulars</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
              <Bot className="w-4 h-4 text-[#FF5500]" />
              <span className="text-[#FF5500] font-semibold">AI Tutor</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Mock Tests</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Study Groups</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Deadlines</span>
            </div>
          </div>

          {/* Right Main Dashboard Area (9.5 cols) */}
          <div className="md:col-span-9 p-4 sm:p-5 space-y-4">
            
            {/* ── TOP ROW OF 3 MAIN CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Card 1: Time Spent Bar Chart */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Study Hours</span>
                    <div className="text-sm font-black text-slate-900 leading-tight">13.6 Hours</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-orange-50 text-[#FF5500] flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[9px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" /> MCQs
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Mocks
                  </div>
                </div>

                <div className="relative pt-3">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-900 text-white text-[8px] font-mono font-bold shadow-2xs">
                    12.5 H
                  </div>
                  <div className="h-14 flex items-end justify-between gap-1 border-b border-slate-100 pb-1">
                    {[
                      { h: 30, c: 'bg-slate-800' },
                      { h: 45, c: 'bg-slate-800' },
                      { h: 60, c: 'bg-slate-800' },
                      { h: 35, c: 'bg-slate-800' },
                      { h: 85, c: 'bg-[#FF5500]' },
                      { h: 55, c: 'bg-slate-800' },
                      { h: 40, c: 'bg-slate-800' },
                      { h: 70, c: 'bg-[#FF5500]' },
                      { h: 90, c: 'bg-[#FF5500]' },
                      { h: 50, c: 'bg-slate-800' },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-t ${b.c}`}
                        style={{ height: `${b.h * 0.45}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-[7px] font-mono text-slate-400">
                  <span>J</span>
                  <span>F</span>
                  <span>M</span>
                  <span>A</span>
                  <span>M</span>
                  <span>J</span>
                  <span>J</span>
                  <span>A</span>
                  <span>S</span>
                  <span>D</span>
                </div>
              </div>

              {/* Card 2: Performance Circular Gauge */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-800">Mock Accuracy</span>
                  <div className="w-5 h-5 rounded-full bg-orange-50 text-[#FF5500] flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="my-1 flex items-center justify-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3"
                        strokeDasharray="1, 3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#FF5500]"
                        strokeDasharray="80, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-sm font-black text-slate-900 font-mono leading-none">80%</div>
                      <div className="text-[8px] text-slate-400 font-medium">Readiness</div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
                  Target: BUET Ka Unit
                </div>
              </div>

              {/* Card 3: Upcoming Lesson / Test */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div className="font-bold text-xs text-slate-900">Upcoming Live Drill</div>

                {/* Lesson 1 */}
                <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF5500] flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-800 truncate max-w-[90px]">BUET Physics</div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> 5:30hrs
                      </div>
                    </div>
                  </div>
                  <Link href="/prepare">
                    <button className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-2xs">
                      Join
                    </button>
                  </Link>
                </div>

                {/* Lesson 2 */}
                <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Atom className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-slate-800 truncate max-w-[90px]">DU Chem Drill</div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> 5:30hrs
                      </div>
                    </div>
                  </div>
                  <Link href="/prepare">
                    <button className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5500] text-[10px] font-bold">
                      Join
                    </button>
                  </Link>
                </div>
              </div>

            </div>

            {/* ── BOTTOM ROW OF STAT CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Stat 1 */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">2h 37m Avg.</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">21 Chapters</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">06 Complete</div>
                </div>
              </div>

              {/* Stat 4: More options */}
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
