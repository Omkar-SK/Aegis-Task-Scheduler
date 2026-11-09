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
import Card from '../common/Card';
import { BarChart3 } from 'lucide-react';

function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const rawData = payload[0].payload;
    return (
      <div className="rounded-xl border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs min-w-[200px]">
        <div className="text-aegis-muted mb-2 pb-1.5 border-b border-aegis-border flex items-center justify-between">
          <span className="font-bold text-white text-sm">{label}</span>
          <span className="text-[10px] text-aegis-teal px-1.5 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/20">
            {rawData.overhead} Overhead
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-aegis-text-dim">
              <span className="w-2.5 h-2.5 rounded-full bg-aegis-teal" />
              Avg Waiting Time:
            </span>
            <span className="font-bold text-aegis-teal">{rawData.avgWaitTime} ms</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-aegis-text-dim">
              <span className="w-2.5 h-2.5 rounded-full bg-aegis-indigo" />
              Avg Turnaround Time:
            </span>
            <span className="font-bold text-aegis-indigo">{rawData.avgTurnaround} ms</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-aegis-border/60">
            <span className="text-aegis-muted">Throughput:</span>
            <span className="text-white font-semibold">{rawData.throughput} tasks/s</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function AlgorithmPerformanceChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <Card
        title="Algorithm Performance Comparison"
        subtitle="Benchmark metrics across CPU scheduling policies"
        icon={BarChart3}
      >
        <div className="h-72 w-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aegis-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Algorithm Performance"
      subtitle="Grouped benchmark: Average Waiting Time vs Turnaround Time (lower is better)"
      icon={BarChart3}
      actions={
        <div className="flex items-center gap-2 text-xs font-terminal text-aegis-muted">
          <span>Target:</span>
          <span className="text-aegis-teal font-semibold">Min Wait & Turnaround</span>
        </div>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />

            <XAxis
              dataKey="algorithm"
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
              unit=" ms"
            />

            <Tooltip content={<CustomBarTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
              iconType="circle"
            />

            <Bar
              dataKey="avgWaitTime"
              name="Avg Waiting Time"
              fill="#18C6A3"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />

            <Bar
              dataKey="avgTurnaround"
              name="Avg Turnaround Time"
              fill="#7C8CFF"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default AlgorithmPerformanceChart;

