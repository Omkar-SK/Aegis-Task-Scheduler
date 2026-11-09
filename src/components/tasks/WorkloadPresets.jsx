import React from 'react';
import { Cpu, Scale, Clock, AlertOctagon, Sparkles, Check } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { WORKLOAD_PRESETS } from '../../data/workloadPresets';

export function WorkloadPresets({ onSelectPreset, activePresetId }) {
  const presetIcons = {
    BALANCED: Scale,
    CPU_INTENSIVE: Cpu,
    DEADLINE_INTENSIVE: Clock,
    STARVATION_DEMO: AlertOctagon,
  };

  return (
    <Card
      title="Benchmark Workload Presets"
      subtitle="Instantly inject synthetic test workloads into the Aegis scheduling pipeline"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Object.values(WORKLOAD_PRESETS).map((preset) => {
          const Icon = presetIcons[preset.id] || Cpu;
          const isSelected = activePresetId === preset.id;

          return (
            <div
              key={preset.id}
              className={`p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between bg-aegis-sidebar/80 ${
                isSelected
                  ? 'border-aegis-teal/50 bg-aegis-teal/5 shadow-glow-teal'
                  : 'border-aegis-border hover:border-aegis-border-light'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-aegis-card border border-aegis-border text-aegis-teal">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight">
                      {preset.name}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-terminal px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                    {preset.tasks.length} Tasks
                  </span>
                </div>

                <p className="text-[11px] text-aegis-muted leading-relaxed line-clamp-2 mt-1">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-aegis-border/60 flex items-center justify-between">
                <span className="text-[10px] text-aegis-subtle font-terminal">
                  {preset.tagline}
                </span>
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="xs"
                  onClick={() => onSelectPreset(preset.id)}
                >
                  {isSelected ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Loaded
                    </span>
                  ) : (
                    'Load Preset'
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default WorkloadPresets;

