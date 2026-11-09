import React from 'react';
import { cn } from '../../utils/classNames';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-aegis-bg disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-aegis-teal hover:bg-aegis-teal-dark text-aegis-bg font-semibold shadow-glow-teal focus:ring-aegis-teal border border-aegis-teal/50',
    secondary:
      'bg-aegis-sidebar hover:bg-aegis-card-hover text-white border border-aegis-border hover:border-aegis-border-light focus:ring-aegis-teal',
    indigo:
      'bg-aegis-indigo hover:bg-aegis-indigo-dark text-white font-semibold shadow-glow-indigo focus:ring-aegis-indigo border border-aegis-indigo/50',
    outline:
      'bg-transparent hover:bg-aegis-card text-aegis-text-dim hover:text-white border border-aegis-border focus:ring-aegis-border',
    danger:
      'bg-status-rose/10 hover:bg-status-rose/20 text-status-rose border border-status-rose/30 hover:border-status-rose/50 focus:ring-status-rose',
    ghost:
      'bg-transparent hover:bg-aegis-card text-aegis-muted hover:text-white border border-transparent',
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-4.5 py-2.5 text-sm gap-2.5 font-semibold',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}

export default Button;
