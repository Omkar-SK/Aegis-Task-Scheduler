/**
 * Aegis Adaptive Dynamic Priority Engine
 * 
 * Implements the deterministic 3-factor dynamic priority formula:
 * 
 *   Priority = w_deadline * DeadlineUrgency
 *            + w_wait     * WaitingScore
 *            + w_cpu      * (1 - CPUConsumptionScore)
 * 
 * All factors normalized between [0, 1].
 * Weights strictly sum to 1.00.
 */

export const DEFAULT_WEIGHTS = {
  deadline: 0.50,
  wait: 0.20,
  cpu: 0.30,
};

export const DEFAULT_OPTIONS = {
  starvationThreshold: 40,      // ms in ready queue before starvation alert
  deadlineWarningThreshold: 25, // ms remaining slack before deadline alert
  maxWaitReference: 80,         // ms for normalizing waiting score to 1.0
};

/**
 * Normalizes all three priority factors and calculates composite score
 * 
 * @param {Object} task - Task object with arrivalTime, burstTimeMs, remainingTime/remainingBurst, deadline
 * @param {number} currentTime - Current logical simulation clock in ms
 * @param {Object} weights - { deadline, wait, cpu } summing to 1.0
 * @param {Object} options - { starvationThreshold, deadlineWarningThreshold, maxWaitReference }
 * @returns {Object} Deterministic factor breakdown and composite score
 */
export function calculateTaskPriority(
  task,
  currentTime = 0,
  weights = DEFAULT_WEIGHTS,
  options = DEFAULT_OPTIONS
) {
  const arrivalTime = Number(task.arrivalTime) || 0;
  const burstTime = Number(task.burstTimeMs) || 10;
  const deadline = Number(task.deadline) || (arrivalTime + burstTime * 2);
  const remainingBurst = task.remainingTime !== undefined 
    ? Number(task.remainingTime) 
    : (task.remainingBurst !== undefined ? Number(task.remainingBurst) : burstTime);

  const executedBurst = Math.max(0, burstTime - remainingBurst);
  const isCompleted = remainingBurst <= 0 || task.status === 'completed';
  const hasArrived = currentTime >= arrivalTime;

  // 1. FACTOR: Deadline Urgency [0, 1]
  // As current time approaches deadline, urgency rises towards 1.0.
  let deadlineUrgency = 0;
  const slack = deadline - currentTime;
  const totalWindow = Math.max(10, deadline - arrivalTime);

  if (isCompleted) {
    deadlineUrgency = 0;
  } else if (!hasArrived) {
    deadlineUrgency = 0;
  } else if (slack <= 0) {
    deadlineUrgency = 1.0; // Overdue / deadline reached
  } else {
    // 1 - (slack / totalWindow)
    deadlineUrgency = Math.max(0, Math.min(1, 1 - (slack / totalWindow)));
  }

  // 2. FACTOR: Waiting Time Score [0, 1]
  // Measures queue latency without CPU access.
  let waitingScore = 0;
  let currentWait = 0;
  const maxWaitRef = options.maxWaitReference || 80;

  if (hasArrived && !isCompleted) {
    if (task.timeInReadyQueue !== undefined) {
      currentWait = task.timeInReadyQueue;
    } else if (task.waitTimeMs !== undefined && task.status === 'ready') {
      currentWait = task.waitTimeMs;
    } else {
      currentWait = Math.max(0, currentTime - arrivalTime - executedBurst);
    }
    waitingScore = Math.max(0, Math.min(1, currentWait / maxWaitRef));
  }

  // 3. FACTOR: CPU Consumption Score [0, 1] & CPU Favor Score [0, 1]
  // Tasks that have consumed little CPU time get higher favor (1 - cpuScore).
  let cpuConsumptionScore = 0;
  let cpuFavorScore = 1;

  if (burstTime > 0) {
    cpuConsumptionScore = Math.max(0, Math.min(1, executedBurst / burstTime));
    cpuFavorScore = 1 - cpuConsumptionScore;
  }

  // COMPOSITE PRIORITY FORMULA
  const wD = weights.deadline ?? 0.5;
  const wW = weights.wait ?? 0.2;
  const wC = weights.cpu ?? 0.3;

  const deadlineContribution = Number((wD * deadlineUrgency).toFixed(4));
  const waitContribution = Number((wW * waitingScore).toFixed(4));
  const cpuContribution = Number((wC * cpuFavorScore).toFixed(4));

  let compositePriority = 0;
  if (hasArrived && !isCompleted) {
    compositePriority = Number((deadlineContribution + waitContribution + cpuContribution).toFixed(4));
  }

  // Warnings
  const starvationThreshold = options.starvationThreshold || 40;
  const deadlineWarningThreshold = options.deadlineWarningThreshold || 25;

  const isDeadlineApproaching =
    hasArrived &&
    !isCompleted &&
    slack > 0 &&
    slack <= deadlineWarningThreshold;

  const isDeadlineMissed = hasArrived && !isCompleted && slack <= 0;

  const isStarving =
    hasArrived &&
    !isCompleted &&
    task.status !== 'running' &&
    currentWait >= starvationThreshold;

  return {
    taskId: task.id,
    taskName: task.name,
    color: task.color,
    status: task.status || (isCompleted ? 'completed' : hasArrived ? 'ready' : 'waiting'),
    deadlineUrgency: Number(deadlineUrgency.toFixed(3)),
    waitingScore: Number(waitingScore.toFixed(3)),
    cpuConsumptionScore: Number(cpuConsumptionScore.toFixed(3)),
    cpuFavorScore: Number(cpuFavorScore.toFixed(3)),
    compositePriority: Number(compositePriority.toFixed(3)),
    breakdown: {
      deadlineContribution,
      waitContribution,
      cpuContribution,
    },
    slack,
    currentWait,
    isDeadlineApproaching,
    isDeadlineMissed,
    isStarving,
  };
}

/**
 * Adjust weights while ensuring they strictly sum to 1.00
 * Proportional redistribution across the other two weights.
 */
export function adjustWeights(changedKey, rawNewValue, currentWeights) {
  const newValue = Math.max(0.05, Math.min(0.90, Number(rawNewValue)));
  const remaining = Number((1.0 - newValue).toFixed(4));

  const otherKeys = ['deadline', 'wait', 'cpu'].filter((k) => k !== changedKey);
  const currentOtherSum = currentWeights[otherKeys[0]] + currentWeights[otherKeys[1]];

  let newOther1;
  let newOther2;

  if (currentOtherSum <= 0.001) {
    newOther1 = Number((remaining / 2).toFixed(2));
    newOther2 = Number((remaining - newOther1).toFixed(2));
  } else {
    const ratio1 = currentWeights[otherKeys[0]] / currentOtherSum;
    newOther1 = Number((remaining * ratio1).toFixed(2));
    newOther2 = Number((remaining - newOther1).toFixed(2));
  }

  return {
    [changedKey]: Number(newValue.toFixed(2)),
    [otherKeys[0]]: newOther1,
    [otherKeys[1]]: newOther2,
  };
}

/**
 * Generate discrete history data points for Recharts priority history chart
 */
export function generatePriorityHistory(tasks, currentTime, weights, options) {
  if (!tasks || tasks.length === 0) return [];

  const points = [];
  const maxSampleTime = Math.max(currentTime, 10);
  const step = Math.max(1, Math.floor(maxSampleTime / 15));

  for (let t = 0; t <= maxSampleTime; t += step) {
    const point = { time: `${t}ms`, rawTime: t };
    tasks.forEach((task) => {
      const calc = calculateTaskPriority(task, t, weights, options);
      point[task.id] = calc.compositePriority;
    });
    points.push(point);
  }

  // Ensure current time point is included
  if (points.length === 0 || points[points.length - 1].rawTime !== currentTime) {
    const curPoint = { time: `${currentTime}ms`, rawTime: currentTime };
    tasks.forEach((task) => {
      const calc = calculateTaskPriority(task, currentTime, weights, options);
      curPoint[task.id] = calc.compositePriority;
    });
    points.push(curPoint);
  }

  return points;
}

