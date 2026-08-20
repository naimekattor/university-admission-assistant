import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-[var(--eg-primary-soft)] text-[var(--eg-primary)] border border-[var(--eg-primary)]/20',
        secondary: 'bg-[var(--eg-surface-subtle)] text-[var(--eg-text-secondary)] border border-[var(--eg-border)]',
        success: 'bg-[var(--eg-success-soft)] text-[var(--eg-success)] border border-[var(--eg-success)]/20',
        warning: 'bg-[var(--eg-warning-soft)] text-[var(--eg-warning)] border border-[var(--eg-warning)]/20',
        error: 'bg-[var(--eg-error-soft)] text-[var(--eg-error)] border border-[var(--eg-error)]/20',
        accent: 'bg-[var(--eg-accent-soft)] text-[var(--eg-accent)] border border-[var(--eg-accent)]/20',
        outline: 'text-[var(--eg-text-primary)] border border-[var(--eg-border-strong)]',
      },
      size: {
        sm: 'px-2 py-0.2 text-[11px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
