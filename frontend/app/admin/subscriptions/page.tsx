'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { CreditCard, DollarSign, Users, Award, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';

export default function AdminSubscriptionsPage() {
  const plans = [
    { name: 'Free Starter Pass', price: '৳ 0', activeSubscribers: 1035, revenue: '৳ 0', features: 'Basic circular intelligence, 10 AI queries/day' },
    { name: 'Premium Admission Season Pass', price: '৳ 1,490', activeSubscribers: 385, revenue: '৳ 573,650', features: 'Unlimited AI Tutor, 30-day personalized plans, Mock series' },
  ];

  return (
    <AdminShell
      pageTitle="SaaS Subscription Plans & Revenue Operations"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Subscriptions' }]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="TOTAL MRR / REVENUE" value="৳ 573.6k" subValue="Admission Season 2026" icon={DollarSign} variant="success" />
          <StatCard label="PAID SUBSCRIBERS" value="385" subValue="27.1% Conversion Rate" icon={Users} variant="primary" />
          <StatCard label="AVERAGE ARPU" value="৳ 1,490" subValue="Per Active Student" icon={CreditCard} variant="accent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div key={p.name} className="eg-card space-y-4">
              <div className="flex justify-between items-start border-b border-[var(--eg-border)] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[var(--eg-text-primary)]">{p.name}</h3>
                  <span className="text-2xl font-bold text-[var(--eg-primary)]">{p.price}</span>
                </div>
                <Badge variant="default" size="sm">{p.activeSubscribers} Active</Badge>
              </div>

              <div className="text-xs text-[var(--eg-text-secondary)] leading-relaxed">
                <strong>Features:</strong> {p.features}
              </div>

              <div className="p-3 bg-[var(--eg-surface-subtle)] rounded-lg text-caption border border-[var(--eg-border)] flex justify-between">
                <span className="text-[var(--eg-text-muted)]">Total Plan Revenue:</span>
                <span className="font-bold text-[var(--eg-text-primary)]">{p.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
