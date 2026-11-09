import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/classNames';

export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  badge,
  className,
}) {
  return (
    <div
      className={cn(
        'pb-6 border-b border-aegis-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4',
        className
      )}
    >
      <div>
        {/* Breadcrumb line */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-aegis-muted font-terminal mb-2">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="hover:text-aegis-teal transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-white font-medium' : ''}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 text-aegis-subtle shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Title and Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {badge}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs md:text-sm text-aegis-muted mt-1 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Controls */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;

