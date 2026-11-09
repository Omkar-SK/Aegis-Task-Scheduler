import React from 'react';
import { Cpu, RotateCcw, Activity, Zap, Layers } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function CpuAndContextSwitchAnalysisSection({
  summary = {},
  allAlgorithmResults = [],
}) {
  const effectiveCpu = summary.effectiveCpuUtilPct ?? 98.4;
  const csOverhead = summary.csOverheadPct ?? 1.6;
  const idle = summary.idlePct ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-terminal text-xs">
      {/* SECTION 6: CPU Utilization Analysis */}
      <Card
        title="6. CPU Utilization & Time Allocation Analysis"
        subtitle="Breakdown of compute execution vs context-switch overhead vs idle cycles"
        icon={Cpu}
        actions={
          <span className="text-aegis-teal font-bold px-2 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/30">
            {effectiveCpu}% Effective
          </span>
        }
      >
        <div className="space-y-4">
          {/* Segmented Utilization Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-aegis-muted">Execution Time Allocation:</span>
              <span className="text-white font-bold">{summary.totalExecutionTime || 0} ms Makespan</span>
            </div>

            <div className="w-full h-3 bg-aegis-sidebar rounded-full overflow-hidden flex">
              <div
                className="h-full bg-aegis-teal"
                style={{ width: `${effectiveCpu}%` }}
                title={`Effective CPU Compute: ${effectiveCpu}%`}
              />
              <div
                className="h-full bg-status-amber"
                style={{ width: `${csOverhead}%` }}
                title={`Context Switch Overhead: ${csOverhead}%`}
              />
              <div
                className="h-full bg-aegis-subtle"
                style={{ width: `${idle}%` }}
                title={`Idle Cycles: ${idle}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aegis-teal" />
                <span className="text-aegis-muted">Compute: <strong>{effectiveCpu}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-amber" />
                <span className="text-aegis-muted">CS Overhead: <strong>{csOverhead}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aegis-subtle" />
                <span className="text-aegis-muted">Idle: <strong>{idle}%</strong></span>
              </div>
            </div>
          </div>

          {/* Compute vs System metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-aegis-border/60">
            <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border">
              <span className="text-[10px] text-aegis-subtle block">EFFECTIVE COMPUTE TIME</span>
              <strong className="text-white text-sm">
                {Math.round(((summary.totalExecutionTime || 0) * effectiveCpu) / 100)} ms
              </strong>
              <span className="text-[10px] text-aegis-teal block">Active instruction cycles</span>
            </div>

            <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border">
              <span className="text-[10px] text-aegis-subtle block">DISPATCH THROUGHPUT</span>
              <strong className="text-white text-sm">{summary.throughput || 0} tasks/sec</strong>
              <span className="text-[10px] text-aegis-indigo block">Makespan efficiency</span>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 7: Context-Switch Overhead Analysis */}
      <Card
        title="7. Context-Switch Overhead Analysis"
        subtitle="Preemption penalties, PCB register saves, TLB flushes, and cross-algorithm costs"
        icon={RotateCcw}
        actions={
          <span className="text-status-amber font-bold px-2 py-0.5 rounded bg-status-amber/10 border border-status-amber/30">
            {summary.contextSwitchCount || 0} Switches
          </span>
        }
      >
        <div className="space-y-4">
          {/* Key Context Switch Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border">
              <span className="text-[10px] text-aegis-subtle block">TIME LOST TO SWITCHING</span>
              <strong className="text-status-amber text-sm">{summary.totalCsDuration || 0} ms</strong>
              <span className="text-[10px] text-aegis-muted block">@ 1.0 ms / preemption</span>
            </div>

            <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border">
              <span className="text-[10px] text-aegis-subtle block">OVERHEAD RATIO</span>
              <strong className="text-white text-sm">{summary.csOverheadPct || 0}% of makespan</strong>
              <span className="text-[10px] text-status-emerald block">Within bound (&lt; 5%)</span>
            </div>
          </div>

          {/* Cross-Algorithm Context Switch Comparison */}
          <div className="space-y-2 pt-2 border-t border-aegis-border/60">
            <span className="text-[10px] text-aegis-muted uppercase block font-semibold">
              Context Switch Burden Comparison Across Policies:
            </span>

            <div className="space-y-1.5">
              {allAlgorithmResults.map((r) => {
                const maxCs = Math.max(...allAlgorithmResults.map((x) => x.contextSwitches), 1);
                const pct = (r.contextSwitches / maxCs) * 100;

                return (
                  <div key={r.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-aegis-text-dim w-32 truncate">{r.shortName}:</span>
                    <div className="flex-1 h-2 bg-aegis-sidebar rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: r.id === 'ROUND_ROBIN' ? '#F59E0B' : r.id === 'AEGIS_ADAPTIVE' ? '#18C6A3' : '#7C8CFF',
                        }}
                      />
                    </div>
                    <span className="font-bold text-white w-12 text-right">
                      {r.contextSwitches} CS
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CpuAndContextSwitchAnalysisSection;

