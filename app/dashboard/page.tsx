'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Calendar, Award, Flame, ArrowRight, Play, BookOpen, CheckCircle, AlertTriangle, RefreshCw, HelpCircle, Sparkles, User, Settings } from 'lucide-react';

export default function StudentDashboardPage() {
  const [studentName, setStudentName] = useState('Tanvir Hossain');
  const [primaryGoal, setPrimaryGoal] = useState('BUET CSE');
  const [sscGpa, setSscGpa] = useState(5.0);
  const [hscGpa, setHscGpa] = useState(5.0);
  const daysRemaining = 62;

  const subjectProgress = [
    { subject: 'Physics', percentage: 72, color: 'bg-amber-500', weakCount: 1 },
    { subject: 'Chemistry', percentage: 51, color: 'bg-red-500', weakCount: 3 },
    { subject: 'Higher Mathematics', percentage: 81, color: 'bg-emerald-500', weakCount: 0 },
  ];

  const todayTasks = [
    { id: 1, subject: 'Physics', topic: "Newton's Laws & Impulse", duration: '35 mins', type: 'Lesson', status: 'pending' },
    { id: 2, subject: 'Chemistry', topic: 'Chemical Bonding & Hybridization', duration: '30 mins', type: 'Practice', status: 'pending' },
    { id: 3, subject: 'Higher Math', topic: 'Calculus Differentiation', duration: '25 mins', type: 'Revision', status: 'completed' },
  ];

  const weakTopics = [
    { name: 'Organic Chemistry Reactions', chapter: 'Organic Chemistry', errorRate: '58% Incorrect' },
    { name: 'Rotational Dynamics', chapter: "Newton's Mechanics", errorRate: '45% Incorrect' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-widest">
            <User className="w-4 h-4" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Welcome back, {studentName}!
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
              {primaryGoal} Goal
            </span>
          </h1>
          <p className="text-sm text-slate-300">
            Academic Group: Science | SSC GPA: {sscGpa} | HSC GPA: {hscGpa}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-2xl font-black text-amber-400">{daysRemaining}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Days Left</div>
          </div>
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-emerald-400 text-emerald-400" />
              <span>7</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Day Streak</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-black text-blue-400">68%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Prep Done</div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Actionable Recommendation & Today's Schedule */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PRIMARY ACTION CARD */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                <Sparkles className="w-5 h-5" />
                <h2>Recommended Action Today</h2>
              </div>
              <span className="text-xs text-slate-400">Personalized AI Ranking</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">High Priority Drill</div>
                <div className="font-bold text-lg text-white">Physics: Newton's Mechanics & Impulse</div>
                <div className="text-xs text-slate-400 mt-1">Accuracy on previous drill: 42% (Weak Topic) • Allocated time: 35 mins</div>
              </div>
              <Link href="/prepare/lessons/newtons-second-law-buet-guide">
                <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-2 shadow-lg transition shrink-0">
                  <Play className="w-4 h-4 fill-slate-950" />
                  Start Today's Lesson
                </button>
              </Link>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Today's Study Tasks</span>
              </h3>
              <Link href="/prepare/study-plan" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
                View 30-Day Schedule <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayTasks.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {t.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{t.topic}</div>
                      <div className="text-xs text-slate-400">{t.subject} • {t.duration}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${t.type === 'Lesson' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : t.type === 'Practice' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    {t.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics Drill */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Identified Weak Topics</span>
              </h3>
              <Link href="/mistakes" className="text-xs text-red-400 hover:underline flex items-center gap-1 font-medium">
                Mistake Notebook <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weakTopics.map((w, i) => (
                <div key={i} className="p-4 bg-slate-950/80 rounded-lg border border-red-500/20 space-y-2">
                  <div className="text-xs font-semibold text-red-400">{w.chapter}</div>
                  <div className="text-sm font-bold text-slate-100">{w.name}</div>
                  <div className="text-xs text-slate-400">{w.errorRate}</div>
                  <Link href="/practice">
                    <button className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                      Practice Drill <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Subject Breakdown & Student Actions */}
        <div className="space-y-8">
          
          {/* Subject Progress Gauges */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-lg text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Subject Mastery</span>
            </h3>

            <div className="space-y-4">
              {subjectProgress.map((sp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{sp.subject}</span>
                    <span className="text-amber-400">{sp.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div className={`${sp.color} h-2.5 rounded-full`} style={{ width: `${sp.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2">Student Tools</h3>
            
            <Link href="/prepare/diagnostic">
              <div className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 flex items-center justify-between text-sm transition">
                <span className="font-medium text-slate-200 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" /> Diagnostic Assessment
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <Link href="/practice">
              <div className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 flex items-center justify-between text-sm transition">
                <span className="font-medium text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" /> MCQ Question Bank
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <Link href="/mock-tests">
              <div className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 flex items-center justify-between text-sm transition">
                <span className="font-medium text-slate-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> Admission Mock Tests
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <Link href="/revision">
              <div className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 flex items-center justify-between text-sm transition">
                <span className="font-medium text-slate-200 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-400" /> Spaced Revision
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
