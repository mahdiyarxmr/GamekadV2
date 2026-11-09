import React from 'react';
import { toPersianDigits } from '../../utils/formatters';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  subtitle,
  trend,
  className = '',
}) => {
  return (
    <div
      className={`p-5 bg-ui-surface rounded-2xl border-1.5 border-ui-border-default shadow-hard-md flex flex-col justify-between transition-all hover:border-[var(--theme-primary)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-body-sm font-semibold text-ui-text-secondary">{label}</span>
          <span className="text-display font-black text-ui-text-primary tracking-tight">
            {typeof value === 'number' ? toPersianDigits(value) : value}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[var(--theme-primary-surface)] text-[var(--theme-primary)] border-1.5 border-[var(--theme-primary)] flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t-1.5 border-ui-border-subtle flex items-center justify-between text-caption text-ui-text-muted">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className="font-bold text-semantic-success bg-semantic-success-surface dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-300">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
