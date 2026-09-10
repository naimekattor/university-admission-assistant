'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface SocialShareBarProps {
  url?: string;
  title?: string;
  className?: string;
}

export function SocialShareBar({ url, title, className = '' }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://university-admission-assistant.vercel.app');
  const shareTitle = title || 'EduGuide — Bangladesh University Admission Circulars & Preparation';

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} — ${shareUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className={`flex items-center gap-1.5 text-xs text-slate-500 ${className}`}>
      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mr-1">
        <Share2 className="w-3 h-3 text-[#FF5500]" />
        <span>Share:</span>
      </span>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share admission circular on WhatsApp"
        title="Share on WhatsApp"
        className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-[11px] transition flex items-center gap-1 border border-emerald-200/60"
      >
        <span>WhatsApp</span>
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share admission circular on Facebook"
        title="Share on Facebook"
        className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[11px] transition flex items-center gap-1 border border-blue-200/60"
      >
        <span>Facebook</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        type="button"
        aria-label="Copy admission circular link"
        title="Copy link"
        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition flex items-center gap-1 cursor-pointer border border-slate-200"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-600 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 text-slate-500" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
