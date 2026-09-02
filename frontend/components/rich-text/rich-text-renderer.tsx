'use client';

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  const sanitizedHtml = useMemo(() => {
    if (!content) return '';
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
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'span',
        'code',
        'pre',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    });
  }, [content]);

  return (
    <div
      className={`prose prose-sm max-w-none text-[var(--eg-text-secondary)] leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
