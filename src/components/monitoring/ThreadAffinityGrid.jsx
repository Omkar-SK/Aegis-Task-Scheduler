import React, { useState } from 'react';
import { Cpu, Zap, Flame, Activity, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function ThreadAffinityGrid({ cores = [], onToggleCoreState }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'PERFORMANCE' | 'EFFICIENCY'

  const filteredCores = cores.filter((core) => {
    if (filterType === 'PERFORMANCE') return core.type === 'Performance';
    if (filterType === 'EFFICIENCY') return core.type === 'Efficiency';
    return true;
  });

  const pCoresCount = cores.filter((c) => c.type === 'Performance').length;
  const eCoresCount = cores.filter((c) => c.type === 'Efficiency').length;
  const activeCount = cores.filter((c) => c.state === 'running').length;

  return (
    <Card
      title="SMP Core Topology & Thread Affinity Matrix"
      subtitle={`Asymmetric multiprocessing cluster: ${pCoresCount} Performance (Golden Cove) + ${eCoresCount} Efficiency (Gracemont) cores`}
      icon={Cpu}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Core Type Filter Pills */}
          <div className="inline-flex rounded-lg bg-aegis-sidebar p-0.5 border border-aegis-border text-xs font-terminal">
            <button
              onClick={() => setFilterType('ALL')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                filterType === 'ALL'
                  ? 'bg-aegis-card text-white font-semibold shadow-sm'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              All ({cores.length})
            </button>
            <button
              onClick={() => setFilterType('PERFORMANCE')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                filterType === 'PERFORMANCE'
                  ? 'bg-aegis-card text-aegis-teal font-semibold shadow-sm'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              P-Cores ({pCoresCount})
            </button>
            <button
              onClick={() => setFilterType('EFFICIENCY')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors',
                filterType === 'EFFICIENCY'
                  ? 'bg-aegis-card text-aegis-indigo font-semibold shadow-sm'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              E-Cores ({eCoresCount})
            </button>
          </div>

          <div className="text-xs font-terminal text-aegis-muted px-2 py-1 rounded bg-aegis-sidebar/80 border border-aegis-border">
            <span className="text-aegis-teal font-bold">{activeCount}</span> / {cores.length} Online
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredCores.map((core) => {
          const isBusy = core.state === 'running';
          const isOverheated = core.temperatureC >= 60;
          const isPCore = core.type === 'Performance';

          return (
            <div
              key={core.coreId}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 relative overflow-hidden group',
                isBusy
                  ? 'bg-aegis-sidebar border-aegis-border hover:border-aegis-teal/40 hover:shadow-card-subtle'
                  : 'bg-aegis-sidebar/40 border-aegis-border/50 opacity-75'
              )}
            >
              {/* Subtle top indicator bar */}
              <div
                className={cn(
                  'absolute top-0 left-0 right-0 h-1 transition-all',
                  isPCore
                    ? isBusy
                      ? 'bg-aegis-teal shadow-glow-teal'
                      : 'bg-aegis-teal/30'
                    : isBusy
                    ? 'bg-aegis-indigo shadow-glow-indigo'
                    : 'bg-aegis-indigo/30'
                )}
              />

              {/* Core Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isBusy ? 'bg-aegis-teal animate-pulse' : 'bg-aegis-subtle'
                    )}
                  />
                  <div>
                    <span className="text-xs font-bold text-white font-terminal tracking-tight block">
                      {core.name}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-terminal uppercase font-medium',
                        isPCore ? 'text-aegis-teal' : 'text-aegis-indigo'
                      )}
                    >
                      {core.type} Core
                    </span>
                  </div>
                </div>

                {/* Affinity Hex Mask Badge */}
                <span
                  className="text-[10px] font-terminal px-2 py-0.5 rounded bg-aegis-card border border-aegis-border text-aegis-muted font-medium"
                  title="pthread thread affinity bitmask (sched_setaffinity)"
                >
                  mask {core.affinityMask}
                </span>
              </div>

              {/* Utilization Gauge */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-baseline justify-between text-xs font-terminal">
                  <span className="text-aegis-muted text-[11px]">Core Load:</span>
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
                <div className="w-full h-1.5 bg-aegis-card rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      core.utilization > 80
                        ? 'bg-gradient-to-r from-status-amber to-status-rose'
                        : isPCore
                        ? 'bg-gradient-to-r from-aegis-indigo to-aegis-teal'
                        : 'bg-gradient-to-r from-aegis-indigo/70 to-aegis-indigo'
                    )}
                    style={{ width: `${core.utilization}%` }}
                  />
                </div>
              </div>

              {/* Microarchitectural Telemetry: Freq, Temp, IPC */}
              <div className="mt-3 pt-2.5 border-t border-aegis-border/60 grid grid-cols-3 gap-1 text-[10px] font-terminal text-center">
                <div className="p-1 rounded bg-aegis-card/50">
                  <div className="text-aegis-subtle flex items-center justify-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-aegis-teal" />
                    <span>Clock</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{core.frequencyGhz} GHz</div>
                </div>

                <div className="p-1 rounded bg-aegis-card/50">
                  <div className="text-aegis-subtle flex items-center justify-center gap-0.5">
                    <Flame className={cn('w-2.5 h-2.5', isOverheated ? 'text-status-amber' : 'text-aegis-subtle')} />
                    <span>Temp</span>
                  </div>
                  <div
                    className={cn(
                      'font-semibold mt-0.5',
                      isOverheated ? 'text-status-amber' : 'text-white'
                    )}
                  >
                    {core.temperatureC}°C
                  </div>
                </div>

                <div className="p-1 rounded bg-aegis-card/50">
                  <div className="text-aegis-subtle flex items-center justify-center gap-0.5">
                    <Activity className="w-2.5 h-2.5 text-aegis-indigo" />
                    <span>IPC</span>
                  </div>
                  <div className="font-semibold text-white mt-0.5">{core.instructionsPerCycle || '2.1'}</div>
                </div>
              </div>

              {/* Bound Task & Worker Thread */}
              <div className="mt-3 pt-2 border-t border-aegis-border/40 flex items-center justify-between text-[11px] font-terminal">
                <div className="truncate mr-2">
                  <span className="text-aegis-subtle text-[10px]">TASK: </span>
                  <span className={isBusy ? 'text-aegis-teal font-semibold' : 'text-aegis-subtle'}>
                    {core.activeTaskId || 'IDLE_LOOP'}
                  </span>
                </div>
                <div className="text-[10px] text-aegis-muted shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-aegis-indigo"></span>
                  <span>{core.activeThreadId}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ThreadAffinityGrid;

