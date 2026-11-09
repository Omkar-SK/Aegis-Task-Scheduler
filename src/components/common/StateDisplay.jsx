import React from 'react';
import {
  Loader2,
  AlertTriangle,
  WifiOff,
  Inbox,
  RefreshCw,
  Radio,
  Server,
} from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/classNames';

/**
 * 1. Loading State
 */
export function LoadingState({ message = 'Loading kernel telemetry...', className = '' }) {
  return (
    <div
      className={cn(
        'py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 font-terminal',
        className
      )}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-aegis-teal/20 border-t-aegis-teal animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-aegis-teal animate-pulse" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-white tracking-wide">{message}</p>
        <p className="text-[10px] text-aegis-muted">Synchronizing with scheduler registers</p>
      </div>
    </div>
  );
}

/**
 * 2. Error State
 */
export function ErrorState({
  title = 'Service Error Encountered',
  message = 'Failed to execute command or communicate with backend service.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-status-rose/5 border border-status-rose/30 flex flex-col items-center justify-center text-center space-y-3 font-terminal max-w-md mx-auto',
        className
      )}
    >
      <div className="p-3 rounded-xl bg-status-rose/10 text-status-rose border border-status-rose/30">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-aegis-muted leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry Request
        </Button>
      )}
    </div>
  );
}

/**
 * 3. Disconnected State (C++ daemon offline)
 */
export function DisconnectedState({
  title = 'C++ Daemon Disconnected',
  message = 'Unable to reach C++ Aegis engine at http://localhost:8080. Operating in local simulated kernel mode.',
  onReconnect,
  onUseMock,
  className = '',
}) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-status-amber/5 border border-status-amber/30 flex flex-col items-center justify-center text-center space-y-3.5 font-terminal max-w-md mx-auto',
        className
      )}
    >
      <div className="p-3 rounded-xl bg-status-amber/10 text-status-amber border border-status-amber/30">
        <WifiOff className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-amber/15 text-status-amber border border-status-amber/40 font-bold">
            OFFLINE
          </span>
        </div>
        <p className="text-xs text-aegis-muted leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {onReconnect && (
          <Button variant="secondary" size="xs" icon={RefreshCw} onClick={onReconnect}>
            Retry Ping
          </Button>
        )}
        {onUseMock && (
          <Button variant="outline" size="xs" icon={Radio} onClick={onUseMock}>
            Use Mock Adapter
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 4. Empty State
 */
export function EmptyState({
  title = 'No Records Found',
  description = 'No tasks or telemetry samples match the current query.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={cn(
        'py-12 px-4 rounded-xl border border-dashed border-aegis-border flex flex-col items-center justify-center text-center space-y-3 font-terminal',
        className
      )}
    >
      <div className="p-3 rounded-xl bg-aegis-sidebar text-aegis-muted border border-aegis-border">
        <Icon className="w-5 h-5" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h4 className="text-xs font-bold text-white tracking-wide">{title}</h4>
        <p className="text-[11px] text-aegis-muted leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default {
  LoadingState,
  ErrorState,
  DisconnectedState,
  EmptyState,
};

