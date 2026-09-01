'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  AlertTriangle,
  CheckCircle2,
  Users,
  Bot,
  BookOpen,
  GraduationCap,
  Database,
  ArrowRight,
  TrendingUp,
  Clock,
  PlusCircle,
  FileCheck,
  Shield,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(true); // Authenticated session
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const attentionAlerts = [
    {
      id: 'a1',
      severity: 'high',
      title: 'BUET Admission 2026 application deadline requires verification',
      time: 'Updated 2 hours ago',
      actionLabel: 'Verify Deadline',
      href: '/admin/universities',
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
    { type: 'Universities & Circulars', published: 34, pending: 2, total: 36 },
    { type: 'Curriculum Lessons', published: 128, pending: 12, total: 140 },
    { type: 'Question Bank MCQs', published: 4850, pending: 45, total: 4895 },
    { type: 'SEO Guides & Articles', published: 24, pending: 3, total: 27 },
  ];

  return (
    <AdminShell
      pageTitle="Platform Operations Dashboard"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]}
    >
      {/* ── 1. WELCOME & OPERATIONS HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--eg-surface)] border border-[var(--eg-border)] shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-overline text-[var(--eg-text-muted)] font-bold">
              EDUGUIDE PLATFORM OPERATIONS
            </span>
            <Badge variant="default" size="sm">System Normal</Badge>
          </div>
          <h2 className="text-2xl font-bold text-[var(--eg-text-primary)]">
            Good afternoon, Administrator
          </h2>
          <p className="text-sm text-[var(--eg-text-secondary)]">
            Here is what requires your verification, management, and publishing today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin/questions">
            <button className="btn btn-primary font-semibold text-xs shadow-sm">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </Link>
          <Link href="/admin/universities">
            <button className="btn btn-secondary font-semibold text-xs">
              <GraduationCap className="w-4 h-4" />
              <span>Manage Universities</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── 2. KPI METRIC OVERVIEW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REGISTERED STUDENTS"
          value="1,420"
          subValue="+385 active today"
          icon={Users}
          trend={{ value: '+12%', isPositive: true }}
          variant="primary"
        />

        <StatCard
          label="PRACTICE QUESTIONS SOLVED"
          value="18,450"
          subValue="Across 48 HSC Chapters"
          icon={CheckCircle2}
          variant="success"
        />

        <StatCard
          label="AI ADVISOR & TUTOR REQUESTS"
          value="4,890"
          subValue="Est. Cost: $0.84 USD"
          icon={Bot}
          variant="accent"
        />

        <StatCard
          label="RAG KNOWLEDGE BASE"
          value="48 Chunks"
          subValue="PostgreSQL pgvector Active"
          icon={Database}
          variant="default"
        />
      </div>

      {/* ── 3. HERO "NEEDS ATTENTION" ALERT SECTION ── */}
      <div className="eg-card space-y-4 border-l-4 border-l-[var(--eg-warning)]">
        <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--eg-warning)]" />
            <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)]">
              Items Requiring Operational Attention ({attentionAlerts.length})
            </h3>
          </div>
          <span className="text-xs text-[var(--eg-text-muted)]">Action Required</span>
        </div>

        <div className="space-y-3">
          {attentionAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'default'} size="sm">
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-[var(--eg-text-muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.time}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[var(--eg-text-primary)]">
                  {alert.title}
                </div>
              </div>

              <Link href={alert.href}>
                <button className="btn btn-secondary btn-sm text-xs font-semibold shrink-0">
                  {alert.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. CONTENT PUBLISHING STATUS MATRIX ── */}
      <div className="eg-card space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[var(--eg-primary)]" />
            <span>Platform Content Publishing Status</span>
          </h3>
          <span className="text-xs text-[var(--eg-text-muted)]">Live Database Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentStatus.map((cs) => (
            <div key={cs.type} className="p-4 rounded-xl border border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] space-y-2">
              <div className="text-caption font-semibold text-[var(--eg-text-muted)]">{cs.type}</div>
              <div className="text-2xl font-bold text-[var(--eg-text-primary)]">{cs.published}</div>
              <div className="flex items-center justify-between text-caption pt-1 border-t border-[var(--eg-border)]">
                <span className="text-[var(--eg-success)] font-semibold">{cs.published} Live</span>
                {cs.pending > 0 && (
                  <span className="text-[var(--eg-warning)] font-semibold">{cs.pending} Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. WEEKLY API USAGE & ACTIVITY TREND ── */}
      <div className="eg-card space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
          <div>
            <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--eg-primary)]" />
              <span>Weekly System Traffic & AI Token Usage</span>
            </h3>
            <p className="text-xs text-[var(--eg-text-muted)]">7 Days Activity Trend</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[var(--eg-primary)]">
              <span className="w-3 h-3 rounded-sm bg-[var(--eg-primary)]" /> AI Queries
            </span>
            <span className="flex items-center gap-1.5 text-[var(--eg-accent)]">
              <span className="w-3 h-3 rounded-sm bg-[var(--eg-accent)]" /> Active Students
            </span>
          </div>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 bg-[var(--eg-surface-subtle)] rounded-xl border border-[var(--eg-border)]">
          {[
            { day: 'Mon', queries: 420, users: 110 },
            { day: 'Tue', queries: 580, users: 145 },
            { day: 'Wed', queries: 720, users: 180 },
            { day: 'Thu', queries: 890, users: 220 },
            { day: 'Fri', queries: 950, users: 250 },
            { day: 'Sat', queries: 1120, users: 290 },
            { day: 'Sun', queries: 1350, users: 340 },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] font-mono font-bold text-[var(--eg-primary)]">{bar.queries}</span>
              <div className="w-full flex gap-1 items-end h-28 max-w-[40px]">
                <div
                  className="flex-1 bg-[var(--eg-primary)] rounded-t transition-all"
                  style={{ height: `${(bar.queries / 1400) * 100}%` }}
                />
                <div
                  className="flex-1 bg-[var(--eg-accent)] rounded-t transition-all"
                  style={{ height: `${(bar.users / 350) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-[var(--eg-text-muted)] font-medium">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
