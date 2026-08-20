'use client';

import React, { useState } from 'react';
import { StudentShell } from '@/components/layout/student-shell';
import { Settings, Bell, Shield, Moon, CheckCircle2 } from 'lucide-react';

export default function StudentSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <StudentShell
      pageTitle="Account & Notification Preferences"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
    >
      <div className="space-y-6 max-w-2xl">
        {saved && (
          <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--eg-success-soft)] text-[var(--eg-success)] border border-[var(--eg-success)]/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="eg-card space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[var(--eg-text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--eg-primary)]" />
              <span>Admission Alerts & Notifications</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--eg-primary)]" />
                <div>
                  <div className="font-bold text-[var(--eg-text-primary)]">Application Deadline Reminders</div>
                  <div className="text-[var(--eg-text-muted)]">Receive notifications 3 days before university deadlines close</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--eg-primary)]" />
                <div>
                  <div className="font-bold text-[var(--eg-text-primary)]">Daily Study Plan Check-in</div>
                  <div className="text-[var(--eg-text-muted)]">Morning reminder on today's recommended topics and practice drill</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn btn-primary font-bold text-xs">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </StudentShell>
  );
}
