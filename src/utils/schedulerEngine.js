/**
 * Aegis Scheduler Simulation Engine
 * 
 * Deterministic implementation of standard and adaptive CPU scheduling algorithms:
 * - FCFS (First-Come, First-Served)
 * - SJF / SRTF (Shortest Remaining Time First)
 * - Round Robin (Preemptive Time Slicing)
 * - Aegis Adaptive Scheduling (Dynamic Priority + Aging + Adaptive Quantum)
 * 
 * Designed to mirror the exact JSON event stream that will later be produced
 * by the native C++ pthread backend.
 */

import { calculateTaskPriority, DEFAULT_WEIGHTS, DEFAULT_OPTIONS } from './adaptivePriorityMath';

export const TASK_COLORS = [
  '#18C6A3', // Teal
  '#7C8CFF', // Indigo
  '#38BDF8', // Sky
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#A855F7', // Violet
  '#FB923C', // Orange
  '#06B6D4', // Cyan
  '#EC4899', // Pink
];

export function getTaskColor(index) {
  return TASK_COLORS[index % TASK_COLORS.length];
}

/**
 * Standard default benchmark tasks for deterministic simulation
 */
export const DEFAULT_SIMULATION_TASKS = [
  {
    id: 'T-101',
    name: 'matrix_mult_avx',
    arrivalTime: 0,
    burstTimeMs: 40,
    deadline: 120,
    priority: 7,
    type: 'CPU-Bound',
  },
  {
    id: 'T-102',
    name: 'crypto_sha256',
    arrivalTime: 10,
    burstTimeMs: 25,
    deadline: 70,
    priority: 8,
    type: 'CPU-Bound',
  },
  {
    id: 'T-103',
    name: 'page_cache_flush',
    arrivalTime: 20,
    burstTimeMs: 15,
    deadline: 60,
    priority: 5,
    type: 'I/O-Bound',
  },
  {
    id: 'T-104',
    name: 'tcp_packet_pump',
    arrivalTime: 30,
    burstTimeMs: 30,
    deadline: 110,
    priority: 6,
    type: 'I/O-Bound',
  },
  {
    id: 'T-105',
    name: 'neural_infer_fp16',
    arrivalTime: 45,
    burstTimeMs: 50,
    deadline: 180,
    priority: 9,
    type: 'CPU-Bound',
  },
  {
    id: 'T-106',
    name: 'kernel_entropy',
    arrivalTime: 60,
    burstTimeMs: 10,
    deadline: 85,
    priority: 8,
    type: 'I/O-Bound',
  },
];

/**
 * Generate a deterministic execution timeline for the given tasks and algorithm
 * 
 * @param {Array} rawTasks
 * @param {string} algorithm - 'FCFS' | 'SJF' | 'ROUND_ROBIN' | 'AEGIS_ADAPTIVE'
 * @param {number} quantum - Time slice quantum in ms (for RR and Aegis)
 * @param {number} contextSwitchOverhead - Context switch overhead in ms (e.g. 1ms)
 * @returns {Object} { timeline, taskStats, totalExecutionTime }
 */
export function generateScheduleTimeline(
  rawTasks,
  algorithm = 'AEGIS_ADAPTIVE',
  quantum = 20,
  contextSwitchOverhead = 1,
  weights = DEFAULT_WEIGHTS,
  options = DEFAULT_OPTIONS
) {
  if (!rawTasks || rawTasks.length === 0) {
    return { timeline: [], taskStats: {}, totalExecutionTime: 0 };
  }

  // Clone tasks with colors and runtime fields
  const tasks = rawTasks.map((t, idx) => ({
    ...t,
    index: idx,
    color: getTaskColor(idx),
    remainingBurst: Number(t.burstTimeMs) || 10,
    burstTimeMs: Number(t.burstTimeMs) || 10,
    arrivalTime: Number(t.arrivalTime) || 0,
    deadline: Number(t.deadline) || 100,
    priority: Number(t.priority) || 5,
    dynamicPriority: Number(t.priority) || 5,
    firstStartTime: null,
    completionTime: null,
    waitingTime: 0,
    turnaroundTime: 0,
    timeInReadyQueue: 0,
  }));

  const timeline = [];
  let currentTime = 0;
  let lastTaskId = null;
  const readyQueue = [];
  const completedTaskIds = new Set();
  const maxSimulationTime = 5000; // Safeguard against infinite loops

  // Sort initial arrival
  const unarrivedTasks = [...tasks].sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Helper: check arrivals up to currentTime
  const updateArrivals = (time) => {
    while (unarrivedTasks.length > 0 && unarrivedTasks[0].arrivalTime <= time) {
      const arrived = unarrivedTasks.shift();
      readyQueue.push(arrived);
    }
  };

  // Helper to add context switch slice
  const addContextSwitch = (fromId, toId, startTime) => {
    if (contextSwitchOverhead > 0 && fromId && toId && fromId !== toId) {
      timeline.push({
        id: `cs-${startTime}`,
        type: 'CONTEXT_SWITCH',
        taskId: null,
        taskName: 'Context Switch',
        startTime,
        endTime: startTime + contextSwitchOverhead,
        duration: contextSwitchOverhead,
        color: '#202C40',
        fromTaskId: fromId,
        toTaskId: toId,
      });
      return startTime + contextSwitchOverhead;
    }
    return startTime;
  };

  while ((readyQueue.length > 0 || unarrivedTasks.length > 0) && currentTime < maxSimulationTime) {
    updateArrivals(currentTime);

    if (readyQueue.length === 0) {
      // CPU Idle: advance to next task's arrival time
      const nextTask = unarrivedTasks[0];
      const idleStart = currentTime;
      const idleEnd = nextTask.arrivalTime;
      timeline.push({
        id: `idle-${idleStart}`,
        type: 'IDLE',
        taskId: null,
        taskName: 'CPU Idle',
        startTime: idleStart,
        endTime: idleEnd,
        duration: idleEnd - idleStart,
        color: '#0D1422',
      });
      currentTime = idleEnd;
      updateArrivals(currentTime);
      continue;
    }

    // Select next task based on algorithm
    let selectedTask = null;
    let selectedIndex = -1;
    let executionDuration = 0;

    switch (algorithm) {
      case 'FCFS': {
        // First Come First Served: Pick first in queue (ordered by arrival)
        readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
        selectedIndex = 0;
        selectedTask = readyQueue[selectedIndex];
        // Non-preemptive: Run to completion
        executionDuration = selectedTask.remainingBurst;
        break;
      }

      case 'SJF': {
        // Preemptive Shortest Remaining Time First (SRTF)
        readyQueue.sort((a, b) => a.remainingBurst - b.remainingBurst);
        selectedIndex = 0;
        selectedTask = readyQueue[selectedIndex];

        // Run until next arrival or completion
        let nextEventTime = currentTime + selectedTask.remainingBurst;
        if (unarrivedTasks.length > 0 && unarrivedTasks[0].arrivalTime < nextEventTime) {
          nextEventTime = unarrivedTasks[0].arrivalTime;
        }
        executionDuration = Math.max(1, nextEventTime - currentTime);
        break;
      }

      case 'ROUND_ROBIN': {
        // FIFO queue with fixed quantum
        selectedIndex = 0;
        selectedTask = readyQueue.shift(); // Remove from front
        executionDuration = Math.min(quantum, selectedTask.remainingBurst);
        break;
      }

      case 'AEGIS_ADAPTIVE':
      default: {
        // Multi-level feedback driven by Aegis 3-factor Adaptive Priority calculation
        // Priority = w_deadline * Urgency + w_wait * WaitScore + w_cpu * (1 - CPUScore)
        readyQueue.forEach((t) => {
          t.timeInReadyQueue = (t.timeInReadyQueue || 0) + 1;
        });

        // Calculate dynamic Aegis score for each ready task at this exact currentTime
        readyQueue.sort((a, b) => {
          const calcA = calculateTaskPriority(a, currentTime, weights, options);
          const calcB = calculateTaskPriority(b, currentTime, weights, options);
          if (calcB.compositePriority !== calcA.compositePriority) {
            return calcB.compositePriority - calcA.compositePriority;
          }
          return a.remainingBurst - b.remainingBurst;
        });

        selectedIndex = 0;
        selectedTask = readyQueue.shift();

        // Adaptive quantum: tasks with high urgency/priority get crisp responsive slices
        const calcWinner = calculateTaskPriority(selectedTask, currentTime, weights, options);
        selectedTask.dynamicPriority = Math.round(calcWinner.compositePriority * 10);
        const adaptiveSlice = Math.max(10, Math.min(quantum, selectedTask.remainingBurst));
        executionDuration = adaptiveSlice;
        break;
      }
    }

    // Apply context switch if switching tasks
    currentTime = addContextSwitch(lastTaskId, selectedTask.id, currentTime);

    // Record first start time
    if (selectedTask.firstStartTime === null) {
      selectedTask.firstStartTime = currentTime;
    }

    // Record execution slice
    const sliceStart = currentTime;
    const sliceEnd = currentTime + executionDuration;
    currentTime = sliceEnd;

    selectedTask.remainingBurst -= executionDuration;
    lastTaskId = selectedTask.id;

    timeline.push({
      id: `exec-${selectedTask.id}-${sliceStart}`,
      type: 'EXECUTION',
      taskId: selectedTask.id,
      taskName: selectedTask.name,
      priority: selectedTask.dynamicPriority || selectedTask.priority,
      startTime: sliceStart,
      endTime: sliceEnd,
      duration: executionDuration,
      color: selectedTask.color,
      progress: Math.round(((selectedTask.burstTimeMs - selectedTask.remainingBurst) / selectedTask.burstTimeMs) * 100),
      remainingBurstAfter: selectedTask.remainingBurst,
    });

    // Check if task finished
    if (selectedTask.remainingBurst <= 0) {
      selectedTask.completionTime = sliceEnd;
      selectedTask.turnaroundTime = selectedTask.completionTime - selectedTask.arrivalTime;
      selectedTask.waitingTime = Math.max(0, selectedTask.turnaroundTime - selectedTask.burstTimeMs);
      completedTaskIds.add(selectedTask.id);

      // If FCFS or SJF, remove from readyQueue
      if (algorithm === 'FCFS' || algorithm === 'SJF') {
        readyQueue.splice(selectedIndex, 1);
      }
    } else {
      // Re-enqueue unfinished task
      if (algorithm === 'ROUND_ROBIN' || algorithm === 'AEGIS_ADAPTIVE') {
        // Put at back of queue
        readyQueue.push(selectedTask);
      }
      // (For SJF, task remains in readyQueue with reduced remainingBurst)
    }
  }

  // Build task statistics
  const taskStats = {};
  tasks.forEach((t) => {
    taskStats[t.id] = {
      id: t.id,
      name: t.name,
      arrivalTime: t.arrivalTime,
      burstTimeMs: t.burstTimeMs,
      deadline: t.deadline,
      priority: t.priority,
      color: t.color,
      firstStartTime: t.firstStartTime,
      completionTime: t.completionTime,
      turnaroundTime: t.turnaroundTime,
      waitingTime: t.waitingTime,
      missedDeadline: t.completionTime !== null && t.completionTime > t.deadline,
    };
  });

  return {
    timeline,
    taskStats,
    totalExecutionTime: currentTime,
  };
}

/**
 * Get the simulation snapshot at a specific logical clock time
 * 
 * @param {Array} timeline
 * @param {Array} originalTasks
 * @param {number} currentTime
 * @returns {Object} live snapshot
 */
export function getSimulationStateAtTime(timeline, originalTasks, currentTime) {
  // Find currently active slice
  const activeSlice = timeline.find(
    (slice) => currentTime >= slice.startTime && currentTime < slice.endTime
  );

  // Slices up to current time (for Gantt)
  const pastSlices = timeline
    .filter((slice) => slice.startTime <= currentTime)
    .map((slice) => {
      if (slice.endTime > currentTime) {
        // Active partial slice
        return {
          ...slice,
          partialEndTime: currentTime,
          partialDuration: currentTime - slice.startTime,
          isActive: true,
        };
      }
      return {
        ...slice,
        isActive: false,
      };
    });

  // Calculate dynamic task states
  const tasksWithState = originalTasks.map((t, idx) => {
    const executedSlices = timeline.filter(
      (s) => s.type === 'EXECUTION' && s.taskId === t.id && s.startTime < currentTime
    );

    let executedDuration = 0;
    executedSlices.forEach((s) => {
      const sliceEnd = Math.min(currentTime, s.endTime);
      executedDuration += Math.max(0, sliceEnd - s.startTime);
    });

    const burst = Number(t.burstTimeMs) || 10;
    const remainingTime = Math.max(0, burst - executedDuration);
    const progress = Math.min(100, Math.round((executedDuration / burst) * 100));

    let status = 'ready';
    if (t.arrivalTime > currentTime) {
      status = 'waiting'; // not arrived yet
    } else if (remainingTime === 0) {
      status = 'completed';
    } else if (activeSlice && activeSlice.type === 'EXECUTION' && activeSlice.taskId === t.id) {
      status = 'running';
    } else {
      status = 'ready';
    }

    return {
      ...t,
      color: getTaskColor(idx),
      remainingTime,
      progress,
      status,
      executedDuration,
    };
  });

  const runningTask = tasksWithState.find((t) => t.status === 'running') || null;
  const readyQueue = tasksWithState.filter((t) => t.status === 'ready');
  const completedTasks = tasksWithState.filter((t) => t.status === 'completed');
  const remainingWorkload = tasksWithState.reduce((sum, t) => sum + t.remainingTime, 0);

  return {
    currentTime,
    activeSlice,
    runningTask,
    readyQueue,
    completedTasks,
    remainingWorkload,
    tasksWithState,
    pastSlices,
    isComplete: completedTasks.length === originalTasks.length && originalTasks.length > 0,
  };
}

