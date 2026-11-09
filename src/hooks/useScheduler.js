import { useState, useEffect, useCallback } from 'react';
import schedulerService from '../services/schedulerService';
import taskService from '../services/taskService';
import useInterval from './useInterval';

/**
 * Master hook for Aegis Scheduler state and actions
 * @param {Object} options
 * @param {number} options.pollingIntervalMs - Polling tick interval in ms (default 1000)
 * @param {boolean} options.autoPoll - Whether polling is active (default true)
 */
export function useScheduler({ pollingIntervalMs = 1000, autoPoll = true } = {}) {
  const [schedulerState, setSchedulerState] = useState(null);
  const [sourceMode, setSourceMode] = useState('SIMULATION'); // 'CXX_CORE' | 'SIMULATION'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' });

  // Initial load & health check
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const health = await schedulerService.checkBackendHealth();
      setBackendStatus({
        connected: health.online,
        latencyMs: health.latencyMs,
        message: health.message,
      });

      const { data, source } = await schedulerService.getSnapshot();
      setSchedulerState(data);
      setSourceMode(source);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch scheduler state', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Tick update
  const tick = useCallback(async () => {
    if (!autoPoll) return;
    try {
      const { data, source } = await schedulerService.getSnapshot();
      setSchedulerState(data);
      setSourceMode(source);
    } catch (err) {
      console.error('Tick error', err);
    }
  }, [autoPoll]);

  // Interval execution
  useInterval(tick, schedulerState?.schedulerRunning ? pollingIntervalMs : null);

  // Scheduler Controls
  const toggleRunning = useCallback(async () => {
    if (!schedulerState) return;
    const nextRunning = !schedulerState.schedulerRunning;
    await schedulerService.setRunningState(nextRunning);
    setSchedulerState((prev) => ({
      ...prev,
      schedulerRunning: nextRunning,
    }));
  }, [schedulerState]);

  const switchAlgorithm = useCallback(async (algoId) => {
    await schedulerService.setAlgorithm(algoId);
    setSchedulerState((prev) => {
      if (!prev || !prev.algorithms) return prev;
      const updatedAlgorithms = prev.algorithms.map((a) => ({
        ...a,
        active: a.id === algoId,
      }));
      const active = updatedAlgorithms.find((a) => a.id === algoId) || prev.activeAlgorithm;
      return {
        ...prev,
        algorithms: updatedAlgorithms,
        activeAlgorithm: active,
      };
    });
  }, []);

  const submitTask = useCallback(async (taskPayload) => {
    const res = await taskService.createTask(taskPayload);
    if (res.data) {
      setSchedulerState((prev) => ({
        ...prev,
        tasks: [res.data, ...(prev?.tasks || [])],
      }));
    }
    return res;
  }, []);

  const killTask = useCallback(async (taskId) => {
    await schedulerService.killTask(taskId);
    const { data } = await schedulerService.getSnapshot();
    setSchedulerState(data);
  }, []);

  const preemptTask = useCallback(async (taskId) => {
    await schedulerService.preemptTask(taskId);
    const { data } = await schedulerService.getSnapshot();
    setSchedulerState(data);
  }, []);

  const boostPriority = useCallback(async (taskId, delta = 2) => {
    await schedulerService.boostPriority(taskId, delta);
    const { data } = await schedulerService.getSnapshot();
    setSchedulerState(data);
  }, []);

  const clearCompleted = useCallback(() => {
    schedulerService.clearCompleted();
    setSchedulerState((prev) => {
      if (!prev || !prev.tasks) return prev;
      return {
        ...prev,
        tasks: prev.tasks.filter((t) => t.state !== 'completed'),
      };
    });
  }, []);

  const resetSimulation = useCallback(async () => {
    await schedulerService.reset();
    const fresh = schedulerService.resetSimulation();
    setSchedulerState(fresh);
  }, []);

  return {
    state: schedulerState,
    loading,
    error,
    sourceMode,
    backendStatus,
    isRunning: schedulerState?.schedulerRunning ?? false,
    tasks: schedulerState?.tasks || [],
    cores: schedulerState?.cores || [],
    metrics: schedulerState?.metrics || {},
    history: schedulerState?.history || [],
    algorithmComparison: schedulerState?.algorithmComparison || [],
    recentActivity: schedulerState?.recentActivity || [],
    algorithms: schedulerState?.algorithms || [],
    activeAlgorithm: schedulerState?.activeAlgorithm || null,
    // Actions
    toggleRunning,
    switchAlgorithm,
    submitTask,
    killTask,
    preemptTask,
    boostPriority,
    clearCompleted,
    resetSimulation,
    refresh: fetchStatus,
  };
}

export default useScheduler;
