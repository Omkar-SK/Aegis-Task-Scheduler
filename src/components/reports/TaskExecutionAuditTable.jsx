import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function TaskExecutionAuditTable({ tasks = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deadlineFilter, setDeadlineFilter] = useState('ALL'); // 'ALL' | 'MET' | 'MISSED'
  const [sortBy, setSortBy] = useState('id'); // 'id' | 'waitingTime' | 'turnaroundTime' | 'burstTime' | 'penalty'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (deadlineFilter === 'MET') return !t.missedDeadline;
        if (deadlineFilter === 'MISSED') return t.missedDeadline;
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'penalty') {
          valA = a.burstTime > 0 ? a.turnaroundTime / a.burstTime : 1;
          valB = b.burstTime > 0 ? b.turnaroundTime / b.burstTime : 1;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [tasks, searchQuery, deadlineFilter, sortBy, sortOrder]);

  return (
    <Card
      title="Task Execution Trace Audit Log"
      subtitle="Exhaustive task turnaround time, waiting time, and deadline compliance log"
      icon={FileText}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-aegis-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-aegis-sidebar border border-aegis-border rounded-lg text-xs font-terminal text-white placeholder-aegis-muted focus:outline-none focus:border-aegis-teal w-40"
            />
          </div>

          {/* Deadline Filter */}
          <div className="inline-flex rounded-lg bg-aegis-sidebar p-0.5 border border-aegis-border text-xs font-terminal">
            <button
              onClick={() => setDeadlineFilter('ALL')}
              className={cn(
                'px-2 py-0.5 rounded transition-colors',
                deadlineFilter === 'ALL'
                  ? 'bg-aegis-card text-white font-semibold'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              All
            </button>
            <button
              onClick={() => setDeadlineFilter('MET')}
              className={cn(
                'px-2 py-0.5 rounded transition-colors',
                deadlineFilter === 'MET'
                  ? 'bg-aegis-card text-aegis-teal font-semibold'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              Met
            </button>
            <button
              onClick={() => setDeadlineFilter('MISSED')}
              className={cn(
                'px-2 py-0.5 rounded transition-colors',
                deadlineFilter === 'MISSED'
                  ? 'bg-aegis-card text-status-rose font-semibold'
                  : 'text-aegis-muted hover:text-white'
              )}
            >
              Missed
            </button>
          </div>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-terminal">
          <thead>
            <tr className="border-b border-aegis-border text-aegis-muted uppercase text-[10px]">
              <th
                onClick={() => handleSort('id')}
                className="py-2.5 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Task ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3 text-right">Arrival</th>
              <th
                onClick={() => handleSort('burstTime')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Burst</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Finish</th>
              <th
                onClick={() => handleSort('waitingTime')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Wait (WT)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('turnaroundTime')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Turnaround (TAT)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('penalty')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Penalty (TAT/B)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Deadline</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aegis-border/60">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-aegis-muted">
                  No tasks match the filter criteria.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const penalty =
                  task.burstTime > 0
                    ? (task.turnaroundTime / task.burstTime).toFixed(2)
                    : '1.00';
                const isMissed = task.missedDeadline;

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-aegis-card-hover transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-white">
                      <span className="px-1.5 py-0.5 rounded bg-aegis-card border border-aegis-border">
                        {task.id}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-aegis-text-dim truncate max-w-[140px]">
                      {task.name}
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-muted">
                      {task.arrivalTime} ms
                    </td>
                    <td className="py-2.5 px-3 text-right text-white font-medium">
                      {task.burstTime} ms
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-muted">
                      {task.finishTime ?? task.arrivalTime + task.turnaroundTime} ms
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-teal font-semibold">
                      {task.waitingTime} ms
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-indigo font-semibold">
                      {task.turnaroundTime} ms
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded font-semibold text-[10px]',
                          Number(penalty) > 3.0
                            ? 'bg-status-amber/15 text-status-amber border border-status-amber/30'
                            : 'text-aegis-muted'
                        )}
                      >
                        {penalty}x
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-aegis-subtle">
                      {task.deadline ? `${task.deadline} ms` : 'None'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
                          isMissed
                            ? 'bg-status-rose/10 text-status-rose border border-status-rose/30'
                            : 'bg-status-emerald/10 text-status-emerald border border-status-emerald/30'
                        )}
                      >
                        {isMissed ? (
                          <>
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Missed</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-2.5 h-2.5" />
                            <span>Met</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TaskExecutionAuditTable;

