/**
 * OS Course Core Calculations & Scheduling Metrics
 * Standard Operating Systems formulas for Turnaround Time, Waiting Time,
 * Throughput, Context Switch overhead, and Starvation Risk.
 */

/**
 * Calculate Turnaround Time: Completion Time - Arrival Time
 */
export function calculateTurnaroundTime(completionTime, arrivalTime) {
  return Math.max(0, completionTime - arrivalTime);
}

/**
 * Calculate Waiting Time: Turnaround Time - Burst Time
 */
export function calculateWaitingTime(turnaroundTime, burstTime) {
  return Math.max(0, turnaroundTime - burstTime);
}

/**
 * Calculate CPU Throughput: Completed Tasks / Total Elapsed Time (in seconds)
 */
export function calculateThroughput(completedTaskCount, elapsedSeconds) {
  if (!elapsedSeconds || elapsedSeconds <= 0) return 0;
  return Number((completedTaskCount / elapsedSeconds).toFixed(2));
}

/**
 * Determine dynamic starvation risk score (0 to 100)
 * Evaluated by wait time in ready queue relative to priority and aging threshold.
 */
export function calculateStarvationRisk(timeInQueueMs, priority, maxToleranceMs = 15000) {
  if (!timeInQueueMs || timeInQueueMs <= 0) return 0;
  // Higher priority tasks expect faster response; low priority can wait longer
  const weight = (10 - Math.min(Math.max(priority, 1), 10)) / 10 + 0.5;
  const ratio = (timeInQueueMs * weight) / maxToleranceMs;
  return Math.min(100, Math.round(ratio * 100));
}

/**
 * Compute average of an array of numbers
 */
export function computeAverage(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  return Number((sum / values.length).toFixed(2));
}

