import React from 'react';
import { Trophy, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';

export function DetailedComparisonTable({ results = [], bestPerformers = {} }) {
  if (!results || results.length === 0) return null;

  const rows = [
    {
      label: 'Scheduling Paradigm',
      getValue: (r) => r.tag,
      format: (val) => <span className="font-semibold text-white">{val}</span>,
    },
    {
      label: 'Average Waiting Time (WT)',
      metricKey: 'avgWaitTime',
      getValue: (r) => `${r.avgWaitTime} ms`,
      isNumeric: true,
    },
    {
      label: 'Average Turnaround Time (TAT)',
      metricKey: 'avgTurnaroundTime',
      getValue: (r) => `${r.avgTurnaroundTime} ms`,
      isNumeric: true,
    },
    {
      label: 'Average Response Time (RT)',
      metricKey: 'avgResponseTime',
      getValue: (r) => `${r.avgResponseTime} ms`,
      isNumeric: true,
    },
    {
      label: 'CPU Utilization',
      metricKey: 'cpuUtilization',
      getValue: (r) => `${r.cpuUtilization}%`,
      isNumeric: true,
    },
    {
      label: 'System Throughput',
      metricKey: 'throughput',
      getValue: (r) => `${r.throughput} tasks/s`,
      isNumeric: true,
    },
    {
      label: 'Context Switches',
      metricKey: 'contextSwitches',
      getValue: (r) => `${r.contextSwitches} CS`,
      isNumeric: true,
    },
    {
      label: 'Deadline SLA Misses',
      metricKey: 'deadlineMisses',
      getValue: (r) => `${r.deadlineMisses} misses`,
      isNumeric: true,
    },
    {
      label: 'Starvation Resistance',
      getValue: (r) => {
        if (r.id === 'AEGIS_ADAPTIVE') return 'Guaranteed (Aging Boost)';
        if (r.id === 'ROUND_ROBIN') return 'Guaranteed (Circular Fair)';
        if (r.id === 'SJF') return 'Vulnerable (Long tasks starve)';
        return 'Convoy Effect Vulnerable';
      },
      format: (val, r) => (
        <span
          className={
            r.id === 'AEGIS_ADAPTIVE' || r.id === 'ROUND_ROBIN'
              ? 'text-status-emerald font-semibold'
              : 'text-status-amber'
          }
        >
          {val}
        </span>
      ),
    },
    {
      label: 'Primary Strength',
      getValue: (r) => {
        if (r.id === 'AEGIS_ADAPTIVE') return 'Multi-factor dynamic balance & zero starvation';
        if (r.id === 'ROUND_ROBIN') return 'Predictable response times for interactive jobs';
        if (r.id === 'SJF') return 'Mathematically minimal average wait time';
        return 'Simple O(1) scheduling with minimal overhead';
      },
    },
    {
      label: 'Key Weakness',
      getValue: (r) => {
        if (r.id === 'AEGIS_ADAPTIVE') return 'Requires coefficient tuning and factor math';
        if (r.id === 'ROUND_ROBIN') return 'Frequent context-switch overhead degrades throughput';
        if (r.id === 'SJF') return 'Requires advance burst knowledge & starves long jobs';
        return 'Convoy effect when long CPU job blocks ready queue';
      },
    },
  ];

  return (
    <Card
      title="Detailed Algorithm Evaluation Matrix"
      subtitle="Comprehensive architectural and empirical comparison across all evaluated scheduling metrics"
      icon={Trophy}
    >
      <div className="overflow-x-auto rounded-lg border border-aegis-border bg-aegis-bg font-terminal text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-aegis-border bg-aegis-sidebar text-aegis-muted uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4 min-w-[200px]">Evaluation Dimension</th>
              {results.map((algo) => (
                <th key={algo.id} className="py-3 px-4 min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: algo.color }}
                    />
                    <span className="font-bold text-white text-xs">{algo.shortName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aegis-border/60">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-aegis-card-hover transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  {row.label}
                </td>

                {results.map((algo) => {
                  const val = row.getValue(algo);
                  const isWinner =
                    row.metricKey && bestPerformers[row.metricKey]?.algorithmId === algo.id;

                  return (
                    <td key={algo.id} className="py-3 px-4">
                      <div className="flex items-center justify-between gap-2">
                        {row.format ? (
                          row.format(val, algo)
                        ) : (
                          <span
                            className={
                              isWinner
                                ? 'text-aegis-teal font-bold'
                                : 'text-aegis-text-dim'
                            }
                          >
                            {val}
                          </span>
                        )}

                        {/* Gold Trophy Winner Badge */}
                        {isWinner && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-aegis-teal/15 text-aegis-teal border border-aegis-teal/30 shrink-0"
                            title={`Best performer in ${row.label}`}
                          >
                            <Trophy className="w-2.5 h-2.5 text-aegis-teal" />
                            BEST
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DetailedComparisonTable;

