'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Bot, DollarSign, Cpu, Zap, Activity } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

export default function AdminAiUsagePage() {
  const models = [
    {
      name: 'gemini-2.5-flash',
      role: 'AI Admission Advisor & Tutor Reasoning',
      totalCalls: 3400,
      promptTokens: 850000,
      completionTokens: 420000,
      cost: '$0.58',
      latency: '650ms',
      status: 'Optimal',
    },
    {
      name: 'text-embedding-004',
      role: 'pgvector RAG Document Search Embeddings',
      totalCalls: 1490,
      promptTokens: 400000,
      completionTokens: 0,
      cost: '$0.26',
      latency: '120ms',
      status: 'Optimal',
    },
  ];

  return (
    <AdminShell
      pageTitle="AI Telemetry, Gemini Token Consumption & Cost Tracker"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'AI Usage' }]}
    >
      <div className="space-y-6">
        {/* ── KPI Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="TOTAL AI REQUESTS"
            value="4,890"
            subValue="Advisor & Tutor Queries"
            icon={Bot}
            variant="primary"
          />
          <StatCard
            label="TOTAL TOKENS PROCESSED"
            value="1.67M"
            subValue="Input: 1.25M | Output: 420k"
            icon={Cpu}
            variant="default"
          />
          <StatCard
            label="ESTIMATED GEMINI COST"
            value="$0.84 USD"
            subValue="Under Monthly $50 Quota"
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            label="AVERAGE RESPONSE TIME"
            value="540 ms"
            subValue="Stream Latency"
            icon={Zap}
            variant="accent"
          />
        </div>

        {/* ── Active Endpoints Table ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Active Gemini AI Model Endpoints
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Token consumption, response latency, and inference billing
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Model Identifier</th>
                  <th className="py-3.5 px-4">Role & Use Case</th>
                  <th className="py-3.5 px-4">Total Requests</th>
                  <th className="py-3.5 px-4">Prompt Tokens</th>
                  <th className="py-3.5 px-4">Completion Tokens</th>
                  <th className="py-3.5 px-4">Avg Latency</th>
                  <th className="py-3.5 px-5 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {models.map((m) => (
                  <tr key={m.name} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-xs text-[#FF5500] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
                        {m.name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">{m.role}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 text-xs">
                      {m.totalCalls.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {m.promptTokens.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {m.completionTokens.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {m.latency}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="font-mono font-black text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        {m.cost}
                      </span>
                    </td>
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
