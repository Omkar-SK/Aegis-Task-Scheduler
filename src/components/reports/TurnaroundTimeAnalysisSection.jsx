import React from 'react';
import { Clock, Zap, ArrowUpRight, BarChart2, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import TatVsWtScatterChart from './TatVsWtScatterChart';

export function TurnaroundTimeAnalysisSection({ summary = {}, taskList = [] }) {
  const fastest = summary.fastestJob;
  const slowest = summary.slowestJob;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-terminal flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aegis-teal" />
          <span>4. Turnaround Time (TAT) Analysis</span>
        </h3>
        <span className="text-[11px] font-terminal text-aegis-muted">
          Normalized Penalty: <strong className="text-white">{summary.avgPenalty ?? '1.0'}× Burst</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-terminal text-xs">
        {/* Left 2 Columns: Scatter Chart */}
        <div className="lg:col-span-2">
          <TatVsWtScatterChart tasks={taskList} />
        </div>

        {/* Right Column: Turnaround Statistics & Job Extremes */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-aegis-card border border-aegis-border space-y-3">
            <span className="text-[10px] text-aegis-muted uppercase block font-semibold">
              Turnaround Time Metrics ($TAT = T_{finish} - T_{arrival}$)
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MIN TAT</span>
                <strong className="text-aegis-teal text-sm">{summary.minTat ?? 0} ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MEAN TAT</span>
                <strong className="text-aegis-indigo text-sm">{summary.avgTurnaroundTime ?? 0} ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MAX TAT</span>
                <strong className="text-status-amber text-sm">{summary.maxTat ?? 0} ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">AVG PENALTY</span>
                <strong className="text-white text-sm">{summary.avgPenalty ?? 1}×</strong>
              </div>
            </div>
          </div>

          {/* Fastest Completed Job */}
          {fastest && (
            <div className="p-3 rounded-xl bg-aegis-card border border-aegis-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-status-emerald uppercase font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Fastest Completed Job</span>
                </span>
                <span className="font-bold text-white text-xs mt-0.5 block">{fastest.id} • {fastest.name}</span>
              </div>
              <div className="text-right">
                <span className="text-status-emerald font-bold text-sm">{fastest.turnaroundTime} ms</span>
                <span className="text-[10px] text-aegis-subtle block">{fastest.penaltyRatio}x penalty</span>
              </div>
            </div>
          )}

          {/* Slowest Job */}
          {slowest && (
            <div className="p-3 rounded-xl bg-aegis-card border border-aegis-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-aegis-muted uppercase font-bold block">
                  Slowest Completed Job
                </span>
                <span className="font-bold text-white text-xs mt-0.5 block">{slowest.id} • {slowest.name}</span>
              </div>
              <div className="text-right">
                <span className="text-status-amber font-bold text-sm">{slowest.turnaroundTime} ms</span>
                <span className="text-[10px] text-aegis-subtle block">{slowest.penaltyRatio}x penalty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TurnaroundTimeAnalysisSection;

