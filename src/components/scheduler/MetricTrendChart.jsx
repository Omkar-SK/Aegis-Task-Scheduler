import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { Activity } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs">
        <div className="text-aegis-muted mb-1.5 pb-1 border-b border-aegis-border">
          Timestamp: <span className="text-white font-semibold">{label}</span>
        </div>
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-aegis-text-dim">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-bold text-white">
              {item.value} {item.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function MetricTrendChart({ data = [], title = 'Real-time CPU Utilization & Throughput Telemetry' }) {
  return (
    <Card
      title={title}
      subtitle="Streaming hardware sample telemetry (1000ms rolling window)"
      icon={Activity}
      actions={
        <div className="flex items-center gap-4 text-xs font-terminal">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-aegis-teal"></span>
            <span className="text-aegis-muted">CPU Load (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-aegis-indigo"></span>
            <span className="text-aegis-muted">Throughput (T/s)</span>
          </div>
        </div>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18C6A3" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#18C6A3" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C8CFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C8CFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />

            <XAxis
              dataKey="time"
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
              domain={[0, 100]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="cpuLoad"
              name="CPU Utilization"
              unit="%"
              stroke="#18C6A3"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#tealGradient)"
            />

            <Area
              type="monotone"
              dataKey="throughput"
              name="Task Throughput"
              unit="tasks/s"
              stroke="#7C8CFF"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#indigoGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default MetricTrendChart;
