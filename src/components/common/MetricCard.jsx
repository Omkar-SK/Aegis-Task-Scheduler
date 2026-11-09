import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/classNames';

export function MetricCard({
  title,
  value,
  unit,
  change,
  isPositive,
  trend,
  trendLabel = 'vs last interval',
  icon: Icon,
  accentColor = 'teal', // 'teal' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky'
  description,
  subtitle,
  loading = false,
  className,
}) {
  const accentStyles = {
    teal: {
      border: 'border-l-aegis-teal',
      icon: 'text-aegis-teal bg-aegis-teal/10 border-aegis-teal/20',
      bar: 'bg-aegis-teal',
      glow: 'group-hover:border-aegis-teal/40',
    },
    indigo: {
      border: 'border-l-aegis-indigo',
      icon: 'text-aegis-indigo bg-aegis-indigo/10 border-aegis-indigo/20',
      bar: 'bg-aegis-indigo',
      glow: 'group-hover:border-aegis-indigo/40',
    },
    emerald: {
      border: 'border-l-status-emerald',
      icon: 'text-status-emerald bg-status-emerald/10 border-status-emerald/20',
      bar: 'bg-status-emerald',
      glow: 'group-hover:border-status-emerald/40',
    },
    amber: {
      border: 'border-l-status-amber',
      icon: 'text-status-amber bg-status-amber/10 border-status-amber/20',
      bar: 'bg-status-amber',
      glow: 'group-hover:border-status-amber/40',
    },
    rose: {
      border: 'border-l-status-rose',
      icon: 'text-status-rose bg-status-rose/10 border-status-rose/20',
      bar: 'bg-status-rose',
      glow: 'group-hover:border-status-rose/40',
    },
    sky: {
      border: 'border-l-status-sky',
      icon: 'text-status-sky bg-status-sky/10 border-status-sky/20',
      bar: 'bg-status-sky',
      glow: 'group-hover:border-status-sky/40',
    },
  };

  const currentAccent = accentStyles[accentColor] || accentStyles.teal;
  const descText = description || subtitle;
  const trendValue = trend !== undefined ? trend : change;

  if (loading) {
    return (
      <div
        className={cn(
          'p-5 rounded-xl border border-aegis-border bg-aegis-card animate-pulse border-l-4',
          currentAccent.border,
          className
        )}
      >
        <div className="flex justify-between items-center">
          <div className="h-3 w-20 bg-aegis-border rounded" />
          <div className="h-7 w-7 bg-aegis-border rounded-lg" />
        </div>
        <div className="h-7 w-28 bg-aegis-border rounded mt-4" />
        <div className="h-3 w-36 bg-aegis-border rounded mt-3" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative p-5 rounded-xl border border-aegis-border bg-aegis-card hover:bg-aegis-card-hover transition-all duration-200 border-l-4 shadow-card-subtle flex flex-col justify-between',
        currentAccent.border,
        currentAccent.glow,
        className
      )}
    >
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-aegis-muted uppercase tracking-wider font-terminal">
            {title}
          </span>
          {Icon && (
            <div className={cn('p-2 rounded-lg border shrink-0', currentAccent.icon)}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Metric Value */}
        <div className="mt-3 flex items-baseline gap-1.5 font-terminal">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          {unit && <span className="text-xs font-medium text-aegis-muted">{unit}</span>}
        </div>

        {/* Short Description */}
        {descText && (
          <p className="text-xs text-aegis-muted mt-1 leading-snug line-clamp-1">
            {descText}
          </p>
        )}
      </div>

      {/* Trend or Footer indicator */}
      <div className="mt-4 pt-2.5 border-t border-aegis-border/60 flex items-center justify-between text-xs">
        {trendValue !== undefined && trendValue !== null ? (
          <div className="flex items-center gap-1.5 font-terminal">
            {isPositive ? (
              <span className="inline-flex items-center text-status-emerald font-semibold gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {trendValue}
              </span>
            ) : (
              <span className="inline-flex items-center text-status-rose font-semibold gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {trendValue}
              </span>
            )}
            <span className="text-aegis-subtle text-[11px] truncate">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-[11px] text-aegis-subtle font-terminal">Telemetric Sample</span>
        )}

        {/* Subtle accent bar */}
        <div className="w-12 h-1 bg-aegis-sidebar rounded-full overflow-hidden">
          <div className={cn('h-full w-2/3 rounded-full opacity-70', currentAccent.bar)} />
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
