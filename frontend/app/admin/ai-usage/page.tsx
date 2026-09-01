'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Bot, DollarSign, Cpu, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';

export default function AdminAiUsagePage() {
  const models = [
    { name: 'gemini-2.5-flash', role: 'AI Admission Advisor & Tutor Reasoning', totalCalls: 3400, promptTokens: 850000, completionTokens: 420000, cost: '$0.58', latency: '650ms' },
    { name: 'embedding-001', role: 'pgvector RAG Document Search Embeddings', totalCalls: 1490, promptTokens: 400000, completionTokens: 0, cost: '$0.26', latency: '120ms' },
  ];

  return (
    <AdminShell
      pageTitle="AI Telemetry, Gemini Token Consumption & Cost Tracker"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'AI Usage' }]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="TOTAL AI REQUESTS" value="4,890" subValue="Advisor & Tutor Queries" icon={Bot} variant="primary" />
          <StatCard label="TOTAL TOKENS PROCESSED" value="1.67M" subValue="Input: 1.25M | Output: 420k" icon={Cpu} variant="default" />
          <StatCard label="ESTIMATED GEMINI COST" value="$0.84 USD" subValue="Under Monthly $50 Quota" icon={DollarSign} variant="success" />
          <StatCard label="AVERAGE RESPONSE TIME" value="540 ms" subValue="Stream Latency" icon={Zap} variant="accent" />
        </div>

        <div className="eg-card space-y-4">
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)] border-b border-[var(--eg-border)] pb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--eg-primary)]" />
            <span>Active Gemini AI Model Endpoints</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left admin-table">
              <thead>
                <tr>
                  <th>Model Identifier</th>
                  <th>Role & Use Case</th>
                  <th>Total Requests</th>
                  <th>Prompt Tokens</th>
                  <th>Completion Tokens</th>
                  <th>Avg Latency</th>
                  <th>Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name}>
                    <td><span className="font-mono font-bold text-xs text-[var(--eg-primary)]">{m.name}</span></td>
                    <td className="text-xs text-[var(--eg-text-secondary)]">{m.role}</td>
                    <td className="font-bold text-xs text-[var(--eg-text-primary)]">{m.totalCalls.toLocaleString()}</td>
                    <td className="text-caption font-mono text-[var(--eg-text-muted)]">{m.promptTokens.toLocaleString()}</td>
                    <td className="text-caption font-mono text-[var(--eg-text-muted)]">{m.completionTokens.toLocaleString()}</td>
                    <td><Badge variant="secondary" size="sm">{m.latency}</Badge></td>
                    <td className="font-bold text-xs text-[var(--eg-success)]">{m.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
