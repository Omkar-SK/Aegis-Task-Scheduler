import React from 'react';
import {
  Layers,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  RotateCcw,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import MetricCard from '../common/MetricCard';

export function OverallSimulationSummary({ summary = {} }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-terminal flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aegis-teal" />
          <span>1. Overall Simulation Execution Summary</span>
        </h3>
        <span className="text-[11px] font-terminal text-aegis-muted">
          Benchmark Makespan: <strong className="text-white">{summary.totalExecutionTime || 0} ms</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <MetricCard
          title="Total Tasks"
          value={summary.totalTasks || 0}
          subtitle="Processed in workload"
          icon={Layers}
          accentColor="teal"
        />

        <MetricCard
          title="Completed Tasks"
          value={`${summary.completedTasks || 0} / ${summary.totalTasks || 0}`}
          subtitle="100% completion rate"
          icon={CheckCircle}
          accentColor="emerald"
        />

        <MetricCard
          title="Mean Waiting Time"
          value={`${summary.avgWaitTime || 0} ms`}
          subtitle="Average ready queue delay"
          icon={Clock}
          accentColor="indigo"
        />

        <MetricCard
          title="Mean Turnaround"
          value={`${summary.avgTurnaroundTime || 0} ms`}
          subtitle="Completion - Arrival"
          icon={Clock}
          accentColor="amber"
        />

        <MetricCard
          title="Throughput"
          value={`${summary.throughput || 0} T/s`}
          subtitle="Tasks completed per second"
          icon={Activity}
          accentColor="teal"
        />

        <MetricCard
          title="CPU Utilization"
          value={`${summary.effectiveCpuUtilPct || 100}%`}
          subtitle={`Overhead: ${summary.csOverheadPct || 0}%`}
          icon={Cpu}
          accentColor="indigo"
        />

        <MetricCard
          title="Context Switches"
          value={summary.contextSwitchCount || 0}
          subtitle={`${summary.totalCsDuration || 0} ms lost to switches`}
          icon={RotateCcw}
          accentColor="amber"
        />

        <MetricCard
          title="Deadline Miss Rate"
          value={`${summary.deadlineMissRate || 0}%`}
          subtitle={`${summary.deadlineMissesCount || 0} missed SLA targets`}
          icon={AlertTriangle}
          accentColor={summary.deadlineMissesCount > 0 ? 'rose' : 'emerald'}
        />
      </div>
    </div>
  );
}

export default OverallSimulationSummary;

