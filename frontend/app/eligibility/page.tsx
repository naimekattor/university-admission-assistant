import React from 'react';
import type { Metadata } from 'next';
import { EligibilityFormIsland } from '@/components/eligibility/eligibility-form-island';
import { Sparkles, CheckCircle2, Award, BookOpen, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'University Admission Eligibility Checker 2026-2027 | EduGuide Bangladesh',
  description:
    'Check your admission eligibility for BUET, DU, Medical, GST, and all public universities in Bangladesh based on your SSC and HSC GPA, academic group, and passing year.',
  keywords: [
    'University Admission Eligibility Bangladesh',
    'BUET Eligibility Criteria',
    'DU Admission GPA Requirements',
    'Medical Admission Minimum GPA',
    'GST Cluster Eligibility',
    'HSC 2026 Admission Checker',
  ],
  openGraph: {
    title: 'University Admission Eligibility Checker | EduGuide',
    description: 'Instant automated qualification evaluation for public, engineering, and medical universities.',
    url: 'https://university-admission-assistant.vercel.app/eligibility',
  },
};

const CRITERIA_BENCHMARKS = [
  {
    institution: 'BUET & Engineering Cluster (CKRUET)',
    minSSC: '4.00',
    minHSC: '4.00',
    minCombined: '9.00 - 10.00',
    subjectRequirements: 'A+ (5.00) in Physics, Chemistry, Math & min 4.00 in English',
    secondTimeAllowed: 'No (1st Time Only for BUET)',
    group: 'Science Only',
  },
  {
    institution: 'Dhaka University (DU Ka / Science)',
    minSSC: '3.50',
    minHSC: '3.50',
    minCombined: '8.50',
    subjectRequirements: 'Min GPA 3.0 in individual science disciplines',
    secondTimeAllowed: 'No (DU 1st Time Only)',
    group: 'Science',
  },
  {
    institution: 'Dhaka University (DU Kha / Arts & Social Sciences)',
    minSSC: '3.00',
    minHSC: '3.00',
    minCombined: '8.00',
    subjectRequirements: 'Min GPA 3.0 in English & Bangla',
    secondTimeAllowed: 'No',
    group: 'Humanities / Any',
  },
  {
    institution: 'Dhaka University (DU Ga / Business Studies)',
    minSSC: '3.50',
    minHSC: '3.50',
    minCombined: '8.00',
    subjectRequirements: 'Accounting, Management, or Business Studies',
    secondTimeAllowed: 'No',
    group: 'Commerce',
  },
  {
    institution: 'National Medical & Dental Colleges (MBBS/BDS)',
    minSSC: '4.00',
    minHSC: '4.00',
    minCombined: '9.00 (Tribal: 8.00)',
    subjectRequirements: 'Biology minimum GPA 4.00 (or equivalent)',
    secondTimeAllowed: 'Yes (5 Marks deducted for 2nd time)',
    group: 'Science Only',
  },
  {
    institution: 'GST 24 General Science & Technology Cluster',
    minSSC: '3.50',
    minHSC: '3.50',
    minCombined: '8.00 (Sci) / 7.50 (Hum/Com)',
    subjectRequirements: 'Relevant core group subjects',
    secondTimeAllowed: 'Yes (2nd Time Allowed across GST)',
    group: 'Science / Commerce / Humanities',
  },
  {
    institution: 'Jahangirnagar University (JU Units A-E)',
    minSSC: '4.00',
    minHSC: '4.00',
    minCombined: '8.50 - 9.00',
    subjectRequirements: 'Unit specific thresholds in Math, Physics, or English',
    secondTimeAllowed: 'Yes (2nd Time Permitted)',
    group: 'All Groups',
  },
  {
    institution: 'Agriculture Cluster (8 Universities)',
    minSSC: '4.00',
    minHSC: '4.00',
    minCombined: '8.50',
    subjectRequirements: 'Biology, Physics, Chemistry, and Higher Math mandatory',
    secondTimeAllowed: 'Yes (2nd Time Allowed)',
    group: 'Science Only',
  },
];

export default function EligibilityPage() {
  return (
    <main className="min-h-screen bg-[#FFFDFB] relative overflow-hidden pb-16">
      {/* ── AMBIENT GRADIENT MESH BACKGROUND ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-orange-200/35 via-orange-100/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-5xl space-y-12">
        {/* ── PAGE HEADER ── */}
        <header className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500] text-xs font-bold uppercase tracking-wider shadow-2xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>OFFICIAL 2026-2027 ADMISSION CRITERIA QUALIFIER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            University Eligibility{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF6A1A] to-[#E64D00]">
              Checker
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Enter your SSC and HSC credentials below to instantly evaluate your eligibility across public, engineering, and medical admission units.
          </p>
        </header>

        {/* ── INTERACTIVE CLIENT FORM ISLAND ── */}
        <section aria-label="Interactive Eligibility Calculator">
          <EligibilityFormIsland />
        </section>

        {/* ── STATIC CRAWLABLE BENCHMARK CRITERIA TABLE (FOR SEARCH ENGINE CRITERIA INDEXING) ── */}
        <section className="bg-white/90 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-500/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-bold shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Standard GPA Admission Cutoffs by Institution
                </h2>
                <p className="text-xs text-slate-500">
                  Official historical benchmarks for HSC Batch 2025 & 2026
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto font-mono">
              2026 SESSION
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 font-mono text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">University / Cluster</th>
                  <th className="py-3 px-3">Group</th>
                  <th className="py-3 px-3">Min SSC</th>
                  <th className="py-3 px-3">Min HSC</th>
                  <th className="py-3 px-3">Min Total</th>
                  <th className="py-3 px-3">2nd Time?</th>
                  <th className="py-3 px-4">Key Subject Requirements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {CRITERIA_BENCHMARKS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.institution}</td>
                    <td className="py-3.5 px-3">{item.group}</td>
                    <td className="py-3.5 px-3 font-mono">{item.minSSC}</td>
                    <td className="py-3.5 px-3 font-mono">{item.minHSC}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#FF5500]">{item.minCombined}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${item.secondTimeAllowed.startsWith('Yes') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {item.secondTimeAllowed.startsWith('Yes') ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.subjectRequirements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS (SEO FAQ ACCORDION) ── */}
        <section className="bg-white/90 backdrop-blur-xl border border-orange-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-500/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5500] flex items-center justify-center font-bold shadow-2xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Frequently Asked Eligibility Questions
              </h2>
              <p className="text-xs text-slate-500">
                Rules regarding 4th subject GPAs, second-time admission, and quota reservations
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Is 4th subject included in minimum GPA?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes, in almost all Bangladeshi public universities (including DU, Medical, and GST), the total SSC and HSC GPA is evaluated including optional 4th subject credits. However, specific faculty requirements (like Physics or Chemistry grades) exclude optional substitutions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Which universities allow second-time applicants?</h3>
              <p className="text-slate-600 leading-relaxed">
                Medical & Dental colleges, GST 24 universities cluster, Agricultural Universities cluster, and Jahangirnagar University (JU) permit 2nd-time candidates. BUET, Dhaka University, and CUET/RUET/KUET generally restrict applicants to their first examination year.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">How does the 2nd time mark deduction work?</h3>
              <p className="text-slate-600 leading-relaxed">
                For Medical admission tests, 5.0 marks are deducted from the total score for 2nd time applicants, and 7.5 marks if already enrolled in a public medical college. Cluster universities may impose 0 to 5 mark penalties based on yearly circular specifications.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Can Arts or Commerce students apply for Science units?</h3>
              <p className="text-slate-600 leading-relaxed">
                Generally, Science units require HSC in Science with Physics, Chemistry, and Mathematics. However, DU Unit D (Department Change) and JU Units permit Science students to transfer into Commerce or Humanities, and vice-versa where specified.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
