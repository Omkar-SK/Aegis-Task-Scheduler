import React from 'react';
import { Layers, Clock, AlertTriangle, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import StatusBadge from './StatusBadge';
import { cn } from '../../utils/classNames';

const DEFAULT_READY_TASKS = [
  { id: 'T-1055', name: 'radix_tree_index_rebalance', waitTimeMs: 38, basePriority: 9, dynamicPriority: 9.6, remainingTimeMs: 92, deadline: 340, starvationRisk: 'HIGH' },
  { id: 'T-1065', name: 'garbage_collector_mark', waitTimeMs: 28, basePriority: 7, dynamicPriority: 8.8, remainingTimeMs: 55, deadline: 280, starvationRisk: 'MEDIUM' },
  { id: 'T-1068', name: 'tcp_socket_poll_batch', waitTimeMs: 22, basePriority: 6, dynamicPriority: 7.9, remainingTimeMs: 40, deadline: 220, starvationRisk: 'LOW' },
  { id: 'T-1070', name: 'crypto_ed25519_verify', waitTimeMs: 16, basePriority: 8, dynamicPriority: 7.5, remainingTimeMs: 65, deadline: 300, starvationRisk: 'LOW' },
  { id: 'T-1071', name: 'memory_compactor_slab', waitTimeMs: 12, basePriority: 5, dynamicPriority: 6.4, remainingTimeMs: 80, deadline: 400, starvationRisk: 'LOW' },
];

export function ReadyQueueSection({
  readyTasks = DEFAULT_READY_TASKS,
  onBoostPriority,
}) {
  const tasks = readyTasks.length > 0 ? readyTasks : DEFAULT_READY_TASKS;

  return (
    <MonitoringCard
      sectionNumber="03"
      title="Ready Queue & Dispatch Latency"
      subtitle="Tasks waiting in memory for CPU time slice allocation"
      icon={Layers}
      isLive
      badge={
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-aegis-indigo/10 border border-aegis-indigo/30 text-aegis-indigo text-xs font-terminal font-semibold">
          <span>{tasks.length} Tasks Queued</span>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-terminal">
          <thead>
            <tr className="border-b border-aegis-border text-aegis-muted uppercase text-[10px]">
              <th className="py-2.5 px-3">Queue Rank</th>
              <th className="py-2.5 px-3">Task ID & Name</th>
              <th className="py-2.5 px-3 text-right">Waiting Duration</th>
              <th className="py-2.5 px-3 text-right">Current Priority</th>
              <th className="py-2.5 px-3 text-right">Remaining Burst</th>
              <th className="py-2.5 px-3 text-right">Deadline</th>
              <th className="py-2.5 px-3 text-center">Starvation Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aegis-border/60">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-aegis-muted">
                  Ready queue is empty. Scheduler is awaiting task arrivals or I/O interrupts.
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => {
                const isHighWait = task.waitTimeMs >= 35;
                const isHead = index === 0;

                return (
                  <tr
                    key={task.id}
                    className={cn(
                      'hover:bg-aegis-card-hover transition-colors',
                      isHead && 'bg-aegis-teal/5'
                    )}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold',
                            isHead
                              ? 'bg-aegis-teal text-aegis-bg shadow-glow-teal'
                              : 'bg-aegis-card border border-aegis-border text-aegis-muted'
                          )}
                        >
                          #{index + 1}
                        </span>
                        {isHead && (
                          <span className="text-[10px] text-aegis-teal font-semibold">
                            HEAD
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Task ID & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white px-1.5 py-0.5 rounded bg-aegis-sidebar border border-aegis-border">
                          {task.id}
                        </span>
                        <span className="text-white font-medium truncate max-w-[180px]">
                          {task.name}
                        </span>
                      </div>
                    </td>

                    {/* Waiting Duration */}
                    <td className="py-3 px-3 text-right">
                      <span
                        className={cn(
                          'font-bold inline-flex items-center gap-1',
                          isHighWait
                            ? 'text-status-amber animate-pulse'
                            : 'text-aegis-teal'
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{task.waitTimeMs} ms</span>
                      </span>
                    </td>

                    {/* Current Priority */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-aegis-indigo font-bold text-sm">
                          {typeof task.dynamicPriority === 'number'
                            ? task.dynamicPriority.toFixed(1)
                            : task.dynamicPriority || '7.5'}
                        </span>
                        <span className="text-[10px] text-aegis-subtle">
                          (base: {task.basePriority ?? task.priority ?? 5})
                        </span>
                      </div>
                    </td>

                    {/* Remaining Burst */}
                    <td className="py-3 px-3 text-right text-white font-medium">
                      {task.remainingTimeMs ?? task.burstTimeMs ?? 20} ms
                    </td>

                    {/* Deadline */}
                    <td className="py-3 px-3 text-right text-aegis-muted">
                      {task.deadline ? `${task.deadline} ms` : 'None'}
                    </td>

                    {/* Starvation Risk */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
                          task.starvationRisk === 'HIGH' || isHighWait
                            ? 'bg-status-amber/15 text-status-amber border border-status-amber/30'
                            : task.starvationRisk === 'MEDIUM'
                            ? 'bg-aegis-indigo/15 text-aegis-indigo border border-aegis-indigo/30'
                            : 'bg-aegis-sidebar text-aegis-subtle border border-aegis-border'
                        )}
                      >
                        {task.starvationRisk === 'HIGH' || isHighWait ? (
                          <>
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Aging Boost</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Normal</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </MonitoringCard>
  );
}

export default ReadyQueueSection;

