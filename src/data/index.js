import { INITIAL_CORES } from './mockCores';
import { INITIAL_TASKS } from './mockTasks';
import {
  INITIAL_METRICS,
  generateTimelineHistory,
  ALGORITHM_PERFORMANCE_DATA,
  RECENT_ACTIVITY_LOG,
} from './mockMetrics';
import { MOCK_ALGORITHMS } from './mockAlgorithms';

export * from './mockCores';
export * from './mockTasks';
export * from './mockMetrics';
export * from './mockAlgorithms';

/**
 * Creates an initial snapshot of the entire scheduler state
 */
export function getInitialSchedulerSnapshot() {
  return {
    cores: JSON.parse(JSON.stringify(INITIAL_CORES)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    metrics: { ...INITIAL_METRICS },
    algorithms: JSON.parse(JSON.stringify(MOCK_ALGORITHMS)),
    activeAlgorithm: MOCK_ALGORITHMS.find((a) => a.active) || MOCK_ALGORITHMS[0],
    history: generateTimelineHistory(),
    algorithmComparison: [...ALGORITHM_PERFORMANCE_DATA],
    recentActivity: [...RECENT_ACTIVITY_LOG],
    schedulerRunning: true,
    lastTick: Date.now(),
  };
}

/**
 * Simulates a single scheduler step / tick
 * Used by the mock engine when C++ backend is not connected.
 */
export function simulateSchedulerTick(currentState) {
  if (!currentState || !currentState.schedulerRunning) {
    return currentState;
  }

  const tasks = [...currentState.tasks];
  let cores = [...currentState.cores];
  const metrics = { ...currentState.metrics };
  const history = [...currentState.history];
  let activity = [...(currentState.recentActivity || RECENT_ACTIVITY_LOG)];

  // 1. Advance running tasks
  let completedInThisTick = 0;
  const updatedTasks = tasks.map((task) => {
    if (task.state === 'running') {
      const step = Math.min(task.remainingTimeMs, Math.floor(Math.random() * 8) + 4);
      const remainingTimeMs = Math.max(0, task.remainingTimeMs - step);
      const progress = Math.min(100, Math.round(((task.burstTimeMs - remainingTimeMs) / task.burstTimeMs) * 100));

      if (remainingTimeMs === 0) {
        completedInThisTick++;
        return {
          ...task,
          state: 'completed',
          remainingTimeMs: 0,
          progress: 100,
          turnaroundTimeMs: task.waitTimeMs + task.burstTimeMs,
        };
      }
      return {
        ...task,
        remainingTimeMs,
        progress,
        vruntimeMs: Number((task.vruntimeMs + step * 0.4).toFixed(1)),
      };
    }

    if (task.state === 'ready') {
      return {
        ...task,
        waitTimeMs: task.waitTimeMs + 1,
      };
    }

    return task;
  });

  // 2. Replenish completed tasks from ready queue
  const runningCount = updatedTasks.filter((t) => t.state === 'running').length;
  if (runningCount < 6) {
    const readyTask = updatedTasks.find((t) => t.state === 'ready');
    if (readyTask) {
      readyTask.state = 'running';
      const idleCore = cores.find((c) => c.state === 'idle' || !c.activeTaskId);
      if (idleCore) {
        readyTask.assignedCore = idleCore.coreId;
        idleCore.state = 'running';
        idleCore.activeTaskId = readyTask.id;
      }
    }
  }

  // 3. Modulate CPU core loads realistically
  cores = cores.map((core) => {
    if (core.state === 'running') {
      const delta = (Math.random() * 12 - 6);
      const newLoad = Math.min(98, Math.max(25, Math.round(core.utilization + delta)));
      return {
        ...core,
        utilization: newLoad,
        temperatureC: Math.min(75, Math.max(42, Math.round(45 + newLoad * 0.22))),
        contextSwitchesTotal: core.contextSwitchesTotal + Math.floor(Math.random() * 4),
      };
    }
    return {
      ...core,
      utilization: Math.max(0, Math.round(core.utilization * 0.7)),
    };
  });

  // 4. Update overall metrics
  const activeCores = cores.filter((c) => c.state === 'running').length;
  const avgLoad = Math.round(cores.reduce((sum, c) => sum + c.utilization, 0) / cores.length);
  const userLoad = Math.round(avgLoad * 0.78);
  const systemLoad = Math.max(4, avgLoad - userLoad);

  metrics.overallCpuLoad = avgLoad;
  metrics.userLoad = userLoad;
  metrics.systemLoad = systemLoad;
  metrics.activeCores = activeCores;
  metrics.uptimeSeconds += 1;
  metrics.completedTasksCount = (metrics.completedTasksCount || 488) + completedInThisTick;
  metrics.totalTasks = (metrics.totalTasks || 542) + (completedInThisTick > 0 ? 1 : 0);
  metrics.contextSwitchesPerSec = Math.round(3000 + Math.random() * 250);
  metrics.throughputTasksPerSec = Number((138 + Math.random() * 20).toFixed(1));
  metrics.averageWaitTimeMs = Number((16.4 + Math.random() * 0.8).toFixed(1));

  // 5. Append rolling timeline point
  const now = new Date();
  const timeLabel = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  const readyDepth = updatedTasks.filter((t) => t.state === 'ready').length;

  const newHistory = [
    ...history.slice(1),
    {
      time: timeLabel,
      cpuLoad: avgLoad,
      userLoad,
      systemLoad,
      throughput: Math.round(metrics.throughputTasksPerSec),
      ctxSwitches: metrics.contextSwitchesPerSec,
      readyQueueDepth: readyDepth,
      avgLatency: Number((14 + Math.random() * 4).toFixed(1)),
    },
  ];

  return {
    ...currentState,
    cores,
    tasks: updatedTasks,
    metrics,
    history: newHistory,
    algorithmComparison: currentState.algorithmComparison || ALGORITHM_PERFORMANCE_DATA,
    recentActivity: activity,
    lastTick: Date.now(),
  };
}
