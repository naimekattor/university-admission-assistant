'use client';

import React from 'react';
import Link from 'next/link';
import { StudentShell } from '@/components/layout/student-shell';
import { GoalCard } from '@/components/student/goal-card';
import { StudyRecommendation } from '@/components/student/study-recommendation';
import { DailyPlan } from '@/components/student/daily-plan';
import { SubjectProgress } from '@/components/student/subject-progress';
import { WeakTopics } from '@/components/student/weak-topics';
import { RecentPerformance } from '@/components/student/recent-performance';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Award,
  Bot,
  Play,
  RotateCcw,
  ArrowRight,
  Flame,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboardPage() {
  const studentName = 'Naim';
  const targetUniversity = 'BUET';
  const targetProgram = 'Computer Science & Engineering';
  const daysRemaining = 61;

  return (
    <StudentShell
      pageTitle="Student Command Center"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
    >
      {/* ── 1. WELCOME & MOTIVATIONAL BANNER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--eg-surface)] border border-[var(--eg-border)] shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-overline text-[var(--eg-primary)] font-bold">
              ADMISSION PREPARATION JOURNEY
            </span>
            <Badge variant="success" size="sm">On Track</Badge>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--eg-text-primary)]">
            Good morning, {studentName}
          </h2>
          <p className="text-sm text-[var(--eg-text-secondary)]">
            Targeting <strong className="text-[var(--eg-text-primary)]">{targetUniversity} — {targetProgram}</strong>. You have <strong className="text-[var(--eg-primary)]">{daysRemaining} days remaining</strong> until preliminary exams.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/prepare">
            <button className="btn btn-primary btn-lg shadow-sm">
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Preparation</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN ADAPTIVE DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN (2/3): ACTIONABLE RECOMMENDATION & TODAY'S PLAN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HERO SECTION: "WHAT SHOULD YOU STUDY NOW?" */}
          <StudyRecommendation
            subject="Chemistry"
            chapter="Organic Chemistry"
            topic="Electrophilic Aromatic Substitution & Reagents"
            accuracy={43}
            reason="Weak topic detected from recent practice tests (accuracy 43%). Mastering this chapter is high-yield for BUET & DU Ka Unit."
            recommendedMinutes={35}
            lessonHref="/prepare/lessons/newtons-second-law-buet-guide"
          />

          {/* TODAY'S PLAN CHECKLIST */}
          <DailyPlan />

          {/* WEAK TOPICS DRILL */}
          <WeakTopics />

          {/* CONTINUE LEARNING RESUME WIDGET */}
          <div className="eg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--eg-surface-subtle)] border-dashed">
            <div className="space-y-1">
              <span className="text-overline text-[var(--eg-text-muted)]">RESUME WHERE YOU LEFT OFF</span>
              <div className="text-base font-bold text-[var(--eg-text-primary)]">
                Physics • Mechanics: Newton's Second Law & Momentum
              </div>
              <div className="text-xs text-[var(--eg-text-muted)]">
                Progress: 72% completed • 8 minutes remaining
              </div>
            </div>
            <Link href="/prepare/lessons/newtons-second-law-buet-guide">
              <button className="btn btn-secondary btn-sm font-semibold shrink-0">
                <Play className="w-3.5 h-3.5" /> Continue Lesson
              </button>
            </Link>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3): GOAL, METRICS & SHORTCUTS */}
        <div className="space-y-6">
          
          {/* TARGET GOAL CARD */}
          <GoalCard
            university={targetUniversity}
            program={targetProgram}
            daysRemaining={daysRemaining}
            eligibilityStatus="Eligible"
          />

          {/* CURRICULUM SUBJECT BREAKDOWN */}
          <SubjectProgress overallPercentage={68} />

          {/* RECENT MOCK TEST PERFORMANCE */}
          <RecentPerformance
            testTitle="BUET Preliminary Model Test 01"
            score={72}
            maxScore={100}
            accuracy={86}
            improvementPercentage={8}
            weakestSubject="Chemistry (58%)"
            strongestSubject="Physics (92%)"
            resultHref="/mock-tests/buet-prelim-01/result"
          />

          {/* QUICK ACCESS STUDENT TOOLS */}
          <div className="eg-card space-y-3">
            <div className="text-overline text-[var(--eg-text-muted)]">QUICK TOOLS</div>
            <div className="space-y-2">
              <Link
                href="/ai-tutor"
                className="p-3 rounded-lg border border-[var(--eg-border)] bg-[var(--eg-surface)] hover:border-[var(--eg-primary)] flex items-center justify-between transition text-xs font-semibold text-[var(--eg-text-primary)]"
              >
                <span className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-[var(--eg-primary)]" />
                  <span>Ask AI Tutor a Doubt</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--eg-text-muted)]" />
              </Link>

              <Link
                href="/practice"
                className="p-3 rounded-lg border border-[var(--eg-border)] bg-[var(--eg-surface)] hover:border-[var(--eg-primary)] flex items-center justify-between transition text-xs font-semibold text-[var(--eg-text-primary)]"
              >
                <span className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-[var(--eg-accent)]" />
                  <span>Practice Chapter MCQs</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--eg-text-muted)]" />
              </Link>

              <Link
                href="/mock-tests"
                className="p-3 rounded-lg border border-[var(--eg-border)] bg-[var(--eg-surface)] hover:border-[var(--eg-primary)] flex items-center justify-between transition text-xs font-semibold text-[var(--eg-text-primary)]"
              >
                <span className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[var(--eg-success)]" />
                  <span>Take Timed Mock Test</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--eg-text-muted)]" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </StudentShell>
  );
}
