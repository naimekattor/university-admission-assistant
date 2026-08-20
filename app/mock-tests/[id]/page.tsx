'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle2, Bookmark, Send, AlertTriangle } from 'lucide-react';

export default function MockTestRunnerPage() {
  const router = useRouter();
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  const questions = [
    {
      id: 'q1',
      subject: 'Physics',
      text: 'একটি 5 kg ভরের বস্তুর ওপর F(t) = (3t^2 + 2) N বল কাজ করছে। t = 0 হতে t = 2s সময়ে বস্তুর ভরবেগের পরিবর্তন (Impulse) কত Ns?',
      options: ['8 Ns', '12 Ns', '16 Ns', '20 Ns'],
    },
    {
      id: 'q2',
      subject: 'Chemistry',
      text: 'sp^3d সংকরণ (hybridization)-এর ক্ষেত্রে অণুর জ্যামিতিক আকৃতি কোনটি?',
      options: ['ত্রিকোণীয় দ্বিপিরামিডীয়', 'অষ্টতলকীয়', 'চতুস্তলকীয়', 'সমতলীয় বর্গাকার'],
    },
    {
      id: 'q3',
      subject: 'Higher Mathematics',
      text: 'lim (x->0) (sin 5x / x) এর মান কত?',
      options: ['1', '5', '1/5', '0'],
    },
  ];

  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeftSeconds((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const toggleBookmark = () => {
    setMarkedForReview((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleSubmit = () => {
    router.push('/mock-tests/buet-prelim-01/result');
  };

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header with Timer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-amber-400 uppercase">BUET Preliminary Model Test 01</div>
          <div className="text-sm font-semibold text-white">Question {currentIdx + 1} of {questions.length}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 border border-amber-500/40 rounded-lg text-amber-400 font-mono font-bold text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Question View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-400">{q.subject}</span>
            <button
              onClick={toggleBookmark}
              className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition ${markedForReview[currentIdx] ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'}`}
            >
              <Bookmark className="w-3.5 h-3.5" /> {markedForReview[currentIdx] ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          <div className="text-lg font-medium text-slate-100">{q.text}</div>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-lg border text-left text-sm font-medium transition flex items-center justify-between ${isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'}`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => p - 1)}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200"
            >
              Previous
            </button>
            <button
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-40 rounded-lg text-slate-950 font-bold"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl h-fit">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
            Question Palette
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isBookmarked = markedForReview[idx];
              const isCurrent = idx === currentIdx;

              let style = 'bg-slate-950 text-slate-400 border-slate-800';
              if (isAnswered) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              if (isBookmarked) style = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
              if (isCurrent) style += ' ring-2 ring-amber-400';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-lg border text-xs font-mono transition flex items-center justify-center ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500 inline-block" /> Answered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500 inline-block" /> Marked for Review</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 inline-block" /> Unvisited</div>
          </div>
        </div>
      </div>
    </div>
  );
}
