import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Clock,
  Zap,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { WORKLOAD_PRESETS } from '../../data/workloadPresets';

export function WorkloadSelector({
  activeWorkloadKey,
  onSelectWorkload,
  tasks,
  onUpdateCustomTasks,
  onRunBenchmark,
  isRunningBenchmark,
}) {
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const presets = [
    { key: 'BALANCED', label: 'Balanced', desc: 'Standard mixed I/O & compute', icon: Layers },
    { key: 'CPU_INTENSIVE', label: 'CPU-Intensive', desc: 'Long compute-bound AVX bursts', icon: Cpu },
    { key: 'DEADLINE_INTENSIVE', label: 'Deadline-Intensive', desc: 'Strict real-time SLA bounds', icon: Clock },
    { key: 'SHORT_JOB_HEAVY', label: 'Short-Job-Heavy', desc: 'Rapid stream of short micro-jobs', icon: Zap },
    { key: 'CUSTOM', label: 'Custom Workload', desc: 'User-configured task parameters', icon: Sliders },
  ];

  return (
    <Card
      title="Identical Benchmark Workload Configuration"
      subtitle="Select or configure the exact task dataset evaluated simultaneously across all four algorithms"
      icon={Sparkles}
      actions={
        <div className="flex items-center gap-2">
          {activeWorkloadKey === 'CUSTOM' && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsEditingCustom(!isEditingCustom)}
            >
              {isEditingCustom ? 'Close Editor' : 'Edit Tasks'}
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={Play}
            onClick={onRunBenchmark}
            loading={isRunningBenchmark}
          >
            Run Benchmark Comparison
          </Button>
        </div>
      }
    >
      <div className="space-y-4 font-terminal text-xs">
        {/* Preset Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isSelected = activeWorkloadKey === preset.key;

            return (
              <button
                key={preset.key}
                onClick={() => onSelectWorkload(preset.key)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-aegis-teal/10 border-aegis-teal text-white shadow-glow-teal'
                    : 'bg-aegis-sidebar border-aegis-border text-aegis-muted hover:text-white hover:bg-aegis-card'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-bold text-xs truncate">{preset.label}</span>
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-aegis-teal' : 'text-aegis-subtle'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-aegis-subtle font-sans leading-tight line-clamp-2">
                  {preset.desc}
                </p>
                <div className="mt-2 text-[10px] text-aegis-teal font-semibold">
                  {preset.key === 'CUSTOM' ? `${tasks.length} Custom Tasks` : `${(WORKLOAD_PRESETS[preset.key]?.tasks || []).length} Tasks`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Workload Editor if Active */}
        {activeWorkloadKey === 'CUSTOM' && isEditingCustom && (
          <div className="p-4 rounded-xl border border-aegis-teal/30 bg-aegis-bg space-y-3 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-aegis-border">
              <span className="text-white font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-aegis-teal" />
                Custom Workload Editor ({tasks.length} tasks)
              </span>
              <button
                onClick={() => {
                  const newTask = {
                    id: `T-CUST-${tasks.length + 1}`,
                    name: `task_${tasks.length + 1}`,
                    arrivalTime: tasks.length * 5,
                    burstTimeMs: 30,
                    deadline: (tasks.length * 5) + 80,
                    priority: 5,
                  };
                  onUpdateCustomTasks([...tasks, newTask]);
                }}
                className="px-2.5 py-1 rounded bg-aegis-teal/10 border border-aegis-teal/30 text-aegis-teal text-[11px] font-semibold hover:bg-aegis-teal/20 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Task
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {tasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="p-2.5 rounded-lg bg-aegis-sidebar border border-aegis-border flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-white">{task.id}</span>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => {
                        const copy = [...tasks];
                        copy[idx].name = e.target.value;
                        onUpdateCustomTasks(copy);
                      }}
                      className="px-2 py-0.5 bg-aegis-card border border-aegis-border rounded text-white text-[11px] w-28 focus:outline-none focus:border-aegis-teal"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-aegis-subtle text-[10px]">Arr:</span>
                      <input
                        type="number"
                        min="0"
                        value={task.arrivalTime}
                        onChange={(e) => {
                          const copy = [...tasks];
                          copy[idx].arrivalTime = Number(e.target.value);
                          onUpdateCustomTasks(copy);
                        }}
                        className="w-12 px-1.5 py-0.5 bg-aegis-card border border-aegis-border rounded text-white text-[11px]"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-aegis-subtle text-[10px]">Burst:</span>
                      <input
                        type="number"
                        min="5"
                        value={task.burstTimeMs}
                        onChange={(e) => {
                          const copy = [...tasks];
                          copy[idx].burstTimeMs = Number(e.target.value);
                          onUpdateCustomTasks(copy);
                        }}
                        className="w-12 px-1.5 py-0.5 bg-aegis-card border border-aegis-border rounded text-white text-[11px]"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-aegis-subtle text-[10px]">Deadline:</span>
                      <input
                        type="number"
                        min="10"
                        value={task.deadline}
                        onChange={(e) => {
                          const copy = [...tasks];
                          copy[idx].deadline = Number(e.target.value);
                          onUpdateCustomTasks(copy);
                        }}
                        className="w-14 px-1.5 py-0.5 bg-aegis-card border border-aegis-border rounded text-white text-[11px]"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-aegis-subtle text-[10px]">Prio:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={task.priority}
                        onChange={(e) => {
                          const copy = [...tasks];
                          copy[idx].priority = Number(e.target.value);
                          onUpdateCustomTasks(copy);
                        }}
                        className="w-10 px-1.5 py-0.5 bg-aegis-card border border-aegis-border rounded text-white text-[11px]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const copy = tasks.filter((_, i) => i !== idx);
                        onUpdateCustomTasks(copy);
                      }}
                      className="p-1 text-aegis-muted hover:text-status-rose"
                      title="Remove task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default WorkloadSelector;

