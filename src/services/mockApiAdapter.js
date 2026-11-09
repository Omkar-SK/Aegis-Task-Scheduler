/**
 * Aegis Mock API Adapter
 * 
 * Simulates a C++ backend REST API service in the browser with deterministic
 * state persistence, input validation, and asynchronous network latency.
 * 
 * Implements endpoints:
 * - POST /api/tasks
 * - GET /api/tasks
 * - PUT /api/tasks/:id
 * - DELETE /api/tasks/:id
 * - POST /api/scheduler/run
 * - POST /api/scheduler/pause
 * - POST /api/scheduler/resume
 * - POST /api/scheduler/reset
 * - POST /api/scheduler/compare
 * - GET /api/scheduler/results/:runId
 */

import { DEFAULT_SIMULATION_TASKS } from '../utils/schedulerEngine.js';
import { runAlgorithmBenchmark } from '../utils/algorithmBenchmarkEngine.js';
import { WORKLOAD_PRESETS } from '../data/workloadPresets.js';

// Storage key for tasks
const TASKS_STORAGE_KEY = 'aegis_tasks_registry';

// Internal in-memory state
let inMemoryTasks = null;
let schedulerRunning = false;
let simulationTimeMs = 0;
let activeAlgorithmId = 'AEGIS_ADAPTIVE';
let benchmarkRuns = new Map();

// Helper to simulate realistic async network roundtrip
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

function loadTasks() {
  if (inMemoryTasks) return inMemoryTasks;
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      inMemoryTasks = JSON.parse(raw);
      return inMemoryTasks;
    }
  } catch (err) {
    console.warn('Failed to parse stored tasks, using initial defaults', err);
  }
  // Fallback to balanced preset tasks
  inMemoryTasks = (WORKLOAD_PRESETS.BALANCED?.tasks || DEFAULT_SIMULATION_TASKS).map((t, i) => ({
    ...t,
    id: t.id || `T-${1000 + i + 1}`,
    name: t.name || `task_${i + 1}`,
    arrivalTime: t.arrivalTime ?? i * 10,
    burstTime: t.burstTimeMs ?? t.burstTime ?? 20,
    burstTimeMs: t.burstTimeMs ?? t.burstTime ?? 20,
    deadline: t.deadline ?? 100 + i * 20,
    priority: t.priority ?? 5,
    state: t.state || 'ready',
    remainingTime: t.remainingTime ?? t.burstTimeMs ?? 20,
    waitTimeMs: t.waitTimeMs ?? 0,
    turnaroundTimeMs: t.turnaroundTimeMs ?? 0,
  }));
  saveTasks(inMemoryTasks);
  return inMemoryTasks;
}

function saveTasks(tasks) {
  inMemoryTasks = tasks;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('localStorage save failed', e);
  }
}

export const mockApiAdapter = {
  /**
   * GET /api/tasks
   * Lists tasks with optional filtering, search, and sorting
   */
  async getTasks(params = {}) {
    await delay(60);
    let list = [...loadTasks()];

    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (t) => t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'all') {
      list = list.filter((t) => t.state === params.status);
    }

    if (params.sortBy) {
      const field = params.sortBy;
      const order = params.order === 'desc' ? -1 : 1;
      list.sort((a, b) => {
        const valA = a[field] ?? 0;
        const valB = b[field] ?? 0;
        if (typeof valA === 'string') return valA.localeCompare(valB) * order;
        return (valA - valB) * order;
      });
    }

    return {
      status: 200,
      data: list,
      count: list.length,
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * POST /api/tasks
   * Creates a new task descriptor
   */
  async createTask(payload) {
    await delay(80);
    if (!payload.name || !payload.burstTime) {
      throw new Error('Task creation requires valid name and burstTime > 0');
    }

    const tasks = loadTasks();
    const newId = payload.id || `T-${1000 + tasks.length + 1}`;
    const burst = Number(payload.burstTime || payload.burstTimeMs) || 20;
    const arrival = Number(payload.arrivalTime) || 0;
    const deadline = Number(payload.deadline) || arrival + burst * 2;

    const newTask = {
      id: newId,
      name: payload.name.trim(),
      arrivalTime: arrival,
      burstTime: burst,
      burstTimeMs: burst,
      remainingTime: burst,
      deadline,
      priority: Number(payload.priority) || 5,
      type: payload.type || 'CPU-Bound',
      state: 'ready',
      assignedCore: null,
      assignedThread: null,
      waitTimeMs: 0,
      turnaroundTimeMs: 0,
      progress: 0,
      memoryKb: Number(payload.memoryKb) || 16384,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    saveTasks(tasks);

    return {
      status: 201,
      data: newTask,
      message: `Task ${newId} created successfully`,
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * PUT /api/tasks/:id
   * Updates an existing task
   */
  async updateTask(id, updates) {
    await delay(70);
    const tasks = loadTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task ${id} not found`);
    }

    const existing = tasks[index];
    const updated = {
      ...existing,
      ...updates,
      burstTime: updates.burstTime !== undefined ? Number(updates.burstTime) : existing.burstTime,
      burstTimeMs: updates.burstTime !== undefined ? Number(updates.burstTime) : existing.burstTime,
      remainingTime: updates.burstTime !== undefined ? Number(updates.burstTime) : existing.remainingTime,
      deadline: updates.deadline !== undefined ? Number(updates.deadline) : existing.deadline,
      priority: updates.priority !== undefined ? Number(updates.priority) : existing.priority,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updated;
    saveTasks(tasks);

    return {
      status: 200,
      data: updated,
      message: `Task ${id} updated`,
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * DELETE /api/tasks/:id
   * Removes a task from the registry
   */
  async deleteTask(id) {
    await delay(60);
    const tasks = loadTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) {
      throw new Error(`Task ${id} not found`);
    }
    saveTasks(filtered);

    return {
      status: 200,
      message: `Task ${id} deleted successfully`,
      id,
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * POST /api/scheduler/run
   */
  async runScheduler(options = {}) {
    await delay(50);
    schedulerRunning = true;
    if (options.algorithmId) activeAlgorithmId = options.algorithmId;

    return {
      status: 200,
      isRunning: true,
      activeAlgorithm: activeAlgorithmId,
      message: 'Aegis scheduler engine loop started',
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * POST /api/scheduler/pause
   */
  async pauseScheduler() {
    await delay(40);
    schedulerRunning = false;

    return {
      status: 200,
      isRunning: false,
      message: 'Aegis scheduler execution paused',
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * POST /api/scheduler/resume
   */
  async resumeScheduler() {
    await delay(40);
    schedulerRunning = true;

    return {
      status: 200,
      isRunning: true,
      message: 'Aegis scheduler execution resumed',
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * POST /api/scheduler/reset
   */
  async resetScheduler() {
    await delay(60);
    schedulerRunning = false;
    simulationTimeMs = 0;
    // Reset tasks remaining times
    const tasks = loadTasks().map((t) => ({
      ...t,
      state: 'ready',
      remainingTime: t.burstTime,
      waitTimeMs: 0,
      turnaroundTimeMs: 0,
      progress: 0,
      assignedCore: null,
    }));
    saveTasks(tasks);

    return {
      status: 200,
      message: 'Aegis scheduler state and registers reset to zero',
      simTimeMs: 0,
      tasksCount: tasks.length,
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * POST /api/scheduler/compare
   * Runs comparative benchmark across all 4 algorithms on identical tasks
   */
  async compareAlgorithms(payload = {}) {
    await delay(120);
    const tasks = payload.tasks || loadTasks();
    const quantum = payload.quantum || 20;
    const weights = payload.weights || { deadline: 0.5, wait: 0.2, cpu: 0.3 };

    const benchmark = runAlgorithmBenchmark(tasks, quantum, weights);
    const runId = `run-${payload.workloadId || 'custom'}-${Date.now()}`;

    const report = {
      runId,
      workloadName: payload.workloadName || 'Standard Evaluation Workload',
      taskCount: tasks.length,
      quantum,
      results: benchmark.results,
      bestPerformers: benchmark.bestPerformers,
      timestamp: new Date().toISOString(),
    };

    benchmarkRuns.set(runId, report);

    return {
      status: 200,
      data: report,
      source: 'MOCK_ADAPTER',
    };
  },

  /**
   * GET /api/scheduler/results/:runId
   */
  async getRunResults(runId) {
    await delay(50);
    const report = benchmarkRuns.get(runId);
    if (!report) {
      // If not in map, generate on-the-fly for default preset
      const tasks = loadTasks();
      const benchmark = runAlgorithmBenchmark(tasks, 20);
      const generated = {
        runId,
        workloadName: 'Cached Benchmark Run',
        taskCount: tasks.length,
        quantum: 20,
        results: benchmark.results,
        bestPerformers: benchmark.bestPerformers,
        timestamp: new Date().toISOString(),
      };
      benchmarkRuns.set(runId, generated);
      return {
        status: 200,
        data: generated,
        source: 'MOCK_ADAPTER',
      };
    }

    return {
      status: 200,
      data: report,
      source: 'MOCK_ADAPTER',
    };
  },
};

export default mockApiAdapter;
