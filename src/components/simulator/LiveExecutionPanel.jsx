import React from 'react';
import { Cpu, Play, CheckCircle2, Clock, Zap, AlertCircle, Layers } from 'lucide-react';
import Card from '../common/Card';
import StatusDot from '../common/StatusDot';
import { formatDuration } from '../../utils/formatters';

export function LiveExecutionPanel({
  currentTime = 0,
  runningTask = null,
  activeSlice = null,
  readyQueue = [],
  completedTasks = [],
  remainingWorkload = 0,
  totalWorkload = 100,
}) {
  const isContextSwitch = activeSlice?.type === 'CONTEXT_SWITCH';
  const isIdle = activeSlice?.type === 'IDLE';

  return (
    <div className="space-y-4">
      {/* Simulation Clock & Workload Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Clock Meter */}
        <div className="p-3.5 rounded-xl border border-aegis-border bg-aegis-card shadow-card-subtle flex items-center justify-between font-terminal">
          <div>
            <span className="text-[10px] text-aegis-muted uppercase tracking-wider block">
              Simulation Clock
            </span>
            <div className="text-xl font-bold text-aegis-teal mt-0.5">
              {currentTime} <span className="text-xs text-aegis-subtle font-normal">ms</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-aegis-teal/10 border border-aegis-teal/20 text-aegis-teal">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Remaining CPU Workload */}
        <div className="p-3.5 rounded-xl border border-aegis-border bg-aegis-card shadow-card-subtle flex items-center justify-between font-terminal">
          <div>
            <span className="text-[10px] text-aegis-muted uppercase tracking-wider block">
              Remaining CPU Workload
            </span>
            <div className="text-xl font-bold text-white mt-0.5">
              {remainingWorkload} <span className="text-xs text-aegis-subtle font-normal">ms</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-aegis-indigo/10 border border-aegis-indigo/20 text-aegis-indigo">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="p-3.5 rounded-xl border border-aegis-border bg-aegis-card shadow-card-subtle flex items-center justify-between font-terminal">
          <div>
            <span className="text-[10px] text-aegis-muted uppercase tracking-wider block">
              Finished Tasks
            </span>
            <div className="text-xl font-bold text-status-emerald mt-0.5">
              {completedTasks.length} <span className="text-xs text-aegis-subtle font-normal">done</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-status-emerald/10 border border-status-emerald/20 text-status-emerald">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main 3 Lanes: Running Task | Ready Queue | Completed Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lane 1: Currently Running Task */}
        <div className="rounded-xl border border-aegis-teal/30 bg-aegis-card p-4 shadow-card-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-aegis-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-aegis-teal animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-terminal">
                  Currently Running Task
                </h4>
              </div>
              <span className="text-[10px] font-terminal text-aegis-teal bg-aegis-teal/10 px-2 py-0.5 rounded border border-aegis-teal/30">
                Core #0
              </span>
            </div>

            <div className="mt-4">
              {isContextSwitch ? (
                <div className="p-4 rounded-lg border border-status-rose/40 bg-status-rose/10 text-center font-terminal space-y-1">
                  <div className="text-xs font-bold text-status-rose flex items-center justify-center gap-1.5">
                    <Zap className="w-4 h-4 animate-bounce" />
                    <span>Context Switching</span>
                  </div>
                  <p className="text-[11px] text-aegis-muted">
                    Switching PCB registers from {activeSlice.fromTaskId} to {activeSlice.toTaskId}
                  </p>
                </div>
              ) : isIdle ? (
                <div className="p-4 rounded-lg border border-dashed border-aegis-border bg-aegis-sidebar/40 text-center font-terminal text-xs text-aegis-subtle">
                  <span>CPU Idle Loop (No arrived tasks in ready queue)</span>
                </div>
              ) : runningTask ? (
                <div className="p-3.5 rounded-lg border border-aegis-teal/40 bg-aegis-sidebar font-terminal text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: runningTask.color }}
                      />
                      <span className="text-base font-bold text-white">{runningTask.id}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-amber/15 text-status-amber border border-status-amber/30">
                      P{runningTask.priority} Priority
                    </span>
                  </div>

                  <div className="text-aegis-teal font-medium text-xs truncate">
                    {runningTask.name}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-aegis-muted mb-1">
                      <span>Total Task Burst Progress</span>
                      <span className="text-white font-bold">{runningTask.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-aegis-card rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-150"
                        style={{
                          width: `${runningTask.progress || 0}%`,
                          backgroundColor: runningTask.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-aegis-border flex items-center justify-between text-[11px] text-aegis-subtle">
                    <span>Remaining: <strong className="text-white">{runningTask.remainingTime}ms</strong></span>
                    <span>Deadline: {runningTask.deadline}ms</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center font-terminal text-xs text-aegis-subtle">
                  CPU Idle. Start simulation to begin execution.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lane 2: Ready Queue (Ordered by algorithm selection) */}
        <div className="rounded-xl border border-aegis-border bg-aegis-card p-4 shadow-card-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-aegis-border">
              <div className="flex items-center gap-2">
                <StatusDot state="ready" size="sm" pulse={false} />
                <h4 className="text-xs font-bold text-status-sky uppercase tracking-wider font-terminal">
                  Ready Queue ({readyQueue.length})
                </h4>
              </div>
              <span className="text-[10px] font-terminal text-aegis-subtle">Waiting for CPU</span>
            </div>

            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
              {readyQueue.length === 0 ? (
                <div className="text-center py-8 text-xs text-aegis-subtle font-terminal">
                  Ready Queue is currently empty.
                </div>
              ) : (
                readyQueue.map((task, idx) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg border border-aegis-border bg-aegis-sidebar hover:border-status-sky/40 transition-colors font-terminal text-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-aegis-subtle font-bold">#{idx + 1}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block">{task.id}</span>
                        <span className="text-[10px] text-aegis-muted truncate block max-w-[120px]">
                          {task.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-white font-semibold text-[11px]">
                        Rem: {task.remainingTime}ms
                      </div>
                      <span className="text-[10px] text-status-amber">P{task.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Lane 3: Completed Tasks */}
        <div className="rounded-xl border border-aegis-border bg-aegis-card p-4 shadow-card-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-aegis-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-emerald" />
                <h4 className="text-xs font-bold text-status-emerald uppercase tracking-wider font-terminal">
                  Completed Tasks ({completedTasks.length})
                </h4>
              </div>
              <span className="text-[10px] font-terminal text-aegis-subtle">Terminated</span>
            </div>

            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-aegis-subtle font-terminal">
                  No tasks completed yet.
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg border border-aegis-border bg-aegis-sidebar font-terminal text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: task.color }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block">{task.id}</span>
                        <span className="text-[10px] text-aegis-muted truncate block max-w-[120px]">
                          {task.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-status-emerald font-semibold text-[11px]">
                        Burst: {task.burstTimeMs}ms
                      </div>
                      <span className="text-[10px] text-aegis-subtle">Exit OK</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveExecutionPanel;

