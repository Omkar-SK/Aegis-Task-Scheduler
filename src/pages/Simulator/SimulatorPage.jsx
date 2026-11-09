import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Layers,
  Zap,
  Sliders,
  Scale,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import GanttChart from '../../components/scheduler/GanttChart';
import SimulatorControlPanel from '../../components/simulator/SimulatorControlPanel';
import SimulatorTaskQueue from '../../components/simulator/SimulatorTaskQueue';
import LiveExecutionPanel from '../../components/simulator/LiveExecutionPanel';
import AdaptivePriorityInspector from '../../components/simulator/AdaptivePriorityInspector';
import {
  DEFAULT_SIMULATION_TASKS,
  generateScheduleTimeline,
  getSimulationStateAtTime,
} from '../../utils/schedulerEngine';
import { DEFAULT_WEIGHTS } from '../../utils/adaptivePriorityMath';
import schedulerService from '../../services/schedulerService';
import ConnectionStatusBar from '../../components/common/ConnectionStatusBar';

export function SimulatorPage() {
  // 1. Simulator Configuration State
  const [algorithm, setAlgorithm] = useState('AEGIS_ADAPTIVE');
  const [quantum, setQuantum] = useState(20);
  const [speed, setSpeed] = useState(1); // 0.5, 1, 2, 4
  const [tasks, setTasks] = useState(DEFAULT_SIMULATION_TASKS);

  // 2. Adaptive Priority Formula Weights & Thresholds
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [starvationThreshold, setStarvationThreshold] = useState(40);

  // 3. Playback State
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Active view tab: 'TIMELINE' or 'PRIORITY_INSPECTOR' or 'ALL'
  const [activeTab, setActiveTab] = useState('ALL');

  // Timer reference for playback loop
  const timerRef = useRef(null);

  // 4. Deterministic Precomputation of Schedule Timeline
  // Scheduler logic is kept completely separate from UI components
  const { timeline, taskStats, totalExecutionTime } = useMemo(() => {
    return generateScheduleTimeline(
      tasks,
      algorithm,
      quantum,
      1,
      weights,
      { starvationThreshold }
    );
  }, [tasks, algorithm, quantum, weights, starvationThreshold]);

  // 5. Live Simulation Snapshot at current clock time
  const liveState = useMemo(() => {
    return getSimulationStateAtTime(timeline, tasks, currentTime);
  }, [timeline, tasks, currentTime]);

  // 6. Playback Loop Effect
  useEffect(() => {
    if (isRunning) {
      // Milliseconds between ticks based on speed multiplier
      const tickDelay = Math.max(16, Math.round(40 / speed));
      const timeStep = 1; // 1 ms of logical simulation time per tick

      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= totalExecutionTime) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsPaused(false);
            return totalExecutionTime;
          }
          return prevTime + timeStep;
        });
      }, tickDelay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed, totalExecutionTime]);

  // Playback Handlers
  const handleStart = () => {
    schedulerService.run({ algorithmId: algorithm, quantum });
    setCurrentTime(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    schedulerService.pause();
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    schedulerService.resume();
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleReset = () => {
    schedulerService.reset();
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const handleAlgorithmChange = (newAlgo) => {
    setAlgorithm(newAlgo);
    handleReset();
  };

  const handleQuantumChange = (newQuantum) => {
    setQuantum(newQuantum);
    handleReset();
  };

  const handleWeightsChange = (newWeights) => {
    setWeights(newWeights);
    handleReset();
  };

  const handleStarvationThresholdChange = (newThreshold) => {
    setStarvationThreshold(newThreshold);
  };

  const handleLoadWorkloadPreset = (presetKey) => {
    const preset = WORKLOAD_PRESETS[presetKey];
    if (preset && preset.tasks) {
      setTasks(preset.tasks);
      handleReset();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14">
      {/* Page Header */}
      <PageHeader
        title="Scheduling Simulator"
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Simulator' }]}
        subtitle="Cycle-accurate CPU scheduler visualization. Observe deterministic time slicing, preemption, and dynamic multi-factor priority arbitration in real time."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ConnectionStatusBar />
            <span className="text-xs text-aegis-muted font-terminal hidden md:inline">
              Workload:
            </span>
            <button
              onClick={() => {
                setTasks(DEFAULT_SIMULATION_TASKS);
                handleReset();
              }}
              className="px-2.5 py-1 rounded bg-aegis-sidebar border border-aegis-border text-xs font-terminal text-white hover:border-aegis-teal transition-colors"
            >
              Default (6 Tasks)
            </button>
            <button
              onClick={() => handleLoadWorkloadPreset('DEADLINE_INTENSIVE')}
              className="px-2.5 py-1 rounded bg-aegis-sidebar border border-aegis-border text-xs font-terminal text-aegis-muted hover:text-white hover:border-status-rose transition-colors"
            >
              Real-time EDF
            </button>
            <button
              onClick={() => handleLoadWorkloadPreset('STARVATION_DEMO')}
              className="px-2.5 py-1 rounded bg-aegis-sidebar border border-aegis-border text-xs font-terminal text-aegis-muted hover:text-white hover:border-status-amber transition-colors"
            >
              Starvation Demo
            </button>
          </div>
        }
      />

      {/* C++ Backend Bridge Architecture Notice */}
      <div className="p-3.5 rounded-xl border border-aegis-border bg-aegis-card/90 shadow-card-subtle flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-aegis-teal shrink-0 mt-0.5" />
        <div className="text-aegis-muted leading-relaxed font-sans">
          <strong className="text-white">Modular Architecture Notice: </strong>
          The scheduler logic is decoupled from presentation components. When the native C++ pthread-based backend is connected, incoming execution trace events will populate this exact timeline interface without UI redesign.
        </div>
      </div>

      {/* TOP CONTROL PANEL */}
      <SimulatorControlPanel
        algorithm={algorithm}
        onAlgorithmChange={handleAlgorithmChange}
        quantum={quantum}
        onQuantumChange={handleQuantumChange}
        speed={speed}
        onSpeedChange={setSpeed}
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
      />

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-aegis-border pb-3 select-none">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-terminal transition-all flex items-center gap-1.5 ${
            activeTab === 'ALL'
              ? 'bg-aegis-teal text-aegis-bg font-bold shadow-glow-teal'
              : 'bg-aegis-sidebar text-aegis-muted hover:text-white border border-aegis-border'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Complete Execution View</span>
        </button>

        <button
          onClick={() => setActiveTab('PRIORITY_INSPECTOR')}
          className={`px-3 py-1.5 rounded-lg text-xs font-terminal transition-all flex items-center gap-1.5 ${
            activeTab === 'PRIORITY_INSPECTOR'
              ? 'bg-aegis-teal text-aegis-bg font-bold shadow-glow-teal'
              : 'bg-aegis-sidebar text-aegis-muted hover:text-white border border-aegis-border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Adaptive Priority Inspector (Aegis Innovation)</span>
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-terminal transition-all flex items-center gap-1.5 ${
            activeTab === 'TIMELINE'
              ? 'bg-aegis-teal text-aegis-bg font-bold shadow-glow-teal'
              : 'bg-aegis-sidebar text-aegis-muted hover:text-white border border-aegis-border'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Gantt Timeline Only</span>
        </button>
      </div>

      {/* TIMELINE VIEW (Gantt, Live Panel & Queue) */}
      {(activeTab === 'ALL' || activeTab === 'TIMELINE') && (
        <div className="space-y-6">
          {/* HORIZONTAL GANTT CHART */}
          <GanttChart
            timeline={timeline}
            currentTime={currentTime}
            totalExecutionTime={totalExecutionTime}
            runningTaskId={liveState.runningTask?.id}
          />

          {/* LIVE EXECUTION PANEL */}
          <LiveExecutionPanel
            currentTime={currentTime}
            runningTask={liveState.runningTask}
            activeSlice={liveState.activeSlice}
            readyQueue={liveState.readyQueue}
            completedTasks={liveState.completedTasks}
            remainingWorkload={liveState.remainingWorkload}
            totalWorkload={totalExecutionTime}
          />

          {/* SIMULATOR TASK QUEUE TABLE */}
          <SimulatorTaskQueue
            tasks={liveState.tasksWithState}
            runningTaskId={liveState.runningTask?.id}
          />
        </div>
      )}

      {/* DEDICATED ADAPTIVE PRIORITY INSPECTOR (Aegis Innovation) */}
      {(activeTab === 'ALL' || activeTab === 'PRIORITY_INSPECTOR') && (
        <div className="space-y-4 pt-4 border-t border-aegis-border/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-aegis-teal/10 border border-aegis-teal/30 text-aegis-teal">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Aegis Adaptive Priority Inspector</span>
                  <span className="text-[10px] font-terminal px-2 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30">
                    Live Heuristic
                  </span>
                </h3>
                <p className="text-xs text-aegis-muted">
                  Mathematical decomposition of real-time scheduling arbitration across Deadline Urgency, Queue Latency, and CPU Favor.
                </p>
              </div>
            </div>

            <div className="text-xs font-terminal text-aegis-muted hidden sm:block">
              Clock: <strong className="text-white">{currentTime} ms</strong>
            </div>
          </div>

          <AdaptivePriorityInspector
            tasks={liveState.tasksWithState}
            currentTime={currentTime}
            weights={weights}
            onWeightsChange={handleWeightsChange}
            starvationThreshold={starvationThreshold}
            onStarvationThresholdChange={handleStarvationThresholdChange}
          />
        </div>
      )}
    </div>
  );
}

export default SimulatorPage;
