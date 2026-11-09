import React from 'react';
import { cn } from '../../utils/classNames';

export function MonitoringCard({
  title,
  subtitle,
  icon: Icon,
  sectionNumber,
  badge,
  actions,
  children,
  className = '',
  contentClassName = '',
  isLive = false,
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-aegis-border bg-aegis-card transition-all duration-200 overflow-hidden shadow-card-subtle',
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-aegis-border/80 bg-aegis-sidebar/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {sectionNumber && (
            <span className="w-6 h-6 rounded-md bg-aegis-card border border-aegis-border flex items-center justify-center text-[10px] font-terminal font-bold text-aegis-teal shrink-0">
              {sectionNumber}
            </span>
          )}

          {Icon && (
            <div className="p-2 rounded-xl bg-aegis-card border border-aegis-border text-aegis-teal shadow-inner shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-tight truncate font-terminal">
                {title}
              </h3>
              {isLive && (
                <span className="flex items-center gap-1 text-[10px] font-terminal text-aegis-teal">
                  <span className="w-1.5 h-1.5 rounded-full bg-aegis-teal animate-pulse" />
                  <span>LIVE</span>
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-aegis-muted truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Badge or Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {actions}
        </div>
      </div>

      {/* Content */}
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </div>
  );
}

export default MonitoringCard;

