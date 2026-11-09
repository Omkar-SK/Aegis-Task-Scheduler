import React from 'react';
import {
  Trophy,
  AlertTriangle,
  Clock,
  Zap,
  ShieldAlert,
  ArrowUp,
  Layers,
  CheckCircle,
} from 'lucide-react';
import Card from '../common/Card';
import StatusDot from '../common/StatusDot';

export function PriorityRankingList({
  rankedTasks = [],
  weights,
  currentTime,
}) {
  const highestPriorityTask = rankedTasks.find((t) => t.status !== 'completed') || rankedTasks[0];

  return (
    <div className="space-y-4">
      {/* Highest Priority Task Arbitration Indicator */}
      {highestPriorityTask && (
        <div className="p-4 rounded-xl border border-aegis-teal/50 bg-gradient-to-r from-aegis-card via-aegis-sidebar to-aegis-card shadow-glow-teal flex flex-col md:flex-row md:items-center justify-between gap-4 font-terminal">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-aegis-teal/20 border border-aegis-teal/40 text-aegis-teal shrink-0">
              <Trophy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-aegis-teal font-bold px-2 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/30">
                  Highest-Priority Task (Next CPU Grant)
                </span>
                <span className="text-xs text-white font-bold">{highestPriorityTask.taskId}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 font-sans">
                {highestPriorityTask.taskName}
              </h4>
              <p className="text-[11px] text-aegis-muted mt-0.5 font-sans">
                Dominant factor:{' '}
                {highestPriorityTask.deadlineUrgency >= highestPriorityTask.waitingScore &&
                highestPriorityTask.deadlineUrgency >= highestPriorityTask.cpuFavorScore
                  ? `Deadline Urgency (${Math.round(highestPriorityTask.deadlineUrgency * 100)}%) — Slack: ${highestPriorityTask.slack}ms`
                  : highestPriorityTask.waitingScore >= highestPriorityTask.cpuFavorScore
                  ? `Queue Latency (${Math.round(highestPriorityTask.waitingScore * 100)}%) — Waited: ${highestPriorityTask.currentWait}ms`
                  : `CPU Favor (${Math.round(highestPriorityTask.cpuFavorScore * 100)}%) — Minimal Core Consumption`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-aegis-subtle block">Composite Score</span>
              <span className="text-2xl font-bold text-aegis-teal">
                {highestPriorityTask.compositePriority.toFixed(3)}
              </span>
            </div>
            <div className="h-8 w-px bg-aegis-border" />
            <div className="text-xs space-y-0.5 text-aegis-muted">
              <div>Urg: <strong className="text-white">{highestPriorityTask.deadlineUrgency}</strong></div>
              <div>Wait: <strong className="text-white">{highestPriorityTask.waitingScore}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Task Ranking Leaderboard & Visual Factor Bars */}
      <Card
        title="Dynamic Task Priority Ranking & Factor Breakdown"
        subtitle="Real-time multi-factor prioritization under active Aegis coefficients"
        icon={Layers}
        actions={
          <div className="flex items-center gap-4 text-xs font-terminal">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-aegis-teal" />
              <span className="text-aegis-muted">Deadline Urgency ({Math.round(weights.deadline * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-aegis-indigo" />
              <span className="text-aegis-muted">Waiting Score ({Math.round(weights.wait * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-status-sky" />
              <span className="text-aegis-muted">CPU Favor ({Math.round(weights.cpu * 100)}%)</span>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-aegis-border bg-aegis-bg">
          <table className="w-full text-left text-xs font-terminal">
            <thead>
              <tr className="border-b border-aegis-border text-aegis-muted uppercase text-[10px] tracking-wider bg-aegis-sidebar/80">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Task Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 min-w-[200px]">Visual Priority Composition</th>
                <th className="py-2.5 px-3">Factor Breakdown</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 px-3 text-right">Warnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aegis-border/60">
              {rankedTasks.map((task, idx) => {
                const isWinner = idx === 0 && task.status !== 'completed';
                const dContributionPct = Math.round(task.breakdown.deadlineContribution * 100);
                const wContributionPct = Math.round(task.breakdown.waitContribution * 100);
                const cContributionPct = Math.round(task.breakdown.cpuContribution * 100);

                return (
                  <tr
                    key={task.taskId}
                    className={`transition-colors ${
                      isWinner
                        ? 'bg-aegis-teal/5 hover:bg-aegis-teal/10'
                        : 'hover:bg-aegis-card-hover'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-2.5 px-3 font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          idx === 0
                            ? 'bg-aegis-teal text-aegis-bg font-black shadow-glow-teal'
                            : idx === 1
                            ? 'bg-aegis-indigo/20 text-aegis-indigo border border-aegis-indigo/40'
                            : 'bg-aegis-sidebar text-aegis-muted'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Task ID with color */}
                    <td className="py-2.5 px-3 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: task.color || '#18C6A3' }}
                        />
                        <span style={{ color: task.color || '#ffffff' }}>{task.taskId}</span>
                      </div>
                    </td>

                    {/* Task Name */}
                    <td className="py-2.5 px-3 text-white font-medium truncate max-w-[150px]">
                      {task.taskName}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          task.status === 'running'
                            ? 'bg-aegis-teal/15 text-aegis-teal border border-aegis-teal/30'
                            : task.status === 'completed'
                            ? 'bg-status-emerald/15 text-status-emerald border border-status-emerald/30'
                            : task.status === 'ready'
                            ? 'bg-status-sky/15 text-status-sky border border-status-sky/30'
                            : 'bg-aegis-sidebar text-aegis-subtle border border-aegis-border'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    {/* Visual Segmented Priority Bar */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <div className="w-full h-3 bg-aegis-sidebar rounded-full overflow-hidden flex border border-aegis-border">
                          {/* Segment 1: Deadline Urgency */}
                          <div
                            className="h-full bg-aegis-teal transition-all duration-200"
                            style={{ width: `${dContributionPct}%` }}
                            title={`Deadline Urgency Contribution: +${task.breakdown.deadlineContribution}`}
                          />
                          {/* Segment 2: Waiting Score */}
                          <div
                            className="h-full bg-aegis-indigo transition-all duration-200"
                            style={{ width: `${wContributionPct}%` }}
                            title={`Waiting Time Contribution: +${task.breakdown.waitContribution}`}
                          />
                          {/* Segment 3: CPU Favor */}
                          <div
                            className="h-full bg-status-sky transition-all duration-200"
                            style={{ width: `${cContributionPct}%` }}
                            title={`CPU Favor Contribution: +${task.breakdown.cpuContribution}`}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-aegis-subtle font-mono">
                          <span className="text-aegis-teal">U: {(task.deadlineUrgency * 100).toFixed(0)}%</span>
                          <span className="text-aegis-indigo">W: {(task.waitingScore * 100).toFixed(0)}%</span>
                          <span className="text-status-sky">C: {(task.cpuFavorScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </td>

                    {/* Factor Breakdown Text */}
                    <td className="py-2.5 px-3 text-[10px] text-aegis-muted font-mono whitespace-nowrap">
                      <span>D: {task.breakdown.deadlineContribution}</span>
                      <span className="mx-1 text-aegis-border">|</span>
                      <span>W: {task.breakdown.waitContribution}</span>
                      <span className="mx-1 text-aegis-border">|</span>
                      <span>C: {task.breakdown.cpuContribution}</span>
                    </td>

                    {/* Composite Score */}
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`text-sm font-bold ${
                          isWinner ? 'text-aegis-teal' : 'text-white'
                        }`}
                      >
                        {task.compositePriority.toFixed(3)}
                      </span>
                    </td>

                    {/* Warnings (Deadline & Starvation) */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {task.isDeadlineApproaching && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-status-amber/15 text-status-amber border border-status-amber/40 animate-pulse font-semibold"
                            title={`Approaching Deadline! Slack: ${task.slack}ms remaining`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Urgent ({task.slack}ms)
                          </span>
                        )}

                        {task.isDeadlineMissed && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-status-rose/15 text-status-rose border border-status-rose/40 font-semibold"
                            title="Task has exceeded its scheduled deadline!"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            Missed SLA
                          </span>
                        )}

                        {task.isStarving && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-status-rose/15 text-status-rose border border-status-rose/40 font-semibold"
                            title={`Starvation Warning! Waited in ready queue for ${task.currentWait}ms`}
                          >
                            <Clock className="w-3 h-3" />
                            Starved ({task.currentWait}ms)
                          </span>
                        )}

                        {!task.isDeadlineApproaching &&
                          !task.isDeadlineMissed &&
                          !task.isStarving &&
                          task.status !== 'completed' && (
                            <span className="text-[10px] text-status-emerald font-semibold">
                              Nominal
                            </span>
                          )}

                        {task.status === 'completed' && (
                          <span className="text-[10px] text-aegis-subtle">
                            Finished
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default PriorityRankingList;

