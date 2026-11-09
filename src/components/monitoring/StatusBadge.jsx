import React from 'react';
import {
  Play,
  CheckCircle,
  Pause,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { cn } from '../../utils/classNames';

/**
 * Reusable status badge for thread states, task states, and scheduler execution events
 */
export function StatusBadge({ status, type = 'thread', size = 'sm', className = '' }) {
  const norm = String(status || '').toUpperCase();

  // Size styles
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  }[size] || 'px-2 py-0.5 text-[11px]';

  // 1. Thread Statuses
  if (type === 'thread') {
    switch (norm) {
      case 'RUNNING':
      case 'ACTIVE':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-aegis-teal/10 text-aegis-teal border-aegis-teal/30',
              sizeClasses,
              className
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-aegis-teal animate-pulse" />
            <span>RUNNING</span>
          </span>
        );
      case 'DISPATCHING':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-aegis-indigo/10 text-aegis-indigo border-aegis-indigo/30',
              sizeClasses,
              className
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-aegis-indigo animate-ping" />
            <span>DISPATCHING</span>
          </span>
        );
      case 'STEALING':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-status-amber/10 text-status-amber border-status-amber/30',
              sizeClasses,
              className
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-status-amber animate-pulse" />
            <span>STEALING</span>
          </span>
        );
      case 'BLOCKED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-status-rose/10 text-status-rose border-status-rose/30',
              sizeClasses,
              className
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-status-rose" />
            <span>BLOCKED</span>
          </span>
        );
      case 'IDLE':
      default:
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-aegis-sidebar text-aegis-subtle border-aegis-border',
              sizeClasses,
              className
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-aegis-subtle" />
            <span>IDLE</span>
          </span>
        );
    }
  }

  // 2. Task States
  if (type === 'task') {
    switch (norm) {
      case 'RUNNING':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-aegis-teal/15 text-aegis-teal border-aegis-teal/40',
              sizeClasses,
              className
            )}
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>RUNNING</span>
          </span>
        );
      case 'READY':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-aegis-indigo/15 text-aegis-indigo border-aegis-indigo/40',
              sizeClasses,
              className
            )}
          >
            <Clock className="w-2.5 h-2.5" />
            <span>READY</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-status-emerald/15 text-status-emerald border-status-emerald/40',
              sizeClasses,
              className
            )}
          >
            <CheckCircle className="w-2.5 h-2.5" />
            <span>COMPLETED</span>
          </span>
        );
      case 'PREEMPTED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-status-amber/15 text-status-amber border-status-amber/40',
              sizeClasses,
              className
            )}
          >
            <ArrowRightLeft className="w-2.5 h-2.5" />
            <span>PREEMPTED</span>
          </span>
        );
      case 'DEADLINE_MISSED':
      case 'MISSED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-terminal font-semibold border bg-status-rose/15 text-status-rose border-status-rose/40',
              sizeClasses,
              className
            )}
          >
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>MISSED DEADLINE</span>
          </span>
        );
      default:
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md font-terminal font-semibold border bg-aegis-sidebar text-aegis-muted border-aegis-border',
              sizeClasses,
              className
            )}
          >
            <span>{status}</span>
          </span>
        );
    }
  }

  // 3. Execution Event Types
  if (type === 'event') {
    switch (norm) {
      case 'TASK_STARTED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-bold border bg-aegis-teal/10 text-aegis-teal border-aegis-teal/30',
              sizeClasses,
              className
            )}
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>TASK_STARTED</span>
          </span>
        );
      case 'TASK_COMPLETED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-bold border bg-status-emerald/10 text-status-emerald border-status-emerald/30',
              sizeClasses,
              className
            )}
          >
            <CheckCircle className="w-2.5 h-2.5" />
            <span>TASK_COMPLETED</span>
          </span>
        );
      case 'TASK_PREEMPTED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-bold border bg-status-amber/10 text-status-amber border-status-amber/30',
              sizeClasses,
              className
            )}
          >
            <ArrowRightLeft className="w-2.5 h-2.5" />
            <span>TASK_PREEMPTED</span>
          </span>
        );
      case 'CONTEXT_SWITCH':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-bold border bg-aegis-indigo/10 text-aegis-indigo border-aegis-indigo/30',
              sizeClasses,
              className
            )}
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>CONTEXT_SWITCH</span>
          </span>
        );
      case 'PRIORITY_UPDATED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-bold border bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
              sizeClasses,
              className
            )}
          >
            <Zap className="w-2.5 h-2.5" />
            <span>PRIORITY_UPDATED</span>
          </span>
        );
      case 'DEADLINE_MISSED':
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-bold border bg-status-rose/10 text-status-rose border-status-rose/30',
              sizeClasses,
              className
            )}
          >
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>DEADLINE_MISSED</span>
          </span>
        );
      default:
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded font-terminal font-semibold border bg-aegis-sidebar text-aegis-muted border-aegis-border',
              sizeClasses,
              className
            )}
          >
            <span>{status}</span>
          </span>
        );
    }
  }

  // 4. Thread Model (Simulated vs Native POSIX)
  if (type === 'threadModel') {
    if (norm === 'POSIX' || norm === 'NATIVE') {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg font-terminal text-[11px] font-bold border bg-aegis-indigo/15 text-aegis-indigo border-aegis-indigo/40 px-2.5 py-1',
            className
          )}
          title="Native Linux POSIX pthread thread (pthread_create / sched_setaffinity)"
        >
          <span className="w-2 h-2 rounded-full bg-aegis-indigo animate-pulse" />
          <span>NATIVE POSIX PTHREAD (C++20)</span>
        </span>
      );
    }
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg font-terminal text-[11px] font-bold border bg-aegis-teal/10 text-aegis-teal border-aegis-teal/30 px-2.5 py-1',
          className
        )}
        title="In-browser deterministic simulated thread engine (temporary before C++ daemon connection)"
      >
        <span className="w-2 h-2 rounded-full bg-aegis-teal" />
        <span>SIMULATED THREAD MODEL (MOCK KERNEL)</span>
      </span>
    );
  }

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs bg-aegis-sidebar text-white border border-aegis-border', className)}>
      {status}
    </span>
  );
}

export default StatusBadge;

