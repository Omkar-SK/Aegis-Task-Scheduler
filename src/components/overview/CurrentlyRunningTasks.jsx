import React from 'react';
import { Cpu, Play, Zap, HardDrive } from 'lucide-react';
import Card from '../common/Card';
import StatusDot from '../common/StatusDot';
import { formatDuration, formatBytes } from '../../utils/formatters';

export function CurrentlyRunningTasks({ tasks = [], loading = false }) {
  const runningTasks = tasks.filter((t) => t.state === 'running');

  if (loading) {
    return (
      <Card
        title="Currently Running Tasks"
        subtitle="Processes actively executing on CPU execution units"
        icon={Cpu}
      >
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-aegis-sidebar rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Currently Running Tasks"
      subtitle={`Hardware execution units active (${runningTasks.length} running)`}
      icon={Cpu}
      actions={
        <div className="flex items-center gap-2 text-xs font-terminal text-aegis-muted">
          <span className="w-2 h-2 rounded-full bg-aegis-teal animate-pulse" />
          <span className="text-white font-semibold">{runningTasks.length} Cores Busy</span>
        </div>
      }
    >
      {runningTasks.length === 0 ? (
        <div className="py-8 text-center text-aegis-muted font-terminal text-xs">
          No tasks currently executing. CPU is in idle low-power loop.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {runningTasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-lg border border-aegis-border bg-aegis-sidebar/80 hover:border-aegis-teal/40 transition-all font-terminal text-xs space-y-2.5 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusDot state="running" size="sm" pulse={true} />
                  <span className="font-bold text-white text-sm truncate">{task.id}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30 font-semibold">
                  Core #{task.assignedCore ?? 0}
                </span>
              </div>

              {/* Task Name */}
              <div className="text-aegis-teal font-medium truncate text-xs" title={task.name}>
                {task.name}
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-aegis-muted mb-1">
                  <span>Slice Progress</span>
                  <span className="text-white font-bold">{task.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-aegis-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-aegis-indigo to-aegis-teal rounded-full transition-all duration-300"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Details footer */}
              <div className="pt-2 border-t border-aegis-border/60 flex items-center justify-between text-[10px] text-aegis-subtle">
                <span className="text-aegis-muted">Rem: {formatDuration(task.remainingTimeMs)}</span>
                <span className="text-status-amber font-semibold">P{task.priority} Priority</span>
                <span>{formatBytes((task.memoryKb || 16384) * 1024)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default CurrentlyRunningTasks;

