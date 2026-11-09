import React from 'react';
import { Clock, AlertTriangle, CheckCircle, BarChart3, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import LatencyDistributionChart from './LatencyDistributionChart';

export function WaitingTimeAnalysisSection({ summary = {}, taskList = [] }) {
  const longestTask = summary.longestWaitingTask;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-terminal flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aegis-teal" />
          <span>3. Waiting Time (WT) Analysis</span>
        </h3>
        <span className="text-[11px] font-terminal text-aegis-muted">
          Ready Queue Latency Metrics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-terminal text-xs">
        {/* Left Column: 4 Stat KPI boxes */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-aegis-card border border-aegis-border space-y-3">
            <span className="text-[10px] text-aegis-muted uppercase block font-semibold">
              Waiting Time Statistical Breakdown
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MIN WAIT</span>
                <strong className="text-status-emerald text-sm">{summary.minWait ?? 0} ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MEDIAN WAIT</span>
                <strong className="text-aegis-teal text-sm">{summary.medianWait ?? 0} ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MEAN WAIT</span>
                <strong className="text-aegis-indigo text-sm">{summary.avgWaitTime ?? 0} ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border">
                <span className="text-[10px] text-aegis-subtle block">MAX WAIT</span>
                <strong className="text-status-amber text-sm">{summary.maxWait ?? 0} ms</strong>
              </div>
            </div>
          </div>

          {/* Longest Waiting Task Callout Card */}
          {longestTask && (
            <div className="p-3.5 rounded-xl bg-aegis-card border border-aegis-border space-y-2">
              <span className="text-[10px] text-status-amber uppercase block font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Longest Waiting Job Detected</span>
              </span>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs">{longestTask.id}</span>
                  <p className="text-[11px] text-aegis-muted truncate max-w-[150px]">{longestTask.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-status-amber font-bold text-sm">{longestTask.waitingTime} ms</span>
                  <span className="text-[10px] text-aegis-subtle block">in ready queue</span>
                </div>
              </div>

              <div className="text-[10px] text-aegis-subtle pt-1 border-t border-aegis-border/60 flex items-center justify-between">
                <span>Burst: {longestTask.burstTime}ms</span>
                <span>TAT: {longestTask.turnaroundTime}ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Latency Distribution Histogram */}
        <div className="lg:col-span-2">
          <LatencyDistributionChart tasks={taskList} />
        </div>
      </div>
    </div>
  );
}

export default WaitingTimeAnalysisSection;

