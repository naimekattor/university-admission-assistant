'use client';

import React, { useState } from 'react';
import { Share2, CheckCircle2 } from 'lucide-react';

export function GuideShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
        copied
          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
      title="Copy Link"
    >
      {copied ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
