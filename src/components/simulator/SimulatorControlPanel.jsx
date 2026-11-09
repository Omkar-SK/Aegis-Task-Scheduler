import React from 'react';
import { Play, Pause, RotateCcw, Sliders, Zap, FastForward, PlayCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

export function SimulatorControlPanel({
  algorithm,
  onAlgorithmChange,
  quantum,
  onQuantumChange,
  speed,
  onSpeedChange,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}) {
  const isQuantumApplicable = algorithm === 'ROUND_ROBIN' || algorithm === 'AEGIS_ADAPTIVE';

  return (
    <Card
      title="Simulation Control Engine"
      subtitle="Configure CPU scheduling algorithm, time slice quanta, and playback frequency"
      icon={Sliders}
      actions={
        <span
          className={`text-[11px] font-terminal px-2.5 py-1 rounded-lg border font-semibold ${
            isRunning
              ? 'bg-aegis-teal/10 text-aegis-teal border-aegis-teal/30 shadow-glow-teal animate-pulse'
              : isPaused
              ? 'bg-status-amber/10 text-status-amber border-status-amber/30'
              : 'bg-aegis-sidebar text-aegis-muted border-aegis-border'
          }`}
        >
          {isRunning ? 'SIMULATION ACTIVE' : isPaused ? 'SIMULATION PAUSED' : 'ENGINE READY'}
        </span>
      }
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 font-terminal text-xs">
        {/* Left: Algorithm & Quantum Selectors */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Algorithm Selector */}
          <div>
            <label className="block text-[11px] text-aegis-muted mb-1 font-semibold">
              Scheduling Algorithm:
            </label>
            <select
              value={algorithm}
              onChange={(e) => onAlgorithmChange(e.target.value)}
              className="bg-aegis-sidebar border border-aegis-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-aegis-teal cursor-pointer hover:border-aegis-border-light transition-colors font-medium min-w-[210px]"
            >
              <option value="FCFS">1. FCFS (First-Come, First-Served)</option>
              <option value="SJF">2. SJF (Preemptive SRTF)</option>
              <option value="ROUND_ROBIN">3. Round Robin (Time-Sliced)</option>
              <option value="AEGIS_ADAPTIVE">4. Aegis Adaptive Scheduling</option>
            </select>
          </div>

          {/* Time Quantum Input (Enabled for Round Robin & Aegis Adaptive) */}
          <div className={isQuantumApplicable ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
            <label className="block text-[11px] text-aegis-muted mb-1 font-semibold flex items-center justify-between">
              <span>Time Quantum:</span>
              <span className="text-aegis-teal font-bold">{quantum} ms</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="100"
                step="5"
                value={quantum}
                onChange={(e) => onQuantumChange(Math.max(5, Number(e.target.value)))}
                disabled={!isQuantumApplicable}
                className="w-24 px-3 py-1.5 bg-aegis-sidebar border border-aegis-border rounded-lg text-xs text-white focus:outline-none focus:border-aegis-teal"
              />
              <span className="text-aegis-subtle">ms slice</span>
            </div>
          </div>

          {/* Speed Selector */}
          <div>
            <label className="block text-[11px] text-aegis-muted mb-1 font-semibold">
              Simulation Speed:
            </label>
            <div className="flex items-center gap-1 bg-aegis-sidebar border border-aegis-border rounded-lg p-0.5">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    speed === s
                      ? 'bg-aegis-teal text-aegis-bg shadow-glow-teal font-bold'
                      : 'text-aegis-muted hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Playback Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-aegis-border">
          {/* Start Button (Active when idle/stopped) */}
          {!isRunning && !isPaused && (
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={onStart}
            >
              Start
            </Button>
          )}

          {/* Pause Button (Active when running) */}
          {isRunning && (
            <Button
              variant="danger"
              size="sm"
              icon={Pause}
              onClick={onPause}
            >
              Pause
            </Button>
          )}

          {/* Resume Button (Active when paused) */}
          {isPaused && (
            <Button
              variant="primary"
              size="sm"
              icon={PlayCircle}
              onClick={onResume}
            >
              Resume
            </Button>
          )}

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default SimulatorControlPanel;

