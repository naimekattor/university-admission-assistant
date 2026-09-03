'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { CreditCard, DollarSign, Users, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

export default function AdminSubscriptionsPage() {
  const plans = [
    {
      name: 'Free Starter Pass',
      price: '৳ 0',
      period: 'Forever',
      activeSubscribers: 1035,
      revenue: '৳ 0',
      badge: 'Default Tier',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      features: [
        'Official admission circular tracking',
        'Basic eligibility calculator',
        '10 AI Advisor queries / day',
        'Standard chapter-wise MCQs',
      ],
    },
    {
      name: 'Premium Admission Season Pass',
      price: '৳ 1,490',
      period: 'One-time admission cycle',
      activeSubscribers: 385,
      revenue: '৳ 573,650',
      badge: 'Best Seller',
      badgeColor: 'bg-orange-50 text-[#FF5500] border-orange-200',
      highlight: true,
      features: [
        'Unlimited AI Tutor & Admission Reasoning',
        '30-day personalized syllabus study plan',
        'BUET, DU, Medical full-length mock tests',
        'Negative marking instant rank analytics',
      ],
    },
  ];

  return (
    <AdminShell
      pageTitle="SaaS Subscription Plans & Revenue Operations"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Subscriptions' }]}
    >
      <div className="space-y-6">
        {/* ── KPI Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="TOTAL MRR / REVENUE"
            value="৳ 573.6k"
            subValue="Admission Season 2026"
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            label="PAID SUBSCRIBERS"
            value="385"
            subValue="27.1% Conversion Rate"
            icon={Users}
            variant="primary"
          />
          <StatCard
            label="AVERAGE ARPU"
            value="৳ 1,490"
            subValue="Per Active Student"
            icon={CreditCard}
            variant="accent"
          />
        </div>

        {/* ── Subscription Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl bg-white border p-6 sm:p-7 space-y-5 transition-all shadow-xs hover:shadow-md relative overflow-hidden ${
                p.highlight
                  ? 'border-orange-300 ring-1 ring-[#FF5500]/20'
                  : 'border-slate-200/80'
              }`}
            >
              {p.highlight && (
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gradient-to-br from-orange-400/15 via-amber-300/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="flex justify-between items-start border-b border-slate-100 pb-4 relative z-10">
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border mb-2 ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                  <h3 className="font-black text-lg text-slate-900">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                      {p.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ {p.period}</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {p.activeSubscribers} Active
                </span>
              </div>

              <div className="space-y-2.5 relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Included Features
                </p>
                <ul className="space-y-2 text-xs text-slate-700">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs relative z-10">
                <span className="text-slate-500 font-semibold">Total Revenue Generated:</span>
                <span className="font-mono font-black text-sm text-slate-900">{p.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
