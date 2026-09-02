'use client';

import React from 'react';
import Link from 'next/link';
import { FooterConfig } from '@/../backend/src/modules/homepage/homepage.service';

interface FooterSectionProps {
  config?: FooterConfig;
}

export function FooterSection({ config }: FooterSectionProps) {
  const description =
    config?.description ||
    'EduGuide is Bangladesh’s premier data-driven university admission intelligence and preparation platform, consolidating official circulars, GPA rules, deadlines, and smart preparation in one unified place.';
  const navGroups = config?.navGroups || [
    {
      title: 'Admission',
      links: [
        { label: 'Admission At A Glance', url: '/#admission-table' },
        { label: 'Eligibility Checker', url: '/eligibility' },
        { label: 'Upcoming Deadlines', url: '/#deadlines' },
        { label: 'All Universities', url: '/universities' },
        { label: 'Official Circulars', url: '/admission' },
      ],
    },
    {
      title: 'Preparation',
      links: [
        { label: 'Curriculum & Lessons', url: '/prepare' },
        { label: 'Practice MCQs', url: '/practice' },
        { label: 'Mock Test Simulator', url: '/mock-tests' },
        { label: 'AI Admission Tutor', url: '/chat' },
        { label: 'Student Dashboard', url: '/dashboard' },
      ],
    },
    {
      title: 'Knowledge',
      links: [
        { label: 'Admission Guides', url: '/guides' },
        { label: 'BUET Preparation Guide', url: '/guides/buet-admission-guide-2026' },
        { label: 'DU Ka Unit Guide', url: '/guides/du-ka-unit-guide' },
        { label: 'Medical Tips', url: '/guides' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'Pricing & Passes', url: '/pricing' },
        { label: 'Terms of Service', url: '#' },
        { label: 'Privacy Policy', url: '#' },
      ],
    },
  ];
  const copyrightText =
    config?.copyrightText ||
    '© 2026 EduGuide Bangladesh. All rights reserved. Official admission data sourced from university circulars.';

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900 mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* ── TOP SECTION: BRAND & LINK GROUPS ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-3.5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF5500] text-white font-black flex items-center justify-center text-xs shadow-sm">
                EG
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Edu<span className="text-[#FF5500]">Guide</span>
              </span>
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              {description}
            </p>

            <div className="text-[11px] text-slate-400 font-mono">
              Designed for HSC Candidates & University Aspirants across Bangladesh.
            </div>
          </div>

          {/* Dynamic Link Groups (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  {group.title}
                </h4>
                <ul className="space-y-2 text-xs">
                  {group.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.url}
                        className="text-slate-600 hover:text-[#FF5500] transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>{copyrightText}</div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/eligibility" className="hover:text-[#FF5500] transition">
              Eligibility Engine
            </Link>
            <span>•</span>
            <Link href="/chat" className="hover:text-[#FF5500] transition">
              AI Advisor
            </Link>
            <span>•</span>
            <Link href="/prepare" className="hover:text-[#FF5500] transition font-bold text-[#FF5500]">
              Start Preparing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
