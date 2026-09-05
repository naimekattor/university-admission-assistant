'use client';

import React, { useState, useRef } from 'react';
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
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

import { useGsapContext } from '@/hooks/use-gsap-motion';
import { isReducedMotion } from '@/lib/animations/gsap-motion';
import gsap from 'gsap';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const navHeaderRef = useRef<HTMLElement>(null);

  useGsapContext(
    () => {
      if (!navHeaderRef.current || isReducedMotion()) return;

      gsap.fromTo(
        navHeaderRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    },
    navHeaderRef,
    [pathname]
  );

  const isAdminRoute = pathname.startsWith('/admin');
  const isStudentRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/prepare') ||
    pathname.startsWith('/practice') ||
    pathname.startsWith('/mock-tests') ||
    pathname.startsWith('/mistakes') ||
    pathname.startsWith('/revision') ||
    pathname.startsWith('/chat');

  // For admin routes, AdminShell handles the full-height modern sidebar and topbar
  if (isAdminRoute) {
    return null;
  }

  // ==========================================
  // 2. STUDENT NAVIGATION BAR
  // ==========================================
  if (isStudentRoute) {
    const studentLinks = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/community', label: 'Community' },
      { href: '/prepare', label: 'Curriculum' },
      { href: '/practice', label: 'Practice MCQs' },
      { href: '/mock-tests', label: 'Mock Tests' },
      { href: '/mistakes', label: 'Mistake Notebook' },
      { href: '/chat', label: 'AI Advisor' },
    ];

    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5500] text-white font-black flex items-center justify-center text-xs shadow-md">
              EG
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                Edu<span className="text-[#FF5500]">Guide</span> <span className="text-[#FF5500] font-mono text-xs font-bold uppercase">[STUDENT PASS]</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">BUET CSE Target • 62 Days Remaining</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {studentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    isActive ? 'bg-orange-50 text-[#FF5500] font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-[#FF5500] flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-[#FF5500] text-[#FF5500]" />
              <span>7 Day Streak</span>
            </div>
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                STU
              </div>
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-700 p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
    );
  }

  // ==========================================
  // 3. PUBLIC MARKETING FLOATING NAVBAR (EDUGUIDE BRAND & REAL LINKS)
  // ==========================================
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/community', label: 'Community' },
    { href: '/universities', label: 'Universities' },
    { href: '/eligibility', label: 'Eligibility' },
    { href: '/admission', label: 'Admission Circulars' },
    { href: '/guides', label: 'Guides' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <div className="w-full relative z-50">
      {/* ── TOP ANNOUNCEMENT BANNER ── */}
      {bannerVisible && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="bg-stone-900 text-white text-[11px] sm:text-xs font-medium py-1.5 px-4 rounded-full flex items-center justify-between shadow-sm max-w-4xl mx-auto">
            <div className="flex-1 text-center font-normal">
              University Admission 2026: Official Circulars & GPA Rules Live! <span className="text-[#FF5500] font-bold">Check Eligibility Free</span>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              className="text-slate-400 hover:text-white p-0.5 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── FLOATING PILL NAVBAR ── */}
      <div className="sticky top-3 container mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
        <header ref={navHeaderRef} className="max-w-5xl mx-auto px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-between">
          
          {/* Brand Logo: EG badge + EduGuide brand name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#FF5500] text-white font-black flex items-center justify-center text-xs shadow-sm group-hover:scale-105 transition-transform">
              EG
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Edu<span className="text-[#FF5500]">Guide</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    isActive
                      ? 'text-[#FF5500] font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Start Preparing Action CTA */}
          <div className="hidden md:flex items-center">
            <Link href="/prepare">
              <button className="bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white pl-1.5 pr-4 py-1.5 rounded-full font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer group">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ChevronsRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
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
          <div className="md:hidden max-w-4xl mx-auto mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-2 text-xs animate-in fade-in">
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
              <button className="w-full mt-2 py-2.5 bg-[#FF5500] text-white font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-2">
                <span>Start Preparing</span>
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
