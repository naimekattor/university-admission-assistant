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
          <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--eg-success-soft)] text-[var(--eg-success)] border border-[var(--eg-success)]/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Platform settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="eg-card space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[var(--eg-text-primary)] border-b border-[var(--eg-border)] pb-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-[var(--eg-primary)]" />
              <span>Google Gemini AI Engine Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Gemini Chat Reasoning Model</label>
                <input defaultValue="gemini-2.5-flash" className="eg-input font-mono" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Embedding Model</label>
                <input defaultValue="embedding-001" className="eg-input font-mono" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Embedding Vector Dimension</label>
                <input defaultValue="768" type="number" className="eg-input font-mono" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">RAG Retrieval Max Documents</label>
                <input defaultValue="5" type="number" className="eg-input font-mono" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--eg-border)]">
            <h3 className="font-bold text-base text-[var(--eg-text-primary)] border-b border-[var(--eg-border)] pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--eg-error)]" />
              <span>Admin Security & Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Admin Username</label>
                <input defaultValue="admin" className="eg-input font-mono" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Admin Password Key</label>
                <input type="password" defaultValue="admin" className="eg-input font-mono" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn btn-primary font-bold text-xs">
              Save Platform Configuration
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
