'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Building2, MapPin, ArrowRight, Users, Calendar } from 'lucide-react';
import { FeaturedUniversitiesConfig } from '@/lib/homepage-types';
import { FALLBACK_UNIVERSITIES } from '@/lib/universities-fallback';
import { useScrollTriggerReveal } from '@/hooks/use-gsap-motion';

interface FeaturedUniversitiesSectionProps {
  config?: FeaturedUniversitiesConfig;
  universities?: any[];
}

export function FeaturedUniversitiesSection({ config, universities = [] }: FeaturedUniversitiesSectionProps) {
  const [allUnis, setAllUnis] = useState<any[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useScrollTriggerReveal(gridRef, {
    staggerChildren: '.university-card',
    y: 20,
    stagger: 0.07,
    start: 'top 85%',
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/v1/universities');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            setAllUnis(json.data);
          }
        }
      } catch {}
    };
    fetchAll();
  }, []);

  const displayedUniversities = useMemo(() => {
    const selectedIds = config?.selectedUniversityIds || [];
    const baseSource = allUnis.length > 0 ? allUnis : universities;
    const source = baseSource.length > 0 ? baseSource : FALLBACK_UNIVERSITIES;

    if (selectedIds.length > 0 && source.length > 0) {
      const selected = source.filter((u) => {
        const id = String(u.id || '').toLowerCase();
        const shortName = String(u.shortName || '').toLowerCase();
        const name = String(u.name || '').toLowerCase();
        return selectedIds.some((s) => {
          const target = String(s).toLowerCase();
          return target === id || target === shortName || target === name;
        });
      });
      if (selected.length > 0) return selected;
    }
    return source.slice(0, 8);
  }, [config?.selectedUniversityIds, universities, allUnis]);

  const title = config?.title || 'Explore Universities';
  const description =
    config?.description ||
    'Explore engineering, general, medical, and agricultural universities across Bangladesh with verified admission data.';

  return (
    <section id="explore-universities" className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] font-mono">
              CURATED DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {title}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {description}
            </p>
          </div>

          <Link href="/universities" className="shrink-0">
            <button className="text-xs font-semibold text-[#FF5500] hover:text-[#E64D00] flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 transition cursor-pointer">
              <span>View All Universities (26+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* ── UNIVERSITIES GRID ── */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {displayedUniversities.map((uni) => {
            const isImageLogo = uni.logo && (uni.logo.startsWith('http') || uni.logo.startsWith('/'));
            return (
            <div
              key={uni.id}
              className="university-card p-5 rounded-2xl border border-slate-200 bg-white hover:border-orange-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-3.5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    {isImageLogo ? (
                      <img
                        src={uni.logo}
                        alt={uni.shortName || uni.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                          }
                        }}
                      />
                    ) : null}
                    <span className={`${isImageLogo ? 'hidden' : 'block'} text-lg`}>
                      {uni.logo || '🏛️'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {uni.status || 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {uni.shortName}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {uni.name}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-800">{uni.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Seats:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {uni.seats ? uni.seats.toLocaleString() : '1,200+'}
                  </span>
                </div>
              </div>

              {/* Action */}
              {(() => {
                const targetSlug = (uni.slug || uni.shortName || uni.id || 'buet').toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
                return (
                  <Link href={`/universities/${targetSlug}`} className="block pt-1">
                    <button className="w-full py-1.5 px-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF5500] text-xs font-bold rounded-full flex items-center justify-center gap-1 transition cursor-pointer">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                );
              })()}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
