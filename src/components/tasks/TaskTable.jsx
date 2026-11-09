import React from 'react';
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle,
} from 'lucide-react';
import StatusDot from '../common/StatusDot';
import { formatDuration } from '../../utils/formatters';

export function TaskTable({
  tasks = [],
  sortBy,
  sortDirection,
  onSortChange,
  onEditTask,
  onDeleteTask,
}) {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-aegis-subtle inline ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-aegis-teal inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-aegis-indigo inline ml-1" />
    );
  };

  const getPriorityBadge = (priority) => {
    if (priority >= 9) {
      return 'bg-status-rose/15 text-status-rose border-status-rose/30';
    }
    if (priority >= 7) {
      return 'bg-aegis-teal/15 text-aegis-teal border-aegis-teal/30';
    }
    if (priority >= 4) {
      return 'bg-aegis-indigo/15 text-aegis-indigo border-aegis-indigo/30';
    }
    return 'bg-aegis-sidebar text-aegis-muted border-aegis-border';
  };

  const getStatusBadge = (state) => {
    switch (state) {
      case 'running':
        return 'bg-aegis-teal/15 text-aegis-teal border-aegis-teal/30';
      case 'ready':
        return 'bg-status-sky/15 text-status-sky border-status-sky/30';
      case 'waiting':
        return 'bg-status-amber/15 text-status-amber border-status-amber/30';
      case 'completed':
        return 'bg-status-emerald/15 text-status-emerald border-status-emerald/30';
      default:
        return 'bg-aegis-sidebar text-aegis-muted border-aegis-border';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-aegis-border bg-aegis-card">
      <table className="w-full text-left text-xs font-terminal">
        <thead>
          <tr className="border-b border-aegis-border text-aegis-muted uppercase text-[10px] tracking-wider bg-aegis-sidebar/80 select-none">
            {/* Task ID */}
            <th
              onClick={() => onSortChange('id')}
              className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              Task ID {renderSortIndicator('id')}
            </th>

            {/* Task Name */}
            <th className="py-3 px-4">Task Name</th>

            {/* Arrival Time */}
            <th
              onClick={() => onSortChange('arrivalTime')}
              className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              Arrival Time {renderSortIndicator('arrivalTime')}
            </th>

            {/* Burst Time */}
            <th
              onClick={() => onSortChange('burstTimeMs')}
              className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              Burst Time {renderSortIndicator('burstTimeMs')}
            </th>

            {/* Deadline */}
            <th
              onClick={() => onSortChange('deadline')}
              className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              Deadline {renderSortIndicator('deadline')}
            </th>

            {/* Base Priority */}
            <th
              onClick={() => onSortChange('priority')}
              className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              Base Priority {renderSortIndicator('priority')}
            </th>

            {/* Status */}
            <th className="py-3 px-4">Status</th>

            {/* Actions */}
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-aegis-border/60">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-aegis-muted">
                <Layers className="w-8 h-8 text-aegis-subtle mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-white">No tasks in current queue view</p>
                <p className="text-xs text-aegis-subtle mt-1">
                  Adjust your search / status filter, or load a predefined workload preset above.
                </p>
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const isUrgent =
                task.deadline && task.burstTimeMs && task.deadline - task.burstTimeMs < 20;

              return (
                <tr key={task.id} className="hover:bg-aegis-card-hover transition-colors">
                  {/* Task ID */}
                  <td className="py-3 px-4 font-bold text-white tracking-tight">
                    {task.id}
                  </td>

                  {/* Task Name & Type */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-aegis-teal truncate max-w-[200px]" title={task.name}>
                      {task.name}
                    </div>
                    {task.type && (
                      <span className="text-[10px] text-aegis-subtle font-sans">
                        {task.type}
                      </span>
                    )}
                  </td>

                  {/* Arrival Time */}
                  <td className="py-3 px-4 text-white">
                    {formatDuration(task.arrivalTime ?? 0)}
                  </td>

                  {/* Burst Time */}
                  <td className="py-3 px-4">
                    <div className="text-white font-semibold">
                      {formatDuration(task.burstTimeMs)}
                    </div>
                    {task.state === 'running' && task.remainingTimeMs !== undefined && (
                      <div className="text-[10px] text-aegis-muted mt-0.5">
                        Rem: {formatDuration(task.remainingTimeMs)}
                      </div>
                    )}
                  </td>

                  {/* Deadline */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={
                          isUrgent ? 'text-status-rose font-bold' : 'text-white'
                        }
                      >
                        {formatDuration(task.deadline ?? 100)}
                      </span>
                      {isUrgent && (
                        <span title="Tight deadline SLA constraint">
                          <AlertTriangle className="w-3.5 h-3.5 text-status-rose" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Base Priority */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      P{task.priority || 5}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <StatusDot state={task.state} size="sm" pulse={task.state === 'running'} />
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(
                          task.state
                        )}`}
                      >
                        {task.state}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditTask(task)}
                        title="Edit Task attributes"
                        className="p-1.5 rounded-lg text-aegis-muted hover:text-white hover:bg-aegis-sidebar border border-transparent hover:border-aegis-border transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteTask(task)}
                        title="Delete Process Control Block"
                        className="p-1.5 rounded-lg text-aegis-muted hover:text-status-rose hover:bg-status-rose/10 border border-transparent hover:border-status-rose/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskTable;

