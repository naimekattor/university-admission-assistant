'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { VisualLessonRenderer } from '@/components/learning/visual-lesson-renderer';

export default function LessonViewerPage() {
  const lesson = {
    title: "Mastering Newton's Second Law & Impulse Problems for BUET",
    subject: 'Physics',
    chapter: "Newton's Mechanics",
    estimatedMinutes: 25,
    objectives: [
      'Understand the impulse-momentum theorem ($J = \\int F dt = \\Delta p$).',
      'Solve time-varying force integration problems ($F(t) = a + bt^2$).',
      'Apply variable mass principles to rocket propulsion and water jet MCQs.',
    ],
    content: `
### 1. Vector Formulation of Newton's Second Law
Newton's Second Law states that the net force applied on a particle equals the time rate of change of its linear momentum:

$$\\vec{F} = \\frac{d\\vec{p}}{dt} = \\frac{d(m\\vec{v})}{dt}$$

If mass $m$ is constant, this simplifies to the familiar $\\vec{F} = m\\vec{a}$.

---

### 2. Impulse-Momentum Theorem
The impulse $J$ of a force acting over a time interval from $t_1$ to $t_2$ equals the change in momentum:

$$J = \\int_{t_1}^{t_2} \\vec{F}(t) dt = \\vec{p}_2 - \\vec{p}_1 = m(\\vec{v} - \\vec{u})$$

---

### 3. High-Yield Admission Example (BUET Preliminary Standard)
**Problem**: A variable force $F(t) = 3t^2 + 2t \\text{ (N)}$ acts on a $2\\text{ kg}$ object initially at rest ($u = 0$) from $t = 0$ to $t = 3\\text{ s}$. What is its final velocity?

**Solution**:
1. Calculate Impulse $J$:
   $$J = \\int_0^3 (3t^2 + 2t) dt = \\left[ t^3 + t^2 \\right]_0^3 = (27 + 9) - 0 = 36\\text{ N}\\cdot\\text{s}$$
2. Relate Impulse to final velocity:
   $$J = m(v - u) \\implies 36 = 2(v - 0) \\implies v = 18\\text{ m/s}$$
`,
    visualType: 'interactive',
    visualConfig: { type: 'physics_vectors', initialVelocity: 15 },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href="/prepare" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-xs text-amber-400 font-semibold uppercase">{lesson.subject} • {lesson.chapter}</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black text-white leading-tight">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Estimated Duration: <strong className="text-amber-400">{lesson.estimatedMinutes} mins</strong></span>
          <span>•</span>
          <span>Format: <strong className="text-emerald-400">Structured Notes & Visual Visualizer</strong></span>
        </div>
      </div>

      {/* Learning Objectives Box */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Learning Objectives
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Visual Explanation Component */}
      <VisualLessonRenderer visualType={lesson.visualType} visualConfig={lesson.visualConfig} />

      {/* Structured Lesson Content */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-900/60 p-6 rounded-xl border border-slate-800/80">
        {lesson.content}
      </div>

      {/* Practice Next Action Button */}
      <div className="p-6 bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Understood the Concept?</div>
          <div className="text-xs text-slate-400">Test your understanding with 10 high-yield admission MCQs.</div>
        </div>
        <Link href="/practice">
          <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition shrink-0">
            Practice Chapter MCQs <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
