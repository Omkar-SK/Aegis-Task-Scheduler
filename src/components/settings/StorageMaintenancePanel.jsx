import React, { useState } from 'react';
import { RefreshCw, Trash2, Database, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { INITIAL_TASKS } from '../../data/mockTasks';

export function StorageMaintenancePanel({ resetSimulation }) {
  const [resetMessage, setResetMessage] = useState(null);

  const handleClearTaskRegistry = () => {
    if (window.confirm('Are you sure you want to clear all tasks stored in the browser task registry?')) {
      localStorage.removeItem('aegis_tasks_registry');
      setResetMessage('Local task registry successfully purged.');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  const handleRestorePresets = () => {
    localStorage.setItem('aegis_tasks_registry', JSON.stringify(INITIAL_TASKS));
    setResetMessage('Default benchmark task set restored to registry.');
    setTimeout(() => setResetMessage(null), 3000);
  };

  const handleResetEngine = () => {
    if (resetSimulation) {
      resetSimulation();
      setResetMessage('Kernel simulation registers and clock re-synchronized.');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  return (
    <Card
      title="Kernel State & Storage Maintenance"
      subtitle="Re-synchronize simulation registers, purge browser local storage, or inspect compiler environment"
      icon={Database}
      actions={
        resetMessage && (
          <span className="text-xs font-terminal text-aegis-teal font-semibold px-2.5 py-1 rounded bg-aegis-teal/10 border border-aegis-teal/30">
            {resetMessage}
          </span>
        )
      }
    >
      <div className="space-y-6 font-terminal text-xs">
        {/* Maintenance Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3 flex flex-col justify-between">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-aegis-teal" />
                <span>Reset Simulation</span>
              </div>
              <p className="text-[11px] text-aegis-muted mt-1 leading-relaxed">
                Re-zeros the logical simulation clock and resets active SMP core workloads.
              </p>
            </div>
            <Button variant="secondary" size="xs" onClick={handleResetEngine}>
              Reset Registers
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3 flex flex-col justify-between">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-aegis-indigo" />
                <span>Restore Default Presets</span>
              </div>
              <p className="text-[11px] text-aegis-muted mt-1 leading-relaxed">
                Re-populates the Task Manager registry with initial benchmark workloads.
              </p>
            </div>
            <Button variant="outline" size="xs" onClick={handleRestorePresets}>
              Restore Tasks
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-aegis-sidebar border border-aegis-border space-y-3 flex flex-col justify-between">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-status-rose" />
                <span>Purge Task Storage</span>
              </div>
              <p className="text-[11px] text-aegis-muted mt-1 leading-relaxed">
                Clears all custom tasks and persistent localStorage keys.
              </p>
            </div>
            <Button variant="danger" size="xs" onClick={handleClearTaskRegistry}>
              Purge Registry
            </Button>
          </div>
        </div>

        {/* C++ Kernel Target Environment Specs */}
        <div className="p-4 rounded-xl bg-aegis-sidebar/80 border border-aegis-border space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-aegis-border">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-aegis-teal" />
              <span>Target C++ Environment & Compiler Architecture</span>
            </span>
            <span className="text-[10px] text-aegis-muted font-bold">SPEC: POSIX-2024</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-aegis-subtle block">C++ Standard:</span>
              <strong className="text-white">ISO C++20 (-std=c++20)</strong>
            </div>
            <div>
              <span className="text-aegis-subtle block">Compiler Optimization:</span>
              <strong className="text-aegis-teal">-O3 -march=native</strong>
            </div>
            <div>
              <span className="text-aegis-subtle block">Threading Runtime:</span>
              <strong className="text-aegis-indigo">POSIX pthreads (NPTL)</strong>
            </div>
            <div>
              <span className="text-aegis-subtle block">Cache Alignment:</span>
              <strong className="text-status-emerald">alignas(64) byte-padded</strong>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StorageMaintenancePanel;
