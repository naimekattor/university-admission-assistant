'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ExternalLink,
  ArrowRight,
  Settings,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { EligibilityResultsDisplay } from './eligibility-results-display';

interface MainContentPanelProps {
  admissions?: any[];
  deadlines?: any[];
}

export function MainContentPanel({ admissions = [], deadlines = [] }: MainContentPanelProps) {
  // Form State
  const [name, setName] = useState('');
  const [gpa, setGpa] = useState('5.00');
  const [group, setGroup] = useState('Science (Engineering / Tech)');
  const [evaluated, setEvaluated] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const gpaNum = parseFloat(gpa) || 5.0;
      setEvaluated({
        profile: { sscGPA: gpaNum, hscGPA: gpaNum, group, passingYear: 2026 },
        totalEvaluated: 6,
        eligibleCount: 5,
        ineligibleCount: 1,
        results: [
          {
            id: 'buet',
            university: 'BUET (Bangladesh University of Engineering and Technology)',
            department: 'Faculty of Electrical & Electronic Engineering',
            status: 'eligible',
            isEligible: true,
            deadline: 'Sep 18, 2026',
            testDate: 'Sep 28, 2026',
            satisfiedRequirements: ['HSC GPA 5.00 & Science group verified'],
          },
          {
            id: 'du-ka',
            university: 'University of Dhaka',
            department: 'Ka Unit (Faculty of Science)',
            status: 'eligible',
            isEligible: true,
            deadline: 'Oct 05, 2026',
            testDate: 'Oct 25, 2026',
            satisfiedRequirements: ['GPA criteria met for Ka Unit'],
          },
          {
            id: 'kuet',
            university: 'KUET',
            department: 'Engineering Faculty',
            status: 'eligible',
            isEligible: true,
            deadline: 'Oct 10, 2026',
            testDate: 'Nov 08, 2026',
            satisfiedRequirements: ['Science Stream verified'],
          },
        ],
      });
      setLoading(false);
    }, 600);
  };

  // Mock Technology/Admission Modules if admissions empty
  const displayModules =
    admissions.length > 0
      ? admissions.slice(0, 6)
      : [
          { id: '1', name: 'Field Generator (Core) • BUET Ka Unit', status: 'Online (99.8%)', date: 'May 2026', action: 'Configure' },
          { id: '2', name: 'Control Interface (UI) • DU Ka Unit', status: 'Up-to-date', date: 'June 2026', action: 'Join' },
          { id: '3', name: 'Control Interface (UI) • KUET Engineering', status: 'Online (99.8%)', date: 'June 2026', action: 'Configure' },
          { id: '4', name: 'Field Generator (Core) • RUET Engineering', status: 'Online (99.8%)', date: 'May 2026', action: 'Configure' },
          { id: '5', name: 'Control Interface (UI) • CUET Engineering', status: 'Up-to-date', date: 'May 2026', action: 'Configure' },
          { id: '6', name: 'Control Interface (UI) • Medical Consortium', status: 'Online (99.8%)', date: 'Aug 2026', action: 'Configure' },
        ];

  return (
    <section id="main-content-panel" className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* ── LARGE ROUNDED FRAME PANEL ── */}
      <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200 p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ═══════════════════════════════════════════════════════
              LEFT PANEL (2 COLUMNS) - TECHNOLOGY & ADMISSION MODULES TABLE
             ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#EA580C]" />
                <h2 className="font-bold text-sm sm:text-base tracking-wider text-slate-900 uppercase font-mono">
                  TECHNOLOGY MODULES
                </h2>
              </div>
              <Link
                href="/universities"
                className="text-xs font-semibold text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table Container */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">MODULE</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">LAST DEPLOYED</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {displayModules.map((item, idx) => {
                      const isUpToDate = item.status?.includes('Up-to-date') || item.status === 'Opening Soon';
                      const actionLabel = item.action || (idx % 2 === 0 ? 'Configure' : 'Join');

                      return (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* Module / University Name */}
                          <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                            <span className="truncate max-w-[220px] sm:max-w-xs">{item.shortName ? `${item.shortName} • ${item.name}` : item.name}</span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              {isUpToDate ? 'Up-to-date' : 'Online (99.8%)'}
                            </span>
                          </td>

                          {/* Last Deployed / Date */}
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {item.applicationWindow || item.date || 'May 2026'}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right">
                            <Link href={item.circularUrl || '/universities'}>
                              <button className="px-3.5 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 text-xs font-medium transition cursor-pointer">
                                {actionLabel}
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              RIGHT PANEL (1 COLUMN) - REQUEST ACCESS FORM & EVENTS
             ═══════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            
            {/* CARD 1: REQUEST ACCESS FORM CARD */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Request Access
              </h3>

              <form onSubmit={handleEvaluate} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:bg-white"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="Company Email"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#EA580C] focus:bg-white"
                  >
                    <option value="Use Case">Use Case: Engineering / Tech</option>
                    <option value="Science">Use Case: General Science & Medical</option>
                    <option value="Business">Use Case: Business & Administration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-full font-semibold text-xs shadow-sm hover:shadow transition cursor-pointer"
                >
                  {loading ? 'Evaluating...' : 'Request Evaluation'}
                </button>
              </form>
            </div>

            {/* CARD 2: SYSTEM EVENTS CARD */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
              <h3 className="font-bold text-xs tracking-wider text-slate-900 uppercase font-mono">
                SYSTEM EVENTS
              </h3>

              <div className="space-y-3 text-xs">
                {/* Event 1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>Simulation Beta Test (June 15)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>5:30hrs</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-white text-xs font-medium cursor-pointer shadow-2xs">
                    Join
                  </button>
                </div>

                {/* Event 2 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                      <Settings className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>Mainframe Update (July 1)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>5:30hrs</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-white text-xs font-medium cursor-pointer shadow-2xs">
                    Join
                  </button>
                </div>

                {/* Event 3 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                      <Users className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>Simulation Update (July 1)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>5:30hrs</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-white text-xs font-medium cursor-pointer shadow-2xs">
                    Join
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Evaluation Output if submitted */}
        {evaluated && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <EligibilityResultsDisplay evaluation={evaluated} />
          </div>
        )}
      </div>
    </section>
  );
}
