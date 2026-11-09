/**
 * Aegis Algorithm Benchmark & Comparison Engine
 * 
 * Runs all four scheduling algorithms (FCFS, SJF, Round Robin, Aegis Adaptive)
 * under identical task inputs and computes exact comparative OS metrics.
 */

import { generateScheduleTimeline } from './schedulerEngine';

export const COMPARED_ALGORITHMS = [
  {
    id: 'FCFS',
    name: 'First-Come, First-Served',
    shortName: 'FCFS',
    tag: 'Non-Preemptive',
    color: '#38BDF8', // Sky
    description: 'Executes jobs strictly in arrival order until completion. Prone to convoy effect when long compute tasks precede short interactive tasks.',
  },
  {
    id: 'SJF',
    name: 'Shortest Job First (SRTF)',
    shortName: 'SJF',
    tag: 'Preemptive SRTF',
    color: '#7C8CFF', // Indigo
    description: 'Preemptively schedules the task with shortest remaining CPU burst. Mathematically optimal for minimizing average waiting time, but risks starvation for long jobs.',
  },
  {
    id: 'ROUND_ROBIN',
    name: 'Round Robin',
    shortName: 'Round Robin',
    tag: 'Time-Sliced Preemptive',
    color: '#F59E0B', // Amber
    description: 'Allocates fixed time slices (quanta) in circular FIFO order. Guarantees fair CPU access and rapid response time, at the expense of higher context-switch overhead.',
  },
  {
    id: 'AEGIS_ADAPTIVE',
    name: 'Aegis Adaptive Scheduling',
    shortName: 'Aegis Adaptive',
    tag: 'Multi-Factor Feedback',
    color: '#18C6A3', // Teal
    description: 'Aegis dynamic priority combining Deadline Urgency, Queue Waiting aging, and CPU consumption penalization to minimize SLA deadline misses and eliminate starvation.',
  },
];

/**
 * Run benchmark for all 4 algorithms on identical task inputs
 * 
 * @param {Array} tasks
 * @param {number} quantum - Time slice in ms for RR and Aegis (default 20)
 * @param {Object} aegisWeights - Weights for Aegis priority formula
 * @returns {Object} { results, bestPerformers, chartData }
 */
export function runAlgorithmBenchmark(
  tasks,
  quantum = 20,
  aegisWeights = { deadline: 0.5, wait: 0.2, cpu: 0.3 }
) {
  if (!tasks || tasks.length === 0) {
    return { results: [], bestPerformers: {}, chartData: [] };
  }

  const results = COMPARED_ALGORITHMS.map((algo) => {
    // Run deterministic schedule timeline generator
    const { timeline, taskStats, totalExecutionTime } = generateScheduleTimeline(
      tasks,
      algo.id,
      quantum,
      1, // 1ms context switch overhead
      aegisWeights
    );

    const taskList = Object.values(taskStats);
    const N = taskList.length || 1;

    // 1. Average Waiting Time
    const totalWait = taskList.reduce((acc, t) => acc + (t.waitingTime || 0), 0);
    const avgWaitTime = Number((totalWait / N).toFixed(2));

    // 2. Average Turnaround Time
    const totalTAT = taskList.reduce((acc, t) => acc + (t.turnaroundTime || 0), 0);
    const avgTurnaroundTime = Number((totalTAT / N).toFixed(2));

    // 3. Average Response Time (first start - arrival)
    const totalResponse = taskList.reduce((acc, t) => {
      const resp = t.firstStartTime !== null ? Math.max(0, t.firstStartTime - t.arrivalTime) : 0;
      return acc + resp;
    }, 0);
    const avgResponseTime = Number((totalResponse / N).toFixed(2));

    // 4. CPU Utilization
    const busyTime = timeline
      .filter((s) => s.type === 'EXECUTION')
      .reduce((acc, s) => acc + s.duration, 0);
    const cpuUtilization = totalExecutionTime > 0
      ? Number(((busyTime / totalExecutionTime) * 100).toFixed(1))
      : 0;

    // 5. Throughput (tasks / second)
    const makespanSec = totalExecutionTime / 1000;
    const throughput = makespanSec > 0
      ? Number((N / makespanSec).toFixed(1))
      : 0;

    // 6. Context Switches Count
    const contextSwitches = timeline.filter((s) => s.type === 'CONTEXT_SWITCH').length;

    // 7. Deadline Misses Count
    const deadlineMisses = taskList.filter((t) => t.missedDeadline).length;

    return {
      id: algo.id,
      name: algo.name,
      shortName: algo.shortName,
      tag: algo.tag,
      color: algo.color,
      description: algo.description,
      totalExecutionTime,
      avgWaitTime,
      avgTurnaroundTime,
      avgResponseTime,
      cpuUtilization,
      throughput,
      contextSwitches,
      deadlineMisses,
      timeline,
      taskStats,
    };
  });

  // Determine Best-Performing Algorithm for each metric
  // Lower is better: waitTime, turnaroundTime, responseTime, contextSwitches, deadlineMisses
  // Higher is better: cpuUtilization, throughput
  const bestPerformers = {
    avgWaitTime: findBest(results, 'avgWaitTime', 'min'),
    avgTurnaroundTime: findBest(results, 'avgTurnaroundTime', 'min'),
    avgResponseTime: findBest(results, 'avgResponseTime', 'min'),
    cpuUtilization: findBest(results, 'cpuUtilization', 'max'),
    throughput: findBest(results, 'throughput', 'max'),
    contextSwitches: findBest(results, 'contextSwitches', 'min'),
    deadlineMisses: findBest(results, 'deadlineMisses', 'min'),
  };

  // Grouped Bar Chart Data format
  const chartData = results.map((r) => ({
    name: r.shortName,
    avgWaitTime: r.avgWaitTime,
    avgTurnaroundTime: r.avgTurnaroundTime,
    avgResponseTime: r.avgResponseTime,
    cpuUtilization: r.cpuUtilization,
    contextSwitches: r.contextSwitches,
    deadlineMisses: r.deadlineMisses,
    throughput: r.throughput,
    color: r.color,
  }));

  return {
    results,
    bestPerformers,
    chartData,
  };
}

function findBest(results, metricKey, type = 'min') {
  if (!results || results.length === 0) return null;
  let best = results[0];
  for (let i = 1; i < results.length; i++) {
    const cur = results[i];
    if (type === 'min') {
      if (cur[metricKey] < best[metricKey]) best = cur;
    } else {
      if (cur[metricKey] > best[metricKey]) best = cur;
    }
  }
  return {
    algorithmId: best.id,
    algorithmName: best.shortName,
    color: best.color,
    value: best[metricKey],
  };
}

