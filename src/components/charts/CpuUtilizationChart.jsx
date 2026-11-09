import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import { Activity } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs">
        <div className="text-aegis-muted mb-2 pb-1.5 border-b border-aegis-border flex items-center justify-between gap-4">
          <span>Time:</span>
          <span className="text-white font-semibold">{label}</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((item) => (
            <div key={item.dataKey} className="flex items-center justify-between gap-5 text-xs">
              <span className="flex items-center gap-2 text-aegis-text-dim">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}:
              </span>
              <span className="font-bold text-white font-terminal">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function CpuUtilizationChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <Card
        title="CPU Utilization Over Time"
        subtitle="Continuous hardware load stream across SMP cores"
        icon={Activity}
      >
        <div className="h-72 w-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aegis-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card
        title="CPU Utilization Over Time"
        subtitle="Continuous hardware load stream across SMP cores"
        icon={Activity}
      >
        <div className="h-72 w-full flex flex-col items-center justify-center text-aegis-muted font-terminal text-xs">
          <span>No CPU telemetry available</span>
          <span className="text-aegis-subtle text-[11px] mt-1">Start simulation engine to stream data</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="CPU Utilization Over Time"
      subtitle="Total vs User Workload vs Kernel Scheduler Overhead (1000ms polling)"
      icon={Activity}
      actions={
        <span className="text-[11px] font-terminal text-aegis-teal px-2 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/30">
          Live Telemetry
        </span>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
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
              unit="%"
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
              iconType="circle"
            />

            <Line
              type="monotone"
              dataKey="cpuLoad"
              name="Total CPU Load"
              stroke="#18C6A3"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#18C6A3', stroke: '#090E19', strokeWidth: 2 }}
            />

            <Line
              type="monotone"
              dataKey="userLoad"
              name="User Threads"
              stroke="#7C8CFF"
              strokeWidth={1.8}
              strokeDasharray="4 2"
              dot={false}
              activeDot={{ r: 4, fill: '#7C8CFF' }}
            />

            <Line
              type="monotone"
              dataKey="systemLoad"
              name="Kernel Overhead"
              stroke="#38BDF8"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: '#38BDF8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default CpuUtilizationChart;

