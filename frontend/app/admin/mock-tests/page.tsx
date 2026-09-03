'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Award,
  PlusCircle,
  Clock,
  Play,
  Edit,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Search,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export default function AdminMockTestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState('All');

  const tests = [
    {
      id: 'buet-prelim-01',
      title: 'BUET Preliminary Model Test 01',
      university: 'BUET',
      unit: 'Ka Unit',
      duration: '15 mins',
      questionsCount: 10,
      totalAttempts: 420,
      avgScore: '74%',
      status: 'Active',
    },
    {
      id: 'du-ka-01',
      title: 'DU Ka Unit Full Standard Model Test',
      university: 'DU',
      unit: 'Ka Unit',
      duration: '30 mins',
      questionsCount: 20,
      totalAttempts: 680,
      avgScore: '68%',
      status: 'Active',
    },
    {
      id: 'kuet-prelim-01',
      title: 'Engineering Cluster Mock Test 01',
      university: 'CKRUET',
      unit: 'All Units',
      duration: '45 mins',
      questionsCount: 30,
      totalAttempts: 290,
      avgScore: '62%',
      status: 'Active',
    },
  ];

  const filtered = tests.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUni = selectedUni === 'All' || t.university === selectedUni;
    return matchesSearch && matchesUni;
  });

  return (
    <AdminShell
      pageTitle="Admission Mock Test Series Management"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Mock Tests' }]}
      actions={
        <Link
          href="/mock-tests"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Mock Test</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Test Attempts</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">1,390 Attempts</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                Live student simulation
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Student Score</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">68.0% Avg</h3>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Negative marking evaluated
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Exam Timers</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">Real-time Timed</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                Auto-submission on expiry
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── Search & Filter Toolbar ── */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search mock tests by title or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedUni}
              onChange={(e) => setSelectedUni(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              <option value="All">All Universities</option>
              <option value="BUET">BUET</option>
              <option value="DU">DU</option>
              <option value="CKRUET">CKRUET</option>
            </select>

            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>{' '}
              tests
            </span>
          </div>
        </div>

        {/* ── Modern Table Container ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Test Title</th>
                  <th className="py-3.5 px-4">Target University</th>
                  <th className="py-3.5 px-4">Duration • MCQs</th>
                  <th className="py-3.5 px-4">Total Student Attempts</th>
                  <th className="py-3.5 px-4">Average Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5 max-w-md">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {t.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        /mock-tests/{t.id}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF5500] border border-orange-200">
                        {t.university} • {t.unit}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-700 font-medium text-xs">
                        {t.duration} ({t.questionsCount} Qs)
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {t.totalAttempts} attempts
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {t.avgScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/mock-tests`}
                          className="p-2 rounded-xl bg-orange-50 hover:bg-[#FF5500] text-[#FF5500] hover:text-white border border-orange-200 transition shadow-2xs"
                          title="Start Test"
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-600 border border-slate-200/70 transition shadow-2xs cursor-pointer"
                          title="Edit Mock Test"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
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
