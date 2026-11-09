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
  Cell,
} from 'recharts';
import Card from '../common/Card';
import { BarChart3, Clock, Zap, Activity, AlertTriangle, Cpu } from 'lucide-react';

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs min-w-[180px]">
        <div className="text-white font-bold mb-2 pb-1.5 border-b border-aegis-border text-sm">
          {label}
        </div>
        <div className="space-y-1.5">
          {payload.map((item) => (
            <div key={item.dataKey} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-aegis-text-dim">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}:
              </span>
              <span className="font-bold text-white font-mono">
                {item.value} {item.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function ComparisonCharts({ chartData = [] }) {
  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Row 1: Waiting & Turnaround Time (Grouped Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Average Waiting Time & Turnaround Time (TAT)"
          subtitle="Direct comparison across identical task inputs (lower is better)"
          icon={Clock}
          actions={
            <div className="flex items-center gap-3 text-xs font-terminal">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-aegis-teal" />
                <span className="text-aegis-muted">Avg Wait Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-aegis-indigo" />
                <span className="text-aegis-muted">Avg Turnaround</span>
              </div>
            </div>
          }
        >
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
                  unit="ms"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="avgWaitTime"
                  name="Avg Waiting Time"
                  unit="ms"
                  fill="#18C6A3"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="avgTurnaroundTime"
                  name="Avg Turnaround Time"
                  unit="ms"
                  fill="#7C8CFF"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Average Response Time Comparison */}
        <Card
          title="Average Response Time Comparison"
          subtitle="Latency from process arrival until first timeslice dispatch (lower is better)"
          icon={Zap}
        >
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
                  unit="ms"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="avgResponseTime"
                  name="Avg Response Time"
                  unit="ms"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#38BDF8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: CPU Utilization & Throughput + Context Switches & Deadline Misses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: CPU Utilization & System Throughput */}
        <Card
          title="CPU Utilization & System Throughput"
          subtitle="Processor busy makespan % and tasks completed per second"
          icon={Cpu}
          actions={
            <div className="flex items-center gap-3 text-xs font-terminal">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-status-sky" />
                <span className="text-aegis-muted">CPU Util (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-aegis-teal" />
                <span className="text-aegis-muted">Throughput (T/s)</span>
              </div>
            </div>
          }
        >
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
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="cpuUtilization"
                  name="CPU Utilization"
                  unit="%"
                  fill="#38BDF8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="throughput"
                  name="Throughput"
                  unit="tasks/s"
                  fill="#18C6A3"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Context Switches & Deadline SLA Misses */}
        <Card
          title="Kernel Context Switches & Deadline Misses"
          subtitle="Evaluating scheduling overhead vs real-time SLA deadline violations"
          icon={AlertTriangle}
          actions={
            <div className="flex items-center gap-3 text-xs font-terminal">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-status-amber" />
                <span className="text-aegis-muted">Context Switches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-status-rose" />
                <span className="text-aegis-muted">Deadline Misses</span>
              </div>
            </div>
          }
        >
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
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="contextSwitches"
                  name="Context Switches"
                  unit="CS"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="deadlineMisses"
                  name="Deadline Misses"
                  unit="misses"
                  fill="#F43F5E"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ComparisonCharts;

