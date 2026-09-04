'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Code,
  Eye,
  RotateCcw,
  Sparkles,
  PlusCircle,
  Check,
  Copy,
  ChevronRight,
  Calculator,
  Layers,
  Wand2,
} from 'lucide-react';
import { MathRenderer } from './math-renderer';

interface VisualMathStudioProps {
  onInsertEquation: (latexSnippet: string) => void;
  initialLatex?: string;
  className?: string;
}

export function VisualMathStudio({
  onInsertEquation,
  initialLatex = '',
  className = '',
}: VisualMathStudioProps) {
  // Mode: 'visual' (Interactive Graph Paper Canvas) vs 'tex' (Direct LaTeX input)
  const [mode, setMode] = useState<'visual' | 'tex'>('visual');

  // Active Category in Visual Palette
  const [activeTab, setActiveTab] = useState<'calculus' | 'fractions' | 'powers' | 'greek' | 'presets'>('calculus');

  // Interactive Equation State for the Visual Builder
  const [currentLatex, setCurrentLatex] = useState(
    initialLatex || '\\int \\frac{\\pi \\sin(\\sqrt{x}) e^{\\sqrt{x}}}{\\sqrt{x}} dx'
  );

  // Slots for the active visual template
  const [templateType, setTemplateType] = useState<
    'integral' | 'definite_integral' | 'fraction' | 'limit' | 'sum' | 'sqrt' | 'power' | 'custom'
  >('integral');

  // Slot values
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [integrand, setIntegrand] = useState('\\frac{\\pi \\sin(\\sqrt{x}) e^{\\sqrt{x}}}{\\sqrt{x}}');
  const [differential, setDifferential] = useState('x');

  // Fraction slots
  const [numerator, setNumerator] = useState('\\pi \\sin(\\sqrt{x}) e^{\\sqrt{x}}');
  const [denominator, setDenominator] = useState('\\sqrt{x}');

  // Active highlighted slot on the canvas
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Copied toast state
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);

  // Whenever template slots change, construct the clean LaTeX representation for code/export
  useEffect(() => {
    if (mode === 'tex') return; // Don't overwrite if user is typing raw LaTeX

    if (templateType === 'integral') {
      const lower = lowerLimit ? `_{${lowerLimit}}` : '';
      const upper = upperLimit ? `^{${upperLimit}}` : '';
      const diff = differential ? ` d${differential}` : ' dx';
      setCurrentLatex(`\\int${lower}${upper} ${integrand || 'f(x)'}${diff}`);
    } else if (templateType === 'fraction') {
      setCurrentLatex(`\\frac{${numerator || 'a'}}{${denominator || 'b'}}`);
    }
  }, [templateType, lowerLimit, upperLimit, integrand, differential, numerator, denominator, mode]);

  // Computed LaTeX specifically for the Visual Graph Paper Canvas (with interactive placeholder boxes matching Image 1)
  const canvasLatex = useMemo(() => {
    if (mode === 'tex') return currentLatex;

    if (templateType === 'integral') {
      const lower = lowerLimit ? `_{${lowerLimit}}` : '_{\\Box}';
      const upper = upperLimit ? `^{${upperLimit}}` : '^{\\Box}';
      const diff = differential ? `\\boxed{\\mathrm{d}${differential}}` : '\\boxed{\\mathrm{d}x}';
      return `\\int${lower}${upper} ${integrand || 'f(x)'} ${diff}`;
    } else if (templateType === 'fraction') {
      return `\\frac{${numerator || '\\Box'}}{${denominator || '\\Box'}}`;
    }
    return currentLatex;
  }, [mode, currentLatex, templateType, lowerLimit, upperLimit, differential, integrand, numerator, denominator]);

  // Handle Quick Presets (including the exact one from user's image 1 & 2)
  const applyPreset = (presetName: string) => {
    if (presetName === 'image1_integral') {
      setTemplateType('integral');
      setLowerLimit('');
      setUpperLimit('');
      setIntegrand('\\frac{\\pi \\sin(\\sqrt{x}) e^{\\sqrt{x}}}{\\sqrt{x}}');
      setDifferential('x');
      setCurrentLatex('\\int \\frac{\\pi \\sin(\\sqrt{x}) e^{\\sqrt{x}}}{\\sqrt{x}} dx');
    } else if (presetName === 'image2_integral') {
      setTemplateType('integral');
      setLowerLimit('0');
      setUpperLimit('1');
      setIntegrand('x^2');
      setDifferential('x');
      setCurrentLatex('\\int_{0}^{1} x^2 dx');
    } else if (presetName === 'buet_impulse') {
      setTemplateType('custom');
      setCurrentLatex('J = \\int_{0}^{t_1} \\vec{F}(t) dt = m(v_2 - v_1)');
    } else if (presetName === 'rational_fraction') {
      setTemplateType('fraction');
      setNumerator('x^2 + 1');
      setDenominator('x^4 + 1');
      setCurrentLatex('\\frac{x^2 + 1}{x^4 + 1}');
    } else if (presetName === 'limit_sine') {
      setTemplateType('custom');
      setCurrentLatex('\\lim_{x \\to 0} \\frac{\\sin(\\pi x)}{x} = \\pi');
    } else if (presetName === 'matrix_2x2') {
      setTemplateType('custom');
      setCurrentLatex('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}');
    }
  };

  // Append or insert symbol into active slot
  const appendSymbol = (sym: string) => {
    if (mode === 'tex') {
      setCurrentLatex((prev) => `${prev} ${sym}`);
      return;
    }

    if (activeSlot === 'lower') {
      setLowerLimit((prev) => (prev ? `${prev}${sym}` : sym));
    } else if (activeSlot === 'upper') {
      setUpperLimit((prev) => (prev ? `${prev}${sym}` : sym));
    } else if (activeSlot === 'diff') {
      setDifferential(sym.replace(/^d/, ''));
    } else if (activeSlot === 'num') {
      setNumerator((prev) => (prev ? `${prev} ${sym}` : sym));
    } else if (activeSlot === 'den') {
      setDenominator((prev) => (prev ? `${prev} ${sym}` : sym));
    } else {
      // Default: append to integrand or general formula
      setIntegrand((prev) => (prev ? `${prev} ${sym}` : sym));
      setCurrentLatex((prev) => `${prev} ${sym}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleInsert = () => {
    const formatted = `\n$$${currentLatex.trim()}$$\n`;
    onInsertEquation(formatted);
    setInserted(true);
    setTimeout(() => setInserted(false), 1800);
  };

  return (
    <div className={`w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-4 ${className}`}>
      {/* ── HEADER: STUDIO BRAND & MODE TOGGLE ── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF5500] text-white flex items-center justify-center text-xs font-black shadow-2xs">
            ∑
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 leading-none flex items-center gap-1.5">
              <span>Visual Math Studio</span>
              <span className="text-[10px] text-[#FF5500] font-mono font-bold bg-orange-100/70 px-1.5 py-0.5 rounded">
                CANVAS
              </span>
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">
              Click template boxes on the graph canvas to edit formulas visually
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
          {/* Preset Chips */}
          <button
            type="button"
            onClick={() => applyPreset('image1_integral')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-50 text-[#FF5500] border border-orange-200 hover:bg-orange-100 transition shadow-2xs flex items-center gap-1"
            title="Load: ∫ π sin(√x) e^(√x) / √x dx"
          >
            <Sparkles className="w-3 h-3 text-[#FF5500]" />
            <span>Image 1 Formula</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('image2_integral')}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200"
            title="Load: ∫₀¹ x² dx"
          >
            <span>∫₀¹ x² dx</span>
          </button>

          {/* Mode Switcher */}
          <div className="bg-slate-200/80 p-0.5 rounded-lg flex items-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={`px-2.5 py-1 rounded-md transition ${
                mode === 'visual'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual Canvas
            </button>
            <button
              type="button"
              onClick={() => setMode('tex')}
              className={`px-2.5 py-1 rounded-md transition font-mono ${
                mode === 'tex'
                  ? 'bg-white text-[#FF5500] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TeX Code
            </button>
          </div>
        </div>
      </div>

      {/* ── MATH TOOLBAR TABS & SYMBOL BUTTONS ── */}
      <div className="px-3 pt-2 pb-1.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('calculus');
              setTemplateType('integral');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'calculus'
                ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ∫ Calculus & Integrals
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('fractions');
              setTemplateType('fraction');
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'fractions'
                ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            a/b Fractions & Radicals
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('powers')}
            className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'powers'
                ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            xⁿ Powers & Subscripts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('greek')}
            className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'greek'
                ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            π Greek & Functions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-orange-50 text-[#FF5500] font-bold border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⚡ BUET / Varsity Presets
          </button>
        </div>

        {/* Quick Symbol Buttons Row */}
        <div className="flex flex-wrap items-center gap-1.5 py-2">
          {activeTab === 'calculus' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setTemplateType('integral');
                  setLowerLimit('');
                  setUpperLimit('');
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-xs font-mono font-bold text-slate-800 hover:text-[#FF5500] transition"
              >
                ∫ f(x) dx
              </button>
              <button
                type="button"
                onClick={() => {
                  setTemplateType('integral');
                  setLowerLimit('0');
                  setUpperLimit('1');
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-xs font-mono font-bold text-slate-800 hover:text-[#FF5500] transition"
              >
                ∫₀¹ f(x) dx
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\frac{d}{dx}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                d/dx
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\lim_{x \\to 0}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                lim x→0
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\sum_{i=1}^{n}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ∑
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\vec{F}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                Vector →
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\hat{i} + \\hat{j} + \\hat{k}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                Unit Vectors
              </button>
            </>
          )}

          {activeTab === 'fractions' && (
            <>
              <button
                type="button"
                onClick={() => setTemplateType('fraction')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                a/b Fraction
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\sqrt{x}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                √x
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\sqrt[n]{x}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ⁿ√x
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\pm')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ±
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\times')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ×
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\div')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ÷
              </button>
            </>
          )}

          {activeTab === 'powers' && (
            <>
              <button
                type="button"
                onClick={() => appendSymbol('x^2')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                x²
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('x^n')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                xⁿ
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('x_1')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                x₁
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('e^x')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                eˣ
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('e^{\\sqrt{x}}')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                e^(√x)
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\infty')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ∞
              </button>
            </>
          )}

          {activeTab === 'greek' && (
            <>
              <button
                type="button"
                onClick={() => appendSymbol('\\pi')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                π
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\theta')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                θ
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\sin(\\sqrt{x})')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                sin(√x)
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\cos(x)')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                cos(x)
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\ln(x)')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                ln(x)
              </button>
              <button
                type="button"
                onClick={() => appendSymbol('\\Delta')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
              >
                Δ
              </button>
            </>
          )}

          {activeTab === 'presets' && (
            <>
              <button
                type="button"
                onClick={() => applyPreset('image1_integral')}
                className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF5500] font-bold rounded-lg text-xs"
              >
                ∫ π sin(√x) e^(√x) / √x dx
              </button>
              <button
                type="button"
                onClick={() => applyPreset('buet_impulse')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                BUET Impulse Formula
              </button>
              <button
                type="button"
                onClick={() => applyPreset('matrix_2x2')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                2x2 Matrix
              </button>
              <button
                type="button"
                onClick={() => applyPreset('limit_sine')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                Standard Limit
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MAIN WORKSPACE: GRAPH PAPER CANVAS (MATCHING IMAGE 1) ── */}
      <div className="p-4 sm:p-5 bg-slate-100/50">
        <div className="math-graph-paper rounded-xl border border-slate-300 shadow-inner relative p-6 sm:p-8 min-h-[170px] flex flex-col items-center justify-center transition-all">
          
          {/* Top Canvas Helper Guide */}
          <div className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-400 select-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]"></span>
            <span>Interactive Visual Math Canvas</span>
          </div>

          {mode === 'visual' ? (
            /* VISUAL GRAPH CANVAS RENDERING (WITH PLACEHOLDERS) */
            <div className="w-full flex flex-col items-center justify-center my-auto">
              <div className="scale-110 sm:scale-125 my-4 transition-transform select-none">
                <MathRenderer content={`$$${canvasLatex}$$`} />
              </div>

              {/* Interactive Visual Placeholder Slot Inputs (Below Canvas) */}
              {templateType === 'integral' && (
                <div className="mt-4 pt-3 border-t border-dashed border-slate-300/80 w-full max-w-xl flex flex-wrap items-center justify-center gap-2 text-xs">
                  {/* Lower Limit Slot */}
                  <div
                    onClick={() => setActiveSlot('lower')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                      activeSlot === 'lower'
                        ? 'bg-orange-50 border-[#FF5500] text-[#FF5500] ring-2 ring-[#FF5500]/20'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">Lower Limit:</span>
                    <input
                      type="text"
                      value={lowerLimit}
                      onChange={(e) => setLowerLimit(e.target.value)}
                      placeholder="0 or empty"
                      className="w-16 bg-transparent outline-none font-mono font-bold text-center"
                    />
                  </div>

                  {/* Upper Limit Slot */}
                  <div
                    onClick={() => setActiveSlot('upper')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                      activeSlot === 'upper'
                        ? 'bg-orange-50 border-[#FF5500] text-[#FF5500] ring-2 ring-[#FF5500]/20'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">Upper Limit:</span>
                    <input
                      type="text"
                      value={upperLimit}
                      onChange={(e) => setUpperLimit(e.target.value)}
                      placeholder="1 or empty"
                      className="w-16 bg-transparent outline-none font-mono font-bold text-center"
                    />
                  </div>

                  {/* Integrand Slot */}
                  <div
                    onClick={() => setActiveSlot('integrand')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                      activeSlot === 'integrand'
                        ? 'bg-orange-50 border-[#FF5500] text-[#FF5500] ring-2 ring-[#FF5500]/20'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">Integrand f(x):</span>
                    <input
                      type="text"
                      value={integrand}
                      onChange={(e) => setIntegrand(e.target.value)}
                      placeholder="e.g. x^2 or fraction"
                      className="w-48 bg-transparent outline-none font-mono font-bold"
                    />
                  </div>

                  {/* Differential Slot */}
                  <div
                    onClick={() => setActiveSlot('diff')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                      activeSlot === 'diff'
                        ? 'bg-orange-50 border-[#FF5500] text-[#FF5500] ring-2 ring-[#FF5500]/20'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">Var:</span>
                    <span className="font-mono font-bold text-slate-600">d</span>
                    <input
                      type="text"
                      value={differential}
                      onChange={(e) => setDifferential(e.target.value)}
                      placeholder="x"
                      className="w-8 bg-transparent outline-none font-mono font-bold text-center"
                    />
                  </div>
                </div>
              )}

              {templateType === 'fraction' && (
                <div className="mt-4 pt-3 border-t border-dashed border-slate-300/80 w-full max-w-lg flex flex-wrap items-center justify-center gap-3 text-xs">
                  <div
                    onClick={() => setActiveSlot('num')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg border cursor-pointer transition ${
                      activeSlot === 'num'
                        ? 'bg-orange-50 border-[#FF5500] text-[#FF5500] ring-2 ring-[#FF5500]/20'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">Numerator:</span>
                    <input
                      type="text"
                      value={numerator}
                      onChange={(e) => setNumerator(e.target.value)}
                      placeholder="a"
                      className="w-36 bg-transparent outline-none font-mono font-bold"
                    />
                  </div>

                  <span className="text-slate-400 font-bold">/</span>

                  <div
                    onClick={() => setActiveSlot('den')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg border cursor-pointer transition ${
                      activeSlot === 'den'
                        ? 'bg-orange-50 border-[#FF5500] text-[#FF5500] ring-2 ring-[#FF5500]/20'
                        : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">Denominator:</span>
                    <input
                      type="text"
                      value={denominator}
                      onChange={(e) => setDenominator(e.target.value)}
                      placeholder="b"
                      className="w-36 bg-transparent outline-none font-mono font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* DIRECT LATEX INPUT MODE */
            <div className="w-full max-w-xl my-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Edit LaTeX Code Directly
              </label>
              <textarea
                rows={3}
                value={currentLatex}
                onChange={(e) => setCurrentLatex(e.target.value)}
                placeholder="\int_{0}^{1} x^2 dx"
                className="w-full p-3 font-mono text-sm bg-white/95 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Changes here immediately sync back to the visual graph paper view!
              </p>
            </div>
          )}

          {/* ── THE ICONIC "TeX" BADGE (BOTTOM-RIGHT, MATCHING IMAGE 1) ── */}
          <button
            type="button"
            onClick={() => setMode(mode === 'visual' ? 'tex' : 'visual')}
            title={mode === 'visual' ? 'Switch to TeX mode' : 'Switch to Visual mode'}
            className="absolute bottom-2.5 right-3 px-2 py-1 bg-white/90 hover:bg-orange-50 border border-slate-300 hover:border-orange-300 rounded text-xs font-serif font-bold text-slate-700 hover:text-[#FF5500] shadow-2xs hover:shadow-sm transition flex items-center gap-1 cursor-pointer select-none"
          >
            <span>T<sub className="text-[10px]">E</sub>X</span>
          </button>
        </div>
      </div>

      {/* ── BOTTOM ACTION BAR: INSERT & COPY ── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="font-mono text-slate-400 text-[11px]">Formula Code:</span>
          <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-xs max-w-xs sm:max-w-md truncate">
            {currentLatex || '\\dots'}
          </code>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy LaTeX'}</span>
          </button>

          <button
            type="button"
            onClick={handleInsert}
            className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF5500] to-[#FF6B00] hover:from-[#E64D00] hover:to-[#FF5500] rounded-xl shadow-2xs hover:shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {inserted ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{inserted ? 'Inserted!' : 'Insert Equation into Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
