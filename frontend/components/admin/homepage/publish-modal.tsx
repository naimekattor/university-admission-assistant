'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Loader2, Sparkles, ShieldCheck, X } from 'lucide-react';
import { HomepageFullConfig } from '@/lib/homepage-types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftConfig: HomepageFullConfig;
  warnings?: Array<{ id: string; severity: string; title: string; detail: string }>;
  onConfirmPublish: () => Promise<void>;
}

export function PublishModal({
  isOpen,
  onClose,
  draftConfig,
  warnings = [],
  onConfirmPublish,
}: PublishModalProps) {
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  if (!isOpen) return null;

  const nextVersion = (draftConfig.version || 1) + 1;

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      await onConfirmPublish();
      onClose();
    } catch (err: any) {
      setPublishError(err.message || 'Failed to publish homepage. Please check validations.');
    } finally {
      setPublishing(false);
    }
  };

  const highSeverityWarnings = warnings.filter((w) => w.severity === 'high');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-[var(--eg-border)] shadow-2xl overflow-hidden flex flex-col space-y-0 text-[var(--eg-text-primary)]">
        {/* Header */}
        <div className="p-6 border-b border-[var(--eg-border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Publish Homepage to Production</h3>
              <p className="text-xs text-[var(--eg-text-secondary)]">
                Deploying changes as Version {nextVersion}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
          {/* Section Summary Checklist */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--eg-text-muted)] font-mono">
              Sections to be Published:
            </h4>
            <div className="grid grid-cols-2 gap-2 bg-[var(--eg-surface-subtle)] p-3 rounded-xl border border-[var(--eg-border)]">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hero Section</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admission At A Glance</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Eligibility Checker</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admission Deadlines</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Featured Universities</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Admission Advisor</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admission Guides</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Preparation CTA & FAQ</span>
              </div>
            </div>
          </div>

          {/* Warnings Scanner */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Quality Warnings ({warnings.length}):</span>
              </h4>
              <div className="space-y-2">
                {warnings.map((w) => (
                  <div
                    key={w.id}
                    className={`p-3 rounded-lg border text-xs ${
                      w.severity === 'high'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <div className="font-bold">{w.title}</div>
                    <div className="text-[11px] opacity-90 mt-0.5">{w.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {publishError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
              {publishError}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={publishing}
            className="px-4 py-2 bg-white border border-[var(--eg-border-strong)] rounded-lg text-xs font-semibold text-[var(--eg-text-secondary)] hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing || highSeverityWarnings.length > 3}
            className="px-6 py-2 bg-[var(--eg-primary)] hover:bg-[var(--eg-primary-hover)] text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Version {nextVersion}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Publish Homepage (v{nextVersion})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
