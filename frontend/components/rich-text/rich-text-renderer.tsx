'use client';

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  // Normalize &nbsp; and \u00A0 unicode non-breaking spaces to standard breakable spaces
  // This is crucial: when rich text editors or clipboard pastes contain &nbsp;, the browser
  // treats entire sentences as single unbreakable words, forcing horizontal overflow.
  const normalizedContent = useMemo(() => {
    if (!content) return '';
    return content
      .replace(/&nbsp;/gi, ' ')
      .replace(/\u00A0/g, ' ');
  }, [content]);

  const isHtmlContent = useMemo(() => {
    if (!normalizedContent) return false;
    return /<\/?[a-z][\s\S]*>/i.test(normalizedContent);
  }, [normalizedContent]);

  const sanitizedHtml = useMemo(() => {
    if (!normalizedContent || !isHtmlContent) return '';
    if (typeof window === 'undefined') {
      // Basic SSR sanitization fallback
      return normalizedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return DOMPurify.sanitize(normalizedContent, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'b',
        'i',
        'em',
        'strong',
        'u',
        's',
        'strike',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'span',
        'code',
        'pre',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'img',
        'hr',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'src', 'alt', 'title', 'width', 'height'],
    });
  }, [normalizedContent, isHtmlContent]);

  if (!normalizedContent) return null;

  if (isHtmlContent) {
    return (
      <div
        className={`prose prose-slate max-w-none leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#FF5500] prose-a:underline hover:prose-a:text-[#E64D00] prose-strong:text-slate-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-li:text-slate-700 break-words [overflow-wrap:anywhere] w-full max-w-full min-w-0 overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className={`prose prose-slate max-w-none leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#FF5500] prose-a:underline hover:prose-a:text-[#E64D00] prose-strong:text-slate-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-li:text-slate-700 break-words [overflow-wrap:anywhere] w-full max-w-full min-w-0 overflow-x-auto ${className}`}
    >
      <ReactMarkdown>{normalizedContent}</ReactMarkdown>
    </div>
  );
}


