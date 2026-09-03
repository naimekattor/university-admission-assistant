'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  className?: string;
}

/**
 * Cleanly transforms raw LaTeX math expressions (\[...\], \(...\), \frac, \cdot, etc.)
 * into clear, readable, beautiful math markup before passing to markdown.
 */
function preprocessMathAndMarkdown(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Replace display math \[ ... \] with formatted blockquotes or code blocks
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
    const cleaned = cleanLatexMath(math);
    return `\n\n> 🧮 **Formula:** ${cleaned}\n\n`;
  });

  // 2. Replace inline math \( ... \) with cleaned inline code
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    const cleaned = cleanLatexMath(math);
    return `\`${cleaned}\``;
  });

  // 3. Clean remaining lone LaTeX tags
  text = cleanLatexMath(text);

  return text;
}

function cleanLatexMath(expr: string): string {
  return expr
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\div/g, ' ÷ ')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\pm/g, '±')
    .replace(/\\approx/g, '≈')
    .replace(/\\leq?/g, '≤')
    .replace(/\\geq?/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\int/g, '∫')
    .replace(/\\infty/g, '∞')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sum/g, '∑')
    .replace(/\\\s/g, ' ');
}

export function MarkdownContent({ content, className = '' }: Props) {
  const processed = useMemo(() => preprocessMathAndMarkdown(content), [content]);

  return (
    <div className={`space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal ${className}`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700 font-medium">{children}</p>,
          strong: ({ children }) => <strong className="font-extrabold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-800">{children}</em>,
          ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1 text-slate-700">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1 text-slate-700 font-medium">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <div className="my-2.5 p-3 rounded-2xl bg-orange-50/80 border border-orange-200/90 text-slate-900 font-semibold shadow-2xs">
              {children}
            </div>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[#FF5500] font-mono text-xs font-bold border border-slate-200/80">
              {children}
            </code>
          ),
          h1: ({ children }) => <h1 className="text-base font-extrabold text-slate-900 my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-extrabold text-slate-900 my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-extrabold text-[#FF5500] uppercase tracking-wider my-1.5 font-mono">{children}</h3>,
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
