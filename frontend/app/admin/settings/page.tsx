'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Settings, Shield, Key, Database, Bot, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminShell
      pageTitle="Platform System & API Configuration"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}
    >
      <div className="space-y-6 max-w-3xl">
        {saved && (
          <div className="p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Platform settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#FF5500] flex items-center justify-center shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Google Gemini AI Engine Settings
                </h3>
                <p className="text-[11px] text-slate-500">Inference model, embedding pipeline, and vector thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Gemini Chat Reasoning Model</label>
                <input
                  defaultValue="gemini-2.5-flash"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Embedding Model</label>
                <input
                  defaultValue="text-embedding-004"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Embedding Vector Dimension</label>
                <input
                  defaultValue="768"
                  type="number"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">RAG Retrieval Max Documents</label>
                <input
                  defaultValue="5"
                  type="number"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center shadow-2xs">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Admin Security & Credentials
                </h3>
                <p className="text-[11px] text-slate-500">Master authentication credentials for platform admin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Admin Username</label>
                <input
                  defaultValue="admin"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-900 block">Admin Password Key</label>
                <input
                  type="password"
                  defaultValue="admin"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
            >
              Save Platform Configuration
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
