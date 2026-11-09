import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import Card from '../common/Card';
import { BarChart3 } from 'lucide-react';

export function LatencyDistributionChart({ tasks = [] }) {
  // Compute histogram bins
  const bins = [
    { range: '0-10 ms', min: 0, max: 10, count: 0, color: '#18C6A3' },
    { range: '10-20 ms', min: 10, max: 20, count: 0, color: '#2DD4BF' },
    { range: '20-30 ms', min: 20, max: 30, count: 0, color: '#7C8CFF' },
    { range: '30-40 ms', min: 30, max: 40, count: 0, color: '#818CF8' },
    { range: '40-50 ms', min: 40, max: 50, count: 0, color: '#F59E0B' },
    { range: '> 50 ms', min: 50, max: Infinity, count: 0, color: '#F43F5E' },
  ];

  tasks.forEach((t) => {
    const wt = t.waitingTime ?? 0;
    const bin = bins.find((b) => wt >= b.min && wt < b.max);
    if (bin) {
      bin.count += 1;
    }
  });

  const total = tasks.length || 1;
  const chartData = bins.map((b) => ({
    ...b,
    percentage: ((b.count / total) * 100).toFixed(1),
  }));

  return (
    <Card
      title="Waiting Time Latency Distribution"
      subtitle="Binned histogram of task ready-queue latencies"
      icon={BarChart3}
      actions={
        <div className="text-xs font-terminal text-aegis-muted">
          Total Sample: <strong className="text-white">{tasks.length}</strong> tasks
        </div>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 15, bottom: 10, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />
            <XAxis
              dataKey="range"
              stroke="#64748B"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#202C40' }}
            />
            <YAxis
              stroke="#64748B"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#202C40' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs">
                      <div className="text-white font-bold pb-1 mb-1.5 border-b border-aegis-border">
                        Latency Bin: <span className="text-aegis-teal">{data.range}</span>
                      </div>
                      <div className="flex justify-between gap-4 py-0.5">
                        <span className="text-aegis-muted">Task Count:</span>
                        <strong className="text-white">{data.count}</strong>
                      </div>
                      <div className="flex justify-between gap-4 py-0.5">
                        <span className="text-aegis-muted">Workload Share:</span>
                        <strong className="text-aegis-indigo">{data.percentage}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default LatencyDistributionChart;

