import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = {
  Running: '#18C6A3',     // Teal
  Ready: '#38BDF8',       // Sky
  'Blocked (I/O)': '#F59E0B', // Amber
  Completed: '#10B981',   // Emerald
};

function CustomDonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-aegis-border bg-aegis-card p-3 shadow-2xl backdrop-blur-md font-terminal text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-semibold text-white">{data.name}</span>
        </div>
        <div className="text-aegis-muted flex items-center justify-between gap-4">
          <span>Task Count:</span>
          <span className="text-white font-bold">{data.value} tasks</span>
        </div>
        {data.payload.percentage !== undefined && (
          <div className="text-aegis-subtle flex items-center justify-between gap-4 mt-0.5">
            <span>Share:</span>
            <span className="text-aegis-teal font-semibold">{data.payload.percentage}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function TaskDistributionChart({ tasks = [], loading = false }) {
  if (loading) {
    return (
      <Card
        title="Task Distribution"
        subtitle="Process state breakdown across lifecycle"
        icon={PieIcon}
      >
        <div className="h-72 w-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aegis-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  const runningCount = tasks.filter((t) => t.state === 'running').length;
  const readyCount = tasks.filter((t) => t.state === 'ready').length;
  const waitingCount = tasks.filter((t) => t.state === 'waiting').length;
  const completedCount = tasks.filter((t) => t.state === 'completed').length;
  const total = runningCount + readyCount + waitingCount + completedCount || 1;

  const data = [
    {
      name: 'Running',
      value: runningCount,
      color: COLORS.Running,
      percentage: Math.round((runningCount / total) * 100),
    },
    {
      name: 'Ready',
      value: readyCount,
      color: COLORS.Ready,
      percentage: Math.round((readyCount / total) * 100),
    },
    {
      name: 'Blocked (I/O)',
      value: waitingCount,
      color: COLORS['Blocked (I/O)'],
      percentage: Math.round((waitingCount / total) * 100),
    },
    {
      name: 'Completed',
      value: completedCount,
      color: COLORS.Completed,
      percentage: Math.round((completedCount / total) * 100),
    },
  ];

  return (
    <Card
      title="Task Distribution"
      subtitle="Current lifecycle breakdown (Running, Ready, Blocked, Completed)"
      icon={PieIcon}
      actions={
        <span className="text-xs font-terminal text-aegis-muted">
          Total: <strong className="text-white">{tasks.length}</strong>
        </span>
      }
    >
      <div className="h-72 w-full flex flex-col items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomDonutTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={4}
              dataKey="value"
              stroke="#111B2B"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="block text-xl font-bold text-white font-terminal leading-none">
            {tasks.length}
          </span>
          <span className="text-[10px] text-aegis-muted font-terminal uppercase tracking-wider">
            Tasks
          </span>
        </div>
      </div>
    </Card>
  );
}

export default TaskDistributionChart;

