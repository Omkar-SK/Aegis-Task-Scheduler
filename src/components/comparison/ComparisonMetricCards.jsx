import React from 'react';
import {
  Clock,
  Zap,
  Activity,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Trophy,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import Card from '../common/Card';

export function ComparisonMetricCards({ results = [], bestPerformers = {} }) {
  if (!results || results.length === 0) return null;

  const metricCards = [
    {
      key: 'avgWaitTime',
      title: 'Average Waiting Time',
      unit: 'ms',
      icon: Clock,
      lowerIsBetter: true,
      description: 'Mean ready queue waiting latency before completion',
      best: bestPerformers.avgWaitTime,
    },
    {
      key: 'avgTurnaroundTime',
      title: 'Average Turnaround Time',
      unit: 'ms',
      icon: Clock,
      lowerIsBetter: true,
      description: 'Elapsed duration from process arrival to termination',
      best: bestPerformers.avgTurnaroundTime,
    },
    {
      key: 'avgResponseTime',
      title: 'Average Response Time',
      unit: 'ms',
      icon: Zap,
      lowerIsBetter: true,
      description: 'Time from task arrival to initial CPU dispatch',
      best: bestPerformers.avgResponseTime,
    },
    {
      key: 'cpuUtilization',
      title: 'CPU Utilization',
      unit: '%',
      icon: Cpu,
      lowerIsBetter: false,
      description: 'Active processor core time vs idle makespan',
      best: bestPerformers.cpuUtilization,
    },
    {
      key: 'throughput',
      title: 'System Throughput',
      unit: 'tasks/s',
      icon: Activity,
      lowerIsBetter: false,
      description: 'Completed tasks processed per second of runtime',
      best: bestPerformers.throughput,
    },
    {
      key: 'contextSwitches',
      title: 'Context Switches',
      unit: 'CS',
      icon: Activity,
      lowerIsBetter: true,
      description: 'Kernel register save & restore dispatch overhead',
      best: bestPerformers.contextSwitches,
    },
    {
      key: 'deadlineMisses',
      title: 'Deadline SLA Misses',
      unit: 'misses',
      icon: AlertTriangle,
      lowerIsBetter: true,
      description: 'Tasks completing after scheduled SLA deadline',
      best: bestPerformers.deadlineMisses,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-terminal flex items-center gap-2">
          <Trophy className="w-4 h-4 text-aegis-teal" />
          <span>Dynamic Benchmark Performance Winners</span>
        </h3>
        <span className="text-[11px] text-aegis-muted font-terminal">
          Computed from deterministic scheduling results
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const bestAlgo = metric.best;

          return (
            <div
              key={metric.key}
              className="p-3.5 rounded-xl border border-aegis-border bg-aegis-card hover:bg-aegis-card-hover transition-all duration-150 flex flex-col justify-between font-terminal text-xs shadow-card-subtle"
            >
              <div>
                <div className="flex items-center justify-between text-aegis-muted mb-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider truncate">
                    {metric.title}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-aegis-subtle shrink-0" />
                </div>

                {/* Winner Badge Callout */}
                {bestAlgo ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: bestAlgo.color }}
                      />
                      <span className="font-bold text-white text-xs truncate">
                        {bestAlgo.algorithmName}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 text-lg font-bold text-aegis-teal">
                      <span>{bestAlgo.value}</span>
                      <span className="text-[10px] text-aegis-muted font-normal">
                        {metric.unit}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-aegis-subtle">Computing...</div>
                )}
              </div>

              {/* Subtitle */}
              <div className="mt-3 pt-2 border-t border-aegis-border/60 text-[10px] text-aegis-subtle leading-tight font-sans">
                {metric.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ComparisonMetricCards;

