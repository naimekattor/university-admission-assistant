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
    const adminLinks = [
      { href: '/admin', label: 'Admin Command Center' },
      { href: '/admin', label: 'User List' },
      { href: '/admin', label: 'Upload Content & MCQs' },
      { href: '/admin', label: 'RAG Vectors & PDFs' },
    ];

    return (
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Admin Logo */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black flex items-center justify-center text-xs shadow-md">
              ADM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                EduGuide <span className="text-red-400 font-mono text-xs font-bold uppercase">[ADMIN CONTROL]</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Platform Infrastructure & Telemetry</span>
            </div>
          </Link>

          {/* Admin Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
            <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-red-400" /> Admin Command Center
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition">
              Switch to Student View
            </Link>
          </nav>

          {/* Admin Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[11px] font-mono text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Secured Session
            </div>
            <Link href="/admin">
              <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Admin Lock
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-300 p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Admin Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-red-500/30 px-4 pt-2 pb-4 space-y-2 text-xs">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-red-400 font-bold">
              Admin Command Center
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-slate-300">
              Switch to Student View
            </Link>
          </div>
        )}
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
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Student Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
              STU
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                EduGuide <span className="text-amber-400 font-mono text-xs font-bold uppercase">[STUDENT PASS]</span>
              </span>
              <span className="text-[10px] text-amber-300/80 font-medium">BUET CSE Target • 62 Days Remaining</span>
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
                  className={`px-3 py-1.5 rounded-lg transition ${isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Student Telemetry Badges */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>7 Day Streak</span>
            </div>
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                <User className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-300 p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Student Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-amber-500/30 px-4 pt-2 pb-4 space-y-2 text-xs">
            {studentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 text-slate-200 hover:bg-slate-900 rounded-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    );
  }

  // ==========================================
  // 3. PUBLIC MARKETING NAVIGATION BAR
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
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
            EG
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Edu<span className="text-amber-400">Guide</span>
          </span>
        </Link>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition ${isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Public Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/admin" className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition font-medium">
            <Shield className="w-3.5 h-3.5" /> Admin
          </Link>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Student Dashboard
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-300 p-2 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Public Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 text-xs">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-slate-200 hover:bg-slate-900 rounded-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full mt-2 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md">
              Open Student Dashboard
            </button>
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-amber-400 font-semibold">
            Admin Portal Access
          </Link>
        </div>
      )}
    </header>
  );
}
