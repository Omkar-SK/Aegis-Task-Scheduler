/**
 * Aegis Scheduler Service
 * 
 * Centralized service layer for scheduler execution controls, multi-algorithm
 * benchmarking, and state snapshots. Interacts with C++ daemon via api.js.
 */

import api from './api.js';
import {
  getInitialSchedulerSnapshot,
  simulateSchedulerTick,
  MOCK_ALGORITHMS,
} from '../data';

let localSimulationState = getInitialSchedulerSnapshot();

export const schedulerService = {
  /**
   * Check connection status to C++ backend daemon
   * @returns {Promise<{ online: boolean, latencyMs: number|null, mode: string, message: string }>}
   */
  async checkBackendHealth() {
    return await api.checkHealth();
  },

  /**
   * Start the scheduler dispatch loop
   * POST /api/scheduler/run
   * 
   * @param {Object} [options]
   * @param {string} [options.algorithmId]
   * @param {number} [options.quantum]
   */
  async run(options = {}) {
    const res = await api.post('/api/scheduler/run', options);
    localSimulationState.schedulerRunning = true;
    return res;
  },

  /**
   * Pause scheduler execution
   * POST /api/scheduler/pause
   */
  async pause() {
    const res = await api.post('/api/scheduler/pause', {});
    localSimulationState.schedulerRunning = false;
    return res;
  },

  /**
   * Resume scheduler execution
   * POST /api/scheduler/resume
   */
  async resume() {
    const res = await api.post('/api/scheduler/resume', {});
    localSimulationState.schedulerRunning = true;
    return res;
  },

  /**
   * Reset scheduler state and logical clock
   * POST /api/scheduler/reset
   */
  async reset() {
    const res = await api.post('/api/scheduler/reset', {});
    localSimulationState = getInitialSchedulerSnapshot();
    return res;
  },

  /**
   * Run multi-algorithm comparative benchmark
   * POST /api/scheduler/compare
   * 
   * @param {Object} payload
   * @param {Array<import('./contracts').TaskResponse>} [payload.tasks]
   * @param {number} [payload.quantum=20]
   * @param {Object} [payload.weights]
   * @param {string} [payload.workloadName]
   * @returns {Promise<{ data: import('./contracts').AlgorithmComparisonReport }>}
   */
  async compareAlgorithms(payload = {}) {
    return await api.post('/api/scheduler/compare', payload);
  },

  /**
   * Retrieve comparison report by Run ID
   * GET /api/scheduler/results/:runId
   * 
   * @param {string} runId
   * @returns {Promise<{ data: import('./contracts').AlgorithmComparisonReport }>}
   */
  async getRunResults(runId) {
    return await api.get(`/api/scheduler/results/${runId}`);
  },

  /**
   * Get latest snapshot of scheduler, cores, and tasks
   * 
   * @returns {Promise<{ data: import('./contracts').SchedulerStateSnapshot, source: string }>}
   */
  async getSnapshot() {
    // If backend is online, query native C++ snapshot
    if (api.isBackendOnline) {
      try {
        const res = await api.get('/status');
        return { data: res.data, source: 'CXX_CORE' };
      } catch (err) {
        console.warn('Native snapshot query failed, falling back to local simulation:', err);
      }
    }

    // Advance local simulation state
    localSimulationState = simulateSchedulerTick(localSimulationState);
    return { data: localSimulationState, source: 'SIMULATION' };
  },

  /**
   * Change active scheduling algorithm policy
   * 
   * @param {string} algorithmId
   */
  async setAlgorithm(algorithmId) {
    if (api.isBackendOnline) {
      try {
        await api.post('/algorithms/select', { algorithmId });
      } catch (e) {
        console.warn('Backend algorithm selection failed:', e);
      }
    }

    const algo = MOCK_ALGORITHMS.find((a) => a.id === algorithmId);
    if (algo) {
      localSimulationState.algorithms = localSimulationState.algorithms.map((a) => ({
        ...a,
        active: a.id === algorithmId,
      }));
      localSimulationState.activeAlgorithm = algo;
    }
    return { success: true, activeAlgorithm: algo };
  },

  /**
   * Pause/resume running state helper
   */
  async setRunningState(shouldRun) {
    if (shouldRun) {
      return await this.resume();
    }
    return await this.pause();
  },

  /**
   * Kill / terminate a task
   */
  async killTask(taskId) {
    if (api.isBackendOnline) {
      try {
        await api.post(`/tasks/${taskId}/kill`, {});
      } catch (e) {
        console.warn('Backend task kill failed:', e);
      }
    }

    const task = localSimulationState.tasks.find((t) => t.id === taskId);
    if (task) {
      task.state = 'completed';
      task.remainingTimeMs = 0;
      task.progress = 100;
      if (task.assignedCore !== null) {
        localSimulationState.cores = localSimulationState.cores.map((c) =>
          c.coreId === task.assignedCore
            ? { ...c, state: 'idle', activeTaskId: null, utilization: 0 }
            : c
        );
      }
    }
    return { success: true };
  },

  /**
   * Preempt an active task back to ready queue
   */
  async preemptTask(taskId) {
    const task = localSimulationState.tasks.find((t) => t.id === taskId);
    if (task && task.state === 'running') {
      const coreId = task.assignedCore;
      task.state = 'ready';
      task.assignedCore = null;

      if (coreId !== null) {
        localSimulationState.cores = localSimulationState.cores.map((c) =>
          c.coreId === coreId
            ? { ...c, state: 'idle', activeTaskId: null, utilization: 10 }
            : c
        );
      }
    }
    return { success: true };
  },

  /**
   * Boost task priority
   */
  async boostPriority(taskId, delta = 2) {
    const task = localSimulationState.tasks.find((t) => t.id === taskId);
    if (task) {
      task.priority = Math.min(10, (task.priority || 5) + delta);
      task.waitTimeMs = Math.max(0, task.waitTimeMs - 10);
    }
    return { success: true, task };
  },

  /**
   * Clear completed tasks from queue
   */
  clearCompleted() {
    localSimulationState.tasks = localSimulationState.tasks.filter((t) => t.state !== 'completed');
    return { success: true };
  },

  /**
   * Reset simulation snapshot registers
   */
  resetSimulation() {
    localSimulationState = getInitialSchedulerSnapshot();
    return localSimulationState;
  },
};

export default schedulerService;
