import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { GitCompare, Award, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../utils/classNames';

export function AlgorithmComparisonSection({
  allResults = [],
  selectedAlgoId,
  bestPerformers = {},
}) {
  const chartData = allResults.map((r) => ({
    name: r.shortName,
    avgWaitTime: r.avgWaitTime,
    avgTurnaroundTime: r.avgTurnaroundTime,
    contextSwitches: r.contextSwitches,
    deadlineMisses: r.deadlineMisses,
  }));

  return (
    <Card
      title="2. Algorithm-Wise Comparative Performance Benchmark"
      subtitle="Evaluation of all 4 scheduling algorithms under strictly identical workload inputs"
      icon={GitCompare}
    >
      <div className="space-y-6 font-terminal text-xs">
        {/* Grouped Comparison Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-aegis-muted">
            <span>Average Waiting Time & Turnaround Time across Policies (Lower is Better):</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={{ stroke: '#202C40' }}
                />
                <YAxis
                  stroke="#64748B"
                  tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={{ stroke: '#202C40' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-aegis-border bg-aegis-card p-3 shadow-2xl font-terminal text-xs">
                          <div className="text-white font-bold pb-1 mb-1.5 border-b border-aegis-border">
                            Algorithm: <span className="text-aegis-teal">{label}</span>
                          </div>
                          {payload.map((p) => (
                            <div key={p.dataKey} className="flex justify-between gap-4 py-0.5">
                              <span className="text-aegis-muted">{p.name}:</span>
                              <strong style={{ color: p.color }}>{p.value}</strong>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '8px' }}
                />
                <Bar dataKey="avgWaitTime" name="Avg Waiting Time (ms)" fill="#18C6A3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgTurnaroundTime" name="Avg Turnaround (ms)" fill="#7C8CFF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="contextSwitches" name="Context Switches" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-aegis-border/80">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-aegis-sidebar border-b border-aegis-border text-aegis-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Scheduling Policy</th>
                <th className="py-2.5 px-3 text-right">Avg Wait Time</th>
                <th className="py-2.5 px-3 text-right">Avg Turnaround</th>
                <th className="py-2.5 px-3 text-right">Throughput</th>
                <th className="py-2.5 px-3 text-right">CPU Util</th>
                <th className="py-2.5 px-3 text-right">Context Switches</th>
                <th className="py-2.5 px-3 text-right">Deadline Misses</th>
                <th className="py-2.5 px-3 text-center">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aegis-border/60">
              {allResults.map((algo) => {
                const isSelected = algo.id === selectedAlgoId;
                const isBestWait = bestPerformers.avgWaitTime?.id === algo.id;
                const isBestTat = bestPerformers.avgTurnaroundTime?.id === algo.id;
                const isBestMiss = bestPerformers.deadlineMisses?.id === algo.id;

                return (
                  <tr
                    key={algo.id}
                    className={cn(
                      'hover:bg-aegis-card-hover transition-colors',
                      isSelected && 'bg-aegis-teal/5'
                    )}
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: algo.color }}
                        />
                        <span>{algo.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-aegis-teal px-1.5 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/30">
                            Active
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className={cn('font-bold', isBestWait ? 'text-aegis-teal' : 'text-white')}>
                        {algo.avgWaitTime} ms
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className={cn('font-bold', isBestTat ? 'text-aegis-indigo' : 'text-white')}>
                        {algo.avgTurnaroundTime} ms
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-white">
                      {algo.throughput} T/s
                    </td>

                    <td className="py-3 px-3 text-right text-white">
                      {algo.cpuUtilization}%
                    </td>

                    <td className="py-3 px-3 text-right text-status-amber">
                      {algo.contextSwitches}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={cn(
                          'font-bold',
                          algo.deadlineMisses > 0 ? 'text-status-rose' : 'text-status-emerald'
                        )}
                      >
                        {algo.deadlineMisses}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {algo.id === 'AEGIS_ADAPTIVE' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-aegis-teal/15 text-aegis-teal border border-aegis-teal/30">
                          BALANCED SLA
                        </span>
                      ) : algo.id === 'SJF' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-aegis-indigo/15 text-aegis-indigo border border-aegis-indigo/30">
                          MIN WAIT
                        </span>
                      ) : algo.id === 'ROUND_ROBIN' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-amber/15 text-status-amber border border-status-amber/30">
                          FAIR SLICE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-aegis-card text-aegis-muted border border-aegis-border">
                          FIFO ORDER
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

export default AlgorithmComparisonSection;

