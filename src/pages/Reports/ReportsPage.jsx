import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileBarChart2,
  Download,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ReportRunSelector from '../../components/reports/ReportRunSelector';
import PerformanceInsightsCard from '../../components/reports/PerformanceInsightsCard';
import OverallSimulationSummary from '../../components/reports/OverallSimulationSummary';
import AlgorithmComparisonSection from '../../components/reports/AlgorithmComparisonSection';
import WaitingTimeAnalysisSection from '../../components/reports/WaitingTimeAnalysisSection';
import TurnaroundTimeAnalysisSection from '../../components/reports/TurnaroundTimeAnalysisSection';
import DeadlineMissAnalysisSection from '../../components/reports/DeadlineMissAnalysisSection';
import CpuAndContextSwitchAnalysisSection from '../../components/reports/CpuAndContextSwitchAnalysisSection';
import StarvationDetectionSection from '../../components/reports/StarvationDetectionSection';
import TaskExecutionAuditTable from '../../components/reports/TaskExecutionAuditTable';
import AuditReportModal from '../../components/reports/AuditReportModal';
import {
  exportMetricsSummaryCsv,
  exportExecutionTimelineCsv,
  exportExecutionTraceCsv,
  downloadDetailedTextReport,
} from '../../utils/csvExporter';
import {
  computeReportAnalytics,
  SIMULATION_RUNS,
} from '../../utils/reportsEngine';

export function ReportsPage() {
  const [selectedRunId, setSelectedRunId] = useState('RUN_BALANCED');
  const [selectedAlgoId, setSelectedAlgoId] = useState('AEGIS_ADAPTIVE');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Map run selection to workload ID
  const activeRun = useMemo(() => {
    return SIMULATION_RUNS.find((r) => r.id === selectedRunId) || SIMULATION_RUNS[0];
  }, [selectedRunId]);

  // Compute all analytics, benchmark results, distributions, and insights
  const reportData = useMemo(() => {
    return computeReportAnalytics({
      workloadId: activeRun.workloadId,
      selectedAlgorithmId: selectedAlgoId,
      quantum: 20,
      contextSwitchOverheadMs: 1.0,
      starvationThresholdMs: 40,
    });
  }, [activeRun, selectedAlgoId]);

  const {
    preset,
    selectedAlgorithm,
    allAlgorithmResults,
    bestPerformers,
    timeline,
    taskList,
    insights,
    summary,
  } = reportData;

  // Handlers for Export Features
  const handleExportMetricsCsv = () => {
    exportMetricsSummaryCsv(allAlgorithmResults, preset.name);
  };

  const handleExportTimelineCsv = () => {
    exportExecutionTimelineCsv(timeline, selectedAlgorithm.name);
  };

  const handleDownloadReportTxt = () => {
    downloadDetailedTextReport(reportData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Reports & Analytics"
        breadcrumbs={[{ label: 'Aegis', to: '/' }, { label: 'Reports' }]}
        subtitle="Exhaustive CPU scheduling performance reports, cross-algorithm comparative benchmarks, latency distributions, and data-supported analytical insights."
      />

      {/* Control Panel: Simulation Run, Algorithm Selector, Export Toolbar */}
      <ReportRunSelector
        selectedRunId={selectedRunId}
        onSelectRun={setSelectedRunId}
        selectedAlgoId={selectedAlgoId}
        onSelectAlgo={setSelectedAlgoId}
        onExportMetricsCsv={handleExportMetricsCsv}
        onExportTimelineCsv={handleExportTimelineCsv}
        onDownloadReportTxt={handleDownloadReportTxt}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* Automated Performance Insights (Supported strictly by actual data) */}
      <PerformanceInsightsCard insights={insights} />

      {/* 1. Overall Simulation Summary */}
      <OverallSimulationSummary summary={summary} />

      {/* 2. Algorithm-Wise Comparative Performance Benchmark */}
      <AlgorithmComparisonSection
        allResults={allAlgorithmResults}
        selectedAlgoId={selectedAlgoId}
        bestPerformers={bestPerformers}
      />

      {/* 3. Waiting Time Analysis */}
      <WaitingTimeAnalysisSection
        summary={summary}
        taskList={taskList}
      />

      {/* 4. Turnaround Time Analysis */}
      <TurnaroundTimeAnalysisSection
        summary={summary}
        taskList={taskList}
      />

      {/* 5. Deadline Miss & SLA Compliance Analysis */}
      <DeadlineMissAnalysisSection
        summary={summary}
        taskList={taskList}
      />

      {/* 6. CPU Utilization & 7. Context-Switch Overhead Analysis */}
      <CpuAndContextSwitchAnalysisSection
        summary={summary}
        allAlgorithmResults={allAlgorithmResults}
      />

      {/* 8. Starvation Detection & Aging Summary */}
      <StarvationDetectionSection
        summary={summary}
        taskList={taskList}
      />

      {/* Detailed Task Execution Trace Audit Log Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-terminal flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-aegis-teal" />
          <span>Complete Task Trace Audit Log</span>
        </h3>
        <TaskExecutionAuditTable tasks={taskList} />
      </div>

      {/* Official Laboratory Experiment Audit Modal (Printable to PDF) */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        metrics={{
          averageTurnaroundTimeMs: summary.avgTurnaroundTime,
          averageWaitTimeMs: summary.avgWaitTime,
          throughputTasksPerSec: summary.throughput,
          completedTasksCount: summary.completedTasks,
        }}
        tasksCount={taskList.length}
        onDownloadText={handleDownloadReportTxt}
      />
    </div>
  );
}

export default ReportsPage;
