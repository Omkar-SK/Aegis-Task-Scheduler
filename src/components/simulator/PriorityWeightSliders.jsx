import React from 'react';
import { Sliders, ShieldAlert, Sparkles, Scale, Info, RotateCcw } from 'lucide-react';
import Card from '../common/Card';
import { adjustWeights, DEFAULT_WEIGHTS } from '../../utils/adaptivePriorityMath';

export function PriorityWeightSliders({
  weights,
  onWeightsChange,
  starvationThreshold,
  onStarvationThresholdChange,
}) {
  const handleSliderChange = (key, value) => {
    const updated = adjustWeights(key, value, weights);
    onWeightsChange(updated);
  };

  const presets = [
    { label: 'Balanced (50/20/30)', weights: { deadline: 0.50, wait: 0.20, cpu: 0.30 } },
    { label: 'Deadline Focus (70/15/15)', weights: { deadline: 0.70, wait: 0.15, cpu: 0.15 } },
    { label: 'Anti-Starvation (20/60/20)', weights: { deadline: 0.20, wait: 0.60, cpu: 0.20 } },
    { label: 'Interactive (30/20/50)', weights: { deadline: 0.30, wait: 0.20, cpu: 0.50 } },
  ];

  const sumPercent = Math.round((weights.deadline + weights.wait + weights.cpu) * 100);

  return (
    <Card
      title="Aegis Adaptive Priority Weights & Policy Tuner"
      subtitle="Configurable coefficient weights for real-time task arbitration"
      icon={Sliders}
      actions={
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-terminal px-2 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30 font-semibold">
            Weight Sum: {sumPercent}%
          </span>
          <button
            onClick={() => onWeightsChange(DEFAULT_WEIGHTS)}
            className="p-1 text-aegis-muted hover:text-white rounded hover:bg-aegis-sidebar transition-colors"
            title="Reset to default weights"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-4 font-terminal text-xs">
        {/* Academic Policy Disclaimer */}
        <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border flex items-start gap-2.5">
          <Info className="w-4 h-4 text-aegis-teal shrink-0 mt-0.5" />
          <div className="text-[11px] text-aegis-muted leading-relaxed font-sans">
            <strong className="text-white">Proposed Aegis Policy: </strong>
            This represents an experimental academic scheduling heuristic for the OS Course Project.
            It balances real-time deadline adherence, queue starvation prevention, and I/O-bound burst favor.
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Slider 1: Deadline Urgency */}
          <div className="p-3.5 rounded-lg border border-aegis-border bg-aegis-sidebar/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Deadline Urgency (w₁)</span>
              <span className="text-aegis-teal font-bold text-sm">
                {Math.round(weights.deadline * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.85"
              step="0.05"
              value={weights.deadline}
              onChange={(e) => handleSliderChange('deadline', e.target.value)}
              className="w-full accent-aegis-teal cursor-pointer"
            />
            <p className="text-[10px] text-aegis-subtle font-sans leading-tight">
              Higher weights favor tasks closest to SLA deadlines (EDF-like behavior).
            </p>
          </div>

          {/* Slider 2: Waiting Time Score */}
          <div className="p-3.5 rounded-lg border border-aegis-border bg-aegis-sidebar/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Waiting Time Score (w₂)</span>
              <span className="text-aegis-indigo font-bold text-sm">
                {Math.round(weights.wait * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.85"
              step="0.05"
              value={weights.wait}
              onChange={(e) => handleSliderChange('wait', e.target.value)}
              className="w-full accent-aegis-indigo cursor-pointer"
            />
            <p className="text-[10px] text-aegis-subtle font-sans leading-tight">
              Higher weights prevent low-priority task starvation by boosting aging tasks.
            </p>
          </div>

          {/* Slider 3: CPU Consumption Score */}
          <div className="p-3.5 rounded-lg border border-aegis-border bg-aegis-sidebar/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">CPU Favor (1 − CPU) (w₃)</span>
              <span className="text-status-sky font-bold text-sm">
                {Math.round(weights.cpu * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.85"
              step="0.05"
              value={weights.cpu}
              onChange={(e) => handleSliderChange('cpu', e.target.value)}
              className="w-full accent-status-sky cursor-pointer"
            />
            <p className="text-[10px] text-aegis-subtle font-sans leading-tight">
              Higher weights reward interactive / short tasks that do not monopolize CPU cores.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Presets & Starvation Threshold */}
        <div className="pt-3 border-t border-aegis-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-aegis-muted mr-1 font-semibold">Presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onWeightsChange(preset.weights)}
                className="px-2 py-1 rounded bg-aegis-card hover:bg-aegis-sidebar border border-aegis-border hover:border-aegis-border-light text-[10px] text-aegis-muted hover:text-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Starvation Threshold Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-aegis-muted whitespace-nowrap">
              Starvation Alert Threshold:
            </span>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={starvationThreshold}
              onChange={(e) => onStarvationThresholdChange(Number(e.target.value))}
              className="w-24 accent-status-amber cursor-pointer"
            />
            <span className="text-status-amber font-bold whitespace-nowrap">
              {starvationThreshold} ms
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PriorityWeightSliders;

