'use client';

import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { submitReport } from '@/lib/community-service';

interface ReportDialogProps {
  questionId?: string;
  answerId?: string;
  trigger?: React.ReactNode;
}

export function ReportDialog({ questionId, answerId, trigger }: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('spam');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const msg = await submitReport({
        questionId,
        answerId,
        reason,
        description,
      });
      setSuccessMsg(msg);
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg('');
        setDescription('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition text-xs flex items-center gap-1 cursor-pointer"
            title="Report this content"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="sr-only">Report</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1">
              <AlertTriangle className="w-4 h-4 text-[#FF5500]" />
              <span>Report Content</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Help maintain a high-quality, trustworthy educational environment for all students.
            </p>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason for report
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500]"
                  >
                    <option value="spam">Spam or Advertisement</option>
                    <option value="incorrect_math">Incorrect Mathematics / Solution Error</option>
                    <option value="misleading">Misleading Admission Information</option>
                    <option value="offensive">Abusive or Inappropriate Content</option>
                    <option value="duplicate">Duplicate Question</option>
                    <option value="other">Other Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide context on why this should be moderated..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF5500] hover:bg-[#E64D00] text-white transition shadow-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
