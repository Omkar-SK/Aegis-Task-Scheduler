import React from 'react';
import {
  Cpu,
  Clock,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  Play,
  Terminal,
} from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import StatusBadge from './StatusBadge';
import { cn } from '../../utils/classNames';

export function CpuStatusSection({
  metrics = {},
  runningTask = null,
  simTimeMs = 2450,
  schedulerStatus = 'RUNNING',
  activeAlgorithm = 'Aegis Adaptive',
}) {
  const cpuLoad = metrics?.overallCpuLoad || 68.4;
  const userLoad = metrics?.userLoad || (cpuLoad * 0.78).toFixed(1);
  const systemLoad = metrics?.systemLoad || (cpuLoad - userLoad).toFixed(1);

  // Format logical clock into MM:SS.ms
  const formatClock = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    const millis = String(ms % 1000).padStart(3, '0');
    return `${min}:${sec}.${millis}`;
  };

  // Fallback default task if none supplied
  const task = runningTask || {
    id: 'T-1042',
    name: 'matrix_multiply_avx2',
    burstTimeMs: 120,
    remainingTimeMs: 34,
    progress: 72,
    priority: 9,
    assignedCore: 0,
    threadId: 'TH-00',
    memoryKb: 32768,
    vruntimeMs: 44.2,
  };

  return (
    <MonitoringCard
      sectionNumber="01"
      title="CPU Status & Scheduler Core State"
      subtitle="Real-time CPU workload, logical simulation clock, scheduler execution engine, and active task binding"
      icon={Cpu}
      isLive
      badge={
        <div className="flex items-center gap-2">
          <StatusBadge status="ACTIVE" type="thread" size="xs" />
          <span className="text-[11px] font-terminal text-aegis-muted hidden sm:inline">
            Tick: 1000 Hz
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CPU Utilization */}
        <div className="p-4 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex flex-col justify-between space-y-3 font-terminal">
          <div className="flex items-center justify-between">
            <span className="text-xs text-aegis-muted flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-aegis-teal" />
              <span>CPU Utilization</span>
            </span>
            <span
              className={cn(
                'text-xs font-bold px-2 py-0.5 rounded',
                cpuLoad > 85
                  ? 'bg-status-rose/10 text-status-rose'
                  : cpuLoad > 60
                  ? 'bg-status-amber/10 text-status-amber'
                  : 'bg-aegis-teal/10 text-aegis-teal'
              )}
            >
              {cpuLoad}%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-aegis-card overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-aegis-indigo via-aegis-teal to-aegis-teal transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, cpuLoad)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-aegis-muted pt-1">
              <span>
                User: <strong className="text-white">{userLoad}%</strong>
              </span>
              <span>
                Sys: <strong className="text-aegis-indigo">{systemLoad}%</strong>
              </span>
              <span>
                Idle: <strong className="text-aegis-subtle">{(100 - cpuLoad).toFixed(1)}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Scheduler Status */}
        <div className="p-4 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex flex-col justify-between space-y-3 font-terminal">
          <div className="flex items-center justify-between">
            <span className="text-xs text-aegis-muted flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-aegis-indigo" />
              <span>Scheduler Status</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-status-emerald/10 text-status-emerald border border-status-emerald/30">
              {schedulerStatus}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-white truncate">
              {activeAlgorithm}
            </div>
            <div className="text-[10px] text-aegis-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-aegis-teal" />
              <span>Multi-Factor Preemptive Aging</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Simulation Clock */}
        <div className="p-4 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex flex-col justify-between space-y-3 font-terminal">
          <div className="flex items-center justify-between">
            <span className="text-xs text-aegis-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-status-amber" />
              <span>Simulation Clock</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-aegis-card text-aegis-teal border border-aegis-border">
              LOGICAL TIME
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-base font-bold text-white tracking-wider">
              {formatClock(simTimeMs)}
            </div>
            <div className="text-[10px] text-aegis-muted">
              Clock ticks: <strong className="text-aegis-teal">{simTimeMs} ms</strong>
            </div>
          </div>
        </div>

        {/* Metric 4: Currently Executing Task */}
        <div className="p-4 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex flex-col justify-between space-y-2 font-terminal">
          <div className="flex items-center justify-between">
            <span className="text-xs text-aegis-muted flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-aegis-teal fill-current" />
              <span>Running Task</span>
            </span>
            <span className="text-[10px] font-bold text-aegis-teal px-1.5 py-0.5 rounded bg-aegis-card border border-aegis-border">
              {task.id}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-white truncate max-w-[180px]">
              {task.name}
            </div>
            <div className="flex items-center justify-between text-[10px] text-aegis-muted">
              <span>
                Burst: <strong className="text-white">{task.remainingTimeMs ?? 34}ms rem</strong>
              </span>
              <span>
                Bound: <strong className="text-aegis-indigo">Core {task.assignedCore ?? 0}</strong>
              </span>
            </div>
          </div>

          <div className="w-full h-1 bg-aegis-card rounded-full overflow-hidden">
            <div
              className="h-full bg-aegis-teal transition-all duration-300"
              style={{ width: `${task.progress ?? 72}%` }}
            />
          </div>
        </div>
      </div>
    </MonitoringCard>
  );
}

export default CpuStatusSection;

