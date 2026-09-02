'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Menu,
  X,
  Shield,
  Flame,
  Target,
  BarChart3,
  Users,
  PlusCircle,
  Upload,
  BookOpen,
  LogOut,
  User,
  Clock,
  Award,
  Layers,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/prepare') ||
    pathname.startsWith('/practice') ||
    pathname.startsWith('/mock-tests') ||
    pathname.startsWith('/mistakes') ||
    pathname.startsWith('/revision') ||
    pathname.startsWith('/chat');

  // ==========================================
  // 1. ADMIN PERSONALIZED NAVIGATION BAR
  // ==========================================
  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Admin Logo */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-black flex items-center justify-center text-xs shadow-md">
              ADM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                EduGuide <span className="text-orange-400 font-mono text-xs font-bold uppercase">[ADMIN CONTROL]</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Platform Infrastructure & Telemetry</span>
            </div>
          </Link>

          {/* Admin Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
            <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-orange-400" /> Admin Command Center
            </Link>
            <Link href="/admin/homepage" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition">
              Homepage CMS
            </Link>
          </nav>

          {/* Admin Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[11px] font-mono text-orange-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Secured Session
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-300 p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
    );
  }

  // ==========================================
  // 2. STUDENT PERSONALIZED NAVIGATION BAR
  // ==========================================
  if (isStudentRoute) {
    const studentLinks = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/prepare', label: 'Curriculum' },
      { href: '/practice', label: 'Practice MCQs' },
      { href: '/mock-tests', label: 'Mock Tests' },
      { href: '/mistakes', label: 'Mistake Notebook' },
      { href: '/revision', label: 'Revision Queue' },
      { href: '/chat', label: 'AI Advisor & Tutor' },
    ];

    return (
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Student Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EA580C] text-white font-black flex items-center justify-center text-xs shadow-md">
              EG
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                EduGuide <span className="text-orange-600 font-mono text-xs font-bold uppercase">[STUDENT PASS]</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">BUET CSE Target • 62 Days Remaining</span>
            </div>
          </Link>

          {/* Student Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {studentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition ${isActive ? 'bg-[#FDF2E9] text-[#EA580C] font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Student Telemetry Badges */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-[#EA580C] flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-[#EA580C] text-[#EA580C]" />
              <span>7 Day Streak</span>
            </div>
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-700 p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
    );
  }

  // ==========================================
  // 3. FLOATING PUBLIC MARKETING NAVBAR
  // ==========================================
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/universities', label: 'Universities' },
    { href: '/eligibility', label: 'Eligibility' },
    { href: '/admission', label: 'Admission Circulars' },
    { href: '/guides', label: 'Guides' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6">
      <header className="max-w-5xl mx-auto px-6 py-3 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white font-black flex items-center justify-center text-xs shadow-sm group-hover:scale-105 transition-transform">
            EG
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            EDUGUIDE
          </span>
        </Link>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Public Action CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/prepare">
            <button className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-5 py-2 rounded-full font-medium text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Preparing</span>
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Public Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-2 text-xs">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/prepare" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full mt-2 py-2.5 bg-[#EA580C] text-white font-semibold text-xs rounded-full shadow-sm">
              Start Preparing Free
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
