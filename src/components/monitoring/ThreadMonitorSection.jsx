import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Info,
  CheckCircle,
  AlertCircle,
  RotateCw,
  Terminal,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import StatusBadge from './StatusBadge';
import { cn } from '../../utils/classNames';

const DEFAULT_WORKER_THREADS = [
  { id: 'TH-00', pthreadId: '0x7F9A8801', coreId: 0, coreType: 'P-Core', status: 'RUNNING', activeTaskId: 'T-1042', taskName: 'matrix_multiply_avx2', ctxSwitches: 4120, dequeDepth: 3 },
  { id: 'TH-01', pthreadId: '0x7F9A8802', coreId: 1, coreType: 'P-Core', status: 'RUNNING', activeTaskId: 'T-1049', taskName: 'crypto_sha256_batch', ctxSwitches: 5240, dequeDepth: 2 },
  { id: 'TH-02', pthreadId: '0x7F9A8803', coreId: 2, coreType: 'P-Core', status: 'RUNNING', activeTaskId: 'T-1053', taskName: 'page_cache_flush_daemon', ctxSwitches: 3105, dequeDepth: 1 },
  { id: 'TH-03', pthreadId: '0x7F9A8804', coreId: 3, coreType: 'P-Core', status: 'RUNNING', activeTaskId: 'T-1055', taskName: 'radix_tree_index_rebalance', ctxSwitches: 6890, dequeDepth: 4 },
  { id: 'TH-04', pthreadId: '0x7F9A8805', coreId: 4, coreType: 'E-Core', status: 'STEALING', activeTaskId: null, taskName: 'Work Steal Probe (Victim: TH-01)', ctxSwitches: 1420, dequeDepth: 0 },
  { id: 'TH-05', pthreadId: '0x7F9A8806', coreId: 5, coreType: 'E-Core', status: 'IDLE', activeTaskId: null, taskName: 'Sleeping (epoll_wait)', ctxSwitches: 980, dequeDepth: 0 },
  { id: 'TH-06', pthreadId: '0x7F9A8807', coreId: 6, coreType: 'E-Core', status: 'RUNNING', activeTaskId: 'T-1061', taskName: 'tls_handshake_session', ctxSwitches: 2840, dequeDepth: 2 },
  { id: 'TH-07', pthreadId: '0x7F9A8808', coreId: 7, coreType: 'E-Core', status: 'IDLE', activeTaskId: null, taskName: 'Sleeping (epoll_wait)', ctxSwitches: 840, dequeDepth: 0 },
];

export function ThreadMonitorSection({
  threads = DEFAULT_WORKER_THREADS,
  isNativeBackend = false,
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'IDLE'

  const activeCount = threads.filter((t) => t.status === 'RUNNING' || t.status === 'STEALING').length;
  const idleCount = threads.filter((t) => t.status === 'IDLE').length;

  const filteredThreads = threads.filter((t) => {
    if (filter === 'ACTIVE') return t.status === 'RUNNING' || t.status === 'STEALING';
    if (filter === 'IDLE') return t.status === 'IDLE';
    return true;
  });

  return (
    <MonitoringCard
      sectionNumber="02"
      title="Thread Monitor & Worker Pool"
      subtitle="Master scheduler dispatch loop and worker thread execution states"
      icon={Sliders}
      isLive
      badge={
        <div className="flex items-center gap-2">
          <StatusBadge
            status={isNativeBackend ? 'POSIX' : 'SIMULATED'}
            type="threadModel"
          />
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          {/* Active / Idle Counts */}
          <div className="inline-flex rounded-lg bg-aegis-sidebar p-0.5 border border-aegis-border text-xs font-terminal">
            <button
              onClick={() => setFilter('ALL')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'ALL'
                  ? 'bg-aegis-card text-white font-semibold'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              All ({threads.length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'ACTIVE'
                  ? 'bg-aegis-card text-aegis-teal font-semibold'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('IDLE')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'IDLE'
                  ? 'bg-aegis-card text-aegis-subtle font-semibold'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              Idle ({idleCount})
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-terminal">
        {/* Important Distinction Banner: Simulated vs Native POSIX Threads */}
        <div className="p-3.5 rounded-xl bg-aegis-sidebar border border-aegis-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-aegis-teal shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-white">
                Threading Abstraction Notice (Course Project Architecture)
              </span>
              <p className="text-aegis-muted text-[11px] leading-relaxed">
                {isNativeBackend ? (
                  <>
                    Connected to native C++ daemon. Thread states represent live OS kernel threads via{' '}
                    <code className="text-aegis-indigo">pthread_create</code> and{' '}
                    <code className="text-aegis-indigo">pthread_setaffinity_np</code>.
                  </>
                ) : (
                  <>
                    Operating in <strong className="text-aegis-teal">Simulated Logical Thread Mode</strong>. Thread states
                    and deques are modeled deterministically by the frontend engine to demonstrate multi-threaded
                    scheduling dynamics prior to launching the C++ daemon.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-[10px] text-aegis-subtle">
            <span className="px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
              POSIX 1:1 Mapping
            </span>
            <span className="px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
              Chase-Lev Deques
            </span>
          </div>
        </div>

        {/* Master Scheduler Thread Highlight Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-aegis-indigo/10 via-aegis-card to-aegis-sidebar border border-aegis-indigo/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-aegis-indigo/20 border border-aegis-indigo/40 flex items-center justify-center text-aegis-indigo font-bold shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">TH-SCHED (Master Scheduler Thread)</span>
                <span className="text-[10px] text-aegis-indigo px-1.5 py-0.5 rounded bg-aegis-indigo/10 border border-aegis-indigo/30 font-semibold">
                  pthread_t: 0x7FFF8900
                </span>
              </div>
              <p className="text-[11px] text-aegis-muted mt-0.5">
                Function: <code className="text-aegis-text-dim">aegis_master_dispatch_loop()</code> • Tick: 1000 Hz • Work-stealing coordinator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-[10px] text-aegis-subtle block">SCHEDULER STATE</span>
              <StatusBadge status="DISPATCHING" type="thread" size="xs" />
            </div>
            <div className="text-right pl-4 border-l border-aegis-border">
              <span className="text-[10px] text-aegis-subtle block">CORE AFFINITY</span>
              <strong className="text-white">Core 0 (0x01)</strong>
            </div>
          </div>
        </div>

        {/* Worker Threads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredThreads.map((thread) => {
            const isRunning = thread.status === 'RUNNING';
            const isStealing = thread.status === 'STEALING';

            return (
              <div
                key={thread.id}
                className={cn(
                  'p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2.5',
                  isRunning
                    ? 'bg-aegis-sidebar border-aegis-border hover:border-aegis-teal/40 shadow-card-subtle'
                    : isStealing
                    ? 'bg-aegis-sidebar/90 border-status-amber/40 shadow-glow-amber'
                    : 'bg-aegis-sidebar/50 border-aegis-border/60 opacity-70'
                )}
              >
                {/* Header: Thread ID & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{thread.id}</span>
                    <span className="text-[10px] text-aegis-subtle">
                      ({thread.coreType})
                    </span>
                  </div>
                  <StatusBadge status={thread.status} type="thread" size="xs" />
                </div>

                {/* Assigned Task */}
                <div className="space-y-0.5 pt-1 border-t border-aegis-border/60">
                  <span className="text-[10px] text-aegis-subtle block">ACTIVE WORKLOAD:</span>
                  <div className="truncate text-white font-medium">
                    {thread.activeTaskId ? (
                      <span className="text-aegis-teal font-semibold">
                        {thread.activeTaskId} • {thread.taskName}
                      </span>
                    ) : (
                      <span className="text-aegis-subtle italic">{thread.taskName}</span>
                    )}
                  </div>
                </div>

                {/* Footer: Core, Ctx Switches, Deque */}
                <div className="pt-2 border-t border-aegis-border/40 flex items-center justify-between text-[10px] text-aegis-muted">
                  <span>Core {thread.coreId}</span>
                  <span>CS: <strong className="text-white">{thread.ctxSwitches}</strong></span>
                  <span>
                    Deque: <strong className="text-aegis-indigo">{thread.dequeDepth}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MonitoringCard>
  );
}

export default ThreadMonitorSection;

