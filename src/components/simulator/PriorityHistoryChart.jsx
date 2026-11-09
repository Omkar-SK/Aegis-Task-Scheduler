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
import { TrendingUp, Activity } from 'lucide-react';

function CustomPriorityTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs min-w-[180px]">
        <div className="text-aegis-muted mb-2 pb-1.5 border-b border-aegis-border flex items-center justify-between">
          <span className="font-semibold text-white">Clock: {label}</span>
          <span className="text-[10px] text-aegis-teal">Dynamic Scores</span>
        </div>
        <div className="space-y-1">
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
                {Number(item.value).toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function PriorityHistoryChart({ historyData = [], tasks = [] }) {
  if (!historyData || historyData.length === 0) {
    return (
      <Card
        title="Dynamic Priority Evolution Over Time"
        subtitle="Historical trace of task priority fluctuations across clock intervals"
        icon={TrendingUp}
      >
        <div className="h-64 flex items-center justify-center text-xs font-terminal text-aegis-muted">
          Advance simulation clock to stream dynamic priority progression.
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Dynamic Priority Evolution Over Time"
      subtitle="Deterministic real-time tracking: Deadline urgency rises, queue waiting boosts score, CPU consumption imposes penalty"
      icon={TrendingUp}
      actions={
        <span className="text-[10px] font-terminal px-2 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30">
          Scale: [0.0 - 1.0]
        </span>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 1]}
            />

            <Tooltip content={<CustomPriorityTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
              iconType="circle"
            />

            {tasks.map((task) => (
              <Line
                key={task.id}
                type="monotone"
                dataKey={task.id}
                name={task.id}
                stroke={task.color || '#18C6A3'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#090E19', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default PriorityHistoryChart;

