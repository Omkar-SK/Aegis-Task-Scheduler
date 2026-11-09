import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Layers,
  CheckCircle2,
  Clock,
  Cpu,
  AlertTriangle,
  Activity,
  Play,
  Pause,
  Sliders,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/common/MetricCard';
import Button from '../../components/common/Button';
import CpuUtilizationChart from '../../components/charts/CpuUtilizationChart';
import TaskDistributionChart from '../../components/charts/TaskDistributionChart';
import AlgorithmPerformanceChart from '../../components/charts/AlgorithmPerformanceChart';
import CurrentlyRunningTasks from '../../components/overview/CurrentlyRunningTasks';
import RecentlyExecutedTasks from '../../components/overview/RecentlyExecutedTasks';
import SchedulerStatusPanel from '../../components/overview/SchedulerStatusPanel';
import RecentActivityFeed from '../../components/overview/RecentActivityFeed';

export function OverviewPage() {
  const {
    tasks = [],
    metrics = {},
    history = [],
    algorithms = [],
    activeAlgorithm,
    switchAlgorithm,
    isRunning,
    toggleRunning,
    sourceMode,
    loading = false,
  } = useOutletContext();

  // Metric values with realistic simulation fallbacks
  const totalTasksVal = metrics.totalTasks || 542;
  const completedTasksVal = metrics.completedTasksCount || 488;
  const avgWaitTimeVal = `${metrics.averageWaitTimeMs || 16.8} ms`;
  const cpuLoadVal = `${metrics.overallCpuLoad || 58.4}%`;
  const deadlineMissVal = `${metrics.deadlineMissRate || 1.2}%`;
  const contextSwitchesVal = `${(metrics.contextSwitchesPerSec || 3120).toLocaleString()} /s`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* TOP SECTION */}
      <PageHeader
        title="Scheduling Overview"
        subtitle="Monitor task execution, scheduler performance and system health."
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Overview' }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Current Algorithm Indicator & Quick Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-aegis-sidebar border border-aegis-border text-xs font-terminal">
              <Sliders className="w-3.5 h-3.5 text-aegis-teal" />
              <span className="text-aegis-muted hidden sm:inline">Algorithm:</span>
              <select
                value={activeAlgorithm?.id || 'MLFQ'}
                onChange={(e) => switchAlgorithm && switchAlgorithm(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                aria-label="Select active CPU algorithm"
              >
                {algorithms.map((algo) => (
                  <option key={algo.id} value={algo.id} className="bg-aegis-card text-white">
                    {algo.shortName} — {algo.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Run / Pause Simulation Button */}
            <Button
              variant={isRunning ? 'danger' : 'primary'}
              size="sm"
              icon={isRunning ? Pause : Play}
              onClick={toggleRunning}
            >
              {isRunning ? 'Pause Simulation' : 'Run Simulation'}
            </Button>
          </div>
        }
      />

      {/* METRIC CARDS (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Tasks */}
        <MetricCard
          title="Total Tasks"
          value={totalTasksVal}
          description="Registered process control blocks"
          trend="+12"
          isPositive={true}
          trendLabel="since boot"
          icon={Layers}
          accentColor="teal"
          loading={loading}
        />

        {/* 2. Completed Tasks */}
        <MetricCard
          title="Completed Tasks"
          value={completedTasksVal}
          description="Finished without preemption fault"
          trend="+8"
          isPositive={true}
          trendLabel="optimal exit"
          icon={CheckCircle2}
          accentColor="emerald"
          loading={loading}
        />

        {/* 3. Average Waiting Time */}
        <MetricCard
          title="Avg Waiting Time"
          value={avgWaitTimeVal}
          description="Ready queue wait before burst"
          trend="-1.2 ms"
          isPositive={true}
          trendLabel="latency reduction"
          icon={Clock}
          accentColor="indigo"
          loading={loading}
        />

        {/* 4. CPU Utilization */}
        <MetricCard
          title="CPU Utilization"
          value={cpuLoadVal}
          description="SMP workload across 8 cores"
          trend="+2.4%"
          isPositive={false}
          trendLabel="steady compute"
          icon={Cpu}
          accentColor="teal"
          loading={loading}
        />

        {/* 5. Deadline Miss Rate */}
        <MetricCard
          title="Deadline Miss Rate"
          value={deadlineMissVal}
          description="Real-time SLA tolerance bound"
          trend="-0.4%"
          isPositive={true}
          trendLabel="within budget"
          icon={AlertTriangle}
          accentColor="amber"
          loading={loading}
        />

        {/* 6. Context Switches */}
        <MetricCard
          title="Context Switches"
          value={contextSwitchesVal}
          description="Atomic state save & restores"
          trend="+140"
          isPositive={true}
          trendLabel="lock-free deques"
          icon={Activity}
          accentColor="sky"
          loading={loading}
        />
      </div>

      {/* CHARTS ROW 1: CPU Utilization (Line) & Task Distribution (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CpuUtilizationChart data={history} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <TaskDistributionChart tasks={tasks} loading={loading} />
        </div>
      </div>

      {/* CHARTS ROW 2: Algorithm Performance (Grouped Bar Chart) */}
      <div>
        <AlgorithmPerformanceChart
          data={[
            {
              algorithm: 'MLFQ',
              avgWaitTime: 14.2,
              avgTurnaround: 58.6,
              throughput: 148,
              overhead: 'Medium',
            },
            {
              algorithm: 'Work Stealing',
              avgWaitTime: 11.5,
              avgTurnaround: 52.1,
              throughput: 165,
              overhead: 'Low',
            },
            {
              algorithm: 'CFS',
              avgWaitTime: 17.8,
              avgTurnaround: 66.4,
              throughput: 139,
              overhead: 'O(log N)',
            },
            {
              algorithm: 'Dynamic RR',
              avgWaitTime: 24.3,
              avgTurnaround: 82.0,
              throughput: 118,
              overhead: 'Minimal',
            },
            {
              algorithm: 'Priority Aging',
              avgWaitTime: 20.1,
              avgTurnaround: 74.5,
              throughput: 126,
              overhead: 'Low',
            },
          ]}
          loading={loading}
        />
      </div>

      {/* CURRENTLY RUNNING TASKS */}
      <div>
        <CurrentlyRunningTasks tasks={tasks} loading={loading} />
      </div>

      {/* ADDITIONAL SECTIONS: Recently Executed Tasks + Scheduler Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recently Executed Tasks */}
        <div className="lg:col-span-2">
          <RecentlyExecutedTasks tasks={tasks} loading={loading} />
        </div>

        {/* Right Col: Scheduler Status & Recent Activity Feed */}
        <div className="space-y-6">
          <SchedulerStatusPanel
            activeAlgorithm={activeAlgorithm}
            metrics={metrics}
            sourceMode={sourceMode}
          />
          <RecentActivityFeed
            activities={metrics.recentActivity || [
              {
                id: 'evt-1',
                time: '17:04:48',
                type: 'preempt',
                badge: 'PREEMPT',
                badgeColor: 'border-status-rose/40 text-status-rose bg-status-rose/10',
                title: 'Time Slice Expired on Core #0',
                detail: 'Task T-1042 preempted after 20ms slice. Moved to Q1 queue.',
                core: 'Core 0',
              },
              {
                id: 'evt-2',
                time: '17:04:42',
                type: 'steal',
                badge: 'WORK-STEAL',
                badgeColor: 'border-aegis-indigo/40 text-aegis-indigo bg-aegis-indigo/10',
                title: 'Atomic Work Steal on Core #2',
                detail: 'Core #2 CAS deque-steal acquired Task T-1068 from Core #0.',
                core: 'Core 2',
              },
              {
                id: 'evt-3',
                time: '17:04:35',
                type: 'dispatch',
                badge: 'DISPATCH',
                badgeColor: 'border-aegis-teal/40 text-aegis-teal bg-aegis-teal/10',
                title: 'High Priority Task Dispatched',
                detail: 'Task T-1055 (Priority 10) context switched onto Core #3.',
                core: 'Core 3',
              },
              {
                id: 'evt-4',
                time: '17:04:22',
                type: 'complete',
                badge: 'COMPLETE',
                badgeColor: 'border-status-emerald/40 text-status-emerald bg-status-emerald/10',
                title: 'Process Terminated Gracefully',
                detail: 'Task T-1029 finished execution. Turnaround: 108ms, Wait: 18ms.',
                core: 'Core 1',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;
