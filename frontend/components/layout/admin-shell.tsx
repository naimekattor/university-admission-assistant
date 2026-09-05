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
  X,
  ExternalLink,
  Sparkles,
  MessageSquare,
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/admin/login';
  };

  const adminNavGroups = [
    {
      group: 'DASHBOARD',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CONTENT & HOMEPAGE',
      items: [
        { label: 'Homepage CMS', href: '/admin/homepage', icon: Globe },
        { label: 'SEO Guides & Articles', href: '/admin/guides', icon: FileText },
      ],
    },
    {
      group: 'COMMUNITY & Q&A',
      items: [
        { label: 'Community Moderation', href: '/admin/community', icon: MessageSquare },
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex font-sans antialiased">
      {/* ── DESKTOP ADMIN SIDEBAR ── */}
      <aside
        className={cn(
          'hidden lg:flex shrink-0 flex-col bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 transition-all duration-200 shadow-sm',
          collapsed ? 'w-[72px]' : 'w-[250px]'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-200/80 flex items-center justify-between">
          {!collapsed ? (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF5500] text-white font-black flex items-center justify-center text-xs shadow-sm">
                EG
              </div>
              <div>
                <div className="font-extrabold text-sm leading-none text-slate-900">
                  Edu<span className="text-[#FF5500]">Guide</span>
                </div>
                <div className="text-[10px] font-bold text-[#FF5500] uppercase tracking-wider font-mono">
                  Admin Panel
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#FF5500] text-white font-black flex items-center justify-center text-xs shadow-sm">
              EG
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Dense Nav Tree */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {adminNavGroups.map((grp) => (
            <div key={grp.group} className="space-y-0.5">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
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
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-orange-50 text-[#FF5500] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#FF5500]' : 'text-slate-500')} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer / Exit to Public App & Sign Out */}
        <div className="p-3 border-t border-slate-200/80 space-y-1">
          <Link
            href="/"
            target="_blank"
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#FF5500] hover:bg-orange-50/50 transition',
              collapsed && 'justify-center px-2'
            )}
          >
            <Globe className="w-4 h-4 text-slate-500 shrink-0" />
            {!collapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>View Public Site</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MOBILE DRAWER SIDEBAR ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white border-r border-slate-200 flex flex-col h-full z-50 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5500] text-white font-black flex items-center justify-center text-xs">
                  EG
                </div>
                <span className="font-extrabold text-sm text-slate-900">EduGuide Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              {adminNavGroups.map((grp) => (
                <div key={grp.group} className="space-y-1">
                  <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium',
                          isActive ? 'bg-orange-50 text-[#FF5500] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#FF5500] hover:bg-orange-50/50 transition"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>View Public Site</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-1.5 text-xs text-slate-500">
                {breadcrumbs.map((bc, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    {bc.href ? (
                      <Link href={bc.href} className="hover:text-slate-900 transition">
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="font-bold text-slate-900">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <h1 className="text-sm sm:text-base font-bold text-slate-900">{pageTitle || 'Admin Workspace'}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
                CMS Active
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
