'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  FileCheck,
  Calendar,
  Layers,
  BookOpen,
  HelpCircle,
  Award,
  Database,
  Bot,
  FileText,
  Users,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Bell,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AdminShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function AdminShell({ children, pageTitle, breadcrumbs, actions }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNavGroups = [
    {
      group: 'DASHBOARD',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'ADMISSION INTELLIGENCE',
      items: [
        { label: 'Universities', href: '/admin/universities', icon: GraduationCap },
        { label: 'Programs', href: '/admin/programs', icon: Layers },
        { label: 'Eligibility Rules', href: '/admin/eligibility', icon: FileCheck },
        { label: 'Circulars & Deadlines', href: '/admin/circulars', icon: Calendar },
      ],
    },
    {
      group: 'PREPARATION',
      items: [
        { label: 'Curriculum Tree', href: '/admin/curriculum', icon: Layers },
        { label: 'Lessons CMS', href: '/admin/lessons', icon: BookOpen },
        { label: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
        { label: 'Mock Tests', href: '/admin/mock-tests', icon: Award },
      ],
    },
    {
      group: 'AI & KNOWLEDGE',
      items: [
        { label: 'Knowledge Base', href: '/admin/knowledge', icon: Database },
        { label: 'AI Usage & Cost', href: '/admin/ai-usage', icon: Bot },
      ],
    },
    {
      group: 'CONTENT',
      items: [
        { label: 'SEO Guides & Articles', href: '/admin/guides', icon: FileText },
      ],
    },
    {
      group: 'STUDENTS & OPS',
      items: [
        { label: 'Student Directory', href: '/admin/students', icon: Users },
        { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--eg-surface-subtle)] text-[var(--eg-text-primary)] flex">
      {/* ── ADMIN SIDEBAR (248px or 72px) ── */}
      <aside
        className={cn(
          'hidden lg:flex shrink-0 flex-col bg-[var(--eg-surface)] border-r border-[var(--eg-border)] h-screen sticky top-0 z-30 transition-all duration-200',
          collapsed ? 'w-[72px]' : 'w-[248px]'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[var(--eg-border)] flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--eg-text-primary)] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                OP
              </div>
              <div>
                <div className="font-bold text-sm leading-none text-[var(--eg-text-primary)]">
                  EduGuide
                </div>
                <div className="text-[10px] font-semibold text-[var(--eg-primary)] uppercase tracking-wider">
                  Admin Panel
                </div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[var(--eg-text-primary)] text-white font-bold flex items-center justify-center text-xs">
              OP
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded-md text-[var(--eg-text-muted)] hover:bg-[var(--eg-surface-subtle)] hidden lg:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Dense Nav Tree */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {adminNavGroups.map((grp) => (
            <div key={grp.group} className="space-y-0.5">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--eg-text-muted)] uppercase tracking-wider">
                  {grp.group}
                </div>
              )}
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'admin-nav-item',
                      isActive && 'active',
                      collapsed && 'justify-center px-0 py-2'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] space-y-2">
          {!collapsed ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-xs text-[var(--eg-text-muted)] hover:text-[var(--eg-text-primary)] transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open Student View</span>
              </Link>
              <Link
                href="/api/admin/logout"
                className="flex items-center gap-2 text-xs text-[var(--eg-error)] hover:underline font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Admin Session</span>
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              title="Open Student View"
              className="flex justify-center text-[var(--eg-text-muted)]"
            >
              <Globe className="w-4 h-4" />
            </Link>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[var(--eg-surface)] border-b border-[var(--eg-border)] sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--eg-text-secondary)] hover:bg-[var(--eg-surface-subtle)]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              {breadcrumbs && (
                <div className="flex items-center gap-1.5 text-caption text-[var(--eg-text-muted)]">
                  {breadcrumbs.map((b, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>/</span>}
                      {b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <h1 className="text-body-lg font-bold text-[var(--eg-text-primary)]">
                {pageTitle || 'Admin Operations'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--eg-success-soft)] text-[var(--eg-success)] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[var(--eg-success)] animate-pulse" />
              <span>Admin Online</span>
            </div>
            {actions}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto page-padding py-6 md:py-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
