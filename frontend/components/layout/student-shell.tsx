'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Award,
  Bot,
  AlertCircle,
  RotateCcw,
  TrendingUp,
  GraduationCap,
  Bell,
  FileText,
  User,
  Settings,
  Menu,
  X,
  Flame,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StudentShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function StudentShell({ children, pageTitle, breadcrumbs }: StudentShellProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const mainNav = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Prepare', href: '/prepare', icon: BookOpen },
    { label: 'Practice', href: '/practice', icon: CheckSquare },
    { label: 'Mock Tests', href: '/mock-tests', icon: Award },
    { label: 'AI Tutor', href: '/ai-tutor', icon: Bot, badge: 'AI' },
    { label: 'Mistakes', href: '/mistakes', icon: AlertCircle },
    { label: 'Revision', href: '/revision', icon: RotateCcw },
    { label: 'Progress', href: '/progress', icon: TrendingUp },
  ];

  const discoverNav = [
    { label: 'Universities', href: '/universities', icon: GraduationCap },
    { label: 'Admission', href: '/admission', icon: Bell },
    { label: 'Guides', href: '/guides', icon: FileText },
  ];

  const accountNav = [
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const bottomMobileNav = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Prepare', href: '/prepare', icon: BookOpen },
    { label: 'Practice', href: '/practice', icon: CheckSquare },
    { label: 'AI Tutor', href: '/ai-tutor', icon: Bot },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[var(--eg-surface-subtle)] text-[var(--eg-text-primary)] flex">
      {/* ── DESKTOP SIDEBAR (248px) ── */}
      <aside className="hidden lg:flex w-[248px] shrink-0 flex-col bg-[var(--eg-surface)] border-r border-[var(--eg-border)] h-screen sticky top-0 z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[var(--eg-border)] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--eg-primary)] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              EG
            </div>
            <span className="font-bold text-base tracking-tight text-[var(--eg-text-primary)]">
              Edu<span className="text-[var(--eg-primary)]">Guide</span>
            </span>
          </Link>
          <Badge variant="default" size="sm">HSC '24</Badge>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* MAIN */}
          <div className="space-y-1">
            <div className="px-3 text-overline text-[var(--eg-text-muted)]">MAIN</div>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'nav-item relative flex items-center justify-between',
                    isActive && 'active'
                  )}
                >
                  <div className="nav-indicator" />
                  <div className="flex items-center gap-3">
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="accent" size="sm" className="font-bold">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* DISCOVER */}
          <div className="space-y-1">
            <div className="px-3 text-overline text-[var(--eg-text-muted)]">DISCOVER</div>
            {discoverNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('nav-item relative', isActive && 'active')}
                >
                  <div className="nav-indicator" />
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* ACCOUNT */}
          <div className="space-y-1">
            <div className="px-3 text-overline text-[var(--eg-text-muted)]">ACCOUNT</div>
            {accountNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('nav-item relative', isActive && 'active')}
                >
                  <div className="nav-indicator" />
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer / Target Goal Snapshot */}
        <div className="p-4 border-t border-[var(--eg-border)] bg-[var(--eg-surface-subtle)]">
          <div className="flex items-center justify-between text-caption text-[var(--eg-text-muted)] mb-1">
            <span>Target Goal</span>
            <span className="font-semibold text-[var(--eg-primary)]">61d left</span>
          </div>
          <div className="text-body-md font-semibold text-[var(--eg-text-primary)] truncate">
            BUET — CSE
          </div>
        </div>
      </aside>

      {/* ── MOBILE DRAWER ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-[var(--eg-surface)] h-full flex flex-col z-10 shadow-modal">
            <div className="h-16 px-6 border-b border-[var(--eg-border)] flex items-center justify-between">
              <span className="font-bold text-base text-[var(--eg-text-primary)]">EduGuide</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[var(--eg-text-muted)] hover:bg-[var(--eg-surface-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div className="space-y-1">
                {mainNav.concat(discoverNav).concat(accountNav).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={cn('nav-item', isActive && 'active')}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT SHELL ── */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* TOP HEADER (64px) */}
        <header className="h-16 bg-[var(--eg-surface)] border-b border-[var(--eg-border)] sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--eg-text-secondary)] hover:bg-[var(--eg-surface-subtle)]"
            >
              <Menu className="w-5 h-5" />
            </button>
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-1.5 text-xs text-[var(--eg-text-muted)]">
                {breadcrumbs.map((b, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                    {b.href ? (
                      <Link href={b.href} className="hover:text-[var(--eg-text-primary)]">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[var(--eg-text-primary)]">{b.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <h1 className="text-body-lg font-semibold text-[var(--eg-text-primary)]">
                {pageTitle || 'EduGuide'}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--eg-accent-soft)] text-[var(--eg-accent)] border border-[var(--eg-accent)]/20 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-[var(--eg-accent)]" />
              <span>7 Day Streak</span>
            </div>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-lg border border-[var(--eg-border)] flex items-center justify-center text-[var(--eg-text-secondary)] hover:bg-[var(--eg-surface-subtle)] relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--eg-primary)]" />
            </button>

            {/* User Profile */}
            <Link href="/profile" className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] font-bold text-xs flex items-center justify-center border border-[var(--eg-primary)]/20">
                N
              </div>
              <span className="hidden md:inline text-xs font-semibold text-[var(--eg-text-primary)]">
                Naim
              </span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto page-padding py-6 md:py-8 space-y-6">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION (64px) ── */}
      <nav className="lg:hidden mobile-bottom-nav">
        {bottomMobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-[var(--eg-primary)] font-semibold'
                  : 'text-[var(--eg-text-muted)] hover:text-[var(--eg-text-primary)]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
