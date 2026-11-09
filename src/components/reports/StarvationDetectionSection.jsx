import React from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function StarvationDetectionSection({ summary = {}, taskList = [] }) {
  const threshold = summary.starvationThresholdMs || 40;
  const starvedTasks = summary.starvedTasks || [];
  const agingBoosts = summary.agingBoostsCount || 0;

  return (
    <Card
      title="8. Starvation Detection & Aging Summary"
      subtitle="Evaluation of bounded waiting latency and dynamic priority aging mechanisms"
      icon={ShieldAlert}
      actions={
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-terminal font-semibold border',
            starvedTasks.length === 0
              ? 'bg-status-emerald/10 text-status-emerald border-status-emerald/30'
              : 'bg-status-amber/10 text-status-amber border-status-amber/30'
          )}
        >
          {starvedTasks.length === 0 ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>{starvedTasks.length} Starvation Breaches</span>
        </span>
      }
    >
      <div className="space-y-4 font-terminal text-xs">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">STARVATION THRESHOLD</span>
            <strong className="text-white text-base">{threshold} ms</strong>
            <span className="text-[10px] text-aegis-subtle block">Max acceptable queue latency</span>
          </div>

          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">STARVED TASKS COUNT</span>
            <strong className={cn('text-base', starvedTasks.length > 0 ? 'text-status-amber' : 'text-status-emerald')}>
              {starvedTasks.length}
            </strong>
            <span className="text-[10px] text-aegis-subtle block">
              {starvedTasks.length === 0 ? 'Zero unbounded starvation' : 'Prolonged wait detected'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">AGING INTERVENTIONS</span>
            <strong className="text-aegis-teal text-base">{agingBoosts}</strong>
            <span className="text-[10px] text-aegis-subtle block">Dynamic priority boosts</span>
          </div>

          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">MAX RECORDED QUEUE DELAY</span>
            <strong className="text-aegis-indigo text-base">{summary.maxWait || 0} ms</strong>
            <span className="text-[10px] text-aegis-subtle block">Worst-case queue dwell</span>
          </div>
        </div>

        {/* Status Callout Banner */}
        {starvedTasks.length === 0 ? (
          <div className="p-4 rounded-xl bg-status-emerald/5 border border-status-emerald/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-status-emerald shrink-0" />
              <div>
                <strong className="text-white font-semibold">Bounded Queue Latency Guaranteed</strong>
                <p className="text-aegis-muted text-[11px] mt-0.5">
                  No task in this workload waited beyond {threshold} ms in the ready queue. Under Aegis Adaptive,
                  the aging coefficient strictly increases dynamic priority over time, preventing lower-priority tasks
                  from being starved by incoming short bursts.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-status-emerald px-2 py-0.5 rounded bg-status-emerald/10 border border-status-emerald/30 whitespace-nowrap">
              ZERO STARVATION
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-status-amber/10 border border-status-amber/30 space-y-2">
            <div className="flex items-center gap-2 text-status-amber font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Prolonged Queue Latency Warnings (Wait &gt; {threshold} ms):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {starvedTasks.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-aegis-card border border-aegis-border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{t.id}</span>
                    <span className="text-aegis-muted text-[11px] block">{t.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-status-amber font-bold">{t.waitingTime} ms wait</span>
                    <span className="text-[10px] text-status-rose block">+{t.waitingTime - threshold}ms over threshold</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default StarvationDetectionSection;

