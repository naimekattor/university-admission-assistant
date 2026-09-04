'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface QuestionSearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function QuestionSearch({
  value,
  onChange,
  placeholder = 'Search admission questions, formulas, topics (e.g. BUET deadline, calculus integral)...',
}: QuestionSearchProps) {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localVal !== value) {
        onChange(localVal);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localVal, value, onChange]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/20 focus:border-[#FF5500] shadow-2xs transition"
      />
      {localVal && (
        <button
          type="button"
          onClick={() => {
            setLocalVal('');
            onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
