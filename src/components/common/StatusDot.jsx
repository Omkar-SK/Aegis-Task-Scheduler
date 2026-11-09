import React from 'react';
import { cn } from '../../utils/classNames';

export function StatusDot({ state = 'running', size = 'md', pulse = true, className }) {
  const stateStyles = {
    running: 'bg-kernel-cyan border-cyan-400 text-cyan-400',
    ready: 'bg-kernel-sky border-sky-400 text-sky-400',
    waiting: 'bg-kernel-amber border-amber-400 text-amber-400',
    completed: 'bg-kernel-emerald border-emerald-400 text-emerald-400',
    preempted: 'bg-kernel-rose border-rose-400 text-rose-400',
    idle: 'bg-slate-500 border-slate-400 text-slate-400',
  };

  const sizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const currentStyle = stateStyles[state] || stateStyles.idle;

  return (
    <span className={cn('relative inline-flex items-center justify-center', className)}>
      {pulse && (state === 'running' || state === 'waiting') && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
            currentStyle.split(' ')[0]
          )}
        />
      )}
      <span
        className={cn(
          'relative inline-flex rounded-full border',
          sizeStyles[size] || sizeStyles.md,
          currentStyle
        )}
      />
    </span>
  );
}

export default StatusDot;

