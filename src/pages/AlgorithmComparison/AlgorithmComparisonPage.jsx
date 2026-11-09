import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  GitCompare,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Trophy,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import WorkloadSelector from '../../components/comparison/WorkloadSelector';
import ComparisonMetricCards from '../../components/comparison/ComparisonMetricCards';
import ComparisonCharts from '../../components/comparison/ComparisonCharts';
import DetailedComparisonTable from '../../components/comparison/DetailedComparisonTable';
import ConnectionStatusBar from '../../components/common/ConnectionStatusBar';
import { LoadingState, ErrorState } from '../../components/common/StateDisplay';
import schedulerService from '../../services/schedulerService';
import { WORKLOAD_PRESETS } from '../../data/workloadPresets';

export function AlgorithmComparisonPage() {
  const [activeWorkloadKey, setActiveWorkloadKey] = useState('BALANCED');
  const [customTasks, setCustomTasks] = useState([
    { id: 'T-CUST-1', name: 'raytrace_kernel', arrivalTime: 0, burstTimeMs: 45, deadline: 110, priority: 8 },
    { id: 'T-CUST-2', name: 'audio_dma_sink', arrivalTime: 5, burstTimeMs: 20, deadline: 35, priority: 10 },
    { id: 'T-CUST-3', name: 'page_cache_sync', arrivalTime: 12, burstTimeMs: 30, deadline: 80, priority: 6 },
    { id: 'T-CUST-4', name: 'batch_indexer', arrivalTime: 15, burstTimeMs: 90, deadline: 240, priority: 5 },
    { id: 'T-CUST-5', name: 'crypto_verify', arrivalTime: 25, burstTimeMs: 35, deadline: 90, priority: 7 },
  ]);

  const [quantum, setQuantum] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  // Active tasks based on workload selection
  const currentTasks = useMemo(() => {
    if (activeWorkloadKey === 'CUSTOM') {
      return customTasks;
    }
    return WORKLOAD_PRESETS[activeWorkloadKey]?.tasks || WORKLOAD_PRESETS.BALANCED.tasks;
  }, [activeWorkloadKey, customTasks]);

  // Execute benchmark via SchedulerService (POST /api/scheduler/compare)
  const runBenchmark = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await schedulerService.compareAlgorithms({
        tasks: currentTasks,
        quantum,
        workloadId: activeWorkloadKey,
        workloadName: WORKLOAD_PRESETS[activeWorkloadKey]?.name || 'Custom Workload',
      });
      setReport(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to run algorithm benchmark:', err);
      setError(err.message || 'Benchmark comparison failed');
      setLoading(false);
    }
  }, [currentTasks, quantum, activeWorkloadKey]);

  useEffect(() => {
    runBenchmark();
  }, [runBenchmark]);

  const results = report?.results || [];
  const bestPerformers = report?.bestPerformers || {};
  const chartData = results.map((r) => ({
    name: r.shortName,
    avgWaitTime: r.avgWaitTime,
    avgTurnaroundTime: r.avgTurnaroundTime,
    avgResponseTime: r.avgResponseTime,
    cpuUtilization: r.cpuUtilization,
    contextSwitches: r.contextSwitches,
    throughput: r.throughput,
    deadlineMisses: r.deadlineMisses,
  }));

  const handleSelectWorkload = (key) => {
    setActiveWorkloadKey(key);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-14 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Algorithm Comparison & Benchmark"
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Algorithm Comparison' }]}
        subtitle="Empirical multi-dimensional evaluation of FCFS, SJF (SRTF), Round Robin, and Aegis Adaptive under identical workload stresses."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ConnectionStatusBar />

            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={runBenchmark}
              loading={loading}
            >
              Run All Algorithms
            </Button>
          </div>
        }
      />

      {/* Simulated Results & Non-Hardcoded Disclaimer */}
      <div className="p-3.5 rounded-xl border border-aegis-border bg-aegis-card/90 shadow-card-subtle flex items-start gap-3 text-xs font-terminal">
        <Info className="w-4 h-4 text-aegis-teal shrink-0 mt-0.5" />
        <div className="text-aegis-muted leading-relaxed">
          <strong className="text-white">Empirical Scheduling Engine Notice: </strong>
          All comparison values are calculated deterministically by evaluating each scheduling algorithm through identical task arrival queues and execution profiles. Winners are not hardcoded and depend entirely on the active workload characteristics.
        </div>
      </div>

      {/* Workload Selector */}
      <WorkloadSelector
        activeWorkloadKey={activeWorkloadKey}
        onSelectWorkload={handleSelectWorkload}
        tasks={activeWorkloadKey === 'CUSTOM' ? customTasks : currentTasks}
        onUpdateCustomTasks={setCustomTasks}
        onRunBenchmark={runBenchmark}
        isRunningBenchmark={loading}
      />

      {/* Loading or Error State */}
      {loading && results.length === 0 ? (
        <LoadingState message="Running multi-algorithm benchmark via SchedulerService (POST /api/scheduler/compare)..." />
      ) : error ? (
        <ErrorState
          title="Benchmark Execution Error"
          message={error}
          onRetry={runBenchmark}
        />
      ) : (
        <>
          {/* Dynamic Best-Performing Algorithm Winners (7 Metrics) */}
          <ComparisonMetricCards
            results={results}
            bestPerformers={bestPerformers}
          />

          {/* Recharts Visualizations (4 Charts covering all 7 Metrics) */}
          <ComparisonCharts chartData={chartData} />

          {/* Detailed Side-by-Side Algorithm Evaluation Table */}
          <DetailedComparisonTable
            results={results}
            bestPerformers={bestPerformers}
          />
        </>
      )}
    </div>
  );
}

export default AlgorithmComparisonPage;
