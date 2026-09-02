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
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

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
      <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5500] text-white font-black flex items-center justify-center text-xs shadow-md">
              ADM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                EduGuide <span className="text-orange-400 font-mono text-xs font-bold uppercase">[ADMIN CONTROL]</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Platform Infrastructure & Telemetry</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
            <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-orange-400" /> Admin Command Center
            </Link>
            <Link href="/admin/homepage" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition">
              Homepage CMS
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[11px] font-mono text-orange-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Secured Session
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-300 p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>
    );
  }

  // ==========================================
  // 2. STUDENT NAVIGATION BAR
  // ==========================================
  if (isStudentRoute) {
    const studentLinks = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/prepare', label: 'Curriculum' },
      { href: '/practice', label: 'Practice MCQs' },
      { href: '/mock-tests', label: 'Mock Tests' },
      { href: '/mistakes', label: 'Mistake Notebook' },
      { href: '/chat', label: 'AI Advisor' },
    ];

    return (
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            {/* Orange 4-pointed star logo */}
            <div className="w-7 h-7 flex items-center justify-center text-[#FF5500]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              eduguide
            </span>
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
                RR
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
  // 3. PUBLIC MARKETING FLOATING NAVBAR (AS SHOWN IN DESIGN)
  // ==========================================
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/universities', label: 'Features' },
    { href: '/eligibility', label: 'About Us' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/guides', label: 'Blog' },
  ];

  return (
    <div className="w-full relative z-50">
      {/* ── TOP BLACK ANNOUNCEMENT PILL BAR ── */}
      {bannerVisible && (
        <div className="pt-3 px-4 flex justify-center">
          <div className="w-full max-w-4xl bg-stone-900 text-white text-[11px] sm:text-xs font-medium py-1.5 px-4 rounded-full flex items-center justify-between shadow-sm">
            <div className="flex-1 text-center font-normal">
              Limited-Time Offer! Get Up to <span className="text-[#FF5500] font-bold">50% OFF!</span>
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

      {/* ── FLOATING WHITE PILL NAVBAR ── */}
      <div className="sticky top-3 px-4 sm:px-6 pt-3 pb-2">
        <header className="max-w-4xl mx-auto px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-between">
          
          {/* Brand Logo: 4-pointed orange star icon + bold brand name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 flex items-center justify-center text-[#FF5500] group-hover:rotate-45 transition-transform duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              duvex
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    isActive
                      ? 'text-[#FF5500] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Contact Us / Start Preparing Pill Button with Double Arrow */}
          <div className="hidden md:flex items-center">
            <Link href="/prepare">
              <button className="bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white pl-1.5 pr-4 py-1.5 rounded-full font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer group">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ChevronsRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span>Contact Us</span>
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
                <span>Contact Us / Start Preparing</span>
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
