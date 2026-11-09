import React, { useMemo } from 'react';
import {
  Award,
  Clock,
  Cpu,
  Flame,
  ShieldAlert,
  Zap,
  TrendingUp,
  Info,
} from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import { calculateTaskPriority, DEFAULT_WEIGHTS } from '../../utils/adaptivePriorityMath';
import { cn } from '../../utils/classNames';

const DEFAULT_CANDIDATE_TASKS = [
  { id: 'T-1055', name: 'radix_tree_index_rebalance', arrivalTime: 0, burstTimeMs: 120, remainingTime: 40, deadline: 150, waitTimeMs: 38, priority: 9 },
  { id: 'T-1049', name: 'crypto_sha256_batch', arrivalTime: 10, burstTimeMs: 95, remainingTime: 18, deadline: 180, waitTimeMs: 25, priority: 8 },
  { id: 'T-1042', name: 'matrix_multiply_avx2', arrivalTime: 0, burstTimeMs: 120, remainingTime: 34, deadline: 220, waitTimeMs: 14, priority: 7 },
  { id: 'T-1065', name: 'garbage_collector_mark', arrivalTime: 15, burstTimeMs: 55, remainingTime: 55, deadline: 200, waitTimeMs: 28, priority: 6 },
  { id: 'T-1053', name: 'page_cache_flush_daemon', arrivalTime: 20, burstTimeMs: 45, remainingTime: 22, deadline: 260, waitTimeMs: 18, priority: 5 },
];

export function PriorityMonitorSection({
  tasks = [],
  currentTime = 2450,
  weights = DEFAULT_WEIGHTS,
}) {
  const pool = tasks.length > 0 ? tasks : DEFAULT_CANDIDATE_TASKS;

  // Calculate deterministic priority scores for each task
  const rankedTasks = useMemo(() => {
    return pool
      .map((task) => {
        const result = calculateTaskPriority(task, currentTime, weights);
        return {
          ...task,
          ...result,
        };
      })
      .sort((a, b) => b.compositePriority - a.compositePriority);
  }, [pool, currentTime, weights]);

  const topTask = rankedTasks[0];

  return (
    <MonitoringCard
      sectionNumber="05"
      title="Adaptive Priority Monitor & Factor Breakdown"
      subtitle="Live multi-factor ranking combining Deadline Urgency (50%), Waiting Aging (20%), and CPU Penalization (30%)"
      icon={Award}
      isLive
      badge={
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/30 text-aegis-teal text-xs font-terminal font-semibold">
          <span>{rankedTasks.length} Ranked</span>
        </div>
      }
    >
      <div className="space-y-4 font-terminal text-xs">
        {/* Formula & Policy Context Bar */}
        <div className="p-3.5 rounded-xl bg-aegis-sidebar border border-aegis-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-aegis-teal" />
              <span>Aegis Dynamic Priority Heuristic Formula:</span>
            </span>
            <p className="text-aegis-muted text-[11px]">
              <code className="text-aegis-teal font-semibold">
                Priority = 0.50 × Urgency + 0.20 × WaitScore + 0.30 × (1 − CPUScore)
              </code>
            </p>
          </div>

          {topTask && (
            <div className="shrink-0 p-2 rounded-lg bg-aegis-card border border-aegis-teal/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-aegis-teal animate-pulse" />
              <div className="text-[11px]">
                <span className="text-aegis-subtle block text-[10px]">HIGHEST DISPATCH CANDIDATE</span>
                <strong className="text-white">{topTask.id}</strong> ({topTask.compositePriority.toFixed(2)})
              </div>
            </div>
          )}
        </div>

        {/* Priority Leaderboard Table */}
        <div className="overflow-x-auto rounded-xl border border-aegis-border/80">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-aegis-sidebar border-b border-aegis-border text-aegis-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Task ID & Name</th>
                <th className="py-2.5 px-3 text-right">Composite Score</th>
                <th className="py-2.5 px-3">Urgency (50%)</th>
                <th className="py-2.5 px-3">Wait (20%)</th>
                <th className="py-2.5 px-3">CPU Usage (30%)</th>
                <th className="py-2.5 px-3 text-center">Dominant Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aegis-border/60">
              {rankedTasks.slice(0, 7).map((t, index) => {
                const isLeader = index === 0;
                const urgency = t.factors?.deadlineUrgency ?? 0.5;
                const waitScore = t.factors?.waitingScore ?? 0.3;
                const cpuScore = t.factors?.cpuConsumption ?? 0.2;

                // Identify dominant factor
                let dominant = 'Balanced';
                if (urgency >= 0.7) dominant = 'Deadline Urgency';
                else if (waitScore >= 0.6) dominant = 'Aging Starvation';
                else if (cpuScore <= 0.3) dominant = 'I/O Light CPU';

                return (
                  <tr
                    key={t.id}
                    className={cn(
                      'hover:bg-aegis-card-hover transition-colors',
                      isLeader && 'bg-aegis-teal/5'
                    )}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'w-5 h-5 rounded flex items-center justify-center font-bold text-[10px]',
                          isLeader
                            ? 'bg-aegis-teal text-aegis-bg shadow-glow-teal'
                            : 'bg-aegis-sidebar border border-aegis-border text-aegis-muted'
                        )}
                      >
                        #{index + 1}
                      </span>
                    </td>

                    {/* Task ID & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white px-1.5 py-0.5 rounded bg-aegis-card border border-aegis-border">
                          {t.id}
                        </span>
                        <span className="text-white font-medium truncate max-w-[150px]">
                          {t.name}
                        </span>
                      </div>
                    </td>

                    {/* Composite Score */}
                    <td className="py-3 px-3 text-right">
                      <span className="text-aegis-teal font-bold text-sm">
                        {t.compositePriority.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-aegis-subtle block">
                        {(t.compositePriority * 10).toFixed(1)} / 10
                      </span>
                    </td>

                    {/* Factor 1: Deadline Urgency */}
                    <td className="py-3 px-3 min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-aegis-subtle">Slack</span>
                          <span className="text-white font-semibold">{(urgency * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-aegis-sidebar rounded-full overflow-hidden">
                          <div
                            className="h-full bg-aegis-teal rounded-full"
                            style={{ width: `${urgency * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Factor 2: Wait Score */}
                    <td className="py-3 px-3 min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-aegis-subtle">Aging</span>
                          <span className="text-white font-semibold">{(waitScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-aegis-sidebar rounded-full overflow-hidden">
                          <div
                            className="h-full bg-aegis-indigo rounded-full"
                            style={{ width: `${waitScore * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Factor 3: CPU Consumption */}
                    <td className="py-3 px-3 min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-aegis-subtle">Compute</span>
                          <span className="text-white font-semibold">{(cpuScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-aegis-sidebar rounded-full overflow-hidden">
                          <div
                            className="h-full bg-status-amber rounded-full"
                            style={{ width: `${cpuScore * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Dominant Driver */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-aegis-card border border-aegis-border text-white whitespace-nowrap">
                        {dominant}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MonitoringCard>
  );
}

export default PriorityMonitorSection;

