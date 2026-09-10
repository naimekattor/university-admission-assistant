import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 max-w-xl">
        <div className="h-4 w-28 bg-slate-200 rounded-full" />
        <div className="h-8 w-80 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full bg-slate-200 rounded-lg" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-slate-200/70 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-5/6 bg-slate-100 rounded" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="h-4 w-20 bg-slate-200 rounded-full" />
              <div className="h-4 w-16 bg-slate-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
