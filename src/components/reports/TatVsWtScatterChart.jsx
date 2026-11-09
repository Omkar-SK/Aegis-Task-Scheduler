import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import { Clock } from 'lucide-react';

function CustomScatterTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs">
        <div className="text-white font-bold pb-1 mb-1.5 border-b border-aegis-border flex items-center justify-between gap-4">
          <span>{data.name || data.id}</span>
          <span className="text-[10px] text-aegis-teal px-1.5 py-0.5 rounded bg-aegis-teal/10">
            {data.id}
          </span>
        </div>
        <div className="space-y-1 text-aegis-muted">
          <div className="flex justify-between gap-4">
            <span>Waiting Time (WT):</span>
            <strong className="text-aegis-teal">{data.waitingTime} ms</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Turnaround (TAT):</span>
            <strong className="text-aegis-indigo">{data.turnaroundTime} ms</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Burst Time:</span>
            <span className="text-white">{data.burstTime} ms</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Arrival Time:</span>
            <span className="text-white">{data.arrivalTime} ms</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Normalized Penalty:</span>
            <span className="text-status-amber">
              {data.burstTime > 0 ? (data.turnaroundTime / data.burstTime).toFixed(2) : '1.0'}x
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function TatVsWtScatterChart({ tasks = [] }) {
  // Separate tasks into met deadline vs missed deadline
  const metDeadline = tasks
    .filter((t) => !t.missedDeadline)
    .map((t) => ({
      id: t.id,
      name: t.name,
      waitingTime: t.waitingTime,
      turnaroundTime: t.turnaroundTime,
      burstTime: t.burstTime,
      arrivalTime: t.arrivalTime,
      z: 10,
    }));

  const missedDeadline = tasks
    .filter((t) => t.missedDeadline)
    .map((t) => ({
      id: t.id,
      name: t.name,
      waitingTime: t.waitingTime,
      turnaroundTime: t.turnaroundTime,
      burstTime: t.burstTime,
      arrivalTime: t.arrivalTime,
      z: 15,
    }));

  return (
    <Card
      title="Turnaround Time (TAT) vs. Waiting Time (WT) Distribution"
      subtitle="Correlation scatter plot: TAT = Waiting Time + Burst Time (closer to diagonal = lower scheduling delay)"
      icon={Clock}
      actions={
        <div className="flex items-center gap-4 text-xs font-terminal">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-aegis-teal"></span>
            <span className="text-aegis-muted">Met Deadline ({metDeadline.length})</span>
          </div>
          {missedDeadline.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-rose"></span>
              <span className="text-aegis-muted">Missed Deadline ({missedDeadline.length})</span>
            </div>
          )}
        </div>
      }
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 15, bottom: 10, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202C40" opacity={0.6} />
            <XAxis
              type="number"
              dataKey="waitingTime"
              name="Waiting Time"
              unit="ms"
              stroke="#64748B"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#202C40' }}
            />
            <YAxis
              type="number"
              dataKey="turnaroundTime"
              name="Turnaround Time"
              unit="ms"
              stroke="#64748B"
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#202C40' }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 100]} />
            <Tooltip content={<CustomScatterTooltip />} />
            <Scatter
              name="Met Deadline"
              data={metDeadline}
              fill="#18C6A3"
              fillOpacity={0.8}
              stroke="#111B2B"
              strokeWidth={1}
            />
            {missedDeadline.length > 0 && (
              <Scatter
                name="Missed Deadline"
                data={missedDeadline}
                fill="#F43F5E"
                fillOpacity={0.9}
                stroke="#111B2B"
                strokeWidth={1}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default TatVsWtScatterChart;

