import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Globe, Building2 } from 'lucide-react';
import { fetchServerUniversityBySlug } from '@/lib/server-api';
import { UniversityClientTabs } from '@/components/universities/university-client-tabs';

export const revalidate = 900; // ISR: 15 minutes cache regeneration

export async function generateStaticParams() {
  const topSlugs = [
    'buet',
    'du',
    'medical',
    'ckruet',
    'cuet',
    'kuet',
    'ruet',
    'sust',
    'ju',
    'ru',
    'cu',
    'jnu',
    'butex',
    'bup',
    'bau',
    'sau',
    'gst',
  ];

  return topSlugs.map((slug) => ({ slug }));
}

export default async function UniversityDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const uni = await fetchServerUniversityBySlug(slug);

  if (!uni) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">
      {/* ── BREADCRUMB & BACK NAV ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link
          href="/universities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF5500] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Universities</span>
        </Link>
      </div>

      {/* ── UNIVERSITY HERO BANNER (Server Rendered for SEO) ── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:resp-20 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {uni.logo ? (
                <Image
                  src={uni.logo}
                  alt={`${uni.shortName} Logo`}
                  width={64}
                  height={64}
                  className="object-contain max-h-full"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-orange-50 text-[#FF5500] font-black text-sm flex items-center justify-center">
                  {uni.shortName?.slice(0, 3) || 'UNI'}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5500]">
                  {uni.shortName}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  {uni.status || 'Verified 2026'}
                </span>
                {uni.foundedYear && (
                  <span className="text-xs text-slate-400 font-mono">Est. {uni.foundedYear}</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {uni.name} Admission 2026
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{uni.location || 'Bangladesh'}</span>
                </div>
                {uni.website && (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#FF5500] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/eligibility"
              className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] text-white font-bold text-xs rounded-full shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-center"
            >
              <span>Check Eligibility</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CLIENT ISLAND: TABS, BOOKMARKS, AND INTERACTIVE CONTENT ── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <UniversityClientTabs uni={uni} />
      </section>
    </main>
  );
}
