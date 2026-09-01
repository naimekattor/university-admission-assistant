import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const iconColor = {
    default: 'text-[var(--eg-text-muted)] bg-[var(--eg-surface-subtle)]',
    primary: 'text-[var(--eg-primary)] bg-[var(--eg-primary-soft)]',
    accent: 'text-[var(--eg-accent)] bg-[var(--eg-accent-soft)]',
    success: 'text-[var(--eg-success)] bg-[var(--eg-success-soft)]',
    warning: 'text-[var(--eg-warning)] bg-[var(--eg-warning-soft)]',
    error: 'text-[var(--eg-error)] bg-[var(--eg-error-soft)]',
  }[variant];

  return (
    <div
      className={cn(
        'eg-card flex flex-col justify-between space-y-3 transition hover:border-[var(--eg-border-strong)]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-overline text-[var(--eg-text-muted)]">{label}</span>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl lg:text-3xl font-bold text-[var(--eg-text-primary)] tracking-tight">
          {value}
        </div>
        {subValue && (
          <div className="text-caption text-[var(--eg-text-muted)] flex items-center gap-1.5">
            {trend && (
              <span
                className={cn(
                  'font-semibold',
                  trend.isPositive ? 'text-[var(--eg-success)]' : 'text-[var(--eg-error)]'
                )}
              >
                {trend.value}
              </span>
            )}
            <span>{subValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
