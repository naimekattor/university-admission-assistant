import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorColor, size = 'md', showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100);

    const heightClass = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }[size];

    return (
      <div className="w-full space-y-1">
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn('relative w-full overflow-hidden rounded-full bg-[var(--eg-border)]', heightClass, className)}
          {...props}
        >
          <div
            className={cn('h-full w-full flex-1 transition-all duration-500 ease-out rounded-full', indicatorColor || 'bg-[var(--eg-primary)]')}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
        {showLabel && (
          <div className="flex justify-between text-xs text-[var(--eg-text-muted)] font-medium">
            <span>{value} / {max}</span>
            <span className="font-semibold text-[var(--eg-text-primary)]">{percentage}%</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';
