'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DOMPurify from 'dompurify';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses markdown/text content and renders LaTeX expressions safely via KaTeX.
 * Handles:
 * - Display Math: $$ ... $$ or \[ ... \]
 * - Inline Math: $ ... $ or \( ... \)
 * - Bengali & English text mixed naturally
 */
export function MathRenderer({ content, className = '' }: MathRendererProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    let text = content;

    // 1. Render display block math: $$ ... $$ or \[ ... \]
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        return `\n\n<div class="katex-display-wrapper my-3 overflow-x-auto py-1 text-center">${rendered}</div>\n\n`;
      } catch {
        return `\n\n<pre class="katex-error bg-rose-50 text-rose-600 p-2 rounded">${math}</pre>\n\n`;
      }
    });

    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        return `\n\n<div class="katex-display-wrapper my-3 overflow-x-auto py-1 text-center">${rendered}</div>\n\n`;
      } catch {
        return `\n\n<pre class="katex-error bg-rose-50 text-rose-600 p-2 rounded">${math}</pre>\n\n`;
      }
    });

    // 2. Render inline math: $ ... $ or \( ... \) (avoid matching currency or standalone $)
    text = text.replace(/\$([^\$\n\r]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        return `<code>${math}</code>`;
      }
    });

    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        return `<code>${math}</code>`;
      }
    });

    // 3. Format basic markdown line breaks & bold formatting
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((chunk) => {
        const trimmed = chunk.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<div class="katex-display-wrapper') || trimmed.startsWith('<pre class="katex-error')) {
          return trimmed;
        }
        const formatted = trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-[#FF5500]">$1</code>')
          .replace(/\n/g, '<br/>');
        return `<p class="mb-2 leading-relaxed text-slate-800">${formatted}</p>`;
      })
      .filter(Boolean);

    text = paragraphs.join('\n');

    // 4. Sanitize with DOMPurify in browser environment
    if (typeof window !== 'undefined' && typeof DOMPurify?.sanitize === 'function') {
      return DOMPurify.sanitize(text, {
        USE_PROFILES: { mathMl: true, svg: true, html: true },
        ADD_TAGS: [
          'math', 'annotation', 'semantics', 'mrow', 'mi', 'mo', 'mn', 
          'msup', 'msub', 'mfrac', 'msqrt', 'munder', 'mover', 'munderover', 
          'mtable', 'mtr', 'mtd', 'span', 'div', 'p', 'br', 'strong', 'em', 'code'
        ],
        ADD_ATTR: [
          'display', 'xmlns', 'mathvariant', 'columnalign', 'rowalign', 
          'style', 'class', 'aria-hidden'
        ],
      });
    }
    return text;
  }, [content]);

  return (
    <div
      className={`prose-sm max-w-none text-slate-800 math-content-container leading-relaxed break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
