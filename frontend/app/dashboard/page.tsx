'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Award,
  Bot,
  Play,
  ArrowRight,
  Flame,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { StudentSidebar } from '@/components/dashboard/student-sidebar';

interface DailyTask {
  id: string;
  subject: string;
  topic: string;
  type: 'Lesson' | 'Practice' | 'Revision' | 'Mock Test';
  duration: string;
  completed: boolean;
  href: string;
}

export default function StudentDashboardPage() {
  const studentName = 'Naim';
  const targetUniversity = 'BUET';
  const targetProgram = 'Computer Science & Engineering';
  const daysRemaining = 61;

  // Interactive study plan state
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 'p1',
      subject: 'Physics',
      topic: "Newton's Laws & Linear Momentum",
      type: 'Lesson',
      duration: '35 mins',
      completed: true,
      href: '/prepare/lessons/newtons-second-law-buet-guide',
    },
    {
      id: 'p2',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms & Electrophiles',
      type: 'Lesson',
      duration: '40 mins',
      completed: false,
      href: '/prepare',
    },
    {
      id: 'p3',
      subject: 'Higher Math',
      topic: 'Calculus Differentiation 20 MCQs',
      type: 'Practice',
      duration: '25 mins',
      completed: false,
      href: '/practice',
    },
    {
      id: 'p4',
      subject: 'All Subjects',
      topic: 'Review 5 Mistakes from Mistake Notebook',
      type: 'Revision',
      duration: '15 mins',
      completed: false,
      href: '/mistakes',
    },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-[#FFFDFB] relative overflow-hidden pb-16">
      {/* ── AMBIENT GRADIENT MESH BACKGROUND ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-orange-200/35 via-orange-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── STICKY MODERN STUDENT SIDEBAR ── */}
          <div className="hidden lg:block sticky top-24 shrink-0">
            <StudentSidebar
              studentName={studentName}
              targetGoal={`${targetUniversity} — CSE`}
              daysRemaining={daysRemaining}
              syllabusProgress={68}
            />
          </div>

          {/* ── MAIN DASHBOARD CONTENT AREA ── */}
          <div className="flex-1 min-w-0 space-y-8 w-full">
            {/* ── 1. WELCOME & MOTIVATIONAL HERO BANNER ── */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-500/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider font-mono shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>ADMISSION COMMAND CENTER • HSC 2026 BATCH</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                ON TRACK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Good morning,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF6A1A] to-[#E64D00]">
                {studentName} 👋
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Targeting <strong className="text-slate-900">{targetUniversity} — {targetProgram}</strong>. You have <strong className="text-[#FF5500] font-bold">{daysRemaining} days remaining</strong> until preliminary examinations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/prepare">
              <button className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer">
                <Play className="w-4 h-4 fill-white" />
                <span>Continue Preparation</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ── 2. QUICK METRIC STATS TILES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="font-mono uppercase tracking-wider font-bold">Target Goal</span>
              <Target className="w-4 h-4 text-[#FF5500]" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">BUET — CSE</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Eligible to Apply
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="font-mono uppercase tracking-wider font-bold">Days to Exam</span>
              <Calendar className="w-4 h-4 text-[#FF5500]" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-[#FF5500] mt-1">{daysRemaining} Days</div>
            <span className="inline-block mt-1 text-[11px] text-slate-500 font-medium">
              Prelims: Jan 2026
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="font-mono uppercase tracking-wider font-bold">Study Streak</span>
              <Flame className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <span>7 Days</span>
              <span className="text-sm">🔥</span>
            </div>
            <span className="inline-block mt-1 text-[11px] text-emerald-600 font-bold">
              Active Learning Streak
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="font-mono uppercase tracking-wider font-bold">Syllabus Mastered</span>
              <Award className="w-4 h-4 text-[#FF5500]" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">68%</div>
            <span className="inline-block mt-1 text-[11px] text-slate-500 font-medium">
              33 of 48 Chapters Done
            </span>
          </div>
        </div>

        {/* ── 3. TWO-COLUMN ADAPTIVE DASHBOARD GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN (2/3): ACTIONABLE RECOMMENDATION & TODAY'S PLAN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* HERO SECTION: "WHAT SHOULD YOU STUDY NOW?" */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-bold shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider font-mono">
                    AI STUDY RECOMMENDATION
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                  HIGH PRIORITY
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Chemistry • Organic Chemistry
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Electrophilic Aromatic Substitution & Reagents
                </h3>
              </div>

              {/* Diagnostic Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-slate-500">Current Accuracy: </span>
                    <strong className="text-rose-600 font-bold">43%</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <div>
                    <span className="text-slate-500">Allocated Time: </span>
                    <strong className="text-slate-900 font-bold">35 mins</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Weak topic detected from recent practice tests (accuracy 43%). Mastering this chapter is high-yield for BUET & DU Ka Unit examinations.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/prepare/lessons/newtons-second-law-buet-guide">
                  <button className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#E64D00] hover:from-[#E64D00] hover:to-[#D44000] text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition cursor-pointer">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Learning This Topic</span>
                  </button>
                </Link>
                <Link href="/practice">
                  <button className="h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer">
                    <span>Practice 15 MCQs Instead</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </Link>
              </div>
            </div>

            {/* TODAY'S INTERACTIVE PLAN CHECKLIST */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#FF5500]" />
                  <h3 className="text-lg font-extrabold text-slate-900">Today's Study Plan</h3>
                </div>
                <div className="text-xs font-bold font-mono text-slate-600">
                  <span className="text-[#FF5500]">{completedCount}</span> of {tasks.length} Completed
                </div>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-slate-50/60 border-slate-200 text-slate-400'
                        : 'bg-white border-orange-100/90 shadow-2xs hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-[#FF5500] transition cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-[#FF5500]" />
                        )}
                      </button>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${task.completed ? 'text-slate-400' : 'text-slate-700'}`}>
                            {task.subject}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
                            {task.duration}
                          </span>
                        </div>
                        <div className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.topic}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5500] border border-orange-200">
                        {task.type}
                      </span>
                      <Link href={task.href}>
                        <button className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 text-slate-700 hover:text-[#FF5500] text-xs font-bold flex items-center gap-1 transition cursor-pointer">
                          <span>Start</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WEAK TOPICS TO MASTER */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-lg font-extrabold text-slate-900">Weak Topics to Master</h3>
                </div>
                <Link
                  href="/mistakes"
                  className="text-xs font-bold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1 transition"
                >
                  <span>Mistake Notebook</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Chemistry</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 font-mono">
                      58% Error Rate
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Organic Reaction Mechanisms & Isomerism
                  </div>
                  <div className="pt-2">
                    <Link href="/practice">
                      <button className="w-full h-8 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs">
                        <span>Drill 10 MCQs</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Physics</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">
                      45% Error Rate
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Rotational Dynamics & Moment of Inertia
                  </div>
                  <div className="pt-2">
                    <Link href="/practice">
                      <button className="w-full h-8 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs">
                        <span>Drill 10 MCQs</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTINUE LEARNING RESUME WIDGET */}
            <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FF5500] uppercase tracking-wider font-mono">
                  RESUME WHERE YOU LEFT OFF
                </span>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  Physics • Mechanics: Newton's Second Law & Momentum
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Progress: 72% completed • 8 minutes remaining
                </div>
              </div>
              <Link href="/prepare/lessons/newtons-second-law-buet-guide">
                <button className="h-10 px-4 rounded-xl bg-white border border-orange-200 hover:bg-orange-100 text-[#FF5500] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0">
                  <Play className="w-3.5 h-3.5 fill-[#FF5500]" />
                  <span>Continue Lesson</span>
                </button>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN (1/3): GOAL, METRICS & SHORTCUTS */}
          <div className="space-y-6">
            
            {/* TARGET GOAL CARD */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 shadow-xl shadow-orange-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF5500] uppercase tracking-wider font-mono">
                  <Target className="w-4 h-4" />
                  <span>TARGET GOAL</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  ELIGIBLE
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-extrabold text-slate-900">{targetUniversity}</div>
                <div className="text-xs text-slate-600 font-semibold">{targetProgram}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-[#FF5500]" />
                  <span>Exam in {daysRemaining} days</span>
                </div>
                <Link
                  href="/universities/buet"
                  className="text-xs font-bold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1 transition"
                >
                  <span>Circular</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* CURRICULUM SUBJECT BREAKDOWN */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 shadow-xl shadow-orange-500/5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF5500]" />
                  <h3 className="text-base font-extrabold text-slate-900">Curriculum Mastery</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#FF5500]">68%</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Overall</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Physics</span>
                    <span className="font-mono text-slate-500 font-bold">12/16 Ch (72%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF5500] to-[#E64D00] rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Chemistry</span>
                    <span className="font-mono text-slate-500 font-bold">8/16 Ch (51%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '51%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Higher Mathematics</span>
                    <span className="font-mono text-slate-500 font-bold">13/16 Ch (81%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/prepare"
                  className="text-xs font-bold text-slate-600 hover:text-[#FF5500] flex items-center justify-between transition pt-2 border-t border-slate-100"
                >
                  <span>Explore All 48 HSC Chapters</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* RECENT MOCK TEST PERFORMANCE */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 shadow-xl shadow-orange-500/5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Recent Performance</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  +8% IMPROVEMENT
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500 font-medium">BUET Preliminary Model Test 01</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">72</span>
                  <span className="text-xs text-slate-400 font-mono">/ 100 Marks</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Accuracy</span>
                  <strong className="text-slate-900 font-bold">86%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Strongest</span>
                  <strong className="text-emerald-700 font-bold">Physics (92%)</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/mistakes">
                  <button className="w-full h-10 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF5500] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs">
                    <span>Review Test Mistakes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* QUICK ACCESS STUDENT TOOLS */}
            <div className="bg-white/95 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 shadow-xl shadow-orange-500/5 space-y-3">
              <div className="text-xs font-bold text-[#FF5500] uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
                QUICK TOOLS
              </div>
              <div className="space-y-2">
                <Link
                  href="/chat"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#FF5500] flex items-center justify-between transition text-xs font-bold text-slate-800 group shadow-2xs"
                >
                  <span className="flex items-center gap-2.5">
                    <Bot className="w-4 h-4 text-[#FF5500]" />
                    <span>Ask AI Admission Advisor</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  href="/practice"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#FF5500] flex items-center justify-between transition text-xs font-bold text-slate-800 group shadow-2xs"
                >
                  <span className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-[#FF5500]" />
                    <span>Practice Chapter MCQs</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  href="/mock-tests"
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#FF5500] flex items-center justify-between transition text-xs font-bold text-slate-800 group shadow-2xs"
                >
                  <span className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#FF5500]" />
                    <span>Take Timed Mock Test</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

          </div>

        </div>

          </div>
        </div>
      </div>
    </main>
  );
}
