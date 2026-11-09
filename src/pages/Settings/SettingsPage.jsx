import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sliders, Cpu, Shield, RefreshCw, Terminal, Check, Server, Zap } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/common/MetricCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CxxDaemonBridgePanel from '../../components/settings/CxxDaemonBridgePanel';
import KernelParameterTuning from '../../components/settings/KernelParameterTuning';
import StorageMaintenancePanel from '../../components/settings/StorageMaintenancePanel';

export function SettingsPage() {
  const { algorithms, activeAlgorithm, switchAlgorithm, resetSimulation } = useOutletContext();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Settings & C++ Bridge"
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Settings' }]}
        subtitle="Configure C++ daemon connection endpoints, fine-tune scheduling parameters, and calibrate Aegis priority heuristic coefficients."
      />

      {/* Settings KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Policy"
          value={activeAlgorithm?.shortName || 'Aegis'}
          subtitle={activeAlgorithm?.category || 'Dynamic Adaptive'}
          icon={Cpu}
          accentColor="teal"
        />
        <MetricCard
          title="Worker Threads"
          value="8 Threads"
          subtitle="1:1 Kernel thread mapping"
          icon={Sliders}
          accentColor="indigo"
        />
        <MetricCard
          title="IPC Protocol"
          value="v1.0-aegis"
          subtitle="REST / WebSocket / shm"
          icon={Terminal}
          accentColor="amber"
        />
        <MetricCard
          title="Starvation Aging"
          value="5000 ms"
          subtitle="Priority boost threshold"
          icon={Shield}
          accentColor="emerald"
        />
      </div>

      {/* C++ Native Daemon Bridge Configuration */}
      <CxxDaemonBridgePanel />

      {/* CPU Scheduling Policy Selector */}
      <Card
        title="CPU Scheduling Policy Selector"
        subtitle="Select the primary scheduling policy loaded into the kernel engine"
        icon={Cpu}
      >
        <div className="space-y-3 font-terminal">
          {algorithms.map((algo) => {
            const isActive = algo.id === activeAlgorithm?.id;
            return (
              <div
                key={algo.id}
                className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-aegis-teal/5 border-aegis-teal/50 shadow-glow-teal'
                    : 'bg-aegis-sidebar border-aegis-border hover:border-aegis-border-light'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{algo.name}</span>
                    {isActive && (
                      <span className="text-[10px] font-terminal px-2 py-0.5 rounded bg-aegis-teal/10 text-aegis-teal border border-aegis-teal/30 font-semibold">
                        ACTIVE POLICY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-aegis-muted max-w-2xl">{algo.description}</p>
                </div>

                <Button
                  variant={isActive ? 'primary' : 'outline'}
                  size="sm"
                  disabled={isActive}
                  onClick={() => switchAlgorithm(algo.id)}
                >
                  {isActive ? 'Active' : 'Select'}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Kernel Parameter & Heuristic Tuning */}
      <KernelParameterTuning />

      {/* Kernel State & Storage Maintenance */}
      <StorageMaintenancePanel resetSimulation={resetSimulation} />
    </div>
  );
}

export default SettingsPage;
