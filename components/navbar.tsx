'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, Sparkles, BookOpen, Menu, X, Award, Compass, HelpCircle } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/prepare', label: 'Prepare Dashboard' },
    { href: '/practice', label: 'Practice MCQs' },
    { href: '/mock-tests', label: 'Mock Tests' },
    { href: '/chat', label: 'AI Advisor & Tutor' },
    { href: '/universities', label: 'Universities' },
    { href: '/eligibility', label: 'Eligibility' },
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {navLinks.map((link) => {
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

        {/* Desktop Primary CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/prepare">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Start Preparing
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-300 p-2 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/prepare" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full mt-2 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md">
              Start Preparing Now
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
