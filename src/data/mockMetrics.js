/**
 * Performance Metrics and Timeline Samples for Charts
 * Demonstration / Mock data module for Aegis Scheduler
 */

export const INITIAL_METRICS = {
  totalTasks: 542,
  completedTasksCount: 488,
  averageWaitTimeMs: 16.8,
  overallCpuLoad: 58.4,
  userLoad: 46.2,
  systemLoad: 12.2,
  deadlineMissRate: 1.2,
  contextSwitchesPerSec: 3120,
  activeCores: 6,
  totalCores: 8,
  throughputTasksPerSec: 142.8,
  averageTurnaroundTimeMs: 64.2,
  starvationAlerts: 0,
  workStealsTotal: 84,
  adaptiveQuantumCurrentMs: 20,
  uptimeSeconds: 1540,
};

// Comparative Algorithm Benchmark Data for Grouped Bar Chart
export const ALGORITHM_PERFORMANCE_DATA = [
  {
    algorithm: 'MLFQ',
    fullName: 'Multi-Level Feedback Queue',
    avgWaitTime: 14.2,
    avgTurnaround: 58.6,
    throughput: 148,
    overhead: 'Medium',
  },
  {
    algorithm: 'Work Stealing',
    fullName: 'Adaptive Work Stealing',
    avgWaitTime: 11.5,
    avgTurnaround: 52.1,
    throughput: 165,
    overhead: 'Low',
  },
  {
    algorithm: 'CFS',
    fullName: 'Completely Fair Scheduler',
    avgWaitTime: 17.8,
    avgTurnaround: 66.4,
    throughput: 139,
    overhead: 'O(log N)',
  },
  {
    algorithm: 'Dynamic RR',
    fullName: 'Round Robin Dynamic Slice',
    avgWaitTime: 24.3,
    avgTurnaround: 82.0,
    throughput: 118,
    overhead: 'Minimal',
  },
  {
    algorithm: 'Priority Aging',
    fullName: 'Preemptive Priority Aging',
    avgWaitTime: 20.1,
    avgTurnaround: 74.5,
    throughput: 126,
    overhead: 'Low',
  },
];

// 20 historical time samples for Recharts line / area charts
export const generateTimelineHistory = () => {
  const points = [];
  const now = Date.now();
  for (let i = 19; i >= 0; i--) {
    const timestamp = new Date(now - i * 1500);
    const timeLabel = `${String(timestamp.getMinutes()).padStart(2, '0')}:${String(timestamp.getSeconds()).padStart(2, '0')}`;
    
    // Realistic fluctuating values
    const baseLoad = 52 + Math.sin(i * 0.45) * 14;
    const cpuLoad = Math.min(94, Math.max(18, Math.round(baseLoad + (Math.random() * 6 - 3))));
    const userLoad = Math.round(cpuLoad * 0.78);
    const systemLoad = Math.max(4, cpuLoad - userLoad);
    const throughput = Math.round(125 + Math.cos(i * 0.4) * 25 + Math.random() * 8);
    const ctxSwitches = Math.round(2900 + Math.sin(i * 0.6) * 350 + Math.random() * 120);
    const readyQueueDepth = Math.max(1, Math.round(4 + Math.sin(i * 0.5) * 3));
    const avgLatency = Number((14 + Math.random() * 4).toFixed(1));

    points.push({
      time: timeLabel,
      cpuLoad,
      userLoad,
      systemLoad,
      throughput,
      ctxSwitches,
      readyQueueDepth,
      avgLatency,
    });
  }
  return points;
};

// Scheduler event activity log
export const RECENT_ACTIVITY_LOG = [
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
  {
    id: 'evt-5',
    time: '17:04:10',
    type: 'boost',
    badge: 'AGING BOOST',
    badgeColor: 'border-status-amber/40 text-status-amber bg-status-amber/10',
    title: 'Starvation Prevention Scan',
    detail: 'Priority boost elevated 3 aging tasks in Q2 to avoid priority inversion.',
    core: 'Scheduler Daemon',
  },
];
