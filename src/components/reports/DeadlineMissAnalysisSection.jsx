import React from 'react';
import { AlertTriangle, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function DeadlineMissAnalysisSection({ summary = {}, taskList = [] }) {
  const missedTasks = summary.missedTasks || [];
  const compliance = summary.deadlineCompliancePct ?? 100;

  return (
    <Card
      title="5. Real-Time Deadline Miss & SLA Compliance Analysis"
      subtitle="Evaluation of hard real-time scheduling constraints and lateness overshoots"
      icon={AlertTriangle}
      actions={
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-terminal font-semibold border',
            compliance >= 95
              ? 'bg-status-emerald/10 text-status-emerald border-status-emerald/30'
              : compliance >= 80
              ? 'bg-status-amber/10 text-status-amber border-status-amber/30'
              : 'bg-status-rose/10 text-status-rose border-status-rose/30'
          )}
        >
          {compliance >= 95 ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>{compliance}% SLA Compliance</span>
        </span>
      }
    >
      <div className="space-y-4 font-terminal text-xs">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">DEADLINES EVALUATED</span>
            <strong className="text-white text-base">{summary.deadlineCount || taskList.length}</strong>
            <span className="text-[10px] text-aegis-subtle block">Tasks with deadlines</span>
          </div>

          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">DEADLINES MET</span>
            <strong className="text-status-emerald text-base">{summary.deadlinesMet || 0}</strong>
            <span className="text-[10px] text-aegis-subtle block">Completed on schedule</span>
          </div>

          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">DEADLINE MISSES</span>
            <strong className={cn('text-base', missedTasks.length > 0 ? 'text-status-rose' : 'text-status-emerald')}>
              {summary.deadlineMissesCount || 0}
            </strong>
            <span className="text-[10px] text-aegis-subtle block">SLA breaches</span>
          </div>

          <div className="p-3 rounded-xl bg-aegis-sidebar border border-aegis-border">
            <span className="text-[10px] text-aegis-muted uppercase block">MAX LATENESS OVERSHOOT</span>
            <strong className="text-status-amber text-base">
              {summary.maxLateness > 0 ? `+${summary.maxLateness} ms` : '0 ms'}
            </strong>
            <span className="text-[10px] text-aegis-subtle block">Worst breach delay</span>
          </div>
        </div>

        {/* Breached Deadlines Table or Clean Pass Banner */}
        {missedTasks.length === 0 ? (
          <div className="p-4 rounded-xl bg-status-emerald/5 border border-status-emerald/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-status-emerald" />
              <div>
                <strong className="text-white font-semibold">Zero Deadline Misses Recorded</strong>
                <p className="text-aegis-muted text-[11px] mt-0.5">
                  All evaluated tasks completed execution strictly before their respective deadlines under this algorithm.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-status-emerald px-2 py-0.5 rounded bg-status-emerald/10 border border-status-emerald/30">
              100% SLA PASS
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-aegis-border">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-aegis-sidebar border-b border-aegis-border text-aegis-muted uppercase text-[10px]">
                  <th className="py-2.5 px-3">Breached Task</th>
                  <th className="py-2.5 px-3 text-right">Arrival</th>
                  <th className="py-2.5 px-3 text-right">Burst</th>
                  <th className="py-2.5 px-3 text-right">Finish Time</th>
                  <th className="py-2.5 px-3 text-right">Deadline Target</th>
                  <th className="py-2.5 px-3 text-right">Lateness Overshoot</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aegis-border/60">
                {missedTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-aegis-card-hover">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      <span className="text-status-rose font-bold mr-1.5">{t.id}</span>
                      <span>{t.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-muted">{t.arrivalTime} ms</td>
                    <td className="py-2.5 px-3 text-right text-white">{t.burstTime} ms</td>
                    <td className="py-2.5 px-3 text-right text-white font-bold">{t.finishTime} ms</td>
                    <td className="py-2.5 px-3 text-right text-aegis-subtle">{t.deadline} ms</td>
                    <td className="py-2.5 px-3 text-right text-status-rose font-bold">
                      +{t.lateness} ms
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-rose/10 text-status-rose border border-status-rose/30">
                        BREACHED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

export default DeadlineMissAnalysisSection;

