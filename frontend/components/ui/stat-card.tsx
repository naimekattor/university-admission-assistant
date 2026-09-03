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
  const iconStyle = {
    default: 'text-slate-600 bg-slate-50 border-slate-200/80',
    primary: 'text-[#FF5500] bg-orange-50 border-orange-200/60',
    accent: 'text-amber-600 bg-amber-50 border-amber-200/60',
    success: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
    warning: 'text-amber-600 bg-amber-50 border-amber-200/60',
    error: 'text-rose-600 bg-rose-50 border-rose-200/60',
  }[variant];

  return (
    <div
      className={cn(
        'p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-2xl border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0',
              iconStyle
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
          {value}
        </div>
        {subValue && (
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            {trend && (
              <span
                className={cn(
                  'font-bold',
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
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
