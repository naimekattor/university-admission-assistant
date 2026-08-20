import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-dashed border-[var(--eg-border)] bg-[var(--eg-surface-subtle)] space-y-4',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--eg-surface)] border border-[var(--eg-border)] flex items-center justify-center text-[var(--eg-text-muted)] shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-[var(--eg-text-primary)]">{title}</h3>
        <p className="text-xs text-[var(--eg-text-muted)] leading-relaxed">{description}</p>
      </div>
      {actionLabel && (
        actionHref ? (
          <a
            href={actionHref}
            className="btn btn-primary btn-sm mt-2 text-xs font-semibold"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            onClick={onAction}
            className="btn btn-primary btn-sm mt-2 text-xs font-semibold"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
