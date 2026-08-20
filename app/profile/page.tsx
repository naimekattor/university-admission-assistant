'use client';

import React, { useState } from 'react';
import { StudentShell } from '@/components/layout/student-shell';
import { User, Target, Award, Calendar, CheckCircle2, Flame, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <StudentShell
      pageTitle="Student Academic Profile"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Profile' }]}
    >
      <div className="space-y-6 max-w-3xl">
        {saved && (
          <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--eg-success-soft)] text-[var(--eg-success)] border border-[var(--eg-success)]/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="eg-card space-y-6">
          <div className="flex items-center gap-4 border-b border-[var(--eg-border)] pb-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] font-bold text-2xl flex items-center justify-center border border-[var(--eg-primary)]/20">
              N
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--eg-text-primary)]">Naim Hossain</h2>
              <div className="text-xs text-[var(--eg-text-muted)]">HSC Candidate • Science Group • Dhaka Board</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[var(--eg-text-primary)] uppercase tracking-wider">
              Academic Background & Results
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Full Name</label>
                <input defaultValue="Naim Hossain" className="eg-input" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Academic Group</label>
                <input defaultValue="Science" className="eg-input" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">SSC GPA</label>
                <input defaultValue="5.00" className="eg-input font-mono" />
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">HSC GPA / Expected</label>
                <input defaultValue="5.00" className="eg-input font-mono" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--eg-border)]">
            <h3 className="font-bold text-sm text-[var(--eg-text-primary)] uppercase tracking-wider">
              Admission Target Goal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Primary Target University</label>
                <select className="eg-input">
                  <option>BUET — Computer Science & Engineering</option>
                  <option>DU — Faculty of Science (Ka Unit)</option>
                  <option>KUET — Electrical & Electronic Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--eg-text-muted)] mb-1 font-semibold">Secondary Target Goal</label>
                <select className="eg-input">
                  <option>DU — Ka Unit</option>
                  <option>CKRUET — Engineering Cluster</option>
                  <option>Medical College Admission Test</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn btn-primary font-bold text-xs">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </StudentShell>
  );
}
