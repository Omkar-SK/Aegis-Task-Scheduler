import React from 'react';
import { CheckCircle2, Clock, Check } from 'lucide-react';
import Card from '../common/Card';
import { formatDuration } from '../../utils/formatters';

export function RecentlyExecutedTasks({ tasks = [], loading = false }) {
  const completedTasks = tasks.filter((t) => t.state === 'completed');

  if (loading) {
    return (
      <Card
        title="Recently Executed Tasks"
        subtitle="Completed process control blocks (PCBs) and turnaround metrics"
        icon={CheckCircle2}
      >
        <div className="h-48 w-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aegis-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Recently Executed Tasks"
      subtitle="Execution history, waiting times, and turnaround (TAT) latency"
      icon={CheckCircle2}
      actions={
        <span className="text-xs font-terminal text-status-emerald flex items-center gap-1 font-semibold">
          <Check className="w-3.5 h-3.5" />
          {completedTasks.length} Completed Total
        </span>
      }
    >
      {completedTasks.length === 0 ? (
        <div className="py-8 text-center text-aegis-muted font-terminal text-xs">
          No executed tasks yet. Start the simulation engine to begin processing tasks.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-terminal">
            <thead>
              <tr className="border-b border-aegis-border text-aegis-muted uppercase text-[10px] tracking-wider bg-aegis-sidebar/60">
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-3">Task Name</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Burst Time</th>
                <th className="py-2.5 px-3">Wait Time (WT)</th>
                <th className="py-2.5 px-3">Turnaround (TAT)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aegis-border/60">
              {completedTasks.slice(0, 6).map((task) => (
                <tr key={task.id} className="hover:bg-aegis-card-hover transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{task.id}</td>
                  <td className="py-2.5 px-3 text-aegis-teal font-medium truncate max-w-[180px]">
                    {task.name}
                  </td>
                  <td className="py-2.5 px-3 text-white font-semibold">
                    P{task.priority}
                  </td>
                  <td className="py-2.5 px-3 text-aegis-muted">
                    {formatDuration(task.burstTimeMs)}
                  </td>
                  <td className="py-2.5 px-3 text-status-amber">
                    {formatDuration(task.waitTimeMs)}
                  </td>
                  <td className="py-2.5 px-3 text-status-emerald font-semibold">
                    {formatDuration(task.turnaroundTimeMs || task.waitTimeMs + task.burstTimeMs)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-status-emerald/10 text-status-emerald border border-status-emerald/30">
                      COMPLETED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default RecentlyExecutedTasks;

