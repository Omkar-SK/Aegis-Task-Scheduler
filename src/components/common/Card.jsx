import React from 'react';
import { cn } from '../../utils/classNames';

export function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  className,
  bodyClassName,
  headerClassName,
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-aegis-border bg-aegis-card shadow-card-subtle transition-all duration-150',
        className
      )}
    >
      {(title || subtitle || Icon || actions || badge) && (
        <div
          className={cn(
            'px-5 py-4 border-b border-aegis-border/80 flex items-center justify-between gap-3',
            headerClassName
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="p-2 rounded-lg bg-aegis-sidebar border border-aegis-border text-aegis-teal shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {title && (
                  <h3 className="text-sm font-semibold text-white tracking-tight truncate">
                    {title}
                  </h3>
                )}
                {badge}
              </div>
              {subtitle && (
                <p className="text-xs text-aegis-muted truncate mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

export default Card;
