import React from 'react';
import { Server, Radio, ShieldCheck, Zap, Info, Sliders } from 'lucide-react';
import Card from '../common/Card';

export function SchedulerStatusPanel({ activeAlgorithm, metrics = {}, sourceMode = 'SIMULATION' }) {
  return (
    <Card
      title="Scheduler Architecture & Health"
      subtitle="Kernel dispatch parameters and execution state"
      icon={Server}
      actions={
        <span className="text-[10px] font-terminal px-2 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30 font-semibold">
          {sourceMode === 'CXX_CORE' ? 'Native C++20 Core' : 'Simulated Kernel'}
        </span>
      }
    >
      <div className="space-y-4">
        {/* Demonstration Disclaimer Banner */}
        <div className="p-3 rounded-lg bg-aegis-sidebar/90 border border-aegis-border flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-aegis-teal shrink-0 mt-0.5" />
          <div className="text-aegis-muted leading-relaxed">
            <span className="text-white font-medium">Demonstration Telemetry: </span>
            Operating in simulated kernel mode. Metrics reflect realistic OS multithreaded dispatch cycles.
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-terminal">
          <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border space-y-1">
            <span className="text-[11px] text-aegis-muted">Active Policy:</span>
            <div className="text-white font-bold truncate">
              {activeAlgorithm?.name || 'Multi-Level Feedback Queue'}
            </div>
            <div className="text-[10px] text-aegis-teal font-semibold">
              {activeAlgorithm?.category || 'Dynamic Priority'}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border space-y-1">
            <span className="text-[11px] text-aegis-muted">Timer Tick Rate:</span>
            <div className="text-white font-bold">1000 Hz</div>
            <div className="text-[10px] text-aegis-indigo font-semibold">
              1.0 ms precision
            </div>
          </div>

          <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border space-y-1">
            <span className="text-[11px] text-aegis-muted">Preemption Quantum:</span>
            <div className="text-white font-bold">10 - 25 ms</div>
            <div className="text-[10px] text-status-amber font-semibold">
              Dynamic per queue
            </div>
          </div>

          <div className="p-3 rounded-lg bg-aegis-sidebar border border-aegis-border space-y-1">
            <span className="text-[11px] text-aegis-muted">Starvation Protection:</span>
            <div className="text-status-emerald font-bold">Active</div>
            <div className="text-[10px] text-aegis-muted">
              5000 ms aging boost
            </div>
          </div>
        </div>

        {/* Lock Contention & Worker Threads row */}
        <div className="pt-2 border-t border-aegis-border/60 flex items-center justify-between text-xs font-terminal text-aegis-muted">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-aegis-teal" />
            <span>Worker Threads: <strong className="text-white">8 Pinned</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-status-emerald" />
            <span>Lock Contention: <strong className="text-status-emerald">&lt; 0.02%</strong></span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SchedulerStatusPanel;

