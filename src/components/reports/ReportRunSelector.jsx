import React from 'react';
import {
  Layers,
  Cpu,
  Download,
  FileText,
  Printer,
  Calendar,
  Sparkles,
  Sliders,
  Filter,
} from 'lucide-react';
import Button from '../common/Button';
import { SIMULATION_RUNS } from '../../utils/reportsEngine';
import { cn } from '../../utils/classNames';

const ALGORITHMS_LIST = [
  { id: 'AEGIS_ADAPTIVE', name: 'Aegis Adaptive Scheduling' },
  { id: 'SJF', name: 'Shortest Job First (SRTF)' },
  { id: 'ROUND_ROBIN', name: 'Round Robin (20ms Quantum)' },
  { id: 'FCFS', name: 'First-Come, First-Served (FCFS)' },
];

export function ReportRunSelector({
  selectedRunId,
  onSelectRun,
  selectedAlgoId,
  onSelectAlgo,
  onExportMetricsCsv,
  onExportTimelineCsv,
  onDownloadReportTxt,
  onOpenAuditModal,
}) {
  return (
    <div className="p-4 rounded-2xl bg-aegis-card border border-aegis-border space-y-4 font-terminal text-xs shadow-card-subtle">
      {/* Top Controls: Run Selector & Algorithm Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Simulation Run Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-white font-semibold flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-aegis-teal" />
            <span>Simulation Run:</span>
          </span>
          <select
            value={selectedRunId}
            onChange={(e) => onSelectRun(e.target.value)}
            className="px-3 py-1.5 bg-aegis-sidebar border border-aegis-border rounded-lg text-white font-terminal text-xs focus:outline-none focus:border-aegis-teal transition-colors"
          >
            {SIMULATION_RUNS.map((run) => (
              <option key={run.id} value={run.id}>
                {run.name}
              </option>
            ))}
          </select>
        </div>

        {/* Algorithm Focus Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-white font-semibold flex items-center gap-1.5 shrink-0">
            <Cpu className="w-4 h-4 text-aegis-indigo" />
            <span>Target Algorithm:</span>
          </span>
          <select
            value={selectedAlgoId}
            onChange={(e) => onSelectAlgo(e.target.value)}
            className="px-3 py-1.5 bg-aegis-sidebar border border-aegis-border rounded-lg text-white font-terminal text-xs focus:outline-none focus:border-aegis-indigo transition-colors"
          >
            {ALGORITHMS_LIST.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Toolbar Buttons */}
      <div className="pt-3 border-t border-aegis-border/60 flex flex-wrap items-center justify-between gap-2.5">
        <div className="text-[11px] text-aegis-muted">
          Export options for lab submission & offline statistical analysis:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            icon={Download}
            onClick={onExportMetricsCsv}
            title="Export cross-algorithm comparison table to CSV"
          >
            Metrics CSV
          </Button>

          <Button
            variant="outline"
            size="xs"
            icon={Download}
            onClick={onExportTimelineCsv}
            title="Export raw execution timeline slices to CSV"
          >
            Timeline CSV
          </Button>

          <Button
            variant="secondary"
            size="xs"
            icon={FileText}
            onClick={onDownloadReportTxt}
            title="Download formatted text benchmark report"
          >
            Download Report (.txt)
          </Button>

          <Button
            variant="primary"
            size="xs"
            icon={Printer}
            onClick={onOpenAuditModal}
            title="Open printable OS laboratory experiment audit report"
          >
            Print Lab Audit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportRunSelector;

