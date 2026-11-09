import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../common/Card';
import { Activity, Radio, Cpu, RefreshCw } from 'lucide-react';

function CustomTelemetryTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs">
        <div className="text-aegis-muted mb-1.5 pb-1 border-b border-aegis-border">
          Timestamp: <span className="text-white font-semibold">{label}</span>
        </div>
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-aegis-text-dim">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
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

export function HardwareTelemetryCharts({ data = [] }) {
  // If data is short, synthesize rolling points
  const points = data.length > 0 ? data : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: CPU Utilization & Throughput */}
      <Card
        title="CPU Utilization & Dispatch Throughput"
        subtitle="Hardware sample streaming (1000ms rolling telemetry)"
        icon={Activity}
        actions={
          <div className="flex items-center gap-3 text-xs font-terminal">
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
            <AreaChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="monTealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18C6A3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#18C6A3" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="monIndigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C8CFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C8CFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />
              <XAxis
                dataKey="time"
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
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTelemetryTooltip />} />

              <Area
                type="monotone"
                dataKey="cpuLoad"
                name="CPU Utilization"
                unit="%"
                stroke="#18C6A3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#monTealGrad)"
              />
              <Area
                type="monotone"
                dataKey="throughput"
                name="Throughput"
                unit="T/s"
                stroke="#7C8CFF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#monIndigoGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 2: Context Switches & Ready Queue Depth */}
      <Card
        title="Context Switch Frequency & Queue Depth"
        subtitle="Preemption overhead & runqueue latency pressure"
        icon={Cpu}
        actions={
          <div className="flex items-center gap-3 text-xs font-terminal">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-status-amber"></span>
              <span className="text-aegis-muted">CS Rate (/s)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-status-rose"></span>
              <span className="text-aegis-muted">Queue Depth</span>
            </div>
          </div>
        }
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />
              <XAxis
                dataKey="time"
                stroke="#64748B"
                tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#202C40' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748B"
                tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#202C40' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748B"
                tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                tickLine={false}
                axisLine={{ stroke: '#202C40' }}
              />
              <Tooltip content={<CustomTelemetryTooltip />} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ctxSwitches"
                name="Context Switches"
                unit="/s"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="stepAfter"
                dataKey="readyQueueDepth"
                name="Ready Queue Depth"
                unit="tasks"
                stroke="#F43F5E"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default HardwareTelemetryCharts;

