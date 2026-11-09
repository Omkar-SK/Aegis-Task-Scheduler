import React from 'react';
import { Cpu, Flame, Zap } from 'lucide-react';
import { Card } from '../common/Card';
import { StatusDot } from '../common/StatusDot';
import { cn } from '../../utils/classNames';

export function CpuCoreVisualizer({ cores = [] }) {
  return (
    <Card
      title="Hardware Core Topology & Thread Affinity"
      subtitle="Multi-core workload distribution & active thread assignment"
      icon={Cpu}
      actions={
        <div className="flex items-center gap-3 text-xs text-aegis-muted font-terminal">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-aegis-teal"></span>
            <span>Active Core</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-aegis-subtle"></span>
            <span>Idle Core</span>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cores.map((core) => {
          const isBusy = core.state === 'running';
          const isOverheated = core.temperatureC >= 60;

          return (
            <div
              key={core.coreId}
              className={cn(
                'p-3.5 rounded-lg border transition-all duration-150 relative overflow-hidden',
                isBusy
                  ? 'bg-aegis-sidebar border-aegis-border hover:border-aegis-teal/50 shadow-card-subtle'
                  : 'bg-aegis-sidebar/50 border-aegis-border/60 opacity-70'
              )}
            >
              {/* Header: Core Name & State */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isBusy ? 'bg-aegis-teal shadow-glow-teal' : 'bg-aegis-subtle'
                    )}
                  />
                  <span className="text-xs font-bold text-white font-terminal tracking-tight">
                    {core.name}
                  </span>
                </div>
                <span className="text-[10px] font-terminal text-aegis-subtle">
                  {core.affinityMask}
                </span>
              </div>

              {/* Utilization Gauge */}
              <div className="mt-3">
                <div className="flex items-baseline justify-between text-xs font-terminal">
                  <span className="text-aegis-muted">Utilization:</span>
                  <span
                    className={cn(
                      'font-bold',
                      core.utilization > 80
                        ? 'text-status-rose'
                        : core.utilization > 50
                        ? 'text-status-amber'
                        : 'text-aegis-teal'
                    )}
                  >
                    {core.utilization}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-aegis-card rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      core.utilization > 80
                        ? 'bg-gradient-to-r from-status-amber to-status-rose'
                        : 'bg-gradient-to-r from-aegis-indigo to-aegis-teal'
                    )}
                    style={{ width: `${core.utilization}%` }}
                  />
                </div>
              </div>

              {/* Task & Telemetry details */}
              <div className="mt-3 pt-2.5 border-t border-aegis-border/60 flex items-center justify-between text-[11px] font-terminal">
                <div className="truncate mr-2">
                  <span className="text-aegis-subtle">Task: </span>
                  <span className={isBusy ? 'text-aegis-teal font-semibold' : 'text-aegis-subtle'}>
                    {core.activeTaskId || 'IDLE_LOOP'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-aegis-muted shrink-0">
                  <span className="flex items-center gap-0.5" title="Clock Frequency">
                    <Zap className="w-3 h-3 text-aegis-teal" />
                    {core.frequencyGhz}G
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-0.5',
                      isOverheated ? 'text-status-amber' : 'text-aegis-subtle'
                    )}
                    title="Core Temperature"
                  >
                    <Flame className="w-3 h-3" />
                    {core.temperatureC}°C
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default CpuCoreVisualizer;
