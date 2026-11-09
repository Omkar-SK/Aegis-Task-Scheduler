import React from 'react';
import { Layers, AlertTriangle, CheckCircle, Clock, Play } from 'lucide-react';
import Card from '../common/Card';
import StatusDot from '../common/StatusDot';
import { formatDuration } from '../../utils/formatters';

export function SimulatorTaskQueue({ tasks = [], runningTaskId = null }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'running':
        return 'bg-aegis-teal/15 text-aegis-teal border-aegis-teal/40 font-bold';
      case 'ready':
        return 'bg-status-sky/15 text-status-sky border-status-sky/40';
      case 'completed':
        return 'bg-status-emerald/15 text-status-emerald border-status-emerald/40';
      case 'waiting':
      default:
        return 'bg-aegis-sidebar text-aegis-subtle border-aegis-border';
    }
  };

  return (
    <Card
      title="Simulator Task Queue"
      subtitle="Dynamic Process Control Block state tracking remaining execution bursts and deadlines"
      icon={Layers}
      actions={
        <span className="text-xs font-terminal text-aegis-muted">
          Active Registry: <strong className="text-white">{tasks.length} tasks</strong>
        </span>
      }
    >
      <div className="overflow-x-auto rounded-lg border border-aegis-border bg-aegis-bg">
        <table className="w-full text-left text-xs font-terminal">
          <thead>
            <tr className="border-b border-aegis-border text-aegis-muted uppercase text-[10px] tracking-wider bg-aegis-sidebar/80">
              <th className="py-2.5 px-3">Task ID</th>
              <th className="py-2.5 px-3">Task Name</th>
              <th className="py-2.5 px-3">Arrival Time</th>
              <th className="py-2.5 px-3">Burst Time</th>
              <th className="py-2.5 px-3">Remaining Time</th>
              <th className="py-2.5 px-3">Deadline</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aegis-border/60">
            {tasks.map((task) => {
              const isExecuting = task.id === runningTaskId;
              const isUrgent =
                task.status !== 'completed' &&
                task.deadline &&
                task.remainingTime !== undefined &&
                task.deadline - task.remainingTime < 25;

              return (
                <tr
                  key={task.id}
                  className={`transition-colors ${
                    isExecuting
                      ? 'bg-aegis-teal/10 hover:bg-aegis-teal/15'
                      : 'hover:bg-aegis-card-hover'
                  }`}
                >
                  {/* Task ID with Color Indicator */}
                  <td className="py-2.5 px-3 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: task.color || '#18C6A3' }}
                      />
                      <span style={{ color: task.color || '#ffffff' }}>{task.id}</span>
                    </div>
                  </td>

                  {/* Task Name */}
                  <td className="py-2.5 px-3 text-white font-medium truncate max-w-[170px]">
                    {task.name}
                  </td>

                  {/* Arrival Time */}
                  <td className="py-2.5 px-3 text-aegis-muted">
                    {formatDuration(task.arrivalTime ?? 0)}
                  </td>

                  {/* Burst Time */}
                  <td className="py-2.5 px-3 text-white">
                    {formatDuration(task.burstTimeMs)}
                  </td>

                  {/* Remaining Time with Mini Progress Bar */}
                  <td className="py-2.5 px-3">
                    <div className="space-y-1 min-w-[100px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={
                            task.remainingTime === 0
                              ? 'text-status-emerald font-semibold'
                              : isExecuting
                              ? 'text-aegis-teal font-bold'
                              : 'text-white'
                          }
                        >
                          {formatDuration(task.remainingTime ?? task.burstTimeMs)}
                        </span>
                        <span className="text-[10px] text-aegis-subtle">
                          {task.progress ?? 0}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-aegis-sidebar rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-150"
                          style={{
                            width: `${task.progress ?? 0}%`,
                            backgroundColor: task.color || '#18C6A3',
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className={isUrgent ? 'text-status-rose font-bold' : 'text-aegis-muted'}>
                        {formatDuration(task.deadline ?? 100)}
                      </span>
                      {isUrgent && (
                        <AlertTriangle className="w-3.5 h-3.5 text-status-rose" title="SLA deadline tight" />
                      )}
                    </div>
                  </td>

                  {/* Current Status */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <StatusDot state={task.status} size="sm" pulse={task.status === 'running'} />
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase border ${getStatusBadge(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default SimulatorTaskQueue;

