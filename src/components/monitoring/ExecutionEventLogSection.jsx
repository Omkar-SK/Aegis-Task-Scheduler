import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Pause,
  Trash2,
  Filter,
  Radio,
  Wifi,
  WifiOff,
  ArrowDownCircle,
} from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import StatusBadge from './StatusBadge';
import Button from '../common/Button';
import { cn } from '../../utils/classNames';

const EVENT_FILTER_OPTIONS = [
  { id: 'ALL', label: 'All Events' },
  { id: 'TASK_STARTED', label: 'Task Started' },
  { id: 'TASK_COMPLETED', label: 'Completed' },
  { id: 'TASK_PREEMPTED', label: 'Preempted' },
  { id: 'CONTEXT_SWITCH', label: 'Context Switch' },
  { id: 'PRIORITY_UPDATED', label: 'Priority Updated' },
  { id: 'DEADLINE_MISSED', label: 'Deadline Missed' },
];

export function ExecutionEventLogSection({
  events = [],
  isStreaming = true,
  streamMode = 'MOCK',
  wsConnected = false,
  onToggleStreaming,
  onClearEvents,
  onConnectWebSocket,
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);

  const filteredEvents = events.filter((evt) => {
    if (selectedFilter === 'ALL') return true;
    return evt.type === selectedFilter;
  });

  return (
    <MonitoringCard
      sectionNumber="06"
      title="Execution Event Log & Telemetry Stream"
      subtitle="Chronological audit stream of scheduler dispatches, context switches, preemptions, and deadline alerts"
      icon={Terminal}
      isLive
      badge={
        <div className="flex items-center gap-2">
          {streamMode === 'WEBSOCKET' ? (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-terminal font-semibold border',
                wsConnected
                  ? 'bg-status-emerald/10 text-status-emerald border-status-emerald/30'
                  : 'bg-status-rose/10 text-status-rose border-status-rose/30'
              )}
            >
              {wsConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{wsConnected ? 'WebSocket Connected' : 'WebSocket Offline'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-terminal font-semibold bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Mock Event Stream</span>
            </span>
          )}
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Pause / Resume Button */}
          <button
            onClick={onToggleStreaming}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-terminal font-semibold border transition-all',
              isStreaming
                ? 'bg-aegis-card hover:bg-aegis-sidebar text-white border-aegis-border'
                : 'bg-aegis-teal/20 text-aegis-teal border-aegis-teal/40'
            )}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          {/* Clear Log Button */}
          <button
            onClick={onClearEvents}
            className="p-1.5 rounded-lg text-aegis-muted hover:text-status-rose hover:bg-aegis-sidebar border border-aegis-border transition-colors"
            title="Clear Event Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-4 font-terminal text-xs">
        {/* WebSocket Backend Integration Readiness Banner */}
        <div className="p-3.5 rounded-xl bg-aegis-sidebar border border-aegis-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-aegis-indigo" />
              <span>C++ Backend WebSocket Streaming Pipeline</span>
            </span>
            <p className="text-aegis-muted text-[11px]">
              Ready for real-time IPC via <code className="text-aegis-indigo">ws://localhost:8080/ws/scheduler</code>.
              Currently utilizing deterministic synthetic kernel events.
            </p>
          </div>

          <button
            onClick={onConnectWebSocket}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-aegis-card hover:bg-aegis-border/60 text-aegis-indigo border border-aegis-indigo/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Connect WebSocket</span>
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          <span className="text-[10px] text-aegis-muted mr-1 uppercase">Filter:</span>
          {EVENT_FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] border transition-colors',
                selectedFilter === filter.id
                  ? 'bg-aegis-teal text-aegis-bg font-bold border-aegis-teal'
                  : 'bg-aegis-sidebar text-aegis-muted border-aegis-border hover:text-white'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Streaming Event Feed Box */}
        <div className="max-h-96 overflow-y-auto space-y-2 rounded-xl p-3 bg-aegis-sidebar/80 border border-aegis-border/80 custom-scrollbar">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-aegis-muted">
              No events match the selected category &quot;{selectedFilter}&quot;.
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-lg bg-aegis-card border border-aegis-border hover:border-aegis-border-light transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                {/* Left: Timestamp, Type Badge, Task, Thread */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-aegis-muted text-[11px] font-mono shrink-0">
                    [{evt.timestamp}]
                  </span>

                  <StatusBadge status={evt.type} type="event" size="xs" />

                  {evt.taskId && (
                    <span className="text-white font-bold px-1.5 py-0.5 rounded bg-aegis-sidebar border border-aegis-border text-[10px]">
                      {evt.taskId}
                    </span>
                  )}

                  {evt.threadId && (
                    <span className="text-aegis-indigo font-semibold text-[10px]">
                      {evt.threadId}
                    </span>
                  )}
                </div>

                {/* Right / Body: Message Narrative */}
                <div className="text-xs text-aegis-text-dim flex-1 sm:text-right truncate max-w-xl">
                  {evt.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MonitoringCard>
  );
}

export default ExecutionEventLogSection;

