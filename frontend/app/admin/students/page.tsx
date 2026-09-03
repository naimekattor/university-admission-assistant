'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  Users,
  Search,
  Eye,
  Clock,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');

  const students = [
    {
      id: 's1',
      name: 'Tanvir Hossain',
      group: 'Science',
      sscGpa: 5.0,
      hscGpa: 5.0,
      target: 'BUET CSE',
      progress: '68%',
      subscription: 'Premium Pass',
      lastActive: '10 mins ago',
      status: 'Active',
    },
    {
      id: 's2',
      name: 'Nusrat Jahan',
      group: 'Science',
      sscGpa: 5.0,
      hscGpa: 4.92,
      target: 'DU Ka Unit',
      progress: '52%',
      subscription: 'Free Starter',
      lastActive: '45 mins ago',
      status: 'Active',
    },
    {
      id: 's3',
      name: 'Rahim Ahmed',
      group: 'Science',
      sscGpa: 4.8,
      hscGpa: 4.75,
      target: 'KUET EEE',
      progress: '44%',
      subscription: 'Premium Pass',
      lastActive: '2 hours ago',
      status: 'Active',
    },
    {
      id: 's4',
      name: 'Farida Khanam',
      group: 'Science',
      sscGpa: 5.0,
      hscGpa: 5.0,
      target: 'BUET Architecture',
      progress: '35%',
      subscription: 'Free Starter',
      lastActive: '5 hours ago',
      status: 'Inactive',
    },
  ];

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'All' || s.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <AdminShell
      pageTitle="Registered Student Directory & Telemetry"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Students' }]}
    >
      <div className="space-y-6">
        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">1,420 Students</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                385 active today
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Premium Subscribers</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">385 Paid</h3>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                27.1% Conversion Rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Targeting BUET / DU</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">82% Science</h3>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Engineering & Medical Track
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── Search & Filter Toolbar ── */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search students by name or target goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
            >
              <option value="All">All Groups</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
            </select>

            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>{' '}
              students
            </span>
          </div>
        </div>

        {/* ── Modern Table Container ── */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-4">Group</th>
                  <th className="py-3.5 px-4">SSC / HSC GPA</th>
                  <th className="py-3.5 px-4">Primary Target</th>
                  <th className="py-3.5 px-4">Prep Progress</th>
                  <th className="py-3.5 px-4">Plan Tier</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5500] font-black text-xs flex items-center justify-center border border-orange-200/60 shadow-2xs shrink-0">
                          {s.name[0]}
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {s.group}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-xs text-slate-800">
                      {s.sscGpa.toFixed(2)} / {s.hscGpa.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-semibold text-xs text-[#FF5500]">{s.target}</td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-slate-900 font-mono">{s.progress}</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF5500] to-amber-500 rounded-full"
                            style={{ width: s.progress }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          s.subscription === 'Premium Pass'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {s.subscription}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[11px] font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {s.lastActive}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          s.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        className="p-2 rounded-xl bg-slate-50 hover:bg-[#FF5500] text-slate-500 hover:text-white border border-slate-200/70 transition shadow-2xs cursor-pointer"
                        title="View Student Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
