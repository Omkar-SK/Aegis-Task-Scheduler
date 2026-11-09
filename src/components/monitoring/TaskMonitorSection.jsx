import React, { useState } from 'react';
import {
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers,
  Cpu,
  BarChart2,
} from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import StatusBadge from './StatusBadge';
import { cn } from '../../utils/classNames';

export function TaskMonitorSection({ tasks = [] }) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'running' | 'ready' | 'completed' | 'missed'

  const runningTasks = tasks.filter((t) => t.state === 'running');
  const readyTasks = tasks.filter((t) => t.state === 'ready');
  const completedTasks = tasks.filter((t) => t.state === 'completed');
  const missedTasks = tasks.filter((t) => t.missedDeadline || (t.completionTime && t.deadline && t.completionTime > t.deadline));

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'running') return t.state === 'running';
    if (activeTab === 'ready') return t.state === 'ready';
    if (activeTab === 'completed') return t.state === 'completed';
    if (activeTab === 'missed') return t.missedDeadline || (t.completionTime && t.deadline && t.completionTime > t.deadline);
    return true;
  });

  return (
    <MonitoringCard
      sectionNumber="04"
      title="Task Monitor & Execution Lifecycle"
      subtitle="Comprehensive breakdown of running, queued, completed, and deadline-breached workloads"
      icon={Layers}
      isLive
      actions={
        <div className="inline-flex rounded-lg bg-aegis-sidebar p-0.5 border border-aegis-border text-xs font-terminal">
          <button
            onClick={() => setActiveTab('ALL')}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              activeTab === 'ALL'
                ? 'bg-aegis-card text-white font-semibold'
                : 'text-aegis-muted hover:text-white'
            )}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('running')}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              activeTab === 'running'
                ? 'bg-aegis-card text-aegis-teal font-semibold'
                : 'text-aegis-muted hover:text-white'
            )}
          >
            Running ({runningTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              activeTab === 'ready'
                ? 'bg-aegis-card text-aegis-indigo font-semibold'
                : 'text-aegis-muted hover:text-white'
            )}
          >
            Pending ({readyTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              activeTab === 'completed'
                ? 'bg-aegis-card text-status-emerald font-semibold'
                : 'text-aegis-muted hover:text-white'
            )}
          >
            Completed ({completedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('missed')}
            className={cn(
              'px-2.5 py-1 rounded transition-colors',
              activeTab === 'missed'
                ? 'bg-aegis-card text-status-rose font-semibold'
                : 'text-aegis-muted hover:text-white'
            )}
          >
            Missed ({missedTasks.length})
          </button>
        </div>
      }
    >
      <div className="space-y-4 font-terminal">
        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Running */}
          <div className="p-3 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-aegis-muted uppercase block">Running Tasks</span>
              <span className="text-lg font-bold text-aegis-teal">{runningTasks.length}</span>
              <span className="text-[10px] text-aegis-subtle block">Executing on cores</span>
            </div>
            <div className="p-2 rounded-lg bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Pending / Ready */}
          <div className="p-3 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-aegis-muted uppercase block">Pending Tasks</span>
              <span className="text-lg font-bold text-aegis-indigo">{readyTasks.length}</span>
              <span className="text-[10px] text-aegis-subtle block">Awaiting time slice</span>
            </div>
            <div className="p-2 rounded-lg bg-aegis-indigo/10 text-aegis-indigo border border-aegis-indigo/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Completed */}
          <div className="p-3 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-aegis-muted uppercase block">Completed Tasks</span>
              <span className="text-lg font-bold text-status-emerald">{completedTasks.length}</span>
              <span className="text-[10px] text-aegis-subtle block">Turnaround recorded</span>
            </div>
            <div className="p-2 rounded-lg bg-status-emerald/10 text-status-emerald border border-status-emerald/30">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Missed Deadlines */}
          <div className="p-3 rounded-xl bg-aegis-sidebar/80 border border-aegis-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-aegis-muted uppercase block">Missed Deadlines</span>
              <span
                className={cn(
                  'text-lg font-bold',
                  missedTasks.length > 0 ? 'text-status-rose' : 'text-status-emerald'
                )}
              >
                {missedTasks.length}
              </span>
              <span className="text-[10px] text-aegis-subtle block">
                {missedTasks.length === 0 ? '100% SLA compliance' : 'SLA deadline penalty'}
              </span>
            </div>
            <div
              className={cn(
                'p-2 rounded-lg border',
                missedTasks.length > 0
                  ? 'bg-status-rose/10 text-status-rose border-status-rose/30'
                  : 'bg-status-emerald/10 text-status-emerald border-status-emerald/30'
              )}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filtered Tasks Table */}
        <div className="overflow-x-auto rounded-xl border border-aegis-border/80">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-aegis-sidebar border-b border-aegis-border text-aegis-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Task Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Base Priority</th>
                <th className="py-2.5 px-3 text-right">Burst / Remaining</th>
                <th className="py-2.5 px-3 text-right">Assigned Core</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aegis-border/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-aegis-muted">
                    No tasks found in category &quot;{activeTab}&quot;.
                  </td>
                </tr>
              ) : (
                filteredTasks.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-aegis-card-hover transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">
                      <span className="px-1.5 py-0.5 rounded bg-aegis-card border border-aegis-border">
                        {t.id}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white font-medium truncate max-w-[180px]">
                      {t.name}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-aegis-muted">
                      {t.type || 'CPU-Bound'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-indigo font-bold">
                      {t.priority ?? 5}
                    </td>
                    <td className="py-2.5 px-3 text-right text-white">
                      {t.remainingTimeMs ?? t.burstTimeMs} / {t.burstTimeMs} ms
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-teal">
                      {t.assignedCore !== null && t.assignedCore !== undefined
                        ? `Core ${t.assignedCore}`
                        : 'Unassigned'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={t.state} type="task" size="xs" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MonitoringCard>
  );
}

export default TaskMonitorSection;

