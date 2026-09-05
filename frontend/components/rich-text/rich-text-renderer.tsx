'use client';

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  const isHtmlContent = useMemo(() => {
    if (!content) return false;
    return /<\/?[a-z][\s\S]*>/i.test(content);
  }, [content]);

  const sanitizedHtml = useMemo(() => {
    if (!content || !isHtmlContent) return '';
    if (typeof window === 'undefined') {
      // Basic SSR sanitization fallback
      return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return DOMPurify.sanitize(content, {
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
  }, [content, isHtmlContent]);

  if (!content) return null;

  if (isHtmlContent) {
    return (
      <div
        className={`prose prose-slate max-w-none leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#FF5500] prose-a:underline hover:prose-a:text-[#E64D00] prose-strong:text-slate-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-li:text-slate-700 ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className={`prose prose-slate max-w-none leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#FF5500] prose-a:underline hover:prose-a:text-[#E64D00] prose-strong:text-slate-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-li:text-slate-700 ${className}`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

