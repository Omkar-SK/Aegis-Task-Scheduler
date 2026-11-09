import React, { useState } from 'react';
import { Sliders, Clock, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export function KernelParameterTuning() {
  const [quantum, setQuantum] = useState(() => {
    return Number(localStorage.getItem('aegis_param_quantum')) || 20;
  });
  const [agingThreshold, setAgingThreshold] = useState(() => {
    return Number(localStorage.getItem('aegis_param_aging')) || 5000;
  });
  const [csOverhead, setCsOverhead] = useState(() => {
    return Number(localStorage.getItem('aegis_param_cs_overhead')) || 1.0;
  });
  const [stealingBackoff, setStealingBackoff] = useState(() => {
    return Number(localStorage.getItem('aegis_param_stealing_backoff')) || 10;
  });

  // Aegis heuristic weights
  const [wDeadline, setWDeadline] = useState(0.5);
  const [wWait, setWWait] = useState(0.2);
  const [wCpu, setWCpu] = useState(0.3);

  const handleDeadlineChange = (val) => {
    const v = parseFloat(val);
    const rem = 1 - v;
    const oldSum = wWait + wCpu;
    if (oldSum === 0) {
      setWDeadline(v);
      setWWait(rem / 2);
      setWCpu(rem / 2);
    } else {
      setWDeadline(v);
      setWWait((wWait / oldSum) * rem);
      setWCpu((wCpu / oldSum) * rem);
    }
  };

  const handleWaitChange = (val) => {
    const v = parseFloat(val);
    const rem = 1 - v;
    const oldSum = wDeadline + wCpu;
    if (oldSum === 0) {
      setWWait(v);
      setWDeadline(rem / 2);
      setWCpu(rem / 2);
    } else {
      setWWait(v);
      setWDeadline((wDeadline / oldSum) * rem);
      setWCpu((wCpu / oldSum) * rem);
    }
  };

  const handleCpuChange = (val) => {
    const v = parseFloat(val);
    const rem = 1 - v;
    const oldSum = wDeadline + wWait;
    if (oldSum === 0) {
      setWCpu(v);
      setWDeadline(rem / 2);
      setWWait(rem / 2);
    } else {
      setWCpu(v);
      setWDeadline((wDeadline / oldSum) * rem);
      setWWait((wWait / oldSum) * rem);
    }
  };

  const handleSaveParameters = () => {
    localStorage.setItem('aegis_param_quantum', String(quantum));
    localStorage.setItem('aegis_param_aging', String(agingThreshold));
    localStorage.setItem('aegis_param_cs_overhead', String(csOverhead));
    localStorage.setItem('aegis_param_stealing_backoff', String(stealingBackoff));
    alert('Scheduler parameters saved successfully.');
  };

  const handleResetDefaults = () => {
    setQuantum(20);
    setAgingThreshold(5000);
    setCsOverhead(1.0);
    setStealingBackoff(10);
    setWDeadline(0.5);
    setWWait(0.2);
    setWCpu(0.3);
  };

  return (
    <Card
      title="Kernel Algorithm & Scheduling Parameter Tuning"
      subtitle="Fine-tune time-slice quanta, starvation aging intervals, and Aegis heuristic weights"
      icon={Sliders}
      actions={
        <Button variant="outline" size="xs" icon={RefreshCw} onClick={handleResetDefaults}>
          Reset Defaults
        </Button>
      }
    >
      <div className="space-y-6 font-terminal text-xs">
        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Quantum */}
          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-aegis-teal" />
                <span>Round Robin Time Slice (Quantum):</span>
              </span>
              <span className="text-aegis-teal font-bold px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
                {quantum} ms
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={quantum}
              onChange={(e) => setQuantum(Number(e.target.value))}
              className="w-full accent-aegis-teal cursor-pointer"
            />
            <p className="text-[11px] text-aegis-muted">
              Lower values enhance interactive responsiveness; higher values amortize context-switch overhead.
            </p>
          </div>

          {/* Starvation Aging Threshold */}
          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-status-amber" />
                <span>Starvation Aging Threshold:</span>
              </span>
              <span className="text-status-amber font-bold px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
                {agingThreshold} ms
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={agingThreshold}
              onChange={(e) => setAgingThreshold(Number(e.target.value))}
              className="w-full accent-status-amber cursor-pointer"
            />
            <p className="text-[11px] text-aegis-muted">
              Wait time before a task's priority is forcibly boosted to prevent unbounded starvation.
            </p>
          </div>

          {/* Context Switch Overhead */}
          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-aegis-indigo" />
                <span>Context Switch Overhead Model:</span>
              </span>
              <span className="text-aegis-indigo font-bold px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
                {csOverhead} ms
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={csOverhead}
              onChange={(e) => setCsOverhead(Number(e.target.value))}
              className="w-full accent-aegis-indigo cursor-pointer"
            />
            <p className="text-[11px] text-aegis-muted">
              Simulated CPU cycle penalty for register saving, TLB flushing, and cache reload.
            </p>
          </div>

          {/* Work Stealing Backoff */}
          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-status-emerald" />
                <span>Work-Stealing Probe Backoff:</span>
              </span>
              <span className="text-status-emerald font-bold px-2 py-0.5 rounded bg-aegis-card border border-aegis-border">
                {stealingBackoff} μs
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={stealingBackoff}
              onChange={(e) => setStealingBackoff(Number(e.target.value))}
              className="w-full accent-status-emerald cursor-pointer"
            />
            <p className="text-[11px] text-aegis-muted">
              Exponential backoff interval before an idle worker thread probes another core's deque.
            </p>
          </div>
        </div>

        {/* Dynamic Aegis Priority Weights Tuning */}
        <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-aegis-border">
            <div>
              <span className="text-white font-bold text-xs">Aegis Dynamic Priority Heuristic Coefficients</span>
              <p className="text-[11px] text-aegis-muted mt-0.5">
                Formula: Priority = w₁ × Urgency + w₂ × WaitScore + w₃ × (1 − CPUScore)
              </p>
            </div>
            <span className="text-[11px] font-bold text-aegis-teal px-2 py-0.5 rounded bg-aegis-teal/10 border border-aegis-teal/30">
              Sum = {(wDeadline + wWait + wCpu).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weight 1: Deadline */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-aegis-teal font-semibold text-[11px]">w₁ (Deadline Urgency):</span>
                <span className="text-white font-bold text-[11px]">{(wDeadline * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={wDeadline}
                onChange={(e) => handleDeadlineChange(e.target.value)}
                className="w-full accent-aegis-teal cursor-pointer"
              />
            </div>

            {/* Weight 2: Wait Score */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-aegis-indigo font-semibold text-[11px]">w₂ (Waiting Aging):</span>
                <span className="text-white font-bold text-[11px]">{(wWait * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={wWait}
                onChange={(e) => handleWaitChange(e.target.value)}
                className="w-full accent-aegis-indigo cursor-pointer"
              />
            </div>

            {/* Weight 3: CPU Consumption */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-status-amber font-semibold text-[11px]">w₃ (CPU Penalization):</span>
                <span className="text-white font-bold text-[11px]">{(wCpu * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={wCpu}
                onChange={(e) => handleCpuChange(e.target.value)}
                className="w-full accent-status-amber cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={handleSaveParameters}>
            Save All Kernel Parameters
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default KernelParameterTuning;

