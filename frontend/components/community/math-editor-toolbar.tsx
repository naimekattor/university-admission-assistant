'use client';

import React, { useState } from 'react';
import {
  Divide,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Plus,
  FunctionSquare,
} from 'lucide-react';
import { MathRenderer } from './math-renderer';
import { VisualMathStudio } from './visual-math-studio';

interface MathEditorToolbarProps {
  onInsert: (snippet: string) => void;
  currentContent?: string;
  defaultOpenStudio?: boolean;
}

export function MathEditorToolbar({
  onInsert,
  currentContent = '',
  defaultOpenStudio = true,
}: MathEditorToolbarProps) {
  const [showStudio, setShowStudio] = useState(defaultOpenStudio);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'calculus' | 'greek' | 'templates'>('basics');

  const mathButtons = {
    basics: [
      { label: 'a/b', snippet: '\\frac{x^2+1}{x-1}', tooltip: 'Fraction' },
      { label: 'x²', snippet: 'x^2', tooltip: 'Square' },
      { label: 'xⁿ', snippet: 'x^{n}', tooltip: 'Power' },
      { label: 'xₙ', snippet: 'x_{1}', tooltip: 'Subscript' },
      { label: '√x', snippet: '\\sqrt{x}', tooltip: 'Square Root' },
      { label: '±', snippet: '\\pm', tooltip: 'Plus-Minus' },
      { label: '≤', snippet: '\\leq', tooltip: 'Less than or equal' },
      { label: '≥', snippet: '\\geq', tooltip: 'Greater than or equal' },
      { label: '≠', snippet: '\\neq', tooltip: 'Not equal' },
      { label: '≈', snippet: '\\approx', tooltip: 'Approximately equal' },
      { label: '×', snippet: '\\times', tooltip: 'Multiply' },
      { label: '÷', snippet: '\\div', tooltip: 'Divide' },
      { label: '∞', snippet: '\\infty', tooltip: 'Infinity' },
      { label: '→', snippet: '\\to', tooltip: 'Approaches' },
    ],
    calculus: [
      { label: '∫ dx', snippet: '\\int_{0}^{1} x^2 dx', tooltip: 'Definite Integral' },
      { label: '∫ f(x)', snippet: '\\int f(x) dx', tooltip: 'Indefinite Integral' },
      { label: 'd/dx', snippet: '\\frac{d}{dx}[f(x)]', tooltip: 'Derivative' },
      { label: '∂/∂x', snippet: '\\frac{\\partial y}{\\partial x}', tooltip: 'Partial Derivative' },
      { label: 'lim', snippet: '\\lim_{x \\to 0} \\frac{\\sin x}{x}', tooltip: 'Limit' },
      { label: '∑', snippet: '\\sum_{i=1}^{n} i^2', tooltip: 'Summation' },
      { label: '∏', snippet: '\\prod_{i=1}^{n} x_i', tooltip: 'Product' },
      { label: 'Vector →', snippet: '\\vec{F} = m\\vec{a}', tooltip: 'Vector notation' },
      { label: 'Unit Vector', snippet: '\\hat{i} + \\hat{j} + \\hat{k}', tooltip: 'Unit Vectors' },
      { label: 'Matrix', snippet: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', tooltip: '2x2 Matrix' },
    ],
    greek: [
      { label: 'π', snippet: '\\pi', tooltip: 'Pi' },
      { label: 'θ', snippet: '\\theta', tooltip: 'Theta' },
      { label: 'α', snippet: '\\alpha', tooltip: 'Alpha' },
      { label: 'β', snippet: '\\beta', tooltip: 'Beta' },
      { label: 'γ', snippet: '\\gamma', tooltip: 'Gamma' },
      { label: 'λ', snippet: '\\lambda', tooltip: 'Lambda' },
      { label: 'ω', snippet: '\\omega', tooltip: 'Omega' },
      { label: 'Δ', snippet: '\\Delta', tooltip: 'Delta' },
      { label: 'μ', snippet: '\\mu', tooltip: 'Mu' },
      { label: 'σ', snippet: '\\sigma', tooltip: 'Sigma' },
      { label: 'φ', snippet: '\\phi', tooltip: 'Phi' },
      { label: 'ρ', snippet: '\\rho', tooltip: 'Rho' },
    ],
    templates: [
      {
        label: 'Calculus Integral',
        snippet: '\n$$\\int_{0}^{1} \\frac{x^2+1}{x^4+1} dx$$\n',
        tooltip: 'Definite Integral Template',
      },
      {
        label: 'Newton Mechanics',
        snippet: '\n$$\\vec{F}(t) = (3t^2 + 2)\\hat{i} + (4t)\\hat{j}\\text{ N}$$\n$$J = \\int_{0}^{3} F(t) dt = \\Delta p$$\n',
        tooltip: 'Impulse-Momentum Formula',
      },
      {
        label: 'Chemical Equation',
        snippet: '\n$$\\text{CH}_4 + 2\\text{O}_2 \\to \\text{CO}_2 + 2\\text{H}_2\\text{O}$$\n',
        tooltip: 'Chemical Equation',
      },
      {
        label: 'Trig Identity',
        snippet: '\n$$\\sin^2\\theta + \\cos^2\\theta = 1$$\n',
        tooltip: 'Trigonometric Formula',
      },
    ],
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mb-3">
      {/* ── TOP BAR: TABS & PREVIEW TOGGLE ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
            <span className="text-[#FF5500]">Σ</span> Math Toolbar
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'basics' ? 'bg-orange-50 text-[#FF5500]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Algebra & Basics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculus')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'calculus' ? 'bg-orange-50 text-[#FF5500]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Calculus & Vectors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('greek')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'greek' ? 'bg-orange-50 text-[#FF5500]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Greek Symbols
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              activeTab === 'templates' ? 'bg-orange-50 text-[#FF5500]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Templates
          </button>
        </div>

        {/* Action Toggles: Studio & Live Preview */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStudio(!showStudio)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
              showStudio
                ? 'bg-orange-50 text-[#FF5500] border-orange-300 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>{showStudio ? 'Hide Studio' : 'Visual Graph Canvas'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
              showPreview
                ? 'bg-[#FF5500] text-white border-[#FF5500] shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#FF5500]" />}
            <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* ── VISUAL MATH STUDIO (GRAPH PAPER CANVAS MATCHING USER IMAGE 1) ── */}
      {showStudio && (
        <div className="p-3 bg-slate-50/70 border-b border-slate-200">
          <VisualMathStudio onInsertEquation={onInsert} />
        </div>
      )}

      {/* ── SYMBOL BUTTONS ROW ── */}
      <div className="p-2.5 flex flex-wrap items-center gap-1.5 bg-slate-50/60 max-h-[120px] overflow-y-auto">
        {mathButtons[activeTab].map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsert(btn.snippet)}
            title={btn.tooltip}
            className="px-2.5 py-1.5 bg-white hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 rounded-lg text-xs font-mono font-semibold text-slate-800 hover:text-[#FF5500] transition-all shadow-2xs hover:shadow-sm active:scale-95 flex items-center gap-1"
          >
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* ── LIVE PREVIEW CONTAINER ── */}
      {showPreview && (
        <div className="p-4 bg-orange-50/40 border-t border-orange-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#FF5500] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> KaTeX Live Rendered Preview
            </span>
            <span className="text-[11px] text-slate-400">Updates live as you type</span>
          </div>
          {currentContent.trim() ? (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs min-h-[60px]">
              <MathRenderer content={currentContent} />
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400 font-mono">
              Type equations above (e.g. $x^2 + 5x + 6 = 0$ or $$\int_0^1 x^2 dx$$) to see live KaTeX rendering.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
