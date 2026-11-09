import React from 'react';
import { cn } from '../../utils/classNames';

export function Badge({ children, variant = 'default', size = 'sm', className }) {
  const variantStyles = {
    default: 'bg-aegis-800 text-aegis-300 border-aegis-700',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px] font-medium leading-none',
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-terminal tracking-tight uppercase',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.sm,
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;

