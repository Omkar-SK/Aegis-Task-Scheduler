import React from 'react';
import { Search, Filter, ArrowUpDown, X, ArrowUp, ArrowDown } from 'lucide-react';

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  sortDirection,
  onToggleSortDirection,
  statusCounts = {},
  totalCount = 0,
}) {
  const statusOptions = [
    { key: 'ALL', label: 'All Tasks', count: totalCount },
    { key: 'READY', label: 'Ready', count: statusCounts.ready || 0 },
    { key: 'RUNNING', label: 'Running', count: statusCounts.running || 0 },
    { key: 'WAITING', label: 'Blocked / I/O', count: statusCounts.waiting || 0 },
    { key: 'COMPLETED', label: 'Completed', count: statusCounts.completed || 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Row: Search & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-aegis-subtle" />
          <input
            type="text"
            placeholder="Search tasks by PID (e.g. T-1001) or binary name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-aegis-sidebar border border-aegis-border rounded-lg text-xs text-white font-terminal placeholder:text-aegis-subtle focus:outline-none focus:border-aegis-teal transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-aegis-subtle hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-aegis-muted font-terminal">
            <ArrowUpDown className="w-3.5 h-3.5 text-aegis-teal" />
            <span>Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-aegis-sidebar border border-aegis-border rounded-lg px-2.5 py-1.5 text-xs text-white font-terminal focus:outline-none focus:border-aegis-teal cursor-pointer"
          >
            <option value="arrivalTime">Arrival Time</option>
            <option value="burstTimeMs">Burst Time</option>
            <option value="deadline">Deadline</option>
            <option value="priority">Base Priority</option>
            <option value="id">Task ID (PID)</option>
          </select>

          <button
            onClick={onToggleSortDirection}
            title={sortDirection === 'asc' ? 'Ascending (Click for Descending)' : 'Descending (Click for Ascending)'}
            className="p-1.5 rounded-lg bg-aegis-sidebar border border-aegis-border text-aegis-muted hover:text-white hover:border-aegis-teal transition-colors"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-4 h-4 text-aegis-teal" />
            ) : (
              <ArrowDown className="w-4 h-4 text-aegis-indigo" />
            )}
          </button>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onStatusChange(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-terminal transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-aegis-teal/15 text-aegis-teal border-aegis-teal/40 font-semibold shadow-glow-teal'
                  : 'bg-aegis-sidebar text-aegis-muted border-aegis-border hover:text-white hover:bg-aegis-card'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-aegis-teal text-aegis-bg font-bold'
                    : 'bg-aegis-card text-aegis-subtle'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TaskFilters;

