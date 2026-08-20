import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Play, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface WeakTopic {
  id: string;
  subject: string;
  topic: string;
  accuracy: number;
  practiceHref: string;
  learnHref: string;
}

export interface WeakTopicsProps {
  topics?: WeakTopic[];
}

export function WeakTopics({
  topics = [
    {
      id: 'w1',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms & Isomerism',
      accuracy: 43,
      practiceHref: '/practice',
      learnHref: '/prepare',
    },
    {
      id: 'w2',
      subject: 'Physics',
      topic: 'Rotational Dynamics & Moment of Inertia',
      accuracy: 48,
      practiceHref: '/practice',
      learnHref: '/prepare',
    },
    {
      id: 'w3',
      subject: 'Higher Math',
      topic: 'Permutation & Combinations Probability',
      accuracy: 61,
      practiceHref: '/practice',
      learnHref: '/prepare',
    },
  ],
}: WeakTopicsProps) {
  return (
    <div className="eg-card space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--eg-border)] pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[var(--eg-error)]" />
          <h3 className="text-body-lg font-bold text-[var(--eg-text-primary)]">Weak Topics to Master</h3>
        </div>
        <Link
          href="/mistakes"
          className="text-xs font-semibold text-[var(--eg-error)] hover:underline flex items-center gap-1"
        >
          Mistake Notebook <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {topics.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg border border-[var(--eg-border)] bg-[var(--eg-surface)] space-y-2 hover:border-[var(--eg-border-strong)] transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-overline text-[var(--eg-text-muted)]">{item.subject}</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.accuracy < 50
                    ? 'bg-[var(--eg-error-soft)] text-[var(--eg-error)]'
                    : 'bg-[var(--eg-warning-soft)] text-[var(--eg-warning)]'
                }`}
              >
                {item.accuracy}% accuracy
              </span>
            </div>

            <div className="text-sm font-semibold text-[var(--eg-text-primary)]">
              {item.topic}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link href={item.learnHref}>
                <button className="btn btn-secondary btn-sm text-xs">
                  <BookOpen className="w-3.5 h-3.5" /> Learn
                </button>
              </Link>
              <Link href={item.practiceHref}>
                <button className="btn btn-primary btn-sm text-xs">
                  <Play className="w-3.5 h-3.5 fill-white" /> Practice Drill
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
